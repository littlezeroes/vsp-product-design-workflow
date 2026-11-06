/**
 * Validator: FixedBottom overlap check
 *
 * Runtime check — loads each route at iPhone 390×844 width, measures the height
 * of the `FixedBottom` element, and verifies the scroll container has enough
 * bottom padding so its last visible child is NOT hidden behind the FixedBottom.
 *
 * Rules:
 *   - Scroll container's computed paddingBottom must be ≥ FixedBottom.height + 16px safety.
 *   - If FixedBottom is absent, pass.
 *   - Last child's bottom edge (after scroll to bottom) must be ≤ FixedBottom.top.
 *
 * Usage:
 *   npm run dev &
 *   npx tsx .claude/validators/overlap-fixedbottom.ts /bnpl/dashboard /bnpl/teaser
 *   # or default routes:
 *   npx tsx .claude/validators/overlap-fixedbottom.ts
 *
 * Exit codes:
 *   0 — no overlap issues
 *   1 — one or more routes have overlapping content
 *   2 — dev server unreachable
 */

import { chromium, type Page } from "@playwright/test"

const BASE_URL = process.env.VSP_URL ?? "http://localhost:3000"
const VIEWPORT = { width: 390, height: 844 }
const SAFETY_MARGIN = 16

const DEFAULT_ROUTES: string[] = [
  "/bnpl/teaser",
  "/bnpl/intro",
  "/bnpl/info",
  "/bnpl/contract",
  "/bnpl/result?status=approved",
  "/bnpl/dashboard",
  "/bnpl/loan?id=L3",
  "/bnpl/repay",
  "/bnpl/settings",
  "/bnpl/checkout/source",
  "/bnpl/checkout/tenor?state=tenor-3",
  "/bnpl/checkout/result?status=success",
]

interface OverlapReport {
  route: string
  reachable: boolean
  hasFixedBottom: boolean
  fixedBottomHeight: number
  scrollPaddingBottom: number
  shortfall: number        // how many px short (negative = OK)
  lastChildBottom: number  // Y of bottom-most visible content in scroll area after scrollToBottom
  fixedBottomTop: number
  overlapPx: number        // how many px of content hidden behind FixedBottom
  pass: boolean
  reason: string
}

async function probe(page: Page): Promise<Omit<OverlapReport, "route" | "reachable">> {
  return page.evaluate((SAFETY_MARGIN) => {
    // Find FixedBottom: position:fixed at bottom, ≥40h ≥200w, has button inside
    let fb: HTMLElement | null = null
    const all1 = Array.from(document.querySelectorAll<HTMLElement>("*"))
    for (const el of all1) {
      const cs = getComputedStyle(el)
      if (cs.position !== "fixed") continue
      const b = parseFloat(cs.bottom || "999")
      if (b > 20) continue
      const rect = el.getBoundingClientRect()
      if (rect.height < 40 || rect.width < 200) continue
      if (el.querySelector("button")) { fb = el; break }
    }

    // Find scroll container: overflow-y auto/scroll, ≥300 tall
    let sc: HTMLElement | null = null
    const all2 = Array.from(document.querySelectorAll<HTMLElement>("*"))
    for (const el of all2) {
      const cs = getComputedStyle(el)
      if (cs.overflowY !== "auto" && cs.overflowY !== "scroll") continue
      const rect = el.getBoundingClientRect()
      if (rect.height < 300) continue
      sc = el; break
    }

    const hasFixedBottom = !!fb
    const fbRect = fb?.getBoundingClientRect()
    const fixedBottomHeight = fbRect ? fbRect.height : 0
    const fixedBottomTop = fbRect ? fbRect.top : window.innerHeight

    let scrollPaddingBottom = 0
    if (sc) {
      const cs = getComputedStyle(sc)
      scrollPaddingBottom = parseFloat(cs.paddingBottom || "0")
    }

    let lastChildBottom = 0
    let overlapPx = 0
    let contentFits = false

    if (sc) {
      // Check: does content even need to scroll?
      const scrollable = sc.scrollHeight - sc.clientHeight
      if (scrollable <= 1) {
        contentFits = true
      } else {
        // Scroll to bottom + force layout reflow before measuring
        sc.scrollTop = sc.scrollHeight
        void sc.offsetHeight // trigger layout

        const elements = sc.querySelectorAll<HTMLElement>("*")
        for (const el of Array.from(elements)) {
          if (fb && fb.contains(el)) continue
          const cs = getComputedStyle(el)
          // Skip absolutely/fixed positioned decoration elements outside flow
          if (cs.position === "absolute" || cs.position === "fixed") continue
          const r = el.getBoundingClientRect()
          if (r.height === 0 || r.width === 0) continue
          if (r.bottom > lastChildBottom) lastChildBottom = r.bottom
        }
        if (fb && lastChildBottom > fixedBottomTop + 1) {
          overlapPx = Math.round(lastChildBottom - fixedBottomTop)
        }
      }
    }

    const required = fixedBottomHeight + SAFETY_MARGIN
    const shortfall = Math.round(required - scrollPaddingBottom)

    let pass = true
    let reason = "OK"

    if (!hasFixedBottom) {
      reason = "no FixedBottom (skipped)"
    } else if (!sc) {
      // No scroll container but has FixedBottom → content must fit in flex layout
      // Check last visible body element vs fb.top
      let bodyLastBottom = 0
      const bodyEls = document.body.querySelectorAll<HTMLElement>("*")
      for (const el of Array.from(bodyEls)) {
        if (fb && fb.contains(el)) continue
        const r = el.getBoundingClientRect()
        if (r.height === 0 || r.width === 0) continue
        if (r.bottom > bodyLastBottom) bodyLastBottom = r.bottom
      }
      if (bodyLastBottom > fixedBottomTop + 1) {
        pass = false
        reason = `no-scroll layout: body content bottom ${Math.round(bodyLastBottom)} > FixedBottom top ${Math.round(fixedBottomTop)}`
      } else {
        reason = "OK (no scroll, fits above FixedBottom)"
      }
    } else if (contentFits) {
      reason = `OK (scrollHeight ≤ clientHeight, no scroll)`
    } else if (overlapPx > 0) {
      pass = false
      reason = `content overlaps FixedBottom by ${overlapPx}px`
    } else if (shortfall > 0) {
      pass = false
      reason = `scroll paddingBottom=${Math.round(scrollPaddingBottom)}px < required ${Math.round(required)}px (short ${shortfall}px)`
    }

    return {
      hasFixedBottom,
      fixedBottomHeight: Math.round(fixedBottomHeight),
      scrollPaddingBottom: Math.round(scrollPaddingBottom),
      shortfall,
      lastChildBottom: Math.round(lastChildBottom),
      fixedBottomTop: Math.round(fixedBottomTop),
      overlapPx,
      pass,
      reason,
    }
  }, SAFETY_MARGIN) as unknown as Promise<Omit<OverlapReport, "route" | "reachable">>
}

async function runRoute(page: Page, route: string): Promise<OverlapReport> {
  const url = `${BASE_URL}${route}`
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10_000 })
    if (!resp || !resp.ok()) {
      return baseUnreachable(route)
    }
  } catch {
    return baseUnreachable(route)
  }
  await page.waitForTimeout(300)
  const r = await probe(page)
  return { route, reachable: true, ...r }
}

function baseUnreachable(route: string): OverlapReport {
  return {
    route,
    reachable: false,
    hasFixedBottom: false,
    fixedBottomHeight: 0,
    scrollPaddingBottom: 0,
    shortfall: 0,
    lastChildBottom: 0,
    fixedBottomTop: 0,
    overlapPx: 0,
    pass: false,
    reason: "UNREACHABLE",
  }
}

function formatReport(reports: OverlapReport[]) {
  console.log("")
  console.log("── FixedBottom Overlap ─────────────────────────────")

  let failed = 0
  let unreachable = 0

  for (const r of reports) {
    if (!r.reachable) {
      console.log(`  ⚠ ${r.route.padEnd(40)} UNREACHABLE`)
      unreachable++
      continue
    }
    const status = r.pass ? "✓" : "✗"
    if (!r.pass) failed++
    console.log(
      `  ${status} ${r.route.padEnd(40)} fb=${r.fixedBottomHeight}px · pad=${r.scrollPaddingBottom}px · overlap=${r.overlapPx}px`,
    )
    if (!r.pass) console.log(`      ↳ ${r.reason}`)
  }

  console.log("")
  if (unreachable === reports.length) {
    console.log("ERROR — dev server not reachable. Run `npm run dev` first.")
    return { pass: false, score: 0, violations: [] }
  }

  const total = reports.length - unreachable
  const passed = total - failed
  const score = total > 0 ? Math.round((passed / total) * 100) : 0

  if (failed === 0) {
    console.log(`✓ PASS — ${total} routes checked, no overlap`)
  } else {
    console.log(`✗ FAIL — ${failed}/${total} routes have content hidden behind FixedBottom`)
  }
  console.log(`Score: ${score}/100`)

  return {
    pass: failed === 0,
    score,
    violations: reports.filter(r => !r.pass && r.reachable).map(r => ({
      route: r.route,
      reason: r.reason,
      fixedBottomHeight: r.fixedBottomHeight,
      scrollPaddingBottom: r.scrollPaddingBottom,
      overlapPx: r.overlapPx,
    })),
  }
}

async function main() {
  const argRoutes = process.argv.slice(2).filter(a => a.startsWith("/"))
  const routes = argRoutes.length > 0 ? argRoutes : DEFAULT_ROUTES

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await context.newPage()

  const reports: OverlapReport[] = []
  for (const r of routes) reports.push(await runRoute(page, r))

  const report = formatReport(reports)

  await browser.close()

  if (process.env.VALIDATOR_JSON === "1") {
    console.log("")
    console.log("__JSON__" + JSON.stringify({ validator: "overlap-fixedbottom", ...report }))
  }

  process.exit(report.pass ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})

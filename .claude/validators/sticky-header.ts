/**
 * Validator: Sticky Header
 *
 * Runtime check — verifies the Header (status bar + nav bar) stays visible when
 * the user scrolls down. Pattern: if a page has a scrollable content area AND
 * a Header, the Header must remain at the top after scrolling (either it lives
 * OUTSIDE the scroll container, or has `position: sticky`/`position: fixed`).
 *
 * Rules:
 *   - If page has scroll container with scrollHeight > clientHeight + 50px:
 *       The NavBar (h-[56px] with back arrow / title) must still be visible
 *       after scrolling to bottom. Its top must be ≤ 54px (status bar height).
 *   - NavBar identification: element with height ~56px containing a back button
 *       or Header (contains both StatusBar + NavBar).
 *
 * Usage:
 *   npm run dev &
 *   npx tsx .claude/validators/sticky-header.ts /bnpl/dashboard
 *
 * Exit codes:
 *   0 — pass
 *   1 — violations
 *   2 — unreachable
 */

import { chromium, type Page } from "@playwright/test"

const BASE_URL = process.env.VSP_URL ?? "http://localhost:3000"
const VIEWPORT = { width: 390, height: 844 }

const DEFAULT_ROUTES = [
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

interface HeaderReport {
  route: string
  reachable: boolean
  hasScroll: boolean
  hasHeader: boolean
  headerTopBefore: number
  headerTopAfter: number
  drift: number
  pass: boolean
  reason: string
}

async function probe(page: Page): Promise<Omit<HeaderReport, "route" | "reachable">> {
  return page.evaluate(() => {
    // Find Header: status bar (9:41) + navbar (back button) block at top
    let header: HTMLElement | null = null
    const all = Array.from(document.querySelectorAll<HTMLElement>("*"))
    for (const el of all) {
      const r = el.getBoundingClientRect()
      if (r.top > 10 || r.top < -10) continue
      if (r.width < 300) continue
      if (r.height < 80 || r.height > 220) continue
      // Must contain "9:41" text (status bar marker)
      const txt = el.textContent || ""
      if (!txt.includes("9:41")) continue
      // Must contain a back-button (ChevronLeft ~18px svg inside a 44px tap target)
      const backBtn = el.querySelector("button")
      if (!backBtn) continue
      header = el
      break
    }

    // Find scroll container
    let sc: HTMLElement | null = null
    for (const el of all) {
      const cs = getComputedStyle(el)
      if (cs.overflowY !== "auto" && cs.overflowY !== "scroll") continue
      const r = el.getBoundingClientRect()
      if (r.height < 300) continue
      sc = el; break
    }

    const hasHeader = !!header
    const hasScroll = !!sc && sc.scrollHeight - sc.clientHeight > 50

    const headerTopBefore = header ? Math.round(header.getBoundingClientRect().top) : 0

    // Scroll to bottom, measure again
    if (sc) {
      sc.scrollTop = sc.scrollHeight
      void sc.offsetHeight
    }

    const headerTopAfter = header ? Math.round(header.getBoundingClientRect().top) : 0
    const drift = Math.abs(headerTopAfter - headerTopBefore)

    let pass = true
    let reason = "OK"

    if (!hasHeader) {
      reason = "no Header (skipped — result/approve-style pages may not have one)"
    } else if (!hasScroll) {
      reason = "OK (no scroll needed)"
    } else if (drift > 5) {
      pass = false
      reason = `Header drifted ${drift}px on scroll (not sticky)`
    } else if (headerTopAfter < -5) {
      pass = false
      reason = `Header scrolled off-screen (top = ${headerTopAfter}px)`
    }

    return { hasScroll, hasHeader, headerTopBefore, headerTopAfter, drift, pass, reason }
  }) as unknown as Promise<Omit<HeaderReport, "route" | "reachable">>
}

async function runRoute(page: Page, route: string): Promise<HeaderReport> {
  const url = `${BASE_URL}${route}`
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10_000 })
    if (!resp || !resp.ok()) return baseUnreachable(route)
  } catch {
    return baseUnreachable(route)
  }
  await page.waitForTimeout(200)
  const r = await probe(page)
  return { route, reachable: true, ...r }
}

function baseUnreachable(route: string): HeaderReport {
  return {
    route, reachable: false, hasScroll: false, hasHeader: false,
    headerTopBefore: 0, headerTopAfter: 0, drift: 0,
    pass: false, reason: "UNREACHABLE",
  }
}

function formatReport(reports: HeaderReport[]) {
  console.log("")
  console.log("── Sticky Header ───────────────────────────────────")

  let failed = 0
  let unreachable = 0
  for (const r of reports) {
    if (!r.reachable) { console.log(`  ⚠ ${r.route.padEnd(40)} UNREACHABLE`); unreachable++; continue }
    const status = r.pass ? "✓" : "✗"
    if (!r.pass) failed++
    console.log(`  ${status} ${r.route.padEnd(40)} header drift=${r.drift}px`)
    if (!r.pass) console.log(`      ↳ ${r.reason}`)
  }

  console.log("")
  if (unreachable === reports.length) {
    console.log("ERROR — dev server not reachable.")
    return { pass: false, score: 0, violations: [] }
  }
  const total = reports.length - unreachable
  const passed = total - failed
  const score = total > 0 ? Math.round((passed / total) * 100) : 0
  if (failed === 0) console.log(`✓ PASS — ${total} routes checked`)
  else console.log(`✗ FAIL — ${failed}/${total} headers not sticky`)
  console.log(`Score: ${score}/100`)

  return {
    pass: failed === 0,
    score,
    violations: reports.filter(r => !r.pass && r.reachable).map(r => ({ route: r.route, reason: r.reason })),
  }
}

async function main() {
  const argRoutes = process.argv.slice(2).filter(a => a.startsWith("/"))
  const routes = argRoutes.length > 0 ? argRoutes : DEFAULT_ROUTES

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await context.newPage()

  const reports: HeaderReport[] = []
  for (const r of routes) reports.push(await runRoute(page, r))

  const report = formatReport(reports)

  await browser.close()

  if (process.env.VALIDATOR_JSON === "1") {
    console.log("")
    console.log("__JSON__" + JSON.stringify({ validator: "sticky-header", ...report }))
  }

  process.exit(report.pass ? 0 : 1)
}

main().catch(err => { console.error(err); process.exit(2) })

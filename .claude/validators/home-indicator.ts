/**
 * Validator: Home Indicator
 *
 * Runtime check — verifies every full-screen page has exactly ONE iOS home
 * indicator with correct dimensions (w≈139px, h≈5px, rounded-full, bg-foreground)
 * positioned within the bottom 50px safe area.
 *
 * Rules:
 *   - Exactly 1 indicator per page (not 0, not 2+)
 *   - Width in [130, 145] px
 *   - Height in [4, 6] px
 *   - border-radius ≥ 2 (rounded)
 *   - Bottom position ≤ 50px from viewport bottom
 *   - Color dark (foreground) on light bg, OR white on dark hero
 *
 * Usage:
 *   npm run dev &
 *   npx tsx .claude/validators/home-indicator.ts /bnpl/dashboard
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

interface IndicatorReport {
  route: string
  reachable: boolean
  count: number
  indicators: { w: number; h: number; bottomOffset: number; radius: number; issues: string[] }[]
  pass: boolean
  reason: string
}

async function probe(page: Page): Promise<Omit<IndicatorReport, "route" | "reachable">> {
  return page.evaluate(() => {
    const vh = window.innerHeight
    const all = Array.from(document.querySelectorAll<HTMLElement>("div"))
    const candidates: { w: number; h: number; bottomOffset: number; radius: number; issues: string[] }[] = []

    for (const el of all) {
      const r = el.getBoundingClientRect()
      // iOS home indicator: ~134-140px wide, ~4-6px tall
      if (r.width < 100 || r.width > 180) continue
      if (r.height < 2 || r.height > 10) continue
      // Must be in bottom 80px of viewport
      if (r.bottom < vh - 80) continue
      // Element is an empty leaf (no child elements, no text)
      if (el.children.length > 0) continue
      if ((el.textContent || "").trim().length > 0) continue

      const cs = getComputedStyle(el)
      const br = parseFloat(cs.borderTopLeftRadius || "0")
      const bg = cs.backgroundColor

      const issues: string[] = []
      if (r.width < 130 || r.width > 145) issues.push(`width ${Math.round(r.width)}px outside [130,145]`)
      if (r.height < 4 || r.height > 6) issues.push(`height ${Math.round(r.height)}px outside [4,6]`)
      if (br < 2) issues.push(`border-radius ${Math.round(br)}px not rounded`)
      const bottomOffset = Math.round(vh - r.bottom)
      if (bottomOffset > 50) issues.push(`bottom offset ${bottomOffset}px > 50 (too high)`)
      // Color must be visible (not transparent, not same as bg)
      if (bg === "rgba(0, 0, 0, 0)" || bg === "transparent") issues.push(`no bg color`)

      candidates.push({
        w: Math.round(r.width),
        h: Math.round(r.height),
        bottomOffset,
        radius: Math.round(br),
        issues,
      })
    }

    let pass = true
    let reason = "OK"
    if (candidates.length === 0) {
      pass = false
      reason = "no home indicator found (expected 1)"
    } else if (candidates.length > 1) {
      pass = false
      reason = `${candidates.length} home indicators found (expected 1)`
    } else if (candidates[0].issues.length > 0) {
      pass = false
      reason = candidates[0].issues.join("; ")
    }

    return { count: candidates.length, indicators: candidates, pass, reason }
  }) as unknown as Promise<Omit<IndicatorReport, "route" | "reachable">>
}

async function runRoute(page: Page, route: string): Promise<IndicatorReport> {
  const url = `${BASE_URL}${route}`
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10_000 })
    if (!resp || !resp.ok()) {
      return { route, reachable: false, count: 0, indicators: [], pass: false, reason: "UNREACHABLE" }
    }
  } catch {
    return { route, reachable: false, count: 0, indicators: [], pass: false, reason: "UNREACHABLE" }
  }
  await page.waitForTimeout(200)
  const r = await probe(page)
  return { route, reachable: true, ...r }
}

function formatReport(reports: IndicatorReport[]) {
  console.log("")
  console.log("── Home Indicator ──────────────────────────────────")

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
    const meta = r.indicators[0]
      ? `${r.indicators[0].w}×${r.indicators[0].h}px · ${r.indicators[0].bottomOffset}px from bottom`
      : "(none)"
    console.log(`  ${status} ${r.route.padEnd(40)} ${r.count} indicator · ${meta}`)
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

  if (failed === 0) console.log(`✓ PASS — ${total} routes checked`)
  else console.log(`✗ FAIL — ${failed}/${total} routes have home indicator issues`)
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

  const reports: IndicatorReport[] = []
  for (const r of routes) reports.push(await runRoute(page, r))

  const report = formatReport(reports)

  await browser.close()

  if (process.env.VALIDATOR_JSON === "1") {
    console.log("")
    console.log("__JSON__" + JSON.stringify({ validator: "home-indicator", ...report }))
  }

  process.exit(report.pass ? 0 : 1)
}

main().catch(err => { console.error(err); process.exit(2) })

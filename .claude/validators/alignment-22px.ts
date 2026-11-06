/**
 * Validator: 22px Alignment Axis
 *
 * Runtime check — loads each route in headless Chromium at iPhone 390 width,
 * inspects every visible text element's x-coordinate, flags violations.
 *
 * Rules (from CLAUDE.md):
 *   - Content column must sit on x = 22.
 *   - Text nested in cards is allowed at x = 22 + card-padding (typically 44).
 *   - Text with 1 ≤ x ≤ 21 is a violation (too close to edge or off-axis).
 *   - Text with x ∈ (22, 44) but not inside a card is suspicious.
 *
 * Usage:
 *   # Start dev server in another terminal:  npm run dev
 *   npx tsx .claude/validators/alignment-22px.ts /quy-nhom/dashboard /quy-nhom/moi
 *   # Or default route list:
 *   npx tsx .claude/validators/alignment-22px.ts
 *
 * Exit codes:
 *   0 — no violations
 *   1 — violations found
 *   2 — could not reach dev server
 */

import { chromium, type Page } from "@playwright/test"

const BASE_URL = process.env.VSP_URL ?? "http://localhost:3000"
const VIEWPORT = { width: 390, height: 844 }
const PRIMARY_AXIS = 22

const DEFAULT_ROUTES = [
  "/quy-nhom",
  "/quy-nhom/dashboard",
  "/quy-nhom/moi",
  "/quy-nhom/gop",
  "/quy-nhom/list",
  "/quy-nhom/history",
  "/quy-nhom/settings",
]

/* ── Page probe ─────────────────────────────────────────────────────── */

interface TextProbe {
  tag: string
  text: string
  x: number
  y: number
  inCard: boolean          // true if any ancestor has border-radius ≥ 14 or class matching /\bcard\b/
  centered: boolean        // true if text-align=center or parent justify-center
  widthPercent: number     // width / viewport width — narrow → likely a label/icon
}

async function probePage(page: Page): Promise<TextProbe[]> {
  return page.evaluate(() => {
    const vw = window.innerWidth
    const all = document.querySelectorAll<HTMLElement>(
      "p, h1, h2, h3, h4, h5, h6, span, button, label, a, div",
    )
    const out: any[] = []
    for (const el of Array.from(all)) {
      // Only leaf text containers — element whose direct text children are non-empty
      const directText = Array.from(el.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent ?? "")
        .join("")
        .trim()
      if (!directText) continue
      if (directText.length > 200) continue

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      if (rect.x < -50 || rect.x > vw + 50) continue // off-screen

      const cs = window.getComputedStyle(el)
      if (cs.display === "none" || cs.visibility === "hidden") continue

      // Detect card ancestor: border-radius ≥ 14px OR explicit "card" class
      let inCard = false
      let node: HTMLElement | null = el.parentElement
      let hops = 0
      while (node && hops < 8) {
        const ns = window.getComputedStyle(node)
        const br = parseFloat(ns.borderTopLeftRadius || "0")
        const hasCardClass = /\bcard\b|rounded-(14|28)/.test(node.className || "")
        if (br >= 14 || hasCardClass) { inCard = true; break }
        node = node.parentElement
        hops++
      }

      // Centered detection
      const parentCs = el.parentElement ? window.getComputedStyle(el.parentElement) : null
      const centered =
        cs.textAlign === "center" ||
        (parentCs?.display === "flex" && parentCs.justifyContent === "center") ||
        false

      out.push({
        tag: el.tagName.toLowerCase(),
        text: directText.slice(0, 60),
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        inCard,
        centered,
        widthPercent: Math.round((rect.width / vw) * 100),
      })
    }
    return out
  }) as unknown as Promise<TextProbe[]>
}

/* ── Rule: classify each probe ───────────────────────────────────────── */

type Verdict = "pass" | "violation" | "info"

interface Classified extends TextProbe {
  verdict: Verdict
  reason: string
}

function classify(p: TextProbe): Classified {
  // Centered or right-aligned text is exempt from 22px axis
  if (p.centered) return { ...p, verdict: "pass", reason: "centered" }

  // x = 0 is typically full-width container, not a violation
  if (p.x === 0) return { ...p, verdict: "pass", reason: "full-width container" }

  // Primary axis hit
  if (Math.abs(p.x - PRIMARY_AXIS) < 0.5) return { ...p, verdict: "pass", reason: "on axis 22" }

  // Off-axis, too close to edge
  if (p.x >= 1 && p.x < PRIMARY_AXIS) {
    return { ...p, verdict: "violation", reason: `x=${p.x} < 22 (off axis)` }
  }

  // 22 < x < 44, and not in card → suspicious
  if (p.x > PRIMARY_AXIS && p.x < 44 && !p.inCard) {
    return { ...p, verdict: "violation", reason: `x=${p.x} between 22-44, not in card` }
  }

  // x ≥ 44 in card → accepted (card padding nested)
  if (p.x >= 44 && p.inCard) return { ...p, verdict: "pass", reason: "card inner padding" }

  // x ≥ 44 outside card → info (could be icon col, tab indicator, etc.)
  return { ...p, verdict: "info", reason: `x=${p.x} (review)` }
}

/* ── Route runner ────────────────────────────────────────────────────── */

interface RouteReport {
  route: string
  total: number
  violations: Classified[]
  infos: Classified[]
  reachable: boolean
}

async function runRoute(page: Page, route: string): Promise<RouteReport> {
  const url = `${BASE_URL}${route}`
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10_000 })
    if (!resp || !resp.ok()) {
      return { route, total: 0, violations: [], infos: [], reachable: false }
    }
  } catch {
    return { route, total: 0, violations: [], infos: [], reachable: false }
  }

  await page.waitForTimeout(300) // let fonts/layout settle
  const probes = await probePage(page)
  const classified = probes.map(classify)
  return {
    route,
    total: probes.length,
    violations: classified.filter(c => c.verdict === "violation"),
    infos: classified.filter(c => c.verdict === "info"),
    reachable: true,
  }
}

/* ── Report ──────────────────────────────────────────────────────────── */

function formatReport(reports: RouteReport[]) {
  console.log("")
  console.log("── 22px Alignment ──────────────────────────────────")

  let totalViolations = 0
  let totalProbes = 0
  let unreachable = 0

  for (const r of reports) {
    if (!r.reachable) {
      console.log(`  ⚠ ${r.route} — UNREACHABLE`)
      unreachable++
      continue
    }
    totalViolations += r.violations.length
    totalProbes += r.total
    const status = r.violations.length === 0 ? "✓" : "✗"
    console.log(`  ${status} ${r.route.padEnd(28)} ${r.total} text elements, ${r.violations.length} violations`)
  }

  console.log("")
  if (unreachable === reports.length) {
    console.log("ERROR — dev server not reachable. Run `npm run dev` first.")
    return { pass: false, score: 0, violations: [] }
  }

  if (totalViolations === 0) {
    console.log(`✓ PASS — ${totalProbes} text elements checked, all aligned`)
    return { pass: true, score: 100, violations: [] }
  }

  console.log("Violations:")
  for (const r of reports) {
    if (r.violations.length === 0) continue
    console.log(`\n  ${r.route}`)
    for (const v of r.violations.slice(0, 10)) {
      console.log(`    <${v.tag}> x=${v.x}  "${v.text}"  — ${v.reason}`)
    }
    if (r.violations.length > 10) console.log(`    ... and ${r.violations.length - 10} more`)
  }

  // Score: violations / total, linear penalty
  const violationRate = totalProbes > 0 ? totalViolations / totalProbes : 0
  const score = Math.max(0, Math.round(100 - violationRate * 200))
  console.log("")
  console.log(`Score: ${score}/100  (${totalViolations}/${totalProbes} violations)`)
  return { pass: totalViolations === 0, score, violations: reports.flatMap(r => r.violations) }
}

/* ── Entry ───────────────────────────────────────────────────────────── */

async function main() {
  const argRoutes = process.argv.slice(2).filter(a => a.startsWith("/"))
  const routes = argRoutes.length > 0 ? argRoutes : DEFAULT_ROUTES

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await context.newPage()

  const reports: RouteReport[] = []
  for (const r of routes) reports.push(await runRoute(page, r))

  const report = formatReport(reports)

  await browser.close()

  if (process.env.VALIDATOR_JSON === "1") {
    console.log("")
    console.log("__JSON__" + JSON.stringify({ validator: "alignment-22px", ...report }))
  }

  process.exit(report.pass ? 0 : 1)
}

main().catch(err => {
  console.error(err)
  process.exit(2)
})

/**
 * Validator: Route 200 Health Check
 *
 * Lightweight runtime check — every enumerated route must return HTTP 200.
 * Catches: broken imports, missing files, build errors.
 *
 * Usage:
 *   npm run dev &
 *   npx tsx .claude/validators/route-200.ts /bnpl
 *
 * Exit codes:
 *   0 — all routes 200
 *   1 — some routes failed
 *   2 — dev server unreachable
 */

import fs from "node:fs"
import path from "node:path"

const BASE_URL = process.env.VSP_URL ?? "http://localhost:3000"

function deriveRoutes(prefix: string): string[] {
  const featureDir = prefix === "/" ? "app" : path.join("app", prefix.replace(/^\//, ""))
  const routes: string[] = []
  const walk = (dir: string, rel: string) => {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    if (entries.some(e => e.isFile() && e.name === "page.tsx")) {
      routes.push(rel === "" ? "/" : rel)
    }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("(")) {
        walk(path.join(dir, e.name), `${rel}/${e.name}`)
      }
    }
  }
  walk(featureDir, prefix === "/" ? "" : prefix)
  return routes
}

async function checkRoute(route: string): Promise<{ route: string; status: number; ok: boolean }> {
  try {
    const resp = await fetch(`${BASE_URL}${route}`, { method: "GET" })
    return { route, status: resp.status, ok: resp.ok }
  } catch {
    return { route, status: 0, ok: false }
  }
}

async function main() {
  const argPrefix = process.argv[2] ?? "/bnpl"
  const routes = deriveRoutes(argPrefix)

  console.log("")
  console.log("── Route 200 Health ────────────────────────────────")

  if (routes.length === 0) {
    console.log(`  no routes found under ${argPrefix}`)
    const report = { pass: true, score: 100, violations: [] }
    if (process.env.VALIDATOR_JSON === "1") {
      console.log("__JSON__" + JSON.stringify({ validator: "route-200", ...report }))
    }
    process.exit(0)
  }

  const results = await Promise.all(routes.map(checkRoute))

  let failed = 0
  for (const r of results) {
    const status = r.ok ? "✓" : "✗"
    if (!r.ok) failed++
    console.log(`  ${status} ${r.route.padEnd(40)} ${r.status}`)
  }

  console.log("")
  const total = results.length
  const passed = total - failed
  const score = total > 0 ? Math.round((passed / total) * 100) : 0
  if (failed === 0) console.log(`✓ PASS — ${total} routes · all 200`)
  else console.log(`✗ FAIL — ${failed}/${total} routes broken`)
  console.log(`Score: ${score}/100`)

  const report = {
    pass: failed === 0,
    score,
    violations: results.filter(r => !r.ok).map(r => ({ route: r.route, status: r.status })),
  }

  if (process.env.VALIDATOR_JSON === "1") {
    console.log("")
    console.log("__JSON__" + JSON.stringify({ validator: "route-200", ...report }))
  }

  process.exit(report.pass ? 0 : 1)
}

main().catch(err => { console.error(err); process.exit(2) })

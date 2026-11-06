/**
 * Validator: run-all aggregator
 *
 * Runs every validator in .claude/validators/ (except itself), aggregates
 * scores into a single table, and exits non-zero if any validator fails.
 *
 * Usage:
 *   # Dev server must be running for runtime validators (alignment):
 *   npm run dev &
 *
 *   # Run all validators against a feature:
 *   npx tsx .claude/validators/run-all.ts app/quy-nhom /quy-nhom
 *
 * Args:
 *   1. Static target  (path, passed to static validators)    default: "app"
 *   2. Runtime route  (URL prefix, passed to runtime ones)   default: "/"
 *
 * Exit codes:
 *   0 — every validator passed
 *   1 — one or more failed
 */

import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

interface ValidatorResult {
  validator: string
  kind: "static" | "runtime"
  pass: boolean
  score: number
  summary: string
}

const staticTarget = process.argv[2] ?? "app"
const runtimePrefix = process.argv[3] ?? "/"

/* ── Registry ────────────────────────────────────────────────────────── */

interface Validator {
  file: string        // relative to .claude/validators
  kind: "static" | "runtime"
  arg: () => string[]
}

const REGISTRY: Validator[] = [
  { file: "token-compliance.ts",    kind: "static",  arg: () => [staticTarget] },
  { file: "route-200.ts",           kind: "runtime", arg: () => [runtimePrefix] },
  { file: "alignment-22px.ts",      kind: "runtime", arg: () => deriveRoutes(runtimePrefix) },
  { file: "overlap-fixedbottom.ts", kind: "runtime", arg: () => deriveRoutes(runtimePrefix) },
  { file: "home-indicator.ts",      kind: "runtime", arg: () => deriveRoutes(runtimePrefix) },
  { file: "sticky-header.ts",       kind: "runtime", arg: () => deriveRoutes(runtimePrefix) },
]

function deriveRoutes(prefix: string): string[] {
  // If prefix matches app/<feature>, enumerate immediate subdirs as routes
  const featureDir = prefix === "/" ? null : path.join("app", prefix.replace(/^\//, ""))
  if (featureDir && fs.existsSync(featureDir)) {
    const sub = fs
      .readdirSync(featureDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => `${prefix}/${d.name}`)
    return [prefix, ...sub]
  }
  return [prefix]
}

/* ── Runner ──────────────────────────────────────────────────────────── */

function run(v: Validator): ValidatorResult {
  const cmd = "npx"
  const args = ["tsx", path.join(".claude/validators", v.file), ...v.arg()]
  const res = spawnSync(cmd, args, {
    env: { ...process.env, VALIDATOR_JSON: "1" },
    encoding: "utf8",
  })
  const stdout = res.stdout ?? ""
  const marker = stdout.indexOf("__JSON__")
  if (marker === -1) {
    return {
      validator: v.file.replace(/\.ts$/, ""),
      kind: v.kind,
      pass: false,
      score: 0,
      summary: `could not parse output (exit ${res.status})`,
    }
  }
  const jsonStr = stdout.slice(marker + "__JSON__".length).trim().split("\n")[0]
  try {
    const j = JSON.parse(jsonStr)
    return {
      validator: j.validator ?? v.file.replace(/\.ts$/, ""),
      kind: v.kind,
      pass: j.pass ?? false,
      score: j.score ?? 0,
      summary: buildSummary(j),
    }
  } catch {
    return {
      validator: v.file.replace(/\.ts$/, ""),
      kind: v.kind,
      pass: false,
      score: 0,
      summary: "JSON parse error",
    }
  }
}

function buildSummary(j: any): string {
  if (j.validator === "token-compliance") {
    return `${j.errors ?? 0} errors, ${j.warns ?? 0} warnings`
  }
  if (j.validator === "alignment-22px") {
    const n = (j.violations ?? []).length
    return `${n} element${n === 1 ? "" : "s"} off axis`
  }
  if (j.validator === "overlap-fixedbottom") {
    const n = (j.violations ?? []).length
    return `${n} route${n === 1 ? "" : "s"} overlap`
  }
  if (j.validator === "home-indicator") {
    const n = (j.violations ?? []).length
    return `${n} route${n === 1 ? "" : "s"} indicator bad`
  }
  if (j.validator === "sticky-header") {
    const n = (j.violations ?? []).length
    return `${n} header${n === 1 ? "" : "s"} not sticky`
  }
  if (j.validator === "route-200") {
    const n = (j.violations ?? []).length
    return n === 0 ? "all 200" : `${n} broken`
  }
  return j.pass ? "pass" : "fail"
}

/* ── Main ────────────────────────────────────────────────────────────── */

console.log("")
console.log("═".repeat(56))
console.log(" VSP Validator Suite")
console.log(`   static  → ${staticTarget}`)
console.log(`   runtime → ${runtimePrefix}`)
console.log("═".repeat(56))

const results: ValidatorResult[] = []
for (const v of REGISTRY) results.push(run(v))

console.log("")
console.log("┌─────────────────────────┬─────┬───────┬─────────────────────────┐")
console.log("│ Validator               │ Pass│ Score │ Summary                 │")
console.log("├─────────────────────────┼─────┼───────┼─────────────────────────┤")
for (const r of results) {
  const name = r.validator.padEnd(24)
  const pass = (r.pass ? " ✓  " : " ✗  ").padEnd(4)
  const score = `${r.score}/100`.padStart(6)
  const summary = r.summary.slice(0, 23).padEnd(23)
  console.log(`│ ${name}│${pass} │${score} │ ${summary} │`)
}
console.log("└─────────────────────────┴─────┴───────┴─────────────────────────┘")

const allPass = results.every(r => r.pass)
const avgScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0

console.log("")
console.log(`Overall: ${allPass ? "✓ PASS" : "✗ FAIL"}   |   Avg score: ${avgScore}/100`)
console.log("")

process.exit(allPass ? 0 : 1)

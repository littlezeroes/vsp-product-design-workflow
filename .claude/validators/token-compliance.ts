/**
 * Validator: Token Compliance
 *
 * Static analysis — grep-based. Fast (seconds), no browser needed.
 * Flags violations against VSP Golden Rules (CLAUDE.md).
 *
 * Usage:
 *   npx tsx .claude/validators/token-compliance.ts app/quy-nhom
 *   npx tsx .claude/validators/token-compliance.ts app/quy-nhom/dashboard/page.tsx
 *
 * Exit codes:
 *   0 — no violations
 *   1 — violations found
 */

import fs from "node:fs"
import path from "node:path"

/* ── Rules ────────────────────────────────────────────────────────────── */

interface Rule {
  id: string
  label: string
  severity: "error" | "warn"
  // Regex applied to each line. Capture group 1 = offending snippet (for display).
  pattern: RegExp
  // Optional: skip if line also matches this (e.g., allow-list).
  skipIf?: RegExp
  remedy: string
}

const RULES: Rule[] = [
  {
    id: "raw-radius",
    label: "Raw radius — use rounded-8/14/28",
    severity: "error",
    pattern: /(rounded-\[\d+px\])/,
    remedy: "Replace rounded-[Xpx] with named token rounded-8 | rounded-14 | rounded-28",
  },
  {
    id: "banned-radius-class",
    label: "rounded-lg/xl banned on cards",
    severity: "warn",
    pattern: /\b(rounded-(?:lg|xl|2xl|3xl))\b/,
    remedy: "Use rounded-8 / rounded-14 / rounded-28 instead",
  },
  {
    id: "muted-foreground",
    label: "text-muted-foreground banned",
    severity: "error",
    pattern: /\b(text-muted-foreground)\b/,
    remedy: "Replace with text-foreground-secondary",
  },
  {
    id: "raw-hex",
    label: "Raw hex color in JSX/className",
    severity: "error",
    // Require # prefix. Match 3, 4, 6, or 8 hex digits. Use lookahead to avoid
    // matching longer hex-like IDs. 3-digit variant requires at least one a-f
    // to avoid flagging pure-digit IDs like #123.
    pattern: /(#(?:[0-9a-fA-F]{6,8}|[0-9a-fA-F]{2}[0-9a-fA-F]*[a-fA-F][0-9a-fA-F]*))(?![0-9a-fA-F])/,
    skipIf: /^\s*\/\/|^\s*\*/,
    remedy: "Use semantic token (bg-*, text-*, border-*)",
  },
  {
    id: "arrow-left",
    label: "ArrowLeft icon banned — use ChevronLeft",
    severity: "error",
    pattern: /\b(ArrowLeft)\b/,
    remedy: "Import ChevronLeft from lucide-react instead",
  },
  {
    id: "inline-color-style",
    label: "Inline color/background style banned",
    severity: "error",
    pattern: /(style=\{\{[^}]*(?:color|background)\s*:)/,
    remedy: "Use Tailwind token class; remove inline color/background",
  },
  {
    id: "content-column-padding",
    label: "Content column must use px-[22px]",
    severity: "warn",
    // Flag px-4 / px-5 / px-6 / px-[16px] / px-[20px] / px-[24px] when likely a content column
    pattern: /\b(px-4\b|px-5\b|px-6\b|px-\[1[6789]px\]|px-\[2[04]px\])/,
    remedy: "Content columns must use px-[22px]",
  },
  {
    id: "section-gap",
    label: "Inter-section gap must be pt-[32px]",
    severity: "warn",
    pattern: /\b(space-y-(?:8|10|12|16))\b/,
    remedy: "Replace space-y-* with pt-[32px] between sections",
  },
]

/* ── File collection ─────────────────────────────────────────────────── */

function collectTsx(target: string): string[] {
  const stat = fs.statSync(target)
  if (stat.isFile()) return [target]
  const out: string[] = []
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue
    const full = path.join(target, entry.name)
    if (entry.isDirectory()) out.push(...collectTsx(full))
    else if (/\.(tsx|ts)$/.test(entry.name)) out.push(full)
  }
  return out
}

/* ── Scanner ─────────────────────────────────────────────────────────── */

interface Violation {
  file: string
  line: number
  ruleId: string
  severity: "error" | "warn"
  snippet: string
  remedy: string
}

function scanFile(file: string): Violation[] {
  const src = fs.readFileSync(file, "utf8")
  const lines = src.split("\n")
  const violations: Violation[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Skip empty / comment-only lines
    if (!line.trim() || line.trim().startsWith("//")) continue

    for (const rule of RULES) {
      if (rule.skipIf?.test(line)) continue
      const m = line.match(rule.pattern)
      if (m) {
        violations.push({
          file,
          line: i + 1,
          ruleId: rule.id,
          severity: rule.severity,
          snippet: (m[1] ?? m[0]).trim(),
          remedy: rule.remedy,
        })
      }
    }
  }
  return violations
}

/* ── Report ──────────────────────────────────────────────────────────── */

function formatReport(violations: Violation[], fileCount: number) {
  const errors = violations.filter(v => v.severity === "error")
  const warns = violations.filter(v => v.severity === "warn")

  const byRule = new Map<string, number>()
  for (const v of violations) byRule.set(v.ruleId, (byRule.get(v.ruleId) ?? 0) + 1)

  console.log("")
  console.log("── Token Compliance ────────────────────────────────")
  console.log(`Files scanned : ${fileCount}`)
  console.log(`Errors        : ${errors.length}`)
  console.log(`Warnings      : ${warns.length}`)
  console.log("")

  if (violations.length === 0) {
    console.log("✓ PASS — no violations")
    return { pass: true, score: 100, errors: 0, warns: 0 }
  }

  console.log("Violations by rule:")
  for (const [rule, count] of byRule) console.log(`  ${rule.padEnd(25)} ${count}`)
  console.log("")

  console.log("Details:")
  for (const v of violations.slice(0, 50)) {
    const tag = v.severity === "error" ? "ERR " : "WARN"
    console.log(`  ${tag} ${v.file}:${v.line}  [${v.ruleId}]`)
    console.log(`       ${v.snippet}`)
  }
  if (violations.length > 50) console.log(`  ... and ${violations.length - 50} more`)

  // Score: 100 - 2*errors - 1*warns, capped at 0
  const score = Math.max(0, 100 - errors.length * 2 - warns.length)
  console.log("")
  console.log(`Score: ${score}/100`)

  return { pass: errors.length === 0, score, errors: errors.length, warns: warns.length }
}

/* ── Entry ───────────────────────────────────────────────────────────── */

const target = process.argv[2] ?? "app"
if (!fs.existsSync(target)) {
  console.error(`Target not found: ${target}`)
  process.exit(2)
}

const files = collectTsx(target)
const all: Violation[] = []
for (const f of files) all.push(...scanFile(f))

const report = formatReport(all, files.length)

// Machine-readable output for run-all aggregator
if (process.env.VALIDATOR_JSON === "1") {
  console.log("")
  console.log("__JSON__" + JSON.stringify({
    validator: "token-compliance",
    ...report,
    violations: all,
  }))
}

process.exit(report.pass ? 0 : 1)

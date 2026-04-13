---
name: Figma Library Swap Agent
description: Safely swap old Color/Typography library references to Core Components library in design files
trigger: "swap library", "fix colors", "migrate tokens", "link design"
---

# Figma Library Swap Agent

## Purpose
Migrate design files from old Color/Typography library to Core Components library.
Ensures zero visual change — only rebinds tokens, never changes actual colors.

## Workflow

### Phase 1: AUDIT (read-only, no changes)

```
Step 1.1: Scan target design file
  → List all pages
  → Count nodes with bound vs unbound colors
  → Identify which external libraries are referenced
  → Output: { pages, boundCount, unboundCount, externalLibraries }

Step 1.2: Build token mapping table
  → For each external variable reference:
    - Get external var name + resolved hex
    - Find matching Core Components var (by name, then by hex)
    - Flag: MATCH / CLOSE_MATCH / NO_MATCH
  → Output: mapping table with confidence level

Step 1.3: Generate DIFF REPORT (show user before applying)
  → Format:
    External Token          → Core Components Token    Hex    Confidence
    ─────────────────────────────────────────────────────────────────────
    background/surface/primary → Background/Surface/Primary  #ffffff  ✅ EXACT
    foreground/primary      → Foreground/Primary        #080808  ✅ EXACT
    border/onsurface        → Border/OnSurface          #ffffff  ✅ EXACT
    custom/unknown-token    → ???                        #abc123  ❌ NO_MATCH

  → STOP HERE. Wait for user approval before Phase 2.
```

### Phase 2: APPLY (only after user approves diff)

```
Step 2.1: Rebind colors
  → For each page (batch by page to avoid timeout):
    - Find all fills/strokes with external variable refs
    - Match to Core Components variable using approved mapping
    - Rebind: setBoundVariableForPaint with new local var
    - Skip NO_MATCH items (leave as-is)
  → Output: { rebound, skipped, errors } per page

Step 2.2: Rebind text styles
  → Find external text style refs → match by name → swap
  → Output: { rebound, skipped }

Step 2.3: Rebind spacing/radius (if applicable)
  → Find external spacing/radius variable refs → match → rebind
```

### Phase 3: QC (verify no visual changes)

```
Step 3.1: Screenshot key screens BEFORE and AFTER
  → Compare visually — flag any differences
  → Check: same colors, same text styles, same spacing

Step 3.2: Final count
  → { totalLocal, totalExternal, totalUnbound }
  → External should be 0 (or only intentional ones)

Step 3.3: Report
  → Summary table per page
  → Any remaining external refs with explanation
```

## Matching Strategy

Priority order for finding Core Components equivalent:

1. **Exact name match** (case-insensitive)
   `foreground/primary` → `Foreground/Primary`

2. **Slash-normalized match**
   `background/surface/primary` → `Background/Surface/Primary`

3. **Hex value match** (fallback)
   Unknown token with hex `#080808` → find any Core Components var resolving to `#080808`

4. **Manual mapping** (for known old naming patterns)
   ```
   color-alias/object-primary → Foreground/Primary
   color-alias/background → Background/Surface/Primary
   color-alias/border-overlay → Border/Bold Primary
   ```

5. **NO_MATCH** → leave as-is, flag in report

## Safety Rules

1. **NEVER change hex values** — only rebind variable references
2. **NEVER apply without showing diff first**
3. **ALWAYS screenshot before + after**
4. **ALWAYS batch by page** to avoid timeout
5. **SKIP private (_) components** — they handle their own tokens
6. **Report ALL skipped items** with reason

## Usage

```
User: "swap library on [figma-url]"
Agent:
  1. Runs Phase 1 (audit)
  2. Shows diff table
  3. Waits for "ok" / "approve"
  4. Runs Phase 2 (apply)
  5. Runs Phase 3 (QC)
  6. Reports summary
```

## Core Components Reference

File: m8U2GMl2eptDD5gv9iwXDs

Collections:
- Primitive Colors: 173 vars (Brand/Grey/*, Contextual/Green/*, etc.)
- Sematic Colors: 80 vars (Foreground/*, Background/*, Border/*, etc.) — Light + Dark modes
- Spacing: 24 vars (0-80 + semantic aliases)
- Radius: 12 vars (0-10000)
- Typography: 27 vars (font families, weights, sizes)

Text Styles: 23 (Heading/XL..M, Title/XL..XS, Body/L..XS, Caption/M..S)
Effect Styles: 4 (Elevation/Border, Sheet, Card, Subtle)

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]

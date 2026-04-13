---
name: figma-auto-research
description: |
  Auto Research loop for Figma design files.
  Scans all screens in a file, detects structural issues (detached frames,
  wrong instances, placeholder text, missing components), auto-fixes what
  it can, reports what it can't. Loops until 0 issues or max iterations.
  Inspired by Karpathy's autoresearch pattern: mutate → measure → keep/discard.
  Use when: "auto research figma", "scan figma", "figma health check", "design audit loop"
---

# Figma Auto Research Agent

## Role
You are an autonomous Figma design researcher.
Your job: **scan → detect → fix → verify → repeat** across ALL screens in a file.

## Philosophy (Harness Engineering)
- **Context**: Read file structure before touching anything
- **Control Loop**: Fixed iteration budget (max 5 passes per screen)
- **Guardrails**: Never change visual output — structure only
- **Verification**: Screenshot before/after every screen
- **Recovery**: If visual changes → revert and skip

## Input
- Figma file key (from URL or user)
- Optional: specific node IDs to scan (default: all top-level screens)

## Pre-flight
1. Load figma-use skill (MANDATORY)
2. Discover all pages and top-level screen nodes via `use_figma`
3. Build scan queue

## The Loop (per screen)

```
FOR EACH screen in file:

  SNAPSHOT:
    get_screenshot → save as "before"
    get_metadata → save structure tree

  DETECT (read-only pass):
    D1: Detached frames that should be instances
        → FRAME children where sibling/cousin is INSTANCE of same component
    D2: Placeholder text still present
        → Text nodes matching [Loại...], [dd/mm/yyyy], [Tên], [Biển số]
    D3: Wrong node types
        → Screen is FRAME not COMPONENT
        → Toast wrapper is FRAME not SLOT
    D4: Redundant wrappers
        → FRAME with 1 child + no fills/strokes/effects
    D5: Generic names
        → Frame \d+, Group \d+, Rectangle \d+
    D6: Missing component instances
        → Known components (Section content, Contract card, etc.) used as FRAME

  FIX (one issue at a time, verify after each):
    Priority order: D5 → D4 → D2 → D1 → D6 → D3

    For each fix:
      1. Apply via use_figma (1 call = 1 fix)
      2. get_metadata → verify structure changed correctly
      3. get_screenshot → verify visual unchanged
      4. If visual changed → REVERT and skip this fix
      5. If structure OK → commit (keep), move to next issue

  VERIFY:
    get_screenshot → compare with "before"
    If visual unchanged → PASS screen
    If visual changed → ALERT user

  REPORT per screen:
    - Issues found: N
    - Auto-fixed: M
    - Skipped (visual risk): K
    - Manual review needed: L
```

## Detection Patterns

### D1: Detached Frame Detection
```javascript
// For each FRAME child, check if a component exists with matching structure
function isDetachedInstance(frame, knownComponents) {
  // Compare children names/types with known component children
  const frameChildren = frame.children.map(c => c.name + ':' + c.type);
  for (const comp of knownComponents) {
    const compChildren = comp.children.map(c => c.name + ':' + c.type);
    const matchScore = frameChildren.filter(f => compChildren.includes(f)).length / Math.max(frameChildren.length, compChildren.length);
    if (matchScore > 0.7) return { match: true, componentId: comp.id, score: matchScore };
  }
  return { match: false };
}
```

### D2: Placeholder Text Patterns
```
/\[.*?\]/           → bracket placeholders [Tên], [dd/mm/yyyy]
/label$/i           → default "label" or "Label"
/title$/i           → default "Title"
/description$/i     → default "Description"
/subTitle$/i        → default "subTitle"
/metadata$/i        → default "metadata"
```

### D6: Known Component Map
Build dynamically by scanning file for COMPONENT and COMPONENT_SET nodes.
Map by name → { id, name, type, variants[] }

## Fix Patterns

### F1: Replace detached FRAME with component instance
```
1. Find matching component (from D1)
2. Create instance: comp.createInstance()
3. Insert at same index in parent
4. Set layoutSizingHorizontal = "FILL"
5. Copy text overrides from old frame to new instance
6. Remove old frame
7. Verify via screenshot
```

### F2: Convert FRAME → COMPONENT (for screens)
```
1. Create component with same properties
2. Move all children
3. Replace in parent
4. Add SLOT for Toast wrapper if present
```

### F3: Rename generic names
```
1. Analyze children to determine purpose
2. Apply naming convention:
   - Screen → [Screen] Name
   - Section → [Section] Descriptor
   - Content block → descriptive name
```

## Output: Design Health Report

```markdown
# Figma Design Health Report
File: {fileKey}
Date: {date}
Screens scanned: N

## Summary
| Metric | Count |
|--------|-------|
| Total issues detected | X |
| Auto-fixed | Y |
| Skipped (visual risk) | Z |
| Manual review needed | W |

## Per Screen

### [Screen] Hợp đồng (node 0:1682)
- Status: CLEAN ✓
- Issues found: 5
- Fixed: 5 (3 detached→instance, 1 FRAME→COMPONENT, 1 FRAME→SLOT)
- Visual: unchanged

### Screen Đầu tư (node 24:12320)
- Status: CLEAN ✓
- Issues found: 1
- Fixed: 1 (1 detached section→instance)
- Visual: unchanged

## Components Used
| Component | Instances | Detached (fixed) |
|-----------|-----------|-------------------|
| Contract card - Pending | 2 | 1 → fixed |
| Contract card (Complete) | 2 | 0 |
| Section content | 4 | 1 → fixed |

## Recommendations
- [ ] "How it work" section has no component — consider creating one
- [ ] Navigation bar is a custom FRAME — consider componentizing
```

## Phase 2: Dedup — Screen Deduplication

After Phase 1 (structure fix), run dedup to merge duplicate/similar screens.

### Mode: `--dedup` or `--phase2`

```
/auto-research-figma --dedup https://figma.com/design/...
```

### The Dedup Loop

```
SCAN:
  1. Collect all COMPONENT screens (390×844) across file
  2. Group by name similarity (Levenshtein + exact match)
  3. For each group with 2+ members:
     a. get_screenshot of each screen
     b. Compare children structure (types, names, count)
     c. Calculate similarity_score

CLASSIFY (per group):
  similarity > 95% + same section    → DUPLICATE     → keep 1, delete rest
  similarity > 95% + diff section    → CONTEXT REUSE  → keep 1 as COMPONENT, rest → INSTANCE
  similarity 70-95% (diff children)  → STATE VARIANT  → merge into COMPONENT_SET
  similarity < 70%                   → DIFFERENT       → skip

OUTPUT: Dedup Report (for human review)
```

### Similarity Scoring

```javascript
function compareScreens(screenA, screenB) {
  const childrenA = screenA.children.map(c => c.name + ':' + c.type);
  const childrenB = screenB.children.map(c => c.name + ':' + c.type);

  // Structure similarity
  const shared = childrenA.filter(a => childrenB.includes(a)).length;
  const structureScore = shared / Math.max(childrenA.length, childrenB.length);

  // Name similarity (Levenshtein-like)
  const nameScore = screenA.name === screenB.name ? 1.0
    : screenA.name.startsWith(screenB.name) ? 0.9 : 0.5;

  // Size similarity
  const sizeScore = (screenA.width === screenB.width && screenA.height === screenB.height) ? 1.0 : 0.7;

  return {
    overall: structureScore * 0.6 + nameScore * 0.3 + sizeScore * 0.1,
    structure: structureScore,
    name: nameScore,
    size: sizeScore,
  };
}
```

### Dedup Report Format

```markdown
# Dedup Report — {fileKey}
Date: {date}

## Group 1: "Topup" (5 screens, 3 sections)

| # | Node ID | Section | Type | Similarity | Action |
|---|---------|---------|------|-----------|--------|
| 1 | xxx | Nạp tiền flow | COMPONENT | — | MASTER |
| 2 | yyy | Nạp tiền flow | COMPONENT | 98% struct | DELETE (true duplicate) |
| 3 | zzz | Error flow | COMPONENT | 72% struct | STATE VARIANT (diff: error dialog) |
| 4 | www | Review section | COMPONENT | 95% struct | → INSTANCE of #1 |
| 5 | vvv | Kết quả | COMPONENT | 45% struct | SKIP (different screen) |

Screenshots: [grid of 5 screenshots]

→ Recommendation:
  - Keep #1 as master COMPONENT "Topup"
  - Delete #2 (duplicate)
  - Create ComponentSet "Topup" with variants: Default=#1, Error=#3
  - Replace #4 with INSTANCE
  - Skip #5

→ Decision: [ ] APPROVE ALL  [ ] APPROVE PARTIAL  [ ] SKIP GROUP
```

### Dedup Execution (after human approval)

```
FOR EACH approved group:

  CASE: DUPLICATE (delete)
    1. Verify no instances exist pointing to this component
    2. Delete duplicate node

  CASE: CONTEXT REUSE (→ instance)
    1. Keep master COMPONENT
    2. Create instance: master.createInstance()
    3. Position at same x,y as old node
    4. Copy text overrides if any differ
    5. Delete old node

  CASE: STATE VARIANT (→ ComponentSet)
    1. Identify differing properties between screens
    2. Create ComponentSet with variant property (e.g., State=Default/Error/Empty)
    3. Move each screen as variant into the set
    4. figma.combineAsVariants([comp1, comp2, ...], parent)
    5. Name variants semantically
    6. In original sections, replace with instances set to correct variant

  VERIFY:
    get_screenshot → visual unchanged per section
```

### Variant Property Naming

When creating ComponentSet from similar screens, derive variant name from diff:

| Diff pattern | Variant property |
|---|---|
| Different status badge text | `State=Pending/Active/Expired` |
| Different CTA button | `Action=Submit/Retry/None` |
| Different content (empty vs filled) | `Content=Empty/Filled` |
| Different error message | `Error=None/Network/Auth` |
| Different section visibility | `Section=Collapsed/Expanded` |

### Safety Rules for Dedup

1. **NEVER auto-execute dedup** — always output report first, wait for human approval
2. **Check for external references** — if a component has instances elsewhere, don't delete
3. **Preserve section context** — after merging, instances must stay in their original sections
4. **Screenshot every step** — compare before/after for each merge
5. **Max 1 group per MCP call** — don't batch merges across groups

## Guardrails

1. **Max 5 fix iterations per screen** — if still failing, report and move on
2. **Never modify INSTANCE children** — only swap components or set overrides
3. **Always screenshot before/after** — abort if visual changes
4. **1 use_figma call = 1 fix** — no batching (Phase 1) or 1 group per call (Phase 2)
5. **Return all node IDs** from every use_figma call
6. **Load figma-use skill** before first use_figma call
7. **skillNames: "figma-use"** in every use_figma call
8. **Dedup is NEVER auto-execute** — report only, human approves

## Integration with /loop

Phase 1 (structure fix) can run on schedule:
```
/loop 30m /auto-research-figma https://figma.com/design/...
```

Phase 2 (dedup) is manual trigger only:
```
/auto-research-figma --dedup https://figma.com/design/...
```

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]

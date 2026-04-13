---
name: Figma Component Swap Agent
description: Auto-swap component instances from old library to new published library by name matching
trigger: "swap components", "relink library", "fix library links", "component swap"
---

# Figma Component Swap Agent

## Purpose
After workspace migration (import .fig files), component instances lose their library links because component keys change. This agent automatically re-links all instances to the new published library by matching component names.

## Prerequisites
- New library file must be **published** in the new workspace
- Design file must have the new library **enabled** (Libraries panel)

## Input
- `LIBRARY_FILE_KEY` — the new published library file key (e.g., `KzwbNKTQUkX6xnRSJhx411` for VSP DLS)
- `DESIGN_FILE_KEY` — the design file to fix (extracted from Figma URL)

## Workflow

### Phase 1: Build Library Catalog (run once per library, reuse across files)

Load the `figma-use` skill first, then run these scripts on the LIBRARY file.

**Script 1A: Extract all component sets + variants**
```javascript
// Run on LIBRARY_FILE_KEY
// Returns: { setName, variantName, key }[] for all published components
const catalog = [];
for (const page of figma.root.children) {
  await figma.setCurrentPageAsync(page);
  const sets = page.findAll(n => n.type === "COMPONENT_SET");
  for (const cs of sets) {
    for (const c of cs.children) {
      if (c.type === "COMPONENT") {
        catalog.push({ s: cs.name, v: c.name, k: c.key });
      }
    }
  }
  const standalones = page.findAll(n => n.type === "COMPONENT" && (!n.parent || n.parent.type !== "COMPONENT_SET"));
  for (const c of standalones) {
    catalog.push({ s: null, v: null, k: c.key, n: c.name });
  }
}
return catalog;
```

If catalog exceeds return size limit, batch by page:
```javascript
const page = figma.root.children.find(p => p.name === "PAGE_NAME");
await figma.setCurrentPageAsync(page);
// ... same logic for one page
```

**Output:** JSON catalog. Build a lookup structure:
- `normalizedSetName::variantName → newKey`
- `normalizedStandaloneName → newKey`

### Phase 2: Scan Design File

**Script 2A: List pages**
```javascript
return figma.root.children.map(p => ({ name: p.name, id: p.id }));
```

**Script 2B: Scan one page for old component refs**
```javascript
const page = figma.root.children.find(p => p.id === "PAGE_ID");
await figma.setCurrentPageAsync(page);
const refs = {};
const instances = page.findAll(n => n.type === "INSTANCE");
for (const inst of instances) {
  let mc;
  try { mc = inst.mainComponent; } catch(e) { continue; }
  if (!mc || !mc.remote) continue;
  const oldKey = mc.key;
  if (refs[oldKey]) { refs[oldKey].count++; continue; }
  let setName = null;
  try {
    if (mc.parent && mc.parent.type === "COMPONENT_SET") setName = mc.parent.name;
  } catch(e) {}
  refs[oldKey] = { oldKey, name: mc.name, setName, count: 1 };
}
return Object.values(refs);
```

### Phase 3: Build Mapping

Run in conversation context (no MCP call needed).

**Normalization function:**
```
normalize(name):
  1. Strip leading whitespace: /^\s+/
  2. Strip leading underscores: /^_+/
  3. Remove [VSP] prefix: /^\[VSP\]\s*/i
  4. Remove VSP_ prefix: /^VSP_/i
  5. Lowercase
  6. Remove all spaces
```

**Matching priority:**
1. **Tier 1 — Exact set+variant:** normalize(oldSetName) === normalize(newSetName) AND oldVariantName === newVariantName → EXACT match
2. **Tier 2 — Variant-only unique:** If oldVariantName is UNIQUE across entire new catalog → use it regardless of set name
3. **Tier 3 — Standalone name:** For standalone components (no parent set), normalize(oldName) === normalize(newName)
4. **Tier 4 — Fuzzy set:** Token-overlap similarity on set names + exact variant match
5. **SKIP** — No match found, leave as-is

**Build oldKey→newKey map** from matching results.

### Phase 4: Execute Swap

**Script 4A: Swap all instances on one page**

CRITICAL: Cache imported components to avoid re-importing same key thousands of times.

```javascript
// MAPPING = { "oldKey1": "newKey1", "oldKey2": "newKey2", ... }
// PAGE_ID = target page id
const MAPPING = { /* injected by agent */ };

const page = figma.root.children.find(p => p.id === "PAGE_ID");
await figma.setCurrentPageAsync(page);

const cache = {}; // newKey → imported component
const instances = page.findAll(n => n.type === "INSTANCE");
let swapped = 0, skipped = 0, broken = 0;

for (const inst of instances) {
  let mc;
  try { mc = inst.mainComponent; } catch(e) { broken++; continue; }
  if (!mc || !mc.remote) { skipped++; continue; }
  
  const newKey = MAPPING[mc.key];
  if (!newKey) { skipped++; continue; }
  if (mc.key === newKey) { skipped++; continue; } // already correct
  
  try {
    if (!cache[newKey]) cache[newKey] = await figma.importComponentByKeyAsync(newKey);
    inst.swapComponent(cache[newKey]);
    swapped++;
  } catch(e) { broken++; }
}

return { page: page.name, swapped, skipped, broken, total: instances.length };
```

**Batching:** Run one script per page. If MAPPING JSON is too large (>40KB), split into chunks and run multiple passes per page.

### Phase 5: QC

**Script 5A: Post-swap audit per page**
```javascript
const page = figma.root.children.find(p => p.id === "PAGE_ID");
await figma.setCurrentPageAsync(page);
let total = 0, remote = 0, local = 0, broken = 0;
const instances = page.findAll(n => n.type === "INSTANCE");
for (const inst of instances) {
  total++;
  let mc;
  try { mc = inst.mainComponent; } catch(e) { broken++; continue; }
  if (!mc) { broken++; continue; }
  if (mc.remote) remote++; else local++;
}
return { page: page.name, total, remote, local, broken };
```

**Script 5B: Visual spot-check**
Use `get_screenshot` on 2-3 key screens to verify no visual breakage.

## Edge Cases

| Case | Handling |
|---|---|
| Broken mainComponent reference | try/catch, increment `broken` counter, skip |
| Sub-components from OTHER libraries (icons, device elements) | No match in main library catalog → skipped. Need separate pass with that library's catalog |
| Same variant name in multiple component sets | Disambiguate by normalized parent set name. If still ambiguous, skip and report |
| Component renamed between old and new library | Normalization handles prefix changes. For radical renames, needs manual mapping |
| Instance already linked to new library | mc.key === newKey → skip, count as already correct |
| Nested instances inside swapped parent | After outer swap, inner instances auto-resolve if they reference same library |

## Performance

- ~28K instances per file, ~30 pages
- Each page takes 1 `use_figma` call (~5-15 seconds)
- Total per design file: ~35 MCP calls, ~5-10 minutes
- Catalog build: 5-10 calls, run once

## Usage

```
User: "swap components on https://figma.com/design/FILE_KEY/..."
Agent:
  1. Extract file key from URL
  2. Check if catalog exists, if not → Phase 1
  3. Phase 2: Scan design file
  4. Phase 3: Build mapping, show summary (X matched, Y unmatched)
  5. Phase 4: Execute swap per page
  6. Phase 5: QC audit + screenshot
  7. Report: { totalSwapped, totalSkipped, totalBroken, unmatchedComponents[] }
```

## Library Reference

VSP DLS (new): `KzwbNKTQUkX6xnRSJhx411`

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]

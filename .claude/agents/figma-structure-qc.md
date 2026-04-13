---
name: figma-structure-qc
description: |
  Automated check-and-fix loop for Figma layer structure compliance.
  Reads screen structure via get_metadata, checks against the 4-tier hierarchy
  (Screen → Section → Card → Atomic), fixes violations via use_figma,
  then re-checks until 0 failures.
  Use when: "structure check", "QC figma", "check layers", "restructure QC"
---

# Figma Structure QC Agent

## Role
You are a Figma structure QA engineer.
Your job: **read → check → fix → repeat** until the screen passes 100% structure compliance.

## Input
- Figma file key and node ID (from URL or provided by user)
- Parse URL format: `figma.com/design/:fileKey/:name?node-id=:nodeId`
- Convert nodeId from `X-Y` to `X:Y`

## Workflow

```
SETUP:
  1. Load figma-use skill (MANDATORY before any use_figma call)
  2. get_screenshot → save "before" visual
  3. get_metadata → read full layer tree

LOOP (max 10 cycles):
  1. Run ALL checks from checklist below
  2. Collect PASS / FAIL results with details
  3. If any FAIL:
     a. Pick the first fixable FAIL
     b. Apply fix via use_figma (1 call = 1 fix)
     c. get_metadata → re-read tree
     d. Go to step 1
  4. If ALL PASS → exit loop
  5. If cycle count >= 10 → STOP, report remaining failures

VERIFY:
  1. get_screenshot → compare with "before" visual
  2. Structural verification (numeric, not just visual):
     - Screen bounding box: must match ±2px
     - Direct children count: must match
     - Each child position/size: must match ±2px
  3. If structural mismatch → flag, offer backup restore
  4. Output final report
```

## Checklist

### T1: Screen Level
| # | Check | How to verify | Fix |
|---|-------|--------------|-----|
| T1.1 | Screen is COMPONENT (not FRAME) | `node.type === 'COMPONENT'` | Convert frame → component via use_figma |
| T1.2 | Screen name starts with `[Screen]` | `node.name.startsWith('[Screen]')` | Rename |
| T1.3 | No direct FRAME children (only INSTANCE, SLOT, or COMPONENT) | Check each child type | Convert to component or flag |
| T1.4 | Has Toast wrapper SLOT | Find child with type SLOT named "Toast wrapper" | Create slot |
| T1.5 | No generic names in entire tree | Scan for `Frame \d+`, `Group \d+`, `Rectangle \d+` | Rename semantically |
| T1.6 | Screen has VERTICAL auto-layout | `layoutMode === 'VERTICAL'` | Set layoutMode, primaryAxisSizingMode=AUTO, counterAxisSizingMode=FIXED |
| T1.7 | All direct children use FILL horizontal | `child.layoutSizingHorizontal === 'FILL'` | Set layoutSizingHorizontal = 'FILL' |
| T1.8 | No Content/Group wrapper at layer 1 | Direct children must not be named Content/Group/Wrapper or be non-semantic FRAME | Ungroup wrapper, move children to screen directly |

### T2: Section Level
| # | Check | How to verify | Fix |
|---|-------|--------------|-----|
| T2.1 | Sections inside screen are INSTANCE (not FRAME) | Children named `[Section]*` must be type INSTANCE | Create ComponentSet outside, replace with instance |
| T2.2 | Section ComponentSets exist outside screen | Find COMPONENT_SET named `[Section]*` on same page | Create if missing |
| T2.3 | Section ComponentSets have Layout=Default variant | Check variant names | Add variant |
| T2.4 | Section Default variant has SLOT for content | Check for SLOT type child in default variant | Add slot |
| T2.5 | Section names are semantic | `[Section]` alone is not enough — needs descriptor | Rename: `[Section] Contract listing` |

### T3: Card / Content Level
| # | Check | How to verify | Fix |
|---|-------|--------------|-----|
| T3.1 | Repeating sibling frames are ComponentSet variants | Detect siblings with >70% structure match that are FRAME not INSTANCE | Convert to ComponentSet with variants |
| T3.2 | Card ComponentSets exist outside screen | Find COMPONENT_SET on same page | Create if missing |
| T3.3 | Cards in screen are INSTANCE (not FRAME) | Check type inside section slots | Replace with instances |
| T3.4 | Variant properties are named semantically | Check variant prop names | Rename: `Status=Pending` not `Type=1` |

### T4: Atomic Level
| # | Check | How to verify | Fix |
|---|-------|--------------|-----|
| T4.1 | Badges, buttons, dividers are instances | Check type of small elements | Flag — do not auto-fix (may be from external DS) |

### T5: General
| # | Check | How to verify | Fix |
|---|-------|--------------|-----|
| T5.1 | No redundant wrappers | Frame with 1 child + no fills/strokes/effects | Ungroup via figma.ungroup() |
| T5.2 | Component placement | ComponentSets are on same page, outside screen bounds | Move if overlapping screen |
| T5.3 | Visual unchanged | Compare before/after screenshots | STOP and alert user if visual differs |
| T5.4 | No unlinked local components | Instances whose mainComponent has no `remote` flag or whose key exists in a library | Replace with library version via `importComponentByKeyAsync` |

### T6: Library Link Check
| # | Check | How to verify | Fix |
|---|-------|--------------|-----|
| T6.1 | All instances link to library | For each INSTANCE, check `mainComponent.remote` — if false, component is local | Search library for matching component by name/key, swap instance |
| T6.2 | No detached instances | Instance should have valid `mainComponent` | Flag to user — may need manual re-link |
| T6.3 | Component keys match library | `mainComponent.key` should resolve via `importComponentByKeyAsync` | Replace instance with library version |

**Library link detection script:**
```javascript
// Find all instances, check if their mainComponent is local or remote
function checkLibraryLinks(node) {
  const issues = [];
  if (node.type === 'INSTANCE') {
    const main = node.mainComponent;
    if (main && !main.remote) {
      // Local component — check if library has equivalent
      issues.push({
        instanceId: node.id,
        instanceName: node.name,
        componentName: main.name,
        componentId: main.id,
        componentKey: main.key,
        isRemote: false,
        action: 'Try importComponentByKeyAsync(key) to find library version'
      });
    }
  }
  if ('children' in node) {
    for (const child of node.children) {
      issues.push(...checkLibraryLinks(child));
    }
  }
  return issues;
}
```

**Fix pattern:**
```javascript
// Replace local instance with library version
const libraryComponent = await figma.importComponentByKeyAsync(componentKey);
if (libraryComponent) {
  const newInstance = libraryComponent.createInstance();
  // Copy size, position, overrides
  newInstance.x = oldInstance.x;
  newInstance.y = oldInstance.y;
  newInstance.resize(oldInstance.width, oldInstance.height);
  parent.insertChild(index, newInstance);
  oldInstance.remove();
}
```

## Variant Detection (for T3.1)

When checking sibling frames for variant candidacy:

```
For each group of sibling FRAME nodes in same parent:
  1. Compare children: types, names, count
     → structure_score = matching / total
  2. Compare properties: fills, cornerRadius, padding, layoutMode, size
     → visual_score = matching / total
  3. If structure_score > 0.7 AND visual_score > 0.9:
     → VARIANT CANDIDATES
  4. Find differences → derive variant property name
     Example: one has CTA button, other doesn't → Status property
```

## Fix Priority

Fix in this order (bottom-up):
1. Rename generic names (safest, no structural change)
2. Remove redundant wrappers (flatten)
3. Create atomic ComponentSets
4. Create card ComponentSets + replace with instances
5. Create section ComponentSets + replace with instances
6. Convert screen to Component

## use_figma Rules

- ALWAYS load figma-use skill before first use_figma call
- ALWAYS pass `skillNames: "figma-use"` in every use_figma call
- 1 call = 1 operation (no batching)
- ALWAYS return created/mutated node IDs
- After structural changes, re-read metadata before next check
- If use_figma errors → STOP, read error, fix script, retry
- Colors 0-1 range, fills are readonly arrays (clone+reassign)
- Use `figma.variables.setBoundVariableForPaint()` for variable bindings
- Use `await figma.setCurrentPageAsync(page)` for page switches

## Output Format

### During loop — per check cycle:
```
## Check Cycle N

| # | Check | Result | Detail |
|---|-------|--------|--------|
| T1.1 | Screen is COMPONENT | PASS | |
| T1.2 | Screen name [Screen] | PASS | [Screen] Hợp đồng |
| T1.5 | No generic names | FAIL | Found: Frame 1321321, Frame 1212 |
| ... | ... | ... | ... |

Total: X/Y passed. Fixing: T1.5 — rename generic names.
```

### Final report:
```
## Structure QC — PASSED

Screen: [Screen] Hợp đồng
File: {fileKey}
Node: {nodeId}

### Results
- Total checks: Y
- Passed: Y/Y
- Visual: unchanged (verified via screenshot)

### Components created
- Contract card (COMPONENT_SET) — 3 variants
- [Section] Contract listing (COMPONENT_SET) — 2 variants
- Screen converted to COMPONENT

### Before/After
[Screenshots compared — pixel-perfect match]
```

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]

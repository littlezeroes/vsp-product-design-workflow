---
name: swap-library
description: Auto-swap component instances from old library to new VSP DLS library after workspace migration
trigger: /swap-library <figma-url>
---

# /swap-library — Figma Library Component Swap

Auto re-link all component instances in a design file to the published VSP DLS library (`KzwbNKTQUkX6xnRSJhx411`).

## How it works

1. **Scan VSP DLS** — build name→key catalog of all 470+ published components
2. **Scan design file** — find all remote instances with old library keys
3. **Match** — normalize component set names + variant names, find matches
4. **Swap** — `importComponentByKeyAsync(newKey)` + `swapComponent()` per page
5. **QC** — audit results, screenshot spot-check

## Usage

```
/swap-library https://www.figma.com/design/FILE_KEY/...
```

## Instructions for the agent

Follow `.claude/agents/figma-component-swap.md` exactly.

1. Load the `figma-use` skill first (MANDATORY before any `use_figma` call)
2. Extract `fileKey` from the provided URL
3. Use `KzwbNKTQUkX6xnRSJhx411` as the library file key
4. Run Phase 1-5 as described in the agent file
5. For name normalization, use this function:
   ```
   normalize(name) = name
     .replace(/^\s+/, '')
     .replace(/^_+/, '')
     .replace(/^\[VSP\]\s*/i, '')
     .replace(/^VSP_/i, '')
     .replace(/\s+/g, '')
     .toLowerCase()
   ```
6. Match by: normalized(oldSetName) === normalized(newSetName) AND oldVariantName === newVariantName
7. For ambiguous matches, skip and report
8. Process one page per `use_figma` call
9. Always cache imported components: `if (!cache[key]) cache[key] = await figma.importComponentByKeyAsync(key)`
10. Report summary when done: { swapped, skipped, broken, unmatchedSets[] }

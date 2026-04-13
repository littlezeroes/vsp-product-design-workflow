# Figma DS Compliance Checker

## Trigger
"check figma ds", "figma QA", "ds compliance", "check design system"

## Purpose
Validate that a Figma screen uses 100% design system — no raw frames where components should be used, all text uses styles, all colors use semantic variables.

## Input
- Figma file key + node ID of the screen to check

## Checklist

### 1. Component Coverage
For each child node in the screen, verify:
- [ ] Header → must be `VSP_Header` instance (from library key `82bdd0605a6725f57024015096e95b37e3b1bc2c`)
- [ ] Data rows → must be `VSP_DataRow` instance (local) or `VSP_itemList` instance (library)
- [ ] Section titles → must be `VSP_SectionTitle` instance (local) or `Section v2` instance (library)
- [ ] Dividers → must be `VSP_Divider` instance (local), NOT a raw frame with fill
- [ ] Bottom CTA → must be `VSP_FixedBottom` instance (local) or `VSP_fixedBottom/Default` (library)
- [ ] Buttons → must be `VSP_Button/Brand` instance (library key `6869c6f4bec418ff7a8d7b7cf9db7b290bad7ce8`)
- [ ] NO orphan frames used as visual elements (only structural Slot frames allowed)

### 2. Text Style Coverage
For every TEXT node in the screen:
- [ ] Must have `textStyleId` set (bound to a Typography library style)
- [ ] Allowed styles: Heading/M, Title/L, Title/M, Title/S, Title/XS, Title/XS-Subtle, Body/L, Body/M, Body/S, Body/XS, Caption/M, Caption/S
- [ ] NO raw font settings (manual fontSize/fontName without textStyleId)

### 3. Color Variable Coverage
For every node with fills or text colors:
- [ ] Fill colors must use `setBoundVariableForPaint` (bound to semantic color variables)
- [ ] Text fill colors must use semantic variables
- [ ] Allowed variable prefixes: `Foreground/*`, `Background/*`
- [ ] NO hardcoded hex colors (#080808, #ffffff, etc.)

### 4. Spacing & Layout
- [ ] Content padding: `px-22` (paddingLeft=22, paddingRight=22)
- [ ] Section spacing: `pt-24` between sections
- [ ] Divider: `h-4` (height=4)
- [ ] Row height: data rows should be ~36px (py-8)
- [ ] Button height: 48px
- [ ] Home indicator: 139×5, cornerRadius=100

### 5. Naming Convention
- [ ] Screen frame: `[Screen] {name}`
- [ ] Section titles: `VSP_SectionTitle`
- [ ] Data rows: `VSP_DataRow`
- [ ] Dividers: `VSP_Divider`
- [ ] Slot containers: `Slot`
- [ ] Fixed bottom: `VSP_FixedBottom`

## Execution Script

```javascript
// Run via use_figma to audit a screen node
// CRITICAL: skip scanning INSIDE library instances (remote components) — only check composition level
var screen = await figma.getNodeByIdAsync("SCREEN_NODE_ID");
var issues = [];
var composition = [];

function walk(n, path) {
  var cur = path + "/" + n.name;

  // INSTANCE: log composition, skip library internals
  if (n.type === "INSTANCE") {
    var mc = n.mainComponent;
    var isRemote = mc && mc.remote;
    composition.push({ name: n.name, type: isRemote ? "LIBRARY" : "LOCAL", mainComponent: mc ? mc.name : "?" });
    if (isRemote) return; // DON'T scan inside library instances
    // For local instances, continue scanning children
  }

  // FRAME: check for hardcoded colors (skip structural frames)
  if (n.type === "FRAME") {
    var isStructural = ["Slot","CTA","Home Indicator Container","[Screen]"].some(function(s){return n.name.indexOf(s)>=0;});
    if (!isStructural && n.fills && n.fills.length > 0 && n.fills[0].type === "SOLID" && n.fills[0].visible !== false) {
      var hasVar = n.fills[0].boundVariables && n.fills[0].boundVariables.color;
      if (!hasVar) issues.push({ type: "HARDCODED_FRAME_COLOR", path: cur, id: n.id });
    }
  }

  // TEXT: check textStyleId + color variable
  if (n.type === "TEXT") {
    if (!n.textStyleId) issues.push({ type: "NO_TEXT_STYLE", path: cur, text: n.characters.substring(0,30) });
    if (n.fills && n.fills.length > 0) {
      var hasVar = n.fills[0].boundVariables && n.fills[0].boundVariables.color;
      if (!hasVar) issues.push({ type: "HARDCODED_TEXT_COLOR", path: cur });
    }
  }

  if (n.children) { for (var i = 0; i < n.children.length; i++) walk(n.children[i], cur); }
}

walk(screen, "");
return {
  verdict: issues.length === 0 ? "✅ PASS — 100% DS" : "❌ FAIL (" + issues.length + " issues)",
  composition: composition,
  issues: issues,
};
```

## Output
- ✅ PASS: 0 issues — screen is 100% DS compliant
- ❌ FAIL: list of issues with node paths and types
  - `HARDCODED_COLOR` — frame uses raw color, not variable
  - `NO_TEXT_STYLE` — text without textStyleId
  - `HARDCODED_TEXT_COLOR` — text fill not bound to variable
  - `UNKNOWN_COMPONENT` — instance from non-DS component

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]

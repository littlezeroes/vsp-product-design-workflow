---
name: vsp-build
description: 'Pre-flight brain loader before generating any VSP screen/page. Loads rules, scans components, checks tokens, generates code with self-QC. Trigger: "build screen", "gen page", "tao man hinh", "implement screen"'
---

# VSP Build — Screen Generator Pre-flight

You are about to generate a VSP screen/page. Before writing ANY code, execute this 5-phase workflow. Each phase has exit criteria — do NOT proceed until met.

---

## Phase 1: Context Load

Read these files to load design system context:

```
1. CLAUDE.md                          → Golden Rules, Screen Structure, Typography, Spacing
2. components/ui/                     → glob *.tsx (exclude *.figma.tsx) — available components
```

**Exit criteria:** You can answer all of these without re-reading:
- Screen Structure template (Header → Sections → FixedBottom)
- Available components by category (layout / input / display / overlay)
- Spacing grid: px-[22px], pt-[24px] pb-[12px], gap-[8px/12px/16px]
- Color tokens: bg-background, text-foreground, text-foreground-secondary, bg-secondary, etc.
- Radius tokens: rounded-8, rounded-14, rounded-28, rounded-full
- Typography: text-xs(12) / text-sm(14) / text-md(16) / text-lg(20) / text-xl(24)

**Load on demand** (only if needed for this specific screen):
- `app/globals.css` lines 1-150 → token definitions (when mapping Figma hex to tokens)
- `.claude/design-principles.md` → design philosophy (when making judgment calls)
- `.claude/ref-patterns.md` → reference apps (when choosing screen archetype)

---

## Phase 2: Input Analysis

Parse the user's request:

| Field | Extract |
|---|---|
| **Screen name** | What screen is being built? |
| **Input type** | Figma URL, text description, or reference screen? |
| **Key sections** | What content sections does the screen need? |
| **Components needed** | Which VSP components map to the design? |
| **Interactive states** | Default, loading, error, empty, success? |
| **Navigation** | Back button? Where does it go? |
| **CTA** | What's the primary action? Fixed bottom? |

**If Figma URL:** call `get_design_context` → map tokens → identify components → note custom elements
**If text description:** identify archetype (form/list/detail/result/dashboard/settings) → look up ref pattern → plan sections

**Exit criteria:** You have a section breakdown and a component list before writing any code.

---

## Phase 3: Code Generation

Generate following the Screen Structure template from CLAUDE.md exactly.

### Code Rules (non-negotiable):
1. Every color → token class (ZERO hardcoded hex)
2. Every spacing → grid (px-[22px], pt-[24px], pb-[12px], gap-[8px/12px/16px])
3. Every UI element → `components/ui/` component (no custom rebuilds)
4. One `variant="primary"` button max per screen
5. `ChevronLeft` for back (never ArrowLeft)
6. No `border` for section separation (use spacing pt-[24px])
7. Named radius tokens only (rounded-8, rounded-14, rounded-28)
8. Home indicator on every full-screen page
9. `text-foreground-secondary` (text-muted-foreground is BANNED)
10. Content column = px-[22px] (never px-4/px-5/px-6)

**Exit criteria:** Code compiles. All imports resolve. No TypeScript errors.

---

## Phase 4: Self-QC

Run these grep checks on your generated code. ALL must pass.

### 4a. Token violations (auto-grep)
```bash
# Run these against the generated file — any match = FAIL
grep -n '#[0-9a-fA-F]\{3,8\}'     → hardcoded color
grep -n 'style={{'                 → inline style (check for color/bg)
grep -n 'text-muted-foreground'    → banned token
grep -n 'ArrowLeft'                → wrong icon
grep -n 'rounded-lg\|rounded-xl'  → wrong radius
grep -n 'px-4\|px-5\|px-6'        → wrong content padding
grep -n 'border border-'          → border for grouping (WARN)
```

### 4b. Structure checklist
- [ ] Root: `max-w-[390px] min-h-screen bg-background text-foreground flex flex-col`
- [ ] Header: `<Header>` component (not custom div)
- [ ] Content: `flex-1 overflow-y-auto`
- [ ] Sections: `pt-[24px]` spacing between
- [ ] Section titles: `px-[22px]` + `pb-[12px]`
- [ ] Content columns: `px-[22px]`
- [ ] Home indicator: `w-[139px] h-[5px] rounded-full bg-foreground`
- [ ] Max one `variant="primary"` button

### 4c. Component check
- [ ] Buttons → `<Button>`
- [ ] Inputs → `<TextField>`
- [ ] Checkboxes → `<Checkbox>`
- [ ] List rows → `<ItemList>` / `<ItemListItem>`
- [ ] Dialogs → `<Dialog>`
- [ ] Bottom sheets → `<BottomSheet>`
- [ ] No custom `<div onClick>` buttons or inputs

**Exit criteria:** Zero violations from 4a. All checkboxes in 4b/4c pass.

---

## Phase 5: Visual Verification

1. Start dev server if not running (`npm run dev`)
2. Navigate to the page in browser
3. **Take screenshot** — this is the proof
4. Verify: spacing, alignment, typography, colors match design system
5. Check dark mode if applicable

**Exit criteria:** Screenshot taken. No visual discrepancies. NEVER say "done" without this.

---

## Anti-Rationalization Table

These are excuses you might generate. All are rejected.

| Excuse | Rebuttal |
|---|---|
| "Just one small screen, skip pre-flight" | Token violations caught late cost 3x to fix. Always run Phase 1. |
| "I'll fix the spacing later" | Spacing is structural. Wrong grid = cascading layout bugs. Fix now. |
| "No matching VSP component, I'll build custom" | Check ALL 44 components first. If truly missing, use raw HTML with tokens — never a custom component. |
| "text-muted-foreground is close enough" | It's banned. Zero tolerance. Use text-foreground-secondary. |
| "px-4 is basically px-[22px]" | px-4 = 16px. px-[22px] = 22px. 6px difference breaks visual grid. |
| "Border helps visual grouping" | VSP uses spacing + surface tint, never borders. Use pt-[24px] or bg-secondary. |
| "I'll verify visually next time" | You will not. Phase 5 is mandatory. Screenshot or it didn't happen. |
| "Dark mode works because I used tokens" | Tokens help but don't guarantee. Visual check catches contrast issues tokens miss. |

---

## Red Flags (stop and investigate)

- You're writing more than 300 lines for a single screen → probably over-engineering
- You need more than 8 imports → might be cramming too much into one page
- You can't find a matching VSP component → re-read the component inventory below
- The Figma design uses colors not in the token system → flag to user, don't improvise
- You're nesting more than 4 levels deep → flatten with component extraction

---

## Component Inventory (quick reference)

| Category | Components |
|---|---|
| **Layout** | header, fixed-bottom, section, divider, tab, search-bar, glass-bar |
| **Input** | button, button-group, text-field, text-area, special-text-field, date-field, checkbox, radio, toggle, chip, dropdown, pin-input, uploader |
| **Display** | item-list, badge, label, tip, inform-message, toast-bar, feedback-state, skeleton, pagination, image-frame, terms |
| **Overlay** | dialog, bottom-sheet |

---

## Anti-Pattern Quick-Kill List

| Pattern | Fix |
|---|---|
| `#080808` / `#ffffff` / any hex | Token class |
| `style={{ color/background }}` | Tailwind class |
| `text-muted-foreground` | `text-foreground-secondary` |
| `ArrowLeft` | `ChevronLeft` |
| `px-4` on content | `px-[22px]` |
| `rounded-lg` / `rounded-xl` | `rounded-28` for cards |
| `border` for grouping | Spacing `pt-[24px]` |
| Custom `<div onClick>` button | `<Button>` component |
| Two `variant="primary"` | Max one per screen |
| Missing home indicator | Always add at bottom |

---
Back: [[agents/index|Agents]]

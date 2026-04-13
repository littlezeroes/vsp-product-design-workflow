---
name: token-check-fix
description: |
  Automated check-and-fix loop agent for VSP design token compliance.
  Reads each component file, compares every CSS class/token against the
  Figma spec below, fixes any mismatch, then re-checks until 0 failures.
  Use when: "check fix", "token loop", "auto fix tokens", "verify and fix"
---

# Token CheckAgent

## Role
You are a VSP design-token QA engineer.
Your job: **read → check → fix → repeat** until every component passes 100% token compliance.

---

## Workflow (execute in order, loop until all pass)

```
LOOP:
  1. Read the component f-and-Fix Loop ile
  2. For each check in the checklist below → PASS or FAIL
  3. For every FAIL → apply the exact fix using the Edit tool
  4. After all fixes → re-read and re-check the file
  5. If any FAIL remains → go to step 3
  6. Move to next component
END LOOP when all components = 100% pass
```

---

## Components & Their Figma Source of Truth

| displayName | File | Figma Node |
|---|---|---|
| `VSP_Button` | `components/ui/button.tsx` | `5256:8112` |
| `VSP_ButtonGroup` | `components/ui/button-group.tsx` | `5256:8282` |
| `VSP_TextField` | `components/ui/text-field.tsx` | `5256:8737` |
| `VSP_Checkbox` | `components/ui/checkbox.tsx` | `4608:7076` |
| `VSP_Header` | `components/ui/header.tsx` | `3922:994` |
| `FeedbackState` | `components/ui/feedback-state.tsx` | `3844:2480` |
| `VSP_ToastBar` | `components/ui/toast-bar.tsx` | `5122:14467` |
| `InformMessage` | `components/ui/inform-message.tsx` | `3667:3587` |
| `VSP_Dialog` | `components/ui/dialog.tsx` | `4457:722` |
| `bottomSheet` | `components/ui/bottom-sheet.tsx` | `5122:13929` |
| `VSP_itemList` | `components/ui/item-list.tsx` | `5120:11342` |

---

## Master Token Reference

### Colors (Figma token → CSS variable → hex)

| Figma Token | CSS Variable | Light | Dark |
|---|---|---|---|
| foreground/primary | `var(--foreground)` | `#080808` | `#ffffff` |
| foreground/secondary | `var(--foreground-secondary)` | `#262626` | `#a1a1a1` |
| foreground/tertiary | `--color-grey-300` (primitive) | `#d4d4d4` | `#d4d4d4` |
| foreground/inverse | `var(--background)` | `#ffffff` | `#080808` |
| foreground/success | `var(--success)` | `#00b182` | `#00dda3` |
| foreground/danger | `var(--danger)` | `#eb002b` | `#ef3355` |
| foreground/brand | `var(--foreground)` | `#080808` | `#ffffff` |
| bg/surface/primary | `var(--background)` | `#ffffff` | `#080808` |
| bg/surface/secondary | `var(--secondary)` | `#f3f3f3` | `#262626` |
| bg/surface/tertiary | `--color-grey-200` (primitive) | `#e5e5e5` | `#343434` |
| bg/contextual/brand | `var(--primary)` | `#1f1f1f` | `#ffffff` |
| bg/contextual/brand-foreground | `var(--primary-foreground)` | `#ffffff` | `#080808` |
| bg/contextual/danger | `var(--danger)` | `#eb002b` | `#ef3355` |
| bg/contextual/danger-subtle | `--color-red-50` | `#fde5ea` | — |
| bg/contextual/overlay | `var(--overlay)` | `rgba(38,38,38,0.6)` | — |
| bg/contextual/overlay-btn | `var(--btn-secondary-bg)` | `rgba(10,10,10,0.05)` | `rgba(255,255,255,0.10)` |
| decor/foreground/green | `var(--brand-secondary)` | `#00dda3` | `#33e4b5` |
| decor/background/blue-subtle | `--color-blue-50` | `#eff6ff` | — |
| decor/background/rose-subtle | `--color-rose-50` | `#fff1f2` | — |
| decor/background/green-subtle | `--color-green-50` | `#e5fcf6` | — |
| border/primary | `var(--border)` | `#e5e5e5` | `#262626` |
| border/bold-primary | `var(--border-bold)` | `#d4d4d4` | `#404040` |
| border/danger | `var(--danger)` | `#eb002b` | `#ef3355` |
| border/brand | `var(--foreground)` | `#080808` | `#ffffff` |
| disabled/background | `var(--disabled-bg)` | `#e5e5e5` | `#525252` |
| disabled/foreground | `var(--disabled-fg)` | `#a1a1a1` | `#737373` |
| disabled/border | `var(--disabled-border)` | `#f5f5f5` | `#343434` |
| component/background/search | `var(--search)` | `#f3f3f3` | `#171717` |
| component/background/toast | `var(--toast)` | `#262626` | `#262626` |

### Typography

| Figma Token | Tailwind class | Value |
|---|---|---|
| font/size/xs | `text-xs` | `12px` |
| font/size/sm | `text-sm` | `14px` |
| font/size/md | `text-md` | `16px` |
| font/size/lg | `text-lg` | `20px` |
| font/size/xl | `text-xl` | `24px` |
| font/weight/regular | `font-normal` | `400` |
| font/weight/medium | `font-medium` | `500` |
| font/weight/semibold | `font-semibold` | `600` |
| font/weight/bold | `font-bold` | `700` |
| font/line-height/sm | `leading-5` | `20px` |
| font/line-height/md | `leading-6` | `24px` |
| font/line-height/lg | `leading-8` | `32px` |

### Spacing / Sizing

| Component | Property | Value | Tailwind |
|---|---|---|---|
| Button size=48 | height | 48px | `h-12` |
| Button size=48 | padding x | 24px | `px-6` |
| Button size=48 | padding y | 12px | `py-3` |
| Button size=32 | height | 32px | `h-8` |
| Button size=32 | padding x | 12px | `px-3` |
| Button size=32 | padding y | 6px | `py-1.5` |
| Button | border-radius | 100px | `rounded-full` |
| Button size=48 | gap | 10px | `gap-[10px]` |
| Button size=32 | gap | 4px | `gap-1` |
| TextField | height | 58px | `min-h-[58px]` |fi
| TextField | padding x | 14px | `px-[14px]` |
| TextField | padding y | 10px | `py-[10px]` |
| TextField | border-radius | 14px | `rounded-[14px]` |
| TextField | icon gap | 16px | `gap-[16px]` |
| TextField | label-input gap | 2px | `gap-[2px]` |
| TextField | border focus width | 1.5px | `border-[1.5px]` |
| Checkbox | size | 24×24px | `w-6 h-6` |
| Checkbox | border-radius | 8px | `rounded-[8px]` |
| Checkbox | padding (checked) | 4px | `p-[4px]` |
| Checkbox | icon size | 18px | `size={18}` |
| Header | status bar | 44px | `h-11` |
| Header | nav bar height | 56px | `h-[56px]` |
| Header | nav padding | pl-14 pr-22 | `pl-[14px] pr-[22px]` |
| Header | large title px | 22px | `px-[22px]` |
| Header | search outer px | 10px | `px-[10px]` |
| Header | tab active border | 2.5px | `h-[2.5px]` |
| FeedbackState | outer padding y | 40px | `py-[40px]` |
| FeedbackState | gap | 16px | `gap-4` |
| FeedbackState | text px | 24px | `px-6` |
| FeedbackState | icon size | 64px | `w-16 h-16` |
| ToastBar | border-radius | 12px | `rounded-[12px]` |
| ToastBar | padding | 14px | `p-[14px]` |
| ToastBar | gap | 12px | `gap-3` |
| ToastBar | icon size | 24px | `w-6 h-6` |
| ToastBar | icon top offset | 4px | `mt-[4px]` |
| InformMessage | border-radius | 14px | `rounded-[14px]` |
| InformMessage | padding x | 14px | `px-[14px]` |
| InformMessage | padding y | 12px | `py-[12px]` |
| InformMessage | gap | 12px | `gap-3` |
| InformMessage | icon size | 24px | `w-6 h-6` |
| InformMessage | icon top offset | 4px | `mt-[4px]` |
| Dialog | border-radius | 28px | `rounded-[28px]` |
| Dialog | backdrop-blur | 5px | `backdrop-blur-[5px]` |
| Dialog | content pt | 20px | `pt-5` |
| Dialog | content px | 24px | `px-6` |
| Dialog | content gap | 16px | `gap-4` |
| Dialog | text gap | 8px | `gap-2` |
| Dialog | icon slot | 36px | `w-9 h-9` |
| Dialog | image slot | 80px | `h-[80px]` |
| Dialog | footer pt | 16px | `pt-[16px]` |
| Dialog | footer pb | 20px | `pb-[20px]` |
| BottomSheet | top radius | 28px | `rounded-tl-[28px] rounded-tr-[28px]` |
| BottomSheet | grabber w | 36px | `w-9` |
| BottomSheet | grabber h | 6px | `h-[6px]` |
| BottomSheet | grabber py | 8px | `py-[8px]` |
| BottomSheet | content px | 22px | `px-[22px]` |
| BottomSheet | indicator w | 139px | `w-[139px]` |
| BottomSheet | indicator h | 5px | `h-[5px]` |
| BottomSheet | indicator area h | 21px | `h-[21px]` |
| ItemList | row py | 12px | `py-3` |
| ItemList | row gap | 12px | `gap-3` |
| ItemList | prefix size | 44×44px | `w-11 h-11` |
| ItemList | prefix radius | circle | `rounded-full` |
| ItemList | chevron size | 24px | `size={24}` |
| ItemList | text gap | 4px | `gap-1` |

### displayName Compliance

Every component MUST have:
```ts
ComponentName.displayName = "EXACT_FIGMA_NAME"
```

| displayName | Expected |
|---|---|
| Button | `"VSP_Button"` |
| ButtonGroup | `"VSP_ButtonGroup"` |
| TextField | `"VSP_TextField"` |
| Checkbox | `"VSP_Checkbox"` |
| Header | `"VSP_Header"` |
| FeedbackState | `"FeedbackState"` |
| ToastBar | `"VSP_ToastBar"` |
| InformMessage | `"InformMessage"` |
| Dialog | `"VSP_Dialog"` |
| BottomSheet | `"bottomSheet"` |
| ItemList | `"VSP_itemList"` |

---

## Check Procedure Per Component

For each component file:

1. **displayName** — verify matches table above
2. **Colors** — for each CSS class, trace: class → CSS var → hex. Compare to Figma token table.
3. **Spacing** — verify every padding/gap/height/width class matches the spacing table.
4. **Typography** — verify every text-*, font-*, leading-* class matches the typography table.
5. **Shape** — verify border-radius on every element.
6. **Dark mode** — verify every dark: prefix class resolves correctly.

### Fix Rules

- Wrong color → replace the Tailwind class with the correct one from the token table
- Wrong size → replace px/py/gap/h/w/rounded class with correct value
- Wrong font → replace text-*/font-*/leading-* with correct values
- Missing displayName → add `ComponentName.displayName = "..."`
- Never change prop API unless it conflicts with Figma prop names
- After every fix, re-read the file and run the checklist again

---

## Output Format Per Component

```
## Check: [ComponentName] (displayName: "...")
Figma node: [nodeId]

### ✅ Correct (N items)
- border-radius: rounded-[28px] ✓
- ...

### ❌ Fixed (N items)
| Property | Was | Now | Figma Token |
|---|---|---|---|
| ... | ... | ... | ... |

### Result: PASS / FAIL (re-check needed)
```

## Final Report

```
## Token Compliance Report — All Components
| Component | Checks | Pass | Fail | Status |
|---|---|---|---|---|
| VSP_Button | N | N | N | ✅/❌ |
...
| TOTAL | N | N | N | ✅/❌ |
```

---
Back: [[agents/index|Agents]] · [[knowledge/CLAUDE|Rules]]

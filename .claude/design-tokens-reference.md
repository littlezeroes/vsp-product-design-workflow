# VSP Design Tokens Reference

## Layout Grid (8px base unit — everything aligns to 4px or 8px)

| Token | Value | Usage |
|---|---|---|
| `px-[22px]` | 22px | Content column padding (ALL content) |
| `px-[12px]` | 12px | Card inner padding (inside cards/sections) |
| `pt-[24px]` | 24px | Section title top spacing |
| `pb-[12px]` | 12px | Section title bottom spacing |
| `gap-[8px]` | 8px | Default gap between elements |
| `gap-[12px]` | 12px | Gap between cards, list items |
| `gap-[16px]` | 16px | Gap between sections/groups |
| `pt-[12px] pb-[16px]` | 12/16 | FixedBottom CTA area |
| `pb-[8px]` | 8px | Home indicator bottom |
| `py-[12px]` | 12px | Tab item vertical padding |
| `py-[8px]` | 8px | ItemList row vertical padding |
| `p-[10px]` | 10px | Icon button touch target padding |

## Typography Scale (Inter)

| Style | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| Heading/L | 24px | 600 (semibold) | 32px | Large titles, result screens |
| Title/M | 20px | 600 | 24px | Section hero, product name |
| Title/S | 16px | 600 | 24px | Section titles, button text |
| Title/XS | 14px | 600 | 20px | Card titles, labels |
| Body/M | 16px | 400 | 24px | Body text, descriptions |
| Body/S | 14px | 400 | 20px | Sublabels, secondary text |
| Body/XS | 12px | 400 | 20px | Help text, disclaimers |
| Caption/M | 12px | 500 | 20px | Footnotes, legal |
| Caption/S | 10px | 500 | 16px | Date badges, tiny labels |

## Component Sizes

| Component | Height | Radius |
|---|---|---|
| StatusBar | 54px | — |
| NavBar | 56px | — |
| Button primary/secondary | 48px | rounded-full |
| Button small | 32px | rounded-full |
| TextField | 58px | rounded-14 |
| ItemList row | 44-72px | — |
| Checkbox/Radio | 24px | rounded-8 / rounded-full |
| Toggle | 32×52px | rounded-full |
| Card | auto | rounded-[20px] or rounded-28 |
| Action icon button | 44×44px | rounded-full |
| Badge | 22px | rounded-full |
| Tab underline | 2.5px | — |
| Home indicator | 5×139px | rounded-full |

## Alignment Rules

1. All text left-aligned by default — NEVER center body text
2. Metadata/values in ItemList = right-aligned (text-right)
3. Status icons + hero text = centered only on result/feedback screens
4. Cards: `px-[10px]` outer margin from screen edge, `px-[12px]` inner padding
5. Section titles: ALWAYS `px-[22px]` from edge, same line as content
6. FixedBottom buttons: ALWAYS `px-[22px]` from edge

## VSP_Wireframe Template (dev tool pages)

- **Reference:** `app/sinhloi/page.tsx` — copy full template when creating new states browser
- **Style: Monochrome only** — black, white, grays. NO epic/brand colors in the shell UI
- **Color tokens:** use `var(--foreground)`, `var(--background)`, `var(--secondary)`, `var(--border)`, `var(--foreground-secondary)` — NEVER hardcode hex
- **Text hierarchy:** primary text = `var(--foreground)`, secondary/inactive = `var(--foreground-secondary)`, disabled only = `var(--muted-foreground)`
- **Active state pill:** `background: var(--foreground)` + `color: var(--background)` (black on white / white on black)
- **Inactive state pill:** `background: var(--secondary)` + `color: var(--foreground-secondary)`
- **Sidebar active:** `background: var(--secondary)` + `borderLeft: 3px solid var(--foreground)` — no colored tints
- **Phone frame:** always dark bezel (`#1a1a1a` + `#333` border) — physical device, not themed
- **Flow charts (Mermaid):** light mode = `theme: "neutral"` with grayscale classDefs, dark mode = `theme: "dark"` with original colors
- **Required features:** 2 tabs (UI + Flow), shared sidebar, iPhone frame preview, Prev/Next nav, epic expand/collapse
- **Dark/light detection:** `MutationObserver` on `<html>` class for `"dark"`

# VSP UI — Project Rules

## Stack
- Next.js 16 App Router · TypeScript · Tailwind v4 · CVA · Lucide React
- Tailwind config is CSS-only (`app/globals.css`) — no `tailwind.config.ts`
- All tokens are CSS variables, mapped via `@theme inline {}`

## Design System
- **Figma DLS:** `KzwbNKTQUkX6xnRSJhx411` (VSP-DLS — source of truth)
- **Figma Core:** `m8U2GMl2eptDD5gv9iwXDs` (VSP_Core-Components — legacy)
- **Token file:** `app/globals.css`
- **Component library:** `components/ui/` (32 components)
- **Radius tokens:** Use named tokens `rounded-8`, `rounded-14`, `rounded-28` — NOT `rounded-[Xpx]`
- **Design tokens reference:** `.claude/design-tokens-reference.md` (layout grid, typography, component sizes, alignment, wireframe template)

## Screen Structure (mandatory)
Every screen MUST follow: Header → Section(s) → FixedBottom. See `.claude/design-tokens-reference.md` for full spec.

```
StatusBar (54px) → NavBar (56px) → [SearchBar] → [Tab]
Section: pt-[24px] pb-[12px] title, px-[22px] content
FixedBottom: px-[22px] buttons + Home Indicator
```

## Golden Rules (never break)
1. **Never hardcode color** — always use token class (`text-foreground`, `bg-secondary`, etc.)
2. **Never rebuild a VSP component** — use the library, compose don't create
3. **Content column = `px-[22px]`** — always, no exceptions
4. **Section title spacing = `pt-[24px] pb-[12px]`**
5. **`variant="large-title"` NavBar is icon-only** — page name goes in `largeTitle`, NOT `title`
6. **`ChevronLeft` for back** — never `ArrowLeft`
7. **One `variant="primary"` button per screen** — all others are `secondary`
8. **Home indicator on every full-screen page** — `w-[139px] h-[5px] bg-foreground`
9. **Dark mode via semantic tokens only** — never raw CSS invert
10. **`text-muted-foreground` is banned** — use `text-foreground-secondary`
11. **Use named radius tokens** — `rounded-8`, `rounded-14`, `rounded-28` (not `rounded-[Xpx]`)
12. **Every screen uses Screen Structure** — Header → Section(s) → FixedBottom

## Absolute Don'ts
- No `border` to separate content sections
- No `inline style={{ color/background }}`
- No custom button divs — use `components/ui/button.tsx`
- No `text-center` on body/list text
- No `ArrowLeft` icons
- No `rounded-lg` / `rounded-xl` on cards (use `rounded-28`)
- No `px-4` / `px-5` / `px-6` / `px-[16px]` on content columns (use `px-[22px]`)
- No `space-y-8` / `space-y-10` between sections (use `pt-[32px]`)

## Commands
```
npm run dev          # start dev server
npm run token-check  # Playwright CSS vs Figma token audit
npm run build        # production build
```

## Pipelines & Agents
- **UXUI Pipeline:** `.claude/workflows/uxui-pipeline/workflow.md`
- **Code Pipeline:** `.claude/pipeline.md`
- **Agents:** `.claude/agents/` (vsp-designer, vsp-design-ops, token-check-fix, ux-review, figma-*)
- **Skills:** `/wireframe`, `/vsp-build`, `/fast-loop`, `/vsp-launch`

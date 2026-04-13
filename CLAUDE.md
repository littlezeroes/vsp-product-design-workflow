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
- **Radius tokens:** Use named tokens `rounded-8`, `rounded-14`, `rounded-28` — NOT `rounded-[Xpx]` (Tailwind v4 bug)
- **Principles:** `.claude/design-principles.md`
- **Ref apps:** `.claude/ref-patterns.md` (OKX / Cash App / Revolut)
- **UX Knowledge Base:** `.claude/ux-knowledge.md` (V-Smart Pay v1.0 — flows, pages, node IDs)

## Screen Structure (mandatory — Figma node `40018626:2082`)
Every screen MUST follow this composition from the DLS `_Section v1` template:

```
┌─────────────────────────────────┐
│ StatusBar (54px)                │
│ NavBar (56px) — Title + Actions │  ← Header component
│ SearchBar (optional)            │
│ Tab (optional)                  │
├─────────────────────────────────┤
│ Section Title (pt-24 pb-12)     │
│   px-[22px], md/16px semibold   │
│   + optional suffix Label       │  ← Section (repeatable)
│ Section Content (px-[22px])     │
│   [your content here]           │
├─────────────────────────────────┤
│ T&C checkbox (optional)         │
│ ButtonGroup (px-[22px])         │  ← FixedBottom component
│ Home Indicator (pb safe area)   │
└─────────────────────────────────┘
```

**Layout Grid (8px base unit — everything aligns to 4px or 8px):**

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

**Typography Scale (Inter):**
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

**Component Sizes:**
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

**Alignment Rules:**
1. All text left-aligned by default — NEVER center body text
2. Metadata/values in ItemList = right-aligned (text-right)
3. Status icons + hero text = centered only on result/feedback screens
4. Cards: `px-[10px]` outer margin from screen edge, `px-[12px]` inner padding
5. Section titles: ALWAYS `px-[22px]` from edge, same line as content
6. FixedBottom buttons: ALWAYS `px-[22px]` from edge

## Golden Rules (never break)
1. **Never hardcode color** — always use token class (`text-foreground`, `bg-secondary`, etc.)
2. **Never rebuild a VSP component** — use the library, compose don't create
3. **Content column = `px-[22px]`** — always, no exceptions. This includes section titles, labels, rows, cards, and any horizontal padding on the page content area.
4. **Section title spacing = `pt-[24px] pb-[12px]`** — from Figma DLS `_Section v1`
5. **`variant="large-title"` NavBar is icon-only** — page name goes in `largeTitle`, NOT `title`
6. **`ChevronLeft` for back** — never `ArrowLeft`
7. **One `variant="primary"` button per screen** — all others are `secondary`
8. **Home indicator on every full-screen page** — `w-[139px] h-[5px] bg-foreground`
9. **Dark mode via semantic tokens only** — never raw CSS invert
10. **`text-muted-foreground` is banned** — use `text-foreground-secondary`
11. **Use named radius tokens** — `rounded-8`, `rounded-14`, `rounded-28` (not `rounded-[Xpx]`)
12. **Every screen uses Screen Structure** — Header → Section(s) → FixedBottom (see above)

## Pipelines

### UXUI Pipeline (Feature Design → Code)
See `.claude/workflows/uxui-pipeline/workflow.md` — full BRD → Flow → Screen → Code → QC.

**Team:**
| Agent | Name | Role | Platform |
|---|---|---|---|
| 🤖 VI | Vi | Design Lead / Orchestrator | OpenClaw |
| 🔍 Nate | Nate | UX Researcher | Claude Code |
| 👹 Đức | Đức | Senior UX Reviewer | Claude Code |
| 🎨 Ivy | Ivy | UI Designer / Builder | Claude Code |
| 📋 Khoa | Khoa | QA Design | Claude Code |

**Trigger:** "pipeline", "new feature", "start flow", "bắt đầu feature"
**Steps:** `.claude/workflows/uxui-pipeline/steps/step-01..11`
**Edge cases:** `.claude/edge-case-library.md`
**Feature output:** `.claude/features/[name]/`

### Code Pipeline (Figma → Code → QC)
See `.claude/pipeline.md` for the Figma → Code → QC → Ship workflow.

## Skills (Addy Osmani pattern — workflow, not reference)
| Skill | File | Phase | Trigger |
|---|---|---|---|
| `/wireframe` | `.claude/skills/wireframe/SKILL.md` | WIREFRAME | "wireframe", "wf", "sketch", "phác", "mock" |
| `/vsp-build` | `.claude/skills/vsp-build/SKILL.md` | BUILD | "build screen", "gen page", "implement screen" |
| `/fast-loop` | `.claude/skills/fast-loop/SKILL.md` | ITERATE | "fast loop", "iterate", "fix UI", "match figma" |
| `/vsp-launch` | `.claude/skills/vsp-launch/SKILL.md` | SHIP | "launch", "ship", "pre-ship", "done check" |

**Skill anatomy:** Phase workflow → Exit criteria → Anti-rationalization table → Red flags → Evidence required.

## Agents (Code Pipeline — existing)
| Agent | File | Trigger |
|---|---|---|
| VSP Designer | `.claude/agents/vsp-designer.md` | "design", "screen", "page", "implement" |
| Design Ops QC | `.claude/agents/vsp-design-ops.md` | "check", "QC", "audit", "review" |
| Token Fix Loop | `.claude/agents/token-check-fix.md` | "fix tokens", "token loop", "auto fix" |
| Pipeline | `.claude/agents/vsp-pipeline.md` | "pipeline", "full flow", "build and check" |
| UX Review | `.claude/agents/ux-review.md` | paste Figma URL + "review", "ux review", "audit ux" |
| Figma Design Loop | `.claude/agents/figma-design-loop.md` | "design screen", "vẽ figma", "build figma screen" |
| Figma Structure QC | `.claude/agents/figma-structure-qc.md` | "structure check", "QC figma", "check layers" |
| Figma Auto Research | `.claude/agents/figma-auto-research.md` | "auto research figma", "scan figma", "design audit loop" |
| Figma Restructure | `/restructure-figma` (command) | "restructure", "clean layers", "fix structure" |

## Agents (UXUI Pipeline — team)
| Agent | File | Trigger |
|---|---|---|
| 🤖 Vi — Lead | `.claude/agents/vi-lead.md` | Orchestrator (OpenClaw) |
| 🔍 Nate — Researcher | `.claude/agents/nate-researcher.md` | BRD analysis, flow design |
| 👹 Đức — Reviewer | `.claude/agents/duc-reviewer.md` | Flow/UX review, adversarial |
| 🎨 Ivy — Designer | `.claude/agents/ivy-designer.md` | Screen breakdown, code gen |
| 📋 Khoa — QA | `.claude/agents/khoa-qa.md` | State coverage, token check |

## Commands
```
npm run dev          # start dev server
npm run token-check  # Playwright CSS vs Figma token audit
npm run build        # production build
```

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

## Absolute Don'ts
- No `border` to separate content sections
- No `inline style={{ color/background }}`
- No custom button divs
- No `text-center` on body/list text
- No `ArrowLeft` icons
- No `rounded-lg` / `rounded-xl` on cards (use `rounded-28`)
- No `rounded-[Xpx]` arbitrary values (use named tokens: `rounded-3`, `rounded-8`, `rounded-10`, `rounded-12`, `rounded-14`, `rounded-28`)
- No `px-4` / `px-5` / `px-6` / `px-[16px]` on content columns (use `px-[22px]`)
- No `space-y-8` / `space-y-10` between sections (use `pt-[32px]`)

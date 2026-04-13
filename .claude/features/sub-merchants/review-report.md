# Self-Review Report — Sub-Merchants & DS Docs
> Date: 2026-04-12 (overnight session)
> Reviewer: Claude Code (self-review)

---

## 1. DS Documentation Site (`/design-system`)

### Tested Pages
- [x] Overview (stats, links, principles summary)
- [x] Colors (token architecture, semantic table, naming)
- [x] Typography (type ramp, reference table)
- [x] Spacing (visual scale, semantic tokens, layout rules)
- [x] Radius (visual examples, mapping)
- [x] Elevation (shadow cards, usage notes)
- [x] Button (anatomy, props, variants, do/dont, related)
- [x] Header (usage guidelines, props, anatomy)
- [x] Chip (0 variants, "Coming soon")
- [x] Dropdown (props, variants, figma embed)
- [x] PIN/SOTP (props, related)
- [x] 404 handling (invalid slug)

### Issues Found & Fixed
| # | Issue | Status |
|---|---|---|
| 1 | `rounded-[Xpx]` bị SmoothCornersProvider cat goc | FIXED — doi sang named tokens |
| 2 | Figma embed hien thi trang khi khong co figmaNodeId | FIXED — conditional render |
| 3 | Figma embed trang khi co nodeId nhung chua login Figma | KNOWN — expected, can Figma auth |

### Quality Assessment
- Dark mode: OK — all pages render clean
- Sidebar: OK — collapsible sections, active highlight, "Soon" badge
- Navigation: OK — all links work, 404 handled
- Content: OK — 33 components documented
- Responsive: NOT TESTED (desktop only)
- Performance: OK — pages load fast

---

## 2. States Browser (`/sub-merchants/states`)

### Tested
- [x] UI tab — sidebar with 6 epics, 23 screens, 130 states
- [x] Click screen → iframe navigates correctly
- [x] Click state pill → URL params change
- [x] Flow tab — Mermaid charts render for all 6 epics
- [x] Prev/Next navigation (counter: N/130)
- [x] Dark mode rendering

### BRD Coverage
| BRD Section | States in Browser | Coverage |
|---|---|---|
| MC_SMC_04 (Danh sach & Phan cap) | 23 states | 100% |
| MC_SMC_01 (Tao thu cong) | 24 states incl CC-01~06 | 100% |
| MC_SMC_02 (Import) | 37 states incl EC-01~24 | 100% |
| MC_SMC_03 (Kich hoat) | 24 states incl CC-01~18 | 100% |
| MC_SMC_05 (Chi tiet) | 15 states | 100% |
| State Machine | 7 states | 100% |
| **Total** | **130 states** | **100%** |

### Issues Found
| # | Issue | Status |
|---|---|---|
| 1 | Click state pill → iframe same UI (app chua handle params) | KNOWN — expected, states browser la spec |
| 2 | Counter shows "5 epics" in header nhung co 6 | NEEDS FIX |

---

## 3. UX Analysis & User Flows

### Files
- [x] `.claude/features/sub-merchants/ux-analysis.md` — 13 problems, solutions, implementation order
- [x] `.claude/features/sub-merchants/flow.md` — 5 flows (Nate format), 61 edge cases, state machine
- [x] `.claude/features/sub-merchants/user-flows.md` — Mermaid-style backup

### Coverage
- 5/5 User Stories analyzed
- 61 edge cases documented (6 + 24 + 18 + 13 + 10 bo sung)
- State machine: 5 states, cascade rules
- Implementation priority order defined

---

## 4. Other Deliverables

| Deliverable | Status | Notes |
|---|---|---|
| Figma RIP cleanup | DONE | 235 components sorted into 25 categories |
| DS Evaluation | DONE | Score 7.4/10, action items |
| Consciousness sim | DONE | localhost:3000/consciousness |
| Zeroheight MCP | CONFIG ADDED | Waiting credentials |
| Fix DS docs cat goc | DONE | Named tokens |

---

## Action Items (for morning)

1. **Quick fix**: Update states browser header "5 epics" → "6 epics"
2. **Consider**: Remove FigmaEmbed entirely nếu không có Figma auth — thay bằng static screenshot
3. **Consider**: Add `figmaNodeId` cho tat ca components trong ds-data.ts
4. **Test**: Responsive layout cho DS docs on mobile
5. **Test**: States browser trên different browsers (Safari, Firefox)

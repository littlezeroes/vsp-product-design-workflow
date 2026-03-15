# Step 08 — VI show PO screens + states, PO approve

## Agent: 🤖 VI (OpenClaw)
## Input: `screens.md` + `qa-states.md`
## Output: `.claude/features/[name]/decisions.md` (append)

---

## CHECKPOINT — Cần PO tham gia

### Vi tóm tắt:

```
📋 CHECKPOINT 3 — Screen Breakdown

🎨 Ivy đã tạo screen breakdown:
- [N] screens, [N] overlays
- Components: [list]
- Total states: [N]

📋 Khoa đã check state coverage:
- [N/N] screens pass
- Missing: [list nếu có]

Screen summary:
| # | Screen | Type | States | Status |
|---|--------|------|--------|--------|
| 1 | [name] | [type] | [N] | ✅/🔴 |

[Nếu có gaps]:
Khoa báo thiếu [N] states. Em suggest Ivy bổ sung:
- [Screen X]: thêm [state]
- [Screen Y]: thêm [state]

Anh approve:
□ OK, build luôn
□ Cần adjust: [ghi ý kiến]
□ Bổ sung states rồi build
```

### Ghi decisions

```markdown
## Screen decisions (append to decisions.md)
- Screens approved: [list]
- States added: [list nếu có]
- PO adjustments: [list nếu có]
- Approved to build: YES / cần Ivy revise
```

---

## Handoff
PO approved → dispatch Ivy cho step-09 (build code).

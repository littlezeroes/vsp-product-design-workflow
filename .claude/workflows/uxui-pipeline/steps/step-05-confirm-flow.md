# Step 05 — VI show PO debate result, PO chốt flow

## Agent: 🤖 VI (OpenClaw)
## Input: `flow.md` + `review.md`
## Output: `.claude/features/[name]/decisions.md` (append)

---

## CHECKPOINT — Cần PO tham gia

### Vi đọc cả 2 file rồi:

1. **Tóm tắt flow** của Nate (5 bullets max)
2. **Tóm tắt review** của Đức (issues + đề xuất)
3. **Highlight debate** nếu Nate và Đức không đồng ý
4. **Hỏi PO chốt**

### Format:

```
📋 CHECKPOINT 2 — Flow Review

🔍 Nate đề xuất flow:
- [N] screens, [N] overlays
- Happy path: [tóm tắt ngắn]
- [N] edge cases covered

👹 Đức review:
- 🔴 [N] issues phải sửa
- 🟡 [N] issues nên sửa
- Verdict: [PASS/REWORK]

⚔️ Debate:
| Topic | Nate | Đức |
|-------|------|------|
| [topic] | [position] | [position] |

Anh chọn:
□ Nate đúng (giữ flow hiện tại)
□ Đức đúng (sửa theo đề xuất)
□ Mix: [ghi ý kiến]
□ Ý khác: [...]
```

### Ghi decisions

```markdown
# Decisions — [Feature Name]
> Date: [date]

## Flow decisions
- [Topic 1]: Chọn [A/B] — Lý do: PO said "..."
- [Topic 2]: Chọn [A/B] — Lý do: PO said "..."

## Adjustments PO yêu cầu
- [Adjustment 1]
- [Adjustment 2]

## Final flow approved: YES / cần Nate revise
```

---

## If cần revise
Vi dispatch Nate update flow.md theo PO feedback → Đức re-review nhanh → Vi show PO lại.
Loop tối đa 2 lần. Nếu vẫn chưa OK → Vi hỏi PO "anh muốn skip flow review, vào screen detail luôn không?"

## Handoff
Flow approved → dispatch Ivy cho step-06.

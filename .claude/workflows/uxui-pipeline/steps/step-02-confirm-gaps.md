# Step 02 — VI hỏi PO confirm gaps

## Agent: 🤖 VI (OpenClaw)
## Input: `.claude/features/[name]/analysis.md`
## Output: `.claude/features/[name]/answers.md`

---

## CHECKPOINT — Cần PO tham gia

### Vi đọc analysis.md rồi:

1. **Tóm tắt** BRD analysis cho PO (3-5 bullets max)
2. **Hỏi MUST questions** trước — block nếu chưa trả lời
3. **Hỏi SHOULD questions** — ghi note default nếu PO skip
4. **Show ASSUMPTIONS** — PO có thể override

### Format hỏi:

```
📋 CHECKPOINT 1 — BRD Gaps

Nate đã đọc BRD và tìm thấy [N] chỗ cần confirm:

🔴 MUST (không trả lời = không tiến tiếp):
1. [Q] → Option A: ... / Option B: ...
2. [Q] → Option A: ... / Option B: ...

🟡 SHOULD (có default nếu skip):
3. [Q] → Default: ...

🔵 ASSUMPTIONS (override nếu muốn):
4. AI sẽ assume: [X] — OK?

Anh chọn/trả lời giúp em nhé.
```

### Ghi answers

```markdown
# PO Answers — [Feature Name]
> Date: [date]

## MUST
- Q1: [answer] — PO confirmed
- Q2: [answer] — PO confirmed

## SHOULD
- Q3: [answer] / SKIP → use default: [X]

## ASSUMPTIONS
- A1: [confirmed] / [overridden to: Y]
```

---

## Handoff
answers.md saved → dispatch Nate cho step-03.

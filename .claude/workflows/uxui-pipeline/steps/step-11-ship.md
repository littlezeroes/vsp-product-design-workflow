# Step 11 — Vi gửi PO link review + bảng tổng hợp

## Agent: 🤖 VI (OpenClaw)
## Input: `summary.md` + `qa-final.md`
## Output: Final approval

---

## CHECKPOINT — PO review

### Vi CHỈ đọc file rồi gửi. KHÔNG tự tóm tắt (tiết kiệm token).

### Gửi user 4 thứ:

**1. Link localhost**
```
🎨 Ivy đã build xong!

Review tại: http://localhost:3000/[feature]
```

**2. Flow diagram** (copy từ summary.md)
```
[Entry] → [Screen 1] → [Screen 2] → [Result]
```

**3. Bảng screens × components × states** (copy từ summary.md)
```
| # | Screen | Components | States |
|---|--------|-----------|--------|
| 1 | Input | Header, TextField, Button | empty, valid, error, loading |
| 2 | Confirm | Header, ItemList, ButtonGroup | loading, ready |
| 3 | Result | Header, FeedbackState | success, failed |
```

**4. QA result** (copy từ qa-final.md)
```
📋 Khoa QA: PASS ✅ / FIX REQUIRED 🔴
```

### Hỏi PO:
```
Anh review trên localhost rồi confirm:
□ Ship ✅
□ Cần adjust: [ghi]
□ Flow OK, vẽ Figma được
```

---

## Cách Vi đọc files (tiết kiệm token)
```bash
# Đọc summary — KHÔNG dùng LLM, dùng bash read
bash command:"cat ~/Documents/vsp-ui/.claude/features/[NAME]/summary.md"

# Đọc QA verdict line only
bash command:"grep -E '(Verdict|PASS|FIX)' ~/Documents/vsp-ui/.claude/features/[NAME]/qa-final.md"
```

Vi copy-paste content từ file → gửi Telegram. KHÔNG summarize lại.

---

## If PO approve
- Code ready for PR
- PO dùng bảng summary.md để vẽ Figma
- Knowledge persisted in .claude/features/[name]/

## If PO needs adjust
- Vi dispatch Ivy fix (Claude Code) → Khoa re-check → Vi gửi lại

## Pipeline complete 🎉

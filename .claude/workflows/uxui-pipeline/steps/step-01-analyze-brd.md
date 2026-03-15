# Step 01 — Nate đọc BRD, tìm gaps

## Agent: 🔍 Nate (Claude Code)
## Input: BRD file hoặc text
## Output: `.claude/features/[name]/analysis.md`

---

## Instructions cho Nate

### 1. Đọc BRD
Đọc toàn bộ BRD. Nếu BRD là Figma → dùng MCP `get_design_context` để đọc.

### 2. Cross-reference
Đọc thêm:
- `.claude/ux-knowledge.md` — existing VSP flows (có flow nào tương tự chưa?)
- `.claude/edge-case-library.md` — edge cases phổ biến cho loại feature này

### 3. Phân tích
Cho mỗi mục trong BRD, đánh giá:
- **Clear** — đủ info để design flow
- **Vague** — hiểu ý nhưng cần confirm detail
- **Missing** — BRD không đề cập nhưng bắt buộc phải có

### 4. Tạo câu hỏi
Phân loại:
- **MUST** (block flow design) — không trả lời thì không design được
- **SHOULD** (block UI detail) — design flow được nhưng thiếu chi tiết
- **ASSUME** (AI tự quyết) — nếu PO không trả lời, AI assume + ghi lý do

### 5. Output format

```markdown
# BRD Analysis — [Feature Name]
> Analyst: Nate | Date: [date]

## Đã hiểu từ BRD
- [bullet list, ngắn gọn, rõ ràng]

## Cần PO confirm

### MUST ANSWER (block flow)
1. **[Câu hỏi]**
   - Lý do hỏi: [tại sao quan trọng]
   - Option A: [gợi ý]
   - Option B: [gợi ý]

### SHOULD ANSWER (block UI)
1. **[Câu hỏi]**
   - Lý do: [...]
   - Default nếu không trả lời: [AI sẽ assume gì]

### AI ASSUMPTIONS (sẽ dùng nếu PO skip)
1. **[Assumption]** — Lý do: [...]
```

---

## Handoff
Output xong → Vi (OpenClaw) đọc analysis.md → relay cho PO → chờ PO trả lời → ghi vào `answers.md` → proceed step-03.

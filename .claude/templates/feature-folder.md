# Feature Folder Template

Khi bắt đầu feature mới, tạo folder:

```
.claude/features/[feature-name]/
  ├── brd.md            ← BRD gốc (paste hoặc link)
  ├── analysis.md       ← Nate output (step 01)
  ├── answers.md        ← PO answers (step 02)
  ├── flow.md           ← Nate output (step 03)
  ├── review.md         ← Đức output (step 04)
  ├── decisions.md      ← PO decisions (step 02, 05, 08)
  ├── screens.md        ← Ivy output (step 06)
  ├── qa-states.md      ← Khoa output (step 07)
  ├── qa-final.md       ← Khoa output (step 10)
  └── assumptions.md    ← AI assumptions chưa confirm
```

## Quick create command
```bash
mkdir -p .claude/features/[feature-name]
```

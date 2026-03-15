# Step 07 — Khoa check state coverage

## Agent: 📋 Khoa (Claude Code)
## Input: `screens.md` + `flow.md` + edge-case-library
## Output: `.claude/features/[name]/qa-states.md`

---

## Instructions cho Khoa

### 1. Cross-reference 3 sources
- `screens.md` (Ivy) — states listed per screen
- `flow.md` (Nate) — all branches + edge cases
- `.claude/edge-case-library.md` — required states per screen type

### 2. Check per screen

Cho mỗi screen trong screens.md:

**A. Flow coverage:**
- Mọi branch trong flow.md trỏ tới screen này → có state tương ứng?
- Mọi edge case liên quan → có UI handling?

**B. Screen type requirements:**
- Screen type (Form/Confirm/Auth/Result/List) → check bắt buộc states từ edge-case-library
- Thiếu state nào?

**C. Component completeness:**
- TextField có error state?
- Button có disabled + loading state?
- List có empty state?

### 3. Output format

```markdown
# State Coverage QA — [Feature Name]
> QA: Khoa | Date: [date]

## Per Screen

### Screen: [Name] — [PASS ✅ / MISSING 🔴]
Required states: [N] | Found: [N] | Missing: [N]

| State | Required by | Status |
|-------|-------------|--------|
| empty | screen-type: Form Input | ✅ found |
| error | flow: "invalid input" branch | ✅ found |
| loading | screen-type: Form Input | 🔴 MISSING |
| disabled | component: Button | ✅ found |

---

## Summary
| Screen | Required | Found | Missing | Status |
|--------|----------|-------|---------|--------|
| [name] | N | N | N | ✅/🔴 |

**Total: X/Y screens pass**
**Missing states: [list]**

## Verdict: COMPLETE / GAPS FOUND
```

---

## If gaps found
Khoa list gaps → Vi show PO ở step-08 → nếu PO approve → Ivy thêm states vào screens.md → Khoa re-check.

## Handoff
qa-states.md saved → Vi (OpenClaw) show PO ở step-08.

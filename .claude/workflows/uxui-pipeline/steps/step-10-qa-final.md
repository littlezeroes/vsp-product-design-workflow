# Step 10 — Khoa full QA

## Agent: 📋 Khoa (Claude Code)
## Input: `app/[feature]/**/*.tsx` + `screens.md` + `flow.md`
## Output: `.claude/features/[name]/qa-final.md`

---

## Instructions cho Khoa

### Layer 1: Flow ↔ Code
```
- [ ] Mọi screen trong flow.md đều có .tsx file
- [ ] Mọi branch đều có UI handling
- [ ] Mọi edge case confirmed đều có implementation
- [ ] Navigation giữa screens đúng flow
```

### Layer 2: States ↔ Code
```
Cho mỗi screen trong screens.md:
- [ ] Mọi state listed đều có code handling
- [ ] State transitions đúng logic
- [ ] Conditional renders đúng condition
```

### Layer 3: Token compliance
```
Run: npm run token-check (nếu có)
Manual check:
- [ ] No hardcoded colors (grep cho #hex trong .tsx files)
- [ ] px-[22px] on content columns
- [ ] pt-[32px] between sections
- [ ] rounded-[28px] on cards (not rounded-lg)
- [ ] No text-muted-foreground
- [ ] No ArrowLeft (phải là ChevronLeft)
- [ ] No border between sections
```

### Layer 4: Component compliance
```
- [ ] All UI elements use VSP library components
- [ ] One variant="primary" button per screen max
- [ ] Header component on every screen
- [ ] Home indicator on every screen
- [ ] No custom button divs
- [ ] No inline style={{ }}
```

### Layer 5: Dark mode
```
- [ ] Only semantic tokens used (no raw color invert)
- [ ] Dark mode toggle via document.documentElement.classList
```

### Output format

```markdown
# QA Final Report — [Feature Name]
> QA: Khoa | Date: [date]

## Summary
| Check | Pass | Fail | Total |
|-------|------|------|-------|
| Flow coverage | N | N | N |
| State coverage | N | N | N |
| Token compliance | N | N | N |
| Component compliance | N | N | N |
| Dark mode | N | N | N |

## 🔴 Must fix
| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|
| 1 | page.tsx | 42 | hardcoded #080808 | → text-foreground |

## 🟡 Should fix
| # | File | Line | Issue | Fix |
|---|------|------|-------|-----|

## ✅ All pass
- [list]

## Verdict: SHIP ✅ / FIX REQUIRED 🔴
- 🔴 Must fix: N
- 🟡 Should fix: N
```

---

## If FIX REQUIRED
Khoa report → Vi show PO → dispatch Ivy fix → Khoa re-check.
Token violations → có thể dispatch token-check-fix agent tự fix.

Loop tối đa 3 lần. Nếu vẫn fail → escalate to PO.

## Handoff
qa-final.md saved → Vi (OpenClaw) show PO ở step-11.

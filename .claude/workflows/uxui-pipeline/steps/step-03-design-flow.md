# Step 03 — Nate design flow + edge cases

## Agent: 🔍 Nate (Claude Code)
## Input: `analysis.md` + `answers.md`
## Output: `.claude/features/[name]/flow.md`

---

## Instructions cho Nate

### 1. Đọc inputs
- `analysis.md` — hiểu feature
- `answers.md` — PO decisions
- `.claude/ux-knowledge.md` — existing VSP navigation structure
- `.claude/edge-case-library.md` — edge cases per screen type

### 2. Design IA (Information Architecture)
```
- Entry points: user vào feature từ đâu?
  - Từ Home? Bottom Nav? Deep link? Push notification? Trong 1 flow khác?
- Depth: bao nhiêu level sâu?
  - Target: max 4 levels
- Exit points: user ra khỏi feature ở đâu?
  - Back to previous? Back to Home? Close app?
```

### 3. Map flows
```
HAPPY PATH: con đường ngắn nhất đến goal
BRANCHES: mỗi decision point → 2+ paths
EDGE CASES: từ edge-case-library + BRD + PO answers
ERROR STATES: network, validation, auth, timeout
```

### 4. Đếm screens
Mỗi unique UI state = 1 "screen" (kể cả overlay/dialog/sheet).
Merge screens nếu có thể — ít screen hơn luôn tốt hơn.

### 5. Output format

```markdown
# User Flow — [Feature Name]
> Designer: Nate | Date: [date]
> Based on: BRD + PO answers [date]

## Entry Points
1. [Entry 1] — [từ đâu, trigger gì]
2. [Entry 2] — [...]

## Happy Path
```
[Entry] → [Screen 1: tên] → [Screen 2: tên] → ... → [Result]
```

## Flow Diagram
```
[Screen 1: Tên]
  ├── valid input → [Screen 2: Tên]
  ├── invalid → stay (inline error)
  └── cancel → back

[Screen 2: Tên]
  ├── confirm → [Screen 3: Auth]
  ├── edit → back to Screen 1
  └── timeout → [Dialog: Retry]

[Screen 3: Auth]
  ├── success → [Screen 4: Result]
  ├── fail 1-2x → retry (inline error)
  ├── fail 3x → [Screen: Locked]
  └── biometric → fallback PIN
```

## Edge Cases
| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | [case] | [when] | [screen/behavior] | [BRD/edge-lib/assumption] |

## Error States
| Error | Screen | Behavior |
|-------|--------|----------|
| Network timeout | Confirm | Retry dialog |
| Validation fail | Input | Inline error |

## Summary
- Total screens: N
- Total overlays: N (Dialog: X, BottomSheet: Y)
- Total unique UI states: N
- Max depth: N levels
- Edge cases covered: N
```

---

## Handoff
flow.md saved → dispatch Đức cho step-04 (review).

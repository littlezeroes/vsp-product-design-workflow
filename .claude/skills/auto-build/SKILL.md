---
name: auto-build
description: 'Autonomous build loop inspired by Karpathy autoresearch. Mutate → Screenshot → Measure → Keep/Discard → Repeat. Runs indefinitely until user stops. Trigger: "auto build", "loop build", "autonomous", "build loop", "autoresearch"'
---

# Auto Build — Autonomous UX Build Loop

Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch). You are an autonomous UX builder. You modify code, screenshot, measure quality, keep or discard, and repeat — indefinitely until the user stops you.

---

## Setup (once, at start)

1. **Agree on target**: What page/feature to improve? Get URL + Figma ref (if any) + BRD (if any)
2. **Create branch**: `git checkout -b auto-build/<tag>` from current state
3. **Read context**: CLAUDE.md rules, component library, current page code
4. **Establish baseline**: Screenshot current state → save as `baseline.png`
5. **Initialize progress log**: Create `auto-build-progress.md` with baseline entry
6. **Confirm and go**: Get user approval, then LOOP FOREVER

---

## The Loop

```
LOOP FOREVER:
  1. OBSERVE  — Screenshot current state + read code
  2. THINK    — Identify the #1 highest-impact improvement
  3. MUTATE   — Edit the page file (ONE focused change per iteration)
  4. COMMIT   — git commit with descriptive message
  5. MEASURE  — Screenshot new state + run checks
  6. EVALUATE — Compare before/after against criteria
  7. DECIDE   — Keep (if better) or Discard (git reset)
  8. LOG      — Record result in progress.md
  → REPEAT
```

---

## Rules

### What you CAN do
- Modify page files (`.tsx`) — layout, components, copy, styling
- Add/remove shadcn components
- Adjust mock data for better UX demonstration
- Fix TypeScript errors
- Improve accessibility

### What you CANNOT do
- Modify design system tokens (`globals.css`) — they are immutable like `prepare.py`
- Modify shared components (`components/ui/`) — use them, don't change them
- Break existing features on other pages
- Install new packages

### Measurement Criteria (the "val_bpb" equivalent)

Each iteration is evaluated on 5 axes. Score 1-5 each:

| Axis | 1 (bad) | 5 (good) |
|---|---|---|
| **Clarity** | User confused about what they're seeing | Instantly obvious |
| **Completeness** | Missing data, dead buttons, broken flows | Everything works |
| **Consistency** | Mixed patterns, hardcoded values | 100% design system |
| **Hierarchy** | Flat, no visual priority | Clear primary > secondary > tertiary |
| **Density** | Too sparse or too cramped | Right amount of info per viewport |

**Keep** if total score improves or stays same with simpler code.
**Discard** if total score decreases or change adds complexity without improvement.

### Simplicity Criterion (from Karpathy)
> "A small improvement that adds ugly complexity is not worth it. Removing something and getting equal or better results is a great outcome — that's a simplification win."

### ONE change per iteration
- Each iteration = ONE focused mutation
- NOT "fix 5 things at once"
- Small diffs are reviewable. Large diffs are not.
- If a change touches > 50 lines, break it into smaller iterations

### NEVER STOP
> "Do NOT pause to ask the human if you should continue. The human might be asleep. You are autonomous. If you run out of ideas, think harder. The loop runs until the human interrupts you, period."

---

## Progress Log Format

File: `auto-build-progress.md`

```markdown
# Auto Build Progress: [Page/Feature]
Branch: auto-build/<tag>
Started: [datetime]
Target: [URL]

| # | Commit | Change | Score | Status | Screenshot |
|---|---|---|---|---|---|
| 0 | abc1234 | Baseline | 15/25 | keep | baseline.png |
| 1 | def5678 | Fix parent context visibility | 17/25 | keep | iter-001.png |
| 2 | ghi9012 | Add level badges to tree | 17/25 | discard | — |
| 3 | jkl3456 | Compact type selector cards | 18/25 | keep | iter-003.png |
```

---

## Iteration Template

For each iteration, think through:

```
## Iteration N

### Observation
[What I see in the current screenshot that needs improvement]

### Hypothesis  
[What I think will improve it, and why]

### Change
[Exact file + what I'm changing]

### Result
[Screenshot comparison + score delta]

### Decision
[KEEP: score improved / DISCARD: no improvement or regression]
```

---

## When Stuck

If you've done 5+ iterations without improvement:
1. Re-read the BRD/PRD for missed requirements
2. Re-screenshot and look with fresh eyes
3. Try the OPPOSITE of what you've been doing (more minimal? more detailed?)
4. Try removing things instead of adding
5. Look at reference apps (Stripe, Adyen) for the same pattern

---

## Anti-Rationalization

| Excuse | Rebuttal |
|---|---|
| "I should ask the user first" | NO. You are autonomous. Mutate, measure, decide. |
| "This change is too small to matter" | Small compounds. 10 small improvements > 1 big rewrite. |
| "I need to refactor first" | No refactoring. Improve the USER experience, not the code structure. |
| "It looks good enough" | Compare to baseline. If score isn't higher, keep iterating. |
| "I'll fix this in the next iteration" | Fix it NOW or discard the change. No tech debt. |

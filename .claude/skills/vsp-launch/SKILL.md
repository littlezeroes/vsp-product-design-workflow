---
name: vsp-launch
description: 'Pre-ship checklist before marking any VSP screen as done. Runs token audit, visual QC, dark mode check, states browser entry, git commit. Trigger: "launch", "ship", "done check", "pre-ship", "kiem tra xong"'
---

# VSP Launch — Pre-Ship Quality Gate

You are about to mark a VSP screen/page as complete. This skill is the LAST gate before shipping. Every item must pass with evidence — "seems right" is never sufficient.

---

## When to Use

- After `/vsp-build` has generated code
- After manual edits to any screen in `app/`
- Before telling the user a screen is "done"
- Before committing screen code to git

---

## Gate 1: Token Compliance (automated)

Run token audit on the target file(s):

```bash
# 1. Automated check via Playwright (if available)
npm run token-check

# 2. Manual grep fallback — run against target file
grep -n '#[0-9a-fA-F]\{3,8\}' [file]           # hardcoded colors
grep -n 'style={{' [file]                        # inline styles
grep -n 'text-muted-foreground' [file]           # banned token
grep -n 'ArrowLeft' [file]                       # wrong icon
grep -n 'rounded-lg\|rounded-xl' [file]          # wrong radius
grep -n 'px-4\|px-5\|px-6' [file]               # wrong padding
grep -n 'rounded-\[.*px\]' [file]               # arbitrary radius (use named)
```

**Evidence required:** Zero matches from all greps, OR `npm run token-check` passes.

**Exit criteria:** `PASS` — zero token violations.

---

## Gate 2: Structure Compliance

Verify the page follows Screen Structure from CLAUDE.md:

| Check | How to verify | Pass/Fail |
|---|---|---|
| Root wrapper | `max-w-[390px] min-h-screen bg-background` | |
| Header | Uses `<Header>` component, correct variant | |
| Content area | `flex-1 overflow-y-auto` | |
| Section spacing | `pt-[24px]` between sections | |
| Content padding | `px-[22px]` on all content columns | |
| Section titles | `px-[22px] pb-[12px]` | |
| Home indicator | `w-[139px] h-[5px] rounded-full bg-foreground` present | |
| Single primary CTA | Max one `variant="primary"` button | |
| No custom components | All UI from `components/ui/` | |

**Evidence required:** Checklist completed with all PASS.

**Exit criteria:** All 9 checks pass.

---

## Gate 3: Visual QC (mandatory screenshot)

1. Ensure dev server running (`npm run dev`)
2. Navigate to the page in browser
3. **Take screenshot — light mode**
4. **Take screenshot — dark mode** (toggle `<html class="dark">`)
5. Compare against Figma design (if available) or design intent

### Visual checklist:
- [ ] Typography hierarchy visible (title > body > caption)
- [ ] Spacing consistent (no cramped or floating sections)
- [ ] Colors correct (no grey where should be foreground, etc.)
- [ ] Alignment on grid (px-[22px] edges line up)
- [ ] Touch targets adequate (44px min for interactive elements)
- [ ] Home indicator visible at bottom
- [ ] No overflow or clipping issues
- [ ] Dark mode: all text readable, no white-on-white or black-on-black

**Evidence required:** 2 screenshots (light + dark). Both pass visual checklist.

**Exit criteria:** Both screenshots taken and verified. No visual issues.

---

## Gate 4: Interactive States (if applicable)

If the screen has interactive states, verify each:

| State | Check | Pass/Fail |
|---|---|---|
| Default | Page loads correctly with sample data | |
| Empty | Shows empty state / placeholder | |
| Loading | Shows skeleton or spinner | |
| Error | Shows error message in correct component (TextField error, ToastBar, etc.) | |
| Success | Shows FeedbackState or result screen | |
| Edge: long text | Labels truncate gracefully | |
| Edge: no data | No crash, shows fallback | |

**Evidence required:** At least Default state verified. Other states if they exist in the code.

**Exit criteria:** All implemented states render correctly.

---

## Gate 5: States Browser Entry (if screen is part of a feature)

If this screen belongs to a feature with a states browser:

1. Check if states browser exists at `app/[feature]/page.tsx`
2. Verify the new screen/state is listed in sidebar
3. Verify it loads correctly in the iframe preview
4. Verify flow chart (Mermaid tab) includes this screen if applicable

**Evidence required:** States browser shows the screen. Skip if no states browser for this feature.

**Exit criteria:** Screen accessible from states browser, or explicitly N/A.

---

## Gate 6: Ship Decision

After all gates pass, generate the ship report:

```
── VSP LAUNCH REPORT ────────────────────
Screen    : [name]
File      : [path]
Date      : [YYYY-MM-DD]

Gate 1 — Tokens     : PASS / FAIL (N violations)
Gate 2 — Structure  : PASS / FAIL
Gate 3 — Visual QC  : PASS / FAIL (light + dark)
Gate 4 — States     : PASS / FAIL / N/A
Gate 5 — Browser    : PASS / FAIL / N/A

Decision  : SHIP / BLOCK
──────────────────────────────────────────
```

- **SHIP** = All gates PASS. Safe to commit and inform user.
- **BLOCK** = Any gate FAIL. List specific failures with fix instructions. Do NOT tell user it's done.

---

## Anti-Rationalization Table

| Excuse | Rebuttal |
|---|---|
| "I used tokens so dark mode is fine" | Tokens help but don't guarantee. Gate 3 requires dark mode screenshot. No exceptions. |
| "It's just a small text change, skip QC" | Small changes cause big regressions. Gate 1 grep takes 5 seconds. Run it. |
| "The screenshot looks close enough" | "Close enough" ships bugs. If something looks off, it IS off. Fix before shipping. |
| "States browser doesn't need updating" | If the screen exists in a feature, it must be in the browser. Users navigate via browser. |
| "I'll verify dark mode later" | You won't. Dark mode is Gate 3. No ship without both screenshots. |
| "Token check passed so structure must be fine" | Token check validates colors/spacing values, not layout structure. Gate 2 is separate. |
| "User didn't ask for dark mode" | VSP ships light + dark. Every screen. User doesn't need to ask. |
| "Only the happy path matters" | Edge cases cause support tickets. Gate 4 exists for a reason. |

---

## Red Flags (stop and investigate)

- Token check finds > 5 violations → likely copy-pasted non-VSP code. Re-build with `/vsp-build`.
- Dark mode screenshot shows invisible text → token mapping broken. Check globals.css dark theme.
- Structure check fails on multiple items → page wasn't built from Screen Structure template. Consider re-scaffolding.
- States browser iframe shows blank → wrong route or missing `export default`. Check file path.
- You're tempted to skip a gate → this is the red flag. Run all gates.

---

## Integration with Pipeline

This skill is called:
- **Manually:** User says "launch", "ship", "check xong chua", "pre-ship"
- **From `/vsp-build`:** Implicitly after Phase 5 (visual verification overlaps with Gate 3)
- **From `vsp-pipeline`:** At Stage 5 (Agent QC Audit) — this skill IS the audit
- **From `khoa-qa` agent:** As the formal QA checklist

The gates are cumulative — earlier pipeline stages may have already run some checks. But `/vsp-launch` re-runs ALL gates fresh. Trust nothing from earlier stages; verify everything.

---
Back: [[agents/index|Agents]]

---
name: flutter-parity
description: Check-and-fix loop that makes the VinClub Flutter app match the web (huykieu-design.vercel.app) using shared VSP-DLS tokens and Stealuxe strict pixel diff. Use when asked to "check parity", "so web với flutter", "loop flutter cho giống web", or after changing tokens/screens.
tools: Bash, Read, Edit, Write, Glob, Grep
---

You keep `~/Documents/vinclub_flutter` visually identical to the web app in `~/Documents/vinpay-all` (served at http://localhost:3300).
Workflow doc: `~/Documents/vsp-tokens/WORKFLOW.md` — read it first.

## Loop (max 6 iterations per screen, stop earlier when it stops improving)

1. **Tokens** — `python3 ~/Documents/vsp-tokens/tool/build.py --install` (Figma VSP-DLS export + 4px spacing → web CSS + Flutter `lib/vsp_tokens.dart`).
2. **Measure** — `python3 ~/Documents/vsp-tokens/tool/parity.py <screen>` (first run builds Flutter; later runs may pass `--no-build` only if no Dart changed).
   Read `build/parity/<screen>/report.json`: `mismatch_ratio`, `mae_rgb_8bit`, `bands` (per 50pt row), `worst_tiles` (pt boxes), Stealuxe artifacts (overlay/diff images).
3. **Look** — open `web.png`, `flutter.png` and the Stealuxe diff/overlay image with Read. Name the top 3 concrete differences (position, size, colour, font, missing element) with pt coordinates.
4. **Measure the web, not the screenshot** — for each difference, read the exact value from the web DOM (Playwright WebKit 402×874, `getBoundingClientRect` / `getComputedStyle`) or from the VSP token. Never guess.
5. **Fix Flutter only** — edit `lib/*.dart`. Use `VspColors.light.*`, `VspSpace.*`, `VspRadius.*`, `VspText.*` from `vsp_tokens.dart` when a token exists; if the web uses a raw value that is not a token, keep the raw value and list it as a token gap in the report (do not invent tokens silently).
6. **Re-measure** (step 2). Keep the change only if `mae_rgb_8bit` went down; otherwise revert that edit.
7. Append one line to `~/Documents/vsp-tokens/build/parity/<screen>/loop.md`: iteration, what changed, before→after MAE / mismatch.

Stop when: strict pass (0 mismatched pixels) · or MAE improves < 0.3 for 2 iterations in a row · or 6 iterations.

## Rules
- Never edit the web to "meet" Flutter, never resize/shift screenshots, never add masks to hide differences. Masks only for live data (countdown).
- Never raise the threshold. Pixel-perfect = 0 RGB-different pixels in the declared region; otherwise report the numbers honestly.
- Spacing must follow the 4px rule (`VspSpace`). Screen margin is 24 (`VspSpace.screenMargin`) — 22px is dropped by decision; the resulting offset vs the not-yet-migrated web is expected. Other off-grid web values: list under "4px violations" and use the nearest `VspSpace` token.
- Do not deploy, do not install on the user's iPhone, do not touch Figma. Those are separate steps the main session decides.

## Report back (short)
Screen · iterations · MAE before→after · mismatch before→after · strict pass yes/no · remaining top differences with coordinates · token gaps · 4px violations · files changed.

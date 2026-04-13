---
description: 'Fast design-to-code iteration loop. Figma → Code → Screenshot → Compare → Fix → Repeat. Trigger: "fast loop", "quick build", "iterate", "fix UI", "match figma"'
---

$ARGUMENTS

Load and follow the skill at `.claude/skills/fast-loop/SKILL.md` exactly.

Input from user: `$ARGUMENTS`

If $ARGUMENTS contains a Figma URL → extract fileKey and nodeId, start from Bước 1 with Figma.
If $ARGUMENTS contains a file path → that's the code to fix, start from Bước 2.
If $ARGUMENTS is text instruction → find the relevant code file, start from Bước 2.
If $ARGUMENTS is empty → ask what screen/component to iterate on.

---
name: tasklog
description: 'Log task cho team design. Trigger: "log ...", "ghi ...", "task ..."'
metadata:
  openclaw:
    emoji: 📋
---

# Task Logger Skill

Ghi nhanh task cho team qua Telegram. Parse message, goi API, xac nhan.

## Trigger keywords
- `log`, `ghi`, `task`

## Message format
```
log [type] [description] [duration]
```

## Examples
- `log design review SBH 2h` → type=design, desc="review SBH", dur=120
- `log code fix transfer bug 45m` → type=code, desc="fix transfer bug", dur=45
- `ghi meeting sync team 1h30m` → type=meeting, desc="sync team", dur=90
- `log research competitor OKX 3h` → type=research, desc="competitor OKX", dur=180
- `log review QC sinhloi 30m` → type=review, desc="QC sinhloi", dur=30

## Type keywords
| Keywords | Type |
|---|---|
| design, thiet-ke, ui, ux | design |
| review, check, QC, audit | review |
| code, fix, build, dev | code |
| research, nc, survey | research |
| meeting, hop, sync, call | meeting |
| other, khac | other |

## Duration parsing
- `2h` → 120 min
- `45m` → 45 min
- `1h30m` → 90 min
- `1.5h` → 90 min
- `90` (bare number) → 90 min

## Person detection
- Default: map Telegram sender name to team member (Vi, Nate, Duc, Ivy, Khoa)
- Override: append `cho [name]` — e.g., `log design review SBH 2h cho Ivy`

## Procedure

1. Parse the message to extract: type, description, duration, person
2. If cannot parse, reply: "Khong hieu. Format: log [loai] [mo ta] [thoi gian]"
3. Call API:

```bash
curl -s -X POST https://vsp-ui-khaki.vercel.app/api/tasklog \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${TASKLOG_API_KEY}" \
  -d '{
    "person": "<person>",
    "type": "<type>",
    "description": "<description>",
    "durationMinutes": <minutes>,
    "source": "telegram"
  }'
```

4. On success, reply: `📋 Da ghi: <type> — <description> — <duration> (<person>)`
5. On error, reply: `❌ Loi khi ghi task. Thu lai sau.`

## Dashboard link
https://vsp-ui-khaki.vercel.app/tasklog

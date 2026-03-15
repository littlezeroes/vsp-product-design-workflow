# OpenClaw Skills — V-Smart Pay

Skills chay tren OpenClaw (Vi Telegram bot). Copy vao `~/.openclaw/workspace/skills/` de su dung.

## Skills

### 1. uxui-pipeline
**Trigger:** "tien do", "status", "report", "dang o dau"

Status reporter cho UXUI Pipeline. Vi doc `status.md` trong feature folder va bao user tien do qua Telegram.

- Doc: `.claude/features/[name]/status.md`
- Bao: step hien tai, da xong, dang cho gi
- Chi report — khong chay logic nang

### 2. agent-dispatch
**Trigger:** bat ky task chuyen mon (code review, security, debug, ...)

Registry 130+ specialized subagents. Map task → agent phu hop, download on-demand neu chua co local.

- Index: keyword → agent-name:category
- Cache: `~/.claude/agents/`
- JIT: download tu GitHub neu chua install

### 3. tasklog
**Trigger:** "log ...", "ghi ...", "task ..."

Log task nhanh cho team qua Telegram. Parse message, goi API, xac nhan.

- Format: `log [type] [mo ta] [thoi gian]`
- Example: `log design review SBH 2h`
- API: `POST /api/tasklog` → Vercel KV
- Dashboard: `/tasklog`

## Types (tasklog)
| Type | Keywords |
|------|----------|
| design | design, thiet-ke, ui, ux |
| review | review, check, QC, audit |
| code | code, fix, build, dev |
| research | research, nc, survey |
| meeting | meeting, hop, sync, call |
| other | other, khac |

## Team
| Emoji | Name | Role |
|-------|------|------|
| 🤖 | Vi | Design Lead / Orchestrator |
| 🔍 | Nate | UX Researcher |
| 👹 | Duc | Senior UX Reviewer |
| 🎨 | Ivy | UI Designer / Builder |
| 📋 | Khoa | QA Design |

## Setup
```bash
cp -r .claude/skills/* ~/.openclaw/workspace/skills/
openclaw gateway restart
```

# UXUI Pipeline — VSP Team

## Architecture
```
Tại bàn:   User ←→ Claude Code (Vi + Nate/Đức/Ivy/Khoa) — FREE (Claude Max)
Ra ngoài:  User ←→ Vi Telegram — chỉ check status/report — ~$2/mo
```

## Team
| Agent | Role | Chạy trên |
|-------|------|-----------|
| 🤖 Vi | Design Lead (bạn) | Claude Code — orchestrate + summarize |
| 🔍 Nate | UX Researcher | Claude Code subagent |
| 👹 Đức | Senior UX Reviewer | Claude Code subagent |
| 🎨 Ivy | UI Designer | Claude Code subagent |
| 📋 Khoa | QA Design | Claude Code subagent |

## Pipeline Overview

```
BRD (PO)
  │
  ▼
┌─────────────────────────────────────────────────┐
│ PHASE A: UNDERSTAND                              │
│ step-01 → Nate đọc BRD, tìm gaps                │
│ step-02 → Vi hỏi PO confirm gaps    ◄── CHECKPOINT│
│ step-03 → Nate design flow + edge cases          │
│ step-04 → Đức review flow (debate)              │
│ step-05 → Vi show PO debate result   ◄── CHECKPOINT│
└─────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────┐
│ PHASE B: PLAN                                    │
│ step-06 → Ivy tạo screen breakdown + states     │
│ step-07 → Khoa check state coverage              │
│ step-08 → Vi show PO screens + states ◄── CHECKPOINT│
└─────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────┐
│ PHASE C: BUILD                                   │
│ step-09 → Ivy gen code                          │
│ step-10 → Khoa full QA                           │
│ step-11 → Vi show PO final report    ◄── CHECKPOINT│
└─────────────────────────────────────────────────┘
  │
  ▼
  DONE — outputs ready
```

## Checkpoints (Vi hỏi PO trực tiếp trong terminal)
Pipeline có 4 checkpoints bắt buộc dừng lại hỏi PO:

1. **After step-02:** PO trả lời gaps từ BRD
2. **After step-05:** PO chốt flow (sau khi xem debate Nate vs Đức)
3. **After step-08:** PO approve screen breakdown + states
4. **After step-11:** PO approve final hoặc request fix

## Execution Rules

### Vi orchestrate trực tiếp
Vi (Claude Code) là bạn — bạn đọc files, tóm tắt, hỏi user, rồi dispatch subagents. Không cần relay qua Telegram.

### Subagent dispatch
Spawn agents bằng Agent tool hoặc claude CLI:
```
claude --permission-mode bypassPermissions --print '[agent prompt]'
```

### Knowledge persistence
Mọi decision ghi vào:
```
.claude/features/[feature-name]/
  ├── brd-raw.*        ← BRD gốc
  ├── analysis.md      ← Nate output (step 1)
  ├── answers.md       ← PO answers (step 2)
  ├── flow.md          ← Nate output (step 3)
  ├── review.md        ← Đức output (step 4)
  ├── decisions.md     ← PO decisions (step 5)
  ├── screens.md       ← Ivy output (step 6)
  ├── qa-states.md     ← Khoa output (step 7)
  ├── qa-final.md      ← Khoa output (step 10)
  ├── summary.md       ← Ivy output (step 9)
  ├── status.md        ← Pipeline status (Vi Telegram đọc file này)
  └── assumptions.md   ← AI assumptions chưa PO confirm
```

### Status file (cho Vi Telegram)
Sau mỗi step, Vi update `status.md`:
```markdown
# Pipeline Status: [feature-name]
## Current: step-XX — [mô tả]
## Completed: step-01 ✅, step-02 ✅, ...
## Waiting: [PO input / agent running / ...]
## Last update: [timestamp]
```
Vi Telegram đọc file này khi user hỏi tiến độ.

### Debate protocol (step 4-5)
1. Nate đề xuất flow
2. Đức chê + đề xuất alternative
3. Vi tóm tắt cả 2 bên
4. PO chọn hoặc mix

### Cost optimization
- Pipeline chạy hoàn toàn trên Claude Code (Claude Max = FREE)
- Vi Telegram chỉ đọc status.md khi user hỏi (~$2/mo Haiku)
- Nếu PO không available → pipeline pause ở checkpoint, resume sau

## Trigger
User says: "pipeline", "new feature", "start flow", "bắt đầu feature"

## Quick Start
```
1. Tạo folder: .claude/features/[feature-name]/
2. Đặt BRD vào folder (hoặc paste text)
3. Chạy step-01: Nate analyze
4. Follow pipeline steps — Vi hỏi tại mỗi checkpoint
```

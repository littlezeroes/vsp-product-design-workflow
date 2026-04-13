# Screens — Option D: Hub + Global Search
> Ivy | 2026-03-10

---

## Decision
PO chon Option D vi: 3 lane explicit (VSP / Bank / Search), new user hieu ngay app lam gi.

## Architecture

### Entry Page (main page)
3 sections:
1. **Hub Cards** — 2 cards side by side:
   - "Den vi" (Wallet icon) → mo P2P BottomSheet
   - "Den ngan hang" (Landmark icon) → mo Bank BottomSheet
2. **Search Bar** (read-only entry point) — tap → mo Global Search BottomSheet
   - Nut "Dan" (paste) ben phai — paste → auto-detect → mo search sheet voi gia tri
   - KHONG filter inline. Day chi la visual cue.
3. **Da luu** list (mixed P2P + bank):
   - Moi row: avatar + nickname (bold) + sub (SDT/STK) + badge (VSP/bank)
   - Pencil icon edit nickname → mo Edit Nickname BottomSheet
   - Tap → di thang `/transfer/amount?type=xxx&saved=id`

### P2P BottomSheet (giu nguyen)
States: empty → typing → resolving → resolved → not-found → error

### Bank BottomSheet (giu nguyen)
States: empty → typing → detected → resolved → not-found → error-lookup → error-format

### Global Search BottomSheet (REDESIGN)
- Default: real search bar (auto-focus) + "Da luu" + "Danh ba vi VSP"
- Typing SDT: DetectBadge "SDT → Vi VSP" + filter da luu + danh ba
- Typing STK: DetectBadge "STK → Ngan hang" + auto-detect bank card (loading state) → resolved card + "Tiep tuc"
- Typing ten: filter ca da luu + danh ba by name
- No result: empty state + 2 escape buttons ("Nhap SDT moi" → P2P sheet, "Nhap STK moi" → Bank sheet)

### Edit Nickname BottomSheet (giu nguyen)

---

## State Map

| State | Description |
|---|---|
| `default` | Hub cards + search entry point + da luu list |
| `empty` | Hub cards + search + empty state (chua co nguoi nhan) |
| `sheet-p2p` | P2P sheet empty |
| `sheet-p2p-typing` | P2P sheet typing |
| `sheet-p2p-resolving` | P2P sheet loading |
| `sheet-p2p-resolved` | P2P sheet name found |
| `sheet-p2p-not-found` | P2P sheet SDT not registered |
| `sheet-p2p-error` | P2P sheet format error |
| `sheet-bank` | Bank sheet empty |
| `sheet-bank-typing` | Bank sheet typing |
| `sheet-bank-detected` | Bank sheet auto-detected bank |
| `sheet-bank-resolved` | Bank sheet name confirmed |
| `sheet-bank-not-found` | Bank sheet STK invalid |
| `sheet-bank-error-lookup` | Bank sheet name lookup failed |
| `sheet-bank-error-format` | Bank sheet format error |
| `sheet-search` | Global Search default (da luu + danh ba) |
| `sheet-search-typing-sdt` | Search filtering by SDT |
| `sheet-search-typing-stk` | Search typing STK, auto-detect bank card |
| `sheet-search-typing-name` | Search filtering by name |
| `sheet-search-stk-resolved` | Search STK resolved, show name + bank |
| `sheet-search-no-result` | Search no match |
| `edit-nickname` | Edit nickname sheet |

**Total: 22 states** (giam tu 24, bo `sheet-search-sdt-resolved` va `sheet-search-stk-bank-picker`)

---

## Key Changes vs Old Code

### Removed
- Main page inline search filter (no more `filteredSaved`, `handleSearchKeyDown`, detect badges on main page)
- STK Bank Picker (9-option destination list) — replaced with auto-detect
- `sheet-search-sdt-resolved` state — SDT trong search luon filter, khong resolve rieng
- `sheet-search-stk-bank-picker` state — bo destination picker
- Hardcoded colors `#FFF0F2`, `#E31837`, `#EEF2FF`, `#4F46E5` → dung `bg-success/10 text-success` va `bg-foreground/5 text-foreground-secondary`
- `border-b border-border` between items in cards
- `style={{ backgroundColor, color }}` inline trên BankLogo (removed component)
- Avatar `variant="bank"` — 1 style duy nhat cho tat ca avatars

### Added
- Search bar on main page la `<button>` (read-only) — tap → `?state=sheet-search`
- Paste button tren search bar — clipboard API → pass value to search sheet
- STK auto-detect card in search (loading + resolved inline)
- Escape buttons in no-result state ("Nhap SDT moi", "Nhap STK moi")
- Hub cards dung `rounded-[28px]` (was `rounded-[20px]` + border — now borderless, bg-secondary)

### Changed
- Saved list on main page: 2 lines per item (nickname + sub) thay vi 3 lines
- Search sheet: "Da luu" section hien TRUOC "Danh ba vi VSP" (priority order)
- TypeBadge dung semantic tokens thay vi hardcoded hex

---

## CLAUDE.md Compliance Checklist
- [x] `px-[22px]` content padding
- [x] `pt-[32px]` between sections (hub cards → search → da luu)
- [x] `variant="large-title"` Header, `largeTitle` prop
- [x] `ChevronLeft` for back
- [x] 1 primary button per screen (only in sheets)
- [x] Home indicator `w-[139px] h-[5px] bg-foreground`
- [x] No hardcoded colors — semantic tokens only
- [x] No border between sections
- [x] `rounded-[28px]` on hub cards
- [x] Components used: Header, Button, TextField, BottomSheet, ItemList

---

## Files Modified
1. `app/transfer/entry/page.tsx` — full rewrite
2. `app/transfer/states/page.tsx` — updated S1-C states
3. `.claude/features/chuyen-tien/screens-optionD.md` — this file

---
Back: [[features/index|Features]] · [[features/chuyen-tien/status|chuyen-tien]]

# Global Search — Review Brief

## Context
Chuyển tiền có 2 page chính: Entry + Amount.
Entry page có Search Sheet (BottomSheet) — đang hoạt động như "Global Search":
- Default: hiện danh bạ ví VSP (contacts có ví) + danh sách đã lưu
- Gõ SĐT: filter danh bạ VSP
- Gõ STK: filter saved
- Paste STK: show destination picker (Ví VSP ưu tiên + banks)

## Problem
PO feedback: "flow global search vẫn ko đẹp lắm"

## Current Implementation
File: `app/transfer/entry/page.tsx` — SearchSheetContent component
States: sheet-search, sheet-search-typing-sdt/stk/name, sheet-search-stk-bank-picker, sheet-search-sdt/stk-resolved, sheet-search-no-result

## What to analyze
1. UX flow — có hợp lý không? Có thừa step không?
2. Default state — danh bạ + saved có overwhelm không? Hierarchy đúng chưa?
3. Detection logic — STK vs SĐT vs tên, transition giữa các state
4. Destination picker — UX khi paste STK, chọn bank
5. So sánh với ref apps (OKX, Cash App, Revolut, MoMo, ZaloPay)

---
Back: [[features/index|Features]] · [[features/chuyen-tien/status|chuyen-tien]]

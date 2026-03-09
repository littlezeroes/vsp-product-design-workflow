# BIDV Liên kết, Nạp/Rút Ví — Summary
> Builder: Ivy | Date: 2026-03-09

## Flow Diagram
```
[Entry /bidv-link] → [S1: Bank List] → [S2: BIDV Form] → [S3: Waiting] → [S4: Result]
                                                                              ├── success → [S5: Deposit]
                                                                              ├── failed → retry S2
                                                                              └── pending → Home

[S5: Deposit] → [Auth-Deposit] → [S7: Waiting] → [S8: Result]
                                                      ├── success → "Nạp thêm" S5
                                                      └── failed → retry Auth-Deposit

[S9: Withdraw] → [Auth-Withdraw] → [S11: Result]
                                        ├── success → Home
                                        └── failed → retry Auth-Withdraw

[S15: Bank Management] → [S12: Bank Detail] → [S13: Waiting] → [S14: Result]
                                                                     └── cancel → S12

[S16: Transactions] → [S17: Transaction Detail]
```

## Screens x Components x States

| # | Screen | Route | Components | States |
|---|--------|-------|------------|--------|
| 1 | S1: Danh sách NH | /bidv-link/bank-list | Header, StepIndicator, ItemList, FeedbackState | loaded, empty, loading, error |
| 2 | S2: Form Liên kết BIDV | /bidv-link/bidv-form | Header, StepIndicator, TextField, Button, BottomSheet, InformMessage, Dialog | empty, typing, valid, tnc-sheet, loading, error-stk, error-mismatch, error-no-smartbanking, error-maintenance, error-rate-limit, error-network, redirect-store, resume-from-store, deeplink-fail |
| 3 | S3: Chờ xác thực (Liên kết) | /bidv-link/bidv-waiting | Header, StepIndicator, Button, Dialog | waiting, callback-success, callback-failed, callback-pending, callback-cancel, timeout, cancel-confirm, cancelled, network-lost, app-resume |
| 4 | S4: Kết quả Liên kết | /bidv-link/bidv-result | FeedbackState, ItemList, Button | success, failed, failed-cancel, failed-timeout, pending |
| 5 | S5: Nạp tiền | /bidv-link/deposit | Header, Button | empty, typing, valid, error-min, error-max, error-daily, error-monthly, quick-select, loading |
| 6 | Auth-Deposit | /bidv-link/deposit-auth | Header, ItemList, InformMessage, Dialog | default, biometric-prompt, biometric-success, biometric-fail, pin-typing, pin-success, pin-error-1, pin-error-2, pin-locked, redirect-store, session-timeout, fee-changed |
| 7 | S7: Chờ xác thực (Nạp) | /bidv-link/deposit-waiting | Header, Button, Dialog | waiting, callback-success, callback-failed, callback-pending, timeout, cancel-confirm, cancelled, network-lost, app-resume |
| 8 | S8: Kết quả Nạp tiền | /bidv-link/deposit-result | FeedbackState, ItemList, Button | success, failed, failed-insufficient, failed-timeout, pending |
| 9 | S9: Rút tiền | /bidv-link/withdraw | Header, Button | empty, typing, valid, error-min, error-max, error-balance, error-daily, error-monthly, quick-select, loading |
| 10 | Auth-Withdraw | /bidv-link/withdraw-auth | Header, ItemList, InformMessage, Dialog | default, biometric-prompt, biometric-success, biometric-fail, pin-typing, pin-success, pin-error-1, pin-error-2, pin-locked, session-timeout, fee-changed |
| 11 | S11: Kết quả Rút tiền | /bidv-link/withdraw-result | FeedbackState, ItemList, InformMessage, Button | success, failed, failed-account, failed-refund, pending |
| 12 | S12: Chi tiết NH BIDV | /bidv-link/bank-detail | Header, ItemList, Button, BottomSheet, Dialog, FeedbackState | loaded, unlink-check, pending-block, confirm-normal, confirm-last, redirect-store, loading, error |
| 13 | S13: Chờ xác thực (Hủy) | /bidv-link/unlink-waiting | Header, Button, Dialog | waiting, callback-success, callback-failed, callback-pending, callback-cancel, timeout, cancel-confirm, cancelled, network-lost, app-resume |
| 14 | S14: Kết quả Hủy liên kết | /bidv-link/unlink-result | FeedbackState, Button | success, failed, failed-cancel, failed-timeout, pending |
| 15 | S15: Quản lý thanh toán | /bidv-link/bank-management | Header, ItemList, FeedbackState, Button | loaded, empty, loading, error |
| 16 | S16: Lịch sử GD | /bidv-link/transactions | Header, ItemList, FeedbackState | loaded, empty, filtered, filtered-empty, loading, error |
| 17 | S17: Chi tiết GD | /bidv-link/transaction-detail | Header, ItemList, FeedbackState | loaded, loading, status-updated, error |

## Component Inventory

| Component | Used in screens | Props/Variants |
|-----------|----------------|----------------|
| Header | 1-17 | variant="large-title" / "default", leading=ChevronLeft |
| Button | 1-17 | variant="primary"/"secondary", size="48", intent="danger" |
| TextField | 2 | label, value, disabled, error, maxLength |
| ItemList/Item | 4,6,8,10,11,12,15,16,17 | label, metadata, divider, showChevron, onPress |
| FeedbackState | 1,4,8,11,12,14,15,16,17 | icon, title, description, actionLabel |
| BottomSheet | 2,12 | open, onClose, children |
| Dialog | 2,3,6,7,10,13 | title, description, primaryLabel, secondaryLabel |
| InformMessage | 2,6,10,11 | hierarchy="primary", icon, body |
| ButtonGroup | (via Dialog) | layout="horizontal", primaryLabel, secondaryLabel |

## State Matrix (QA missing states FIXED)

| Screen | empty | loading | valid | error | disabled | success | failed | pending | app-resume |
|--------|-------|---------|-------|-------|----------|---------|--------|---------|------------|
| S1 | yes | yes | - | yes | - | - | - | - | - |
| S2 | yes | yes | yes | yes (5 types) | - | - | - | - | - |
| S3 | - | - | - | - | - | yes | yes | yes | yes |
| S4 | - | - | - | - | - | yes | yes (3) | yes | - |
| S5 | yes | yes | yes | yes (4 types) | - | - | - | - | - |
| Auth-D | - | - | - | yes (pin) | - | yes | - | - | - |
| S7 | - | - | - | - | - | yes | yes | yes | yes (FIXED) |
| S8 | - | - | - | - | - | yes | yes (3) | yes | - |
| S9 | yes | yes (FIXED) | yes | yes (5 types) | - | - | - | - | - |
| Auth-W | - | - | - | yes (pin) | - | yes | - | - | - |
| S11 | - | - | - | - | - | yes | yes (3) | yes | - |
| S12 | - | yes | - | yes (FIXED) | - | - | - | - | - |
| S13 | - | - | - | - | - | yes | yes | yes (FIXED) | yes (FIXED) |
| S14 | - | - | - | - | - | yes | yes (3) | yes (FIXED) | - |
| S15 | yes | yes | - | yes (FIXED) | - | - | - | - | - |
| S16 | yes | yes | - | yes (FIXED) | - | - | - | - | - |
| S17 | - | yes | - | yes (FIXED) | - | - | - | - | - |

## 9 QA Missing States — ALL FIXED

| # | Screen | Missing State | Fix Applied |
|---|--------|---------------|-------------|
| 1 | S7 | app-resume | Added to deposit-waiting with status check message |
| 2 | S9 | loading (submit) | Added loading state with Button isLoading |
| 3 | S13 | callback-pending | Added callback-pending -> unlink-result?state=pending |
| 4 | S13 | app-resume | Added to unlink-waiting with status check message |
| 5 | S14 | pending | Added pending state with Clock icon + description |
| 6 | S12 | error (API load) | Added error state with FeedbackState retry |
| 7 | S15 | error (API load) | Added error state with FeedbackState retry |
| 8 | S16 | error (API load) | Added error state with FeedbackState retry |
| 9 | S17 | error (API load) | Added error state with FeedbackState retry |

## URLs

| Screen | URL |
|--------|-----|
| Entry | http://localhost:3000/bidv-link |
| S1: Danh sách NH | http://localhost:3000/bidv-link/bank-list |
| S2: Form BIDV | http://localhost:3000/bidv-link/bidv-form |
| S3: Chờ xác thực (Liên kết) | http://localhost:3000/bidv-link/bidv-waiting |
| S4: Kết quả Liên kết | http://localhost:3000/bidv-link/bidv-result?state=success |
| S5: Nạp tiền | http://localhost:3000/bidv-link/deposit |
| Auth-Deposit | http://localhost:3000/bidv-link/deposit-auth |
| S7: Chờ xác thực (Nạp) | http://localhost:3000/bidv-link/deposit-waiting |
| S8: Kết quả Nạp tiền | http://localhost:3000/bidv-link/deposit-result?state=success |
| S9: Rút tiền | http://localhost:3000/bidv-link/withdraw |
| Auth-Withdraw | http://localhost:3000/bidv-link/withdraw-auth |
| S11: Kết quả Rút tiền | http://localhost:3000/bidv-link/withdraw-result?state=success |
| S12: Chi tiết NH | http://localhost:3000/bidv-link/bank-detail |
| S13: Chờ xác thực (Hủy) | http://localhost:3000/bidv-link/unlink-waiting |
| S14: Kết quả Hủy liên kết | http://localhost:3000/bidv-link/unlink-result?state=success |
| S15: Quản lý thanh toán | http://localhost:3000/bidv-link/bank-management |
| S16: Lịch sử GD | http://localhost:3000/bidv-link/transactions |
| S17: Chi tiết GD | http://localhost:3000/bidv-link/transaction-detail |
| **ALL STATES** | http://localhost:3000/bidv-link/_states |

## Files Created

```
app/bidv-link/
  ├── layout.tsx                    ← Suspense wrapper for useSearchParams
  ├── page.tsx                      ← Entry redirect to bank-list
  ├── bank-list/page.tsx            ← S1: Danh sách ngân hàng
  ├── bidv-form/page.tsx            ← S2: Form Liên kết BIDV
  ├── bidv-waiting/page.tsx         ← S3: Chờ xác thực (Liên kết)
  ├── bidv-result/page.tsx          ← S4: Kết quả Liên kết
  ├── deposit/page.tsx              ← S5: Nạp tiền
  ├── deposit-auth/page.tsx         ← Auth-Deposit: Xác nhận Nạp tiền
  ├── deposit-waiting/page.tsx      ← S7: Chờ xác thực (Nạp)
  ├── deposit-result/page.tsx       ← S8: Kết quả Nạp tiền
  ├── withdraw/page.tsx             ← S9: Rút tiền
  ├── withdraw-auth/page.tsx        ← Auth-Withdraw: Xác nhận Rút tiền
  ├── withdraw-result/page.tsx      ← S11: Kết quả Rút tiền
  ├── bank-detail/page.tsx          ← S12: Chi tiết NH BIDV
  ├── unlink-waiting/page.tsx       ← S13: Chờ xác thực (Hủy)
  ├── unlink-result/page.tsx        ← S14: Kết quả Hủy liên kết
  ├── bank-management/page.tsx      ← S15: Quản lý thanh toán
  ├── transactions/page.tsx         ← S16: Lịch sử giao dịch
  ├── transaction-detail/page.tsx   ← S17: Chi tiết giao dịch
  └── _states/page.tsx              ← ALL states listing page
.claude/features/bidv-link/summary.md ← this file
```

## PO Decisions Applied
1. Store redirect -> persist state + auto-detect (S2, Auth-Deposit, S12)
2. S6/S10 merged into Auth screens (Auth-Deposit, Auth-Withdraw) with summary on PIN screen
3. S11 pending -> shows refund time (15 min) + current balance + hotline button
4. S3/S7/S13 have "Huy giao dich" secondary CTA + confirm dialog
5. TnC -> "Dong y & Tiep tuc" opens BottomSheet
6. "Thu lai" -> goes to Auth screen (pre-filled confirm)
7. S5/S9 show wallet balance
8. Epic 1 step indicator (1/3, 2/3, 3/3)
9. S16 filter chips with "Tat ca" first (default active)
10. S7 cancel -> S5 (PO decision confirmed)

# QA P0 Fixes — Cần apply sau khi Ivy code xong

## P0-1: Min amount validation (Deposit + Withdraw)
- File: `app/sinhloi/deposit-withdraw/page.tsx`
- Add: validation `amount < 10000` → inline error "Số tiền tối thiểu là 10.000đ"
- Import `SINHLOI_CONFIG` from data.ts, add `minAmount: 10000` if not exists

## P0-2: Pending TX banner on Dashboard
- File: `app/sinhloi/dashboard/page.tsx`
- Add: state `hasPendingTx` → show yellow badge on balance area "Đang xử lý giao dịch..."
- Auto-refresh logic (30s interval when pending)

## P0-3: Monthly limit display on Deposit
- File: `app/sinhloi/deposit-withdraw/page.tsx`
- Add: "Hạn mức còn lại tháng này: X đ" below amount input (always visible)
- Validate: (total this month + amount) ≤ 100M

## P1: Biometric state in OTP screen
- File: `app/sinhloi/otp/page.tsx`
- Add biometric prompt state as alternative to OTP (for devices with biometric)
- Fallback: if biometric fails → show OTP input

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]

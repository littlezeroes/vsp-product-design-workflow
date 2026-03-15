# Edge Case Library — VSP
> Mỗi screen type có danh sách edge cases bắt buộc phải handle.
> Nate dùng để tìm gaps trong BRD. Khoa dùng để check state coverage.

---

## Form Input
```
□ Empty state (initial load — button disabled)
□ Typing (partial input — button still disabled)
□ Valid (all rules pass — button enabled)
□ Validation error (inline — "SĐT không hợp lệ")
□ Max length reached (input stops accepting)
□ Paste from clipboard (auto-validate after paste)
□ Keyboard covers input (scroll into view)
□ Loading (submit in progress — button spinner)
□ API error after submit (inline or toast)
□ Duplicate submission prevention (disable button after tap)
```

## Confirmation / Review
```
□ Loading (fetching details — skeleton)
□ Ready (all info displayed)
□ Fetch error (retry option)
□ Price/fee changed (InformMessage warning)
□ Session timeout (dialog → retry or restart)
□ Data stale (user been on screen too long → re-fetch)
□ Double tap prevention (disable confirm after first tap)
```

## Auth — PIN
```
□ Empty (no digits entered)
□ Entering (partial digits)
□ Correct → proceed
□ Wrong attempt 1-2 (error message + clear + retry)
□ Wrong attempt 3 → lock account (redirect to lock screen)
□ Forgot PIN link → forgot flow
□ Biometric available → show biometric option
□ Biometric fail → fallback to PIN
□ Biometric not enrolled → PIN only
```

## Auth — OTP
```
□ OTP sent (countdown timer shown)
□ Entering digits
□ Correct → proceed
□ Wrong OTP (error + retry)
□ OTP expired (show "Hết hạn" + resend button)
□ Resend OTP (reset countdown)
□ Resend limit reached (show "Thử lại sau X phút")
□ Network error sending OTP (retry option)
```

## Result — Success
```
□ Success with details (amount, recipient, time)
□ Action buttons: "Về trang chủ" + "Giao dịch mới"
□ Share/screenshot option (if applicable)
□ Auto-redirect timer (nếu có)
```

## Result — Failed
```
□ Retryable error → "Thử lại" button
□ Non-retryable error → "Về trang chủ" button
□ Error code/message displayed
□ Support link/phone (if applicable)
□ Pending/Processing → "Đang xử lý, kiểm tra sau"
```

## List / Dashboard
```
□ Empty (no data — FeedbackState)
□ Loading (skeleton placeholders)
□ Loaded (with data)
□ Fetch error (retry option)
□ Pull to refresh (if applicable)
□ Pagination / infinite scroll (if > 20 items)
□ Filter/search active but no results → "Không tìm thấy"
```

## Bottom Sheet / Dialog
```
□ Open animation (slide up / fade in)
□ Close: tap outside / swipe down / X button
□ Content overflow → scrollable inside sheet
□ Keyboard opens inside sheet → sheet resizes
□ Multiple sheets stacked → only top one interactive
```

## Navigation / Global
```
□ Deep link entry → screen loads correctly without prior navigation
□ Back button → previous screen (not home)
□ App kill mid-flow → resume or restart?
□ Network lost mid-flow → offline message
□ Network restored → auto-retry or manual?
□ User switch language mid-flow → content updates
□ Accessibility: VoiceOver reads correct order
□ Dark mode: all tokens switch correctly
```

## Financial / Fintech Specific
```
□ Amount = 0 → block
□ Amount < minimum → inline error with min value
□ Amount > balance → inline error "Số dư không đủ"
□ Amount > daily limit → inline error with limit info
□ Transfer to self → block with message
□ Recipient not found → inline error
□ Recipient not KYC verified → warning or block (PO decision)
□ Currency formatting → đúng locale (1.000.000đ)
□ Fee calculation → show fee + total trước confirm
□ Rate changes → warning nếu rate thay đổi > X%
```

---

> Last updated: [auto]. Grow this file sau mỗi feature — thêm edge cases mới phát hiện.

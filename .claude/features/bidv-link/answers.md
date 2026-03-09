# BIDV Liên kết — PO Answers

1. User chỉ có 1 STK — không cần dropdown, input STK thôi
2. Xác thực liên kết: deeplink sang app BIDV SmartBanking
3. Hủy liên kết: deeplink sang app BIDV
4. Ngưỡng GD loại A/C/D: bỏ qua case này (assume tất cả GD đều qua deeplink xác thực)
5. User chưa cài BIDV: chuyển sang App Store, fallback behavior là user install rồi quay lại

## Context
- Timeline: W23–28/03/2026 (golive trong 3 tuần)
- Compliance: Thông tư 40/2024/TT-NHNN
- Target metrics: Completion rate ≥80%, User activation ≥90%

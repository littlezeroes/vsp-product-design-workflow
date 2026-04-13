# Flow — VAS Payment Redesign
> Designer: Vi (AI) | Date: 2026-03-09
> Based on: BRD Design Brief - Redesign VAS Payment + VSP v1.0 Figma

---

## Existing UX (reuse as-is, chỉ visual refresh)
- Xác thực GD (PIN/Bio/Face/Fido) → `40004769:73935`
- Kết quả GD (shared template) → `40013468:41558`

---

## Flow 1 — Thanh toán hóa đơn mới
```
VAS Home → Chọn danh mục (Điện/Nước/Internet/Truyền hình)
  → Chọn nhà cung cấp (grouped by tỉnh/TP cho Điện/Nước)
  → Nhập mã khách hàng (+ link "Xem hướng dẫn")
  → Fetch bill → Hiển thị chi tiết hóa đơn
  → Confirm (amount + phí + nguồn TT)
  → Auth (PIN/Bio) → Result
```

## Flow 2 — Nạp tiền điện thoại
```
VAS Home → Nhập/chọn SĐT (danh sách đã lưu + nhập mới)
  → Auto-detect nhà mạng (Viettel/Mobi/Vina/VNMobile/Reddi/Itelecom)
  → Chọn mệnh giá (10K → 500K chips)
  → Confirm → Auth → Result
```

## Flow 3 — Mua thẻ cao
```
VAS Home → Chọn nhà mạng
  → Chọn mệnh giá
  → Confirm → Auth → Hiển thị mã thẻ (serial + mã nạp)
```

## Flow 4 — Thanh toán nhanh (từ đã lưu)
```
VAS Home → Section "Đã lưu" (SĐT + hóa đơn)
  → Tap item → Pre-filled form
  → Fetch bill (nếu hóa đơn) / Chọn mệnh giá (nếu SĐT)
  → Confirm → Auth → Result
```

## Flow 5 — Quản lý hóa đơn & SĐT đã lưu
```
VAS Home → "Quản lý" (gear icon)
  → Tab "Hóa đơn" | "Số điện thoại"
  → List items grouped by loại DV
  → Tap item → Detail → Edit / Xóa
```

## Flow 6 — Thanh toán tự động
```
Quản lý → Hóa đơn đã lưu → Tap item
  → Toggle "Thanh toán tự động"
  → Config: Ngày TT (1-28) + Nguồn tiền
  → Xác nhận kích hoạt → Auth → Active
```

## Flow 7 — Thanh toán tài chính (vay tiêu dùng)
```
VAS Home → "Tài chính" category
  → Chọn nhà cung cấp (12 providers)
  → Nhập định danh (mã KH / mã HĐ / CCCD — tùy provider)
  → Fetch khoản vay → Hiển thị chi tiết
  → Confirm → Auth → Result
```

## Flow 8 — Mua gói data
```
VAS Home → "Gói data" category
  → Nhập/chọn SĐT → Auto-detect nhà mạng
  → Chọn gói data (grid: dung lượng + giá + thời hạn)
  → Confirm → Auth → Result
```

---

## Screen Map

```
                    ┌──────────────┐
                    │  VAS Home    │ V1
                    │  (redesign)  │
                    └──────┬───────┘
               ┌───────┬──┴──┬────────┬─────────┐
               ▼       ▼     ▼        ▼         ▼
            ┌────┐  ┌────┐ ┌────┐  ┌────┐   ┌────┐
            │Hóa │  │Nạp │ │Thẻ │  │Data│   │Tài │
            │đơn │  │tiền│ │cao │  │    │   │chính│
            │V2  │  │V3  │ │V4  │  │V9  │   │V10 │
            └──┬─┘  └──┬─┘ └──┬─┘  └──┬─┘   └──┬─┘
               │       │      │       │         │
            ┌──▼──┐    │      │    ┌──▼──┐   ┌──▼──┐
            │NCC  │    │      │    │Chọn │   │NCC  │
            │V2a  │    │      │    │gói  │   │V10a │
            └──┬──┘    │      │    │V9a  │   └──┬──┘
               │       │      │    └──┬──┘      │
            ┌──▼──┐    │      │       │         │
            │Input│    │      │       │         │
            │V2b  │    │      │       │         │
            └──┬──┘    │      │       │         │
               │       │      │       │         │
               ▼       ▼      ▼       ▼         ▼
            ┌─────────────────────────────────────┐
            │         Confirm (V5 — shared)       │
            └──────────────┬──────────────────────┘
                           ▼
            ┌─────────────────────────────────────┐
            │         Auth (existing reuse)       │
            └──────────────┬──────────────────────┘
                           ▼
            ┌─────────────────────────────────────┐
            │         Result (existing reuse)     │
            └─────────────────────────────────────┘

Side flows:
  V6: Quản lý đã lưu
  V7: Chi tiết đã lưu
  V8: Auto-pay config
  V11: Lịch sử GD VAS
```

---

## Reuse Analysis

| What | Action | Source |
|------|--------|-------|
| VAS Home | **REDESIGN** | New layout, existing category data |
| Nhà cung cấp selector | **NEW** | Grouped by tỉnh/TP |
| Nhập mã KH | **REFRESH** | Existing form + add "Hướng dẫn" link |
| Nạp tiền ĐT | **REFRESH** | `40002305:67696` — visual update only |
| Mua thẻ cao | **REFRESH** | Clone Nạp ĐT, thêm mã thẻ result |
| Confirm | **REFRESH** | From Payment Hub `40009143:10433` pattern |
| Auth | **REUSE** | `40004769:73935` — no change |
| Result | **REUSE** | `40013468:41558` — no change |
| Mua gói data | **NEW** | SĐT + grid chọn gói |
| Thanh toán tài chính | **NEW** | Multi-input per provider |
| Auto-pay config | **NEW** | Toggle + date picker + nguồn tiền |
| Quản lý đã lưu | **NEW** | Tabbed list + CRUD |
| Lịch sử GD VAS | **REFRESH** | Clone from bidv-link transactions |

---
Back: [[features/index|Features]] · [[features/vas-payment/status|vas-payment]]

# Quỹ Nhóm — Information Design

## S0: Danh sách quỹ

**Mental model:** "Tao tham gia mấy quỹ rồi? Quỹ nào cần góp?"

```
┌─────────────────────────┐
│ Zone 1: Header           │
│ Zone 2: Quỹ cards        │
│ Zone 3: Empty state      │
└─────────────────────────┘
```

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Header | "Quỹ nhóm" + nút [+ Tạo] | User cần biết mình ở đâu + CTA tạo quỹ mới luôn visible vì đây là entry point chính |
| Quỹ cards | Mỗi card: tên + số dư + progress mini + avatar members | Số dư là info quan trọng nhất (tiền tao đâu). Progress cho biết gần đạt mục tiêu chưa. Avatars = social proof (ai đang trong quỹ). Card tap → vào dashboard |
| Empty state | Illustration + "Chưa có quỹ nào" + CTA "Tạo quỹ đầu tiên" | First-time user cần hướng dẫn rõ ràng, không để trống |

**Hierarchy:** Tên quỹ (16px bold) > Số dư (14px semibold) > Progress bar (4px) > Members (avatars 24px)
**Reference:** Cash App "Pools" — card list đơn giản, mỗi card đủ info để quyết định tap vào

---

## S2: Mời thành viên

**Mental model:** "Tao muốn thêm bạn vào quỹ nhanh nhất có thể"

```
┌─────────────────────────┐
│ Zone 1: Header           │
│ Zone 2: Share options    │
│ Zone 3: Danh bạ search   │
└─────────────────────────┘
```

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Header | "Mời thành viên" + back | Context rõ ràng — user biết đang mời vào quỹ nào |
| Share options | QR code lớn + Copy link + Chia sẻ (Zalo/SMS) | QR lớn nhất vì **use case phổ biến nhất = đang ngồi cạnh nhau** (bạn bè gặp nhau → scan QR → join ngay). Copy link cho share online. 3 options cover 100% scenarios |
| Danh bạ search | Search bar + contact list từ điện thoại | Fallback khi không gặp trực tiếp. Search vì danh bạ có thể 500+ contacts — scroll là không khả thi |

**Hierarchy:** QR code (lớn nhất, center) > Share buttons > Search danh bạ
**Lý do QR > Link:** Mời quỹ nhóm thường xảy ra khi đang gặp nhau (ăn cơm, đi chơi) → QR nhanh hơn copy paste link
**Reference:** Revolut "Add member" — QR prominent, AirDrop-style

---

## S4a: Rút tiền — Nhập số tiền

**Mental model:** "Tao cần lấy tiền ra từ quỹ"

```
┌─────────────────────────┐
│ Zone 1: Header           │
│ Zone 2: Fund info card   │
│ Zone 3: Amount input     │
│ Zone 4: CTA              │
└─────────────────────────┘
```

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Header | "Rút tiền" (admin) / "Yêu cầu rút" (member) | Phân biệt role ngay từ title — admin rút trực tiếp, member phải request |
| Fund info card | Tên quỹ + số dư hiện tại | User cần biết quỹ còn bao nhiêu TRƯỚC KHI nhập số tiền. Prevent rút > số dư |
| Amount input | TextField + quick amount chips | Giống góp tiền — consistent pattern, user đã quen từ F3 |
| Lý do (member only) | TextField "Lý do rút tiền" | Admin cần biết tại sao member muốn rút để approve/reject. Bắt buộc cho member, ẩn cho admin |
| CTA | "Rút tiền" / "Gửi yêu cầu" | 1 CTA duy nhất, text khác theo role |

**Lý do copy layout từ Góp tiền:** Consistency — user đã góp 10 lần, não đã quen layout. Đổi layout cho rút = confusion. Chỉ đổi text + thêm field lý do.

---

## S4b: Rút tiền — Xác nhận

**Giống S3b (Xác nhận góp tiền)** — ItemList với thông tin giao dịch.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Fund info | Tên quỹ | Confirm đúng quỹ |
| Details | Số tiền, nguồn nhận (ví VSP), số dư quỹ sau rút | User cần verify TRƯỚC KHI auth. Không thể undo sau auth |
| CTA | "Xác nhận rút tiền" | Verb rõ ràng — "xác nhận" + "rút tiền" |

---

## S4c: Rút tiền — Kết quả

**Giống S3c (Kết quả góp tiền)** — FeedbackState component.

| State | Nội dung | Lý do |
|-------|----------|-------|
| success (admin) | "Rút tiền thành công" + số tiền + số dư còn lại | Admin rút ngay → kết quả ngay |
| pending (member) | "Đã gửi yêu cầu" + chờ admin duyệt | Member không rút trực tiếp — set expectation rõ |
| failed | "Rút tiền thất bại" + lý do + nút thử lại | Cho user biết tại sao fail + action tiếp |

---

## S5: Cài đặt quỹ

**Mental model:** "Tao muốn sửa thông tin hoặc rời/giải tán quỹ"

```
┌─────────────────────────┐
│ Zone 1: Header           │
│ Zone 2: Thông tin quỹ    │
│ Zone 3: Quyền riêng tư   │
│ Zone 4: Danger zone      │
└─────────────────────────┘
```

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Header | "Cài đặt" + back | Simple |
| Thông tin quỹ | Tên (editable), Mô tả (editable), Mục tiêu (editable) | Tap row → edit inline hoặc modal. Đặt lên đầu vì sửa info = action phổ biến nhất trong settings |
| Quyền riêng tư | Radio: Riêng tư / Công khai | Hiếm khi đổi nhưng cần có. Đặt giữa — không quan trọng bằng info, nhưng quan trọng hơn danger |
| Danger zone | Rời quỹ (member) / Giải tán quỹ (admin) | Đặt CUỐI CÙNG + màu destructive. iOS convention: destructive actions luôn ở bottom. Cần confirm dialog trước khi execute |

**Lý do tách admin/member view:** Admin thấy "Giải tán quỹ", member thấy "Rời quỹ". Không hiện action mà user không có quyền → reduce confusion.
**Reference:** iOS Settings style — clean rows, destructive ở bottom đỏ

---

## S6: Auth PIN (shared)

**Mental model:** "Xác nhận bằng PIN để hoàn tất giao dịch"

```
┌─────────────────────────┐
│ Zone 1: Title + context  │
│ Zone 2: PIN dots         │
│ Zone 3: Numpad           │
└─────────────────────────┘
```

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Title + context | "Nhập mã PIN" + "Góp 500.000 ₫ vào Du lịch Đà Lạt" | User cần biết đang xác nhận CÁI GÌ. Prevent xác nhận nhầm. Context từ flow trước truyền vào |
| PIN dots | 6 dots + error message | 6 dots = VSP standard. Error hiện dưới dots khi sai PIN |
| Numpad | 0-9 + Biometric icon + Delete | Biometric (Face/Touch ID) nếu device hỗ trợ + user đã bật. Delete = xoá số cuối |

**Lý do dùng shared screen:** Mọi flow cần auth (góp, rút, giải tán) đều dùng cùng 1 PIN screen. DRY — không duplicate UI. Chỉ khác context text.
**Reference:** Copy pattern từ `app/sinhloi/otp/page.tsx` nếu có

---

## Design Patterns (auto-save to memory)

| Pattern | Rule | Áp dụng |
|---------|------|---------|
| `pattern-fund-card` | Quỹ card trong list: tên + số dư + progress mini + avatars | S0 |
| `pattern-share-invite` | QR lớn > Copy link > Search danh bạ (vì use case gặp trực tiếp) | S2 |
| `pattern-mirror-flow` | Rút tiền = mirror layout của Góp tiền, chỉ đổi text | S4 |
| `pattern-settings-danger` | Destructive actions luôn ở bottom, màu đỏ, cần confirm | S5 |
| `pattern-shared-auth` | PIN/Bio dùng chung, nhận context text từ flow gọi | S6 |

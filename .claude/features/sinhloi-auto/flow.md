# Sinh lời tự động — User Flows

> **Author:** 🔍 Nate (UX Researcher)
> **Date:** 2026-03-22
> **Status:** Draft v1.0
> **Data ref:** `app/sinhloi/data.ts`

---

## Tổng quan

Feature "Sinh lời tự động" gồm 4 epic chính:
1. **Đăng ký sinh lời** — Kích hoạt tài khoản sinh lời
2. **Quản lý sinh lời** — Dashboard, lịch sử, lợi nhuận
3. **Nạp/Rút tiền** — Giao dịch nạp rút với xác thực
4. **Hủy đăng ký** — Tắt tính năng sinh lời

**Config từ data.ts:**
- Lãi suất: 4.5%/năm
- Số dư tối đa: 100.000.000đ
- Hạn mức rút/ngày: 30.000.000đ
- Hạn mức nạp/tháng: 100.000.000đ

---

## Epic 1 — Đăng ký Sinh lời

### Happy Path

```mermaid
flowchart TD
    A[🏠 Homepage] -->|Tap "Sinh lời"| B[📄 Product Intro]
    B -->|Tap "Kích hoạt ngay"| C{eKYC đã xong?}
    C -->|Chưa| D[⚠️ Dialog: Yêu cầu eKYC]
    D -->|Tap "Xác thực ngay"| E[🔐 eKYC Flow]
    E -->|Hoàn tất| B
    D -->|Tap "Để sau"| A
    C -->|Rồi| F[📋 Xác nhận kích hoạt]
    F -->|Hiển thị: Họ tên, SĐT, CCCD| F
    F -->|Tick checkbox 1: Điều khoản| F
    F -->|Tick checkbox 2: Chính sách| F
    F -->|Cả 2 checkbox ✅| G[🟢 Button "Kích hoạt" enabled]
    G -->|Tap "Kích hoạt"| H{Gửi OTP}
    H -->|Thành công| I[🔑 Nhập OTP]
    H -->|Lỗi mạng| J[⚠️ Toast: Không gửi được OTP]
    J -->|Retry| H
    I -->|OTP đúng| K{API kích hoạt}
    K -->|200 OK| L[✅ Kết quả: Thành công]
    K -->|Timeout| M[⏳ Kết quả: Đang xử lý]
    K -->|Error| N[❌ Kết quả: Thất bại]
    L -->|Tap "Về Dashboard"| O[📊 Dashboard Sinh lời]
    M -->|Tap "Về trang chủ"| A
    N -->|Tap "Thử lại"| F
    I -->|OTP sai| P[⚠️ Error: Sai OTP, nhập lại]
    P -->|Retry| I
    I -->|OTP hết hạn| Q[⚠️ "Hết hạn" + Gửi lại]
    Q -->|Tap "Gửi lại"| H
    I -->|Gửi lại quá 3 lần| R[🔒 "Thử lại sau 5 phút"]
```

### Phân nhánh: User đã kích hoạt

```mermaid
flowchart TD
    A[🏠 Homepage] -->|Tap "Sinh lời"| B{Đã kích hoạt?}
    B -->|Chưa| C[📄 Product Intro]
    B -->|Rồi| D[📊 Dashboard Sinh lời]
```

---

## Epic 2 — Quản lý Sinh lời (Dashboard)

### Dashboard chính

```mermaid
flowchart TD
    A[📊 Dashboard Sinh lời] --> B{Tab nào?}

    B -->|Tab "Sản phẩm"| C[💰 Tab Sản phẩm]
    C --> C1[Số dư + ẩn/hiện]
    C --> C2[Lãi suất X%/năm]
    C --> C3[Tiền lời hôm qua]
    C --> C4[Tổng tiền lời]
    C --> C5[Biểu đồ 7 ngày]
    C --> C6[🔘 Nạp tiền / Rút tiền]

    B -->|Tab "Quản lý"| D[⚙️ Tab Quản lý]
    D --> D1[📑 Điều khoản & hợp đồng]
    D --> D2[📜 Lịch sử giao dịch]
    D --> D3[📊 Tổng kết lợi nhuận]
    D --> D4[❌ Hủy đăng ký]

    C1 -->|Tap icon eye| E{Toggle ẩn/hiện}
    E -->|Hiện| F[Số dư: 10.831.048đ]
    E -->|Ẩn| G[Số dư: ••••••••]

    C6 -->|Tap "Nạp tiền"| H[💵 Epic 3: Nạp tiền]
    C6 -->|Tap "Rút tiền"| I[💵 Epic 3: Rút tiền]

    D1 -->|Tap| J[📄 Chi tiết hợp đồng]
    D2 -->|Tap| K[📜 Lịch sử giao dịch]
    D3 -->|Tap| L[📊 Tổng kết lợi nhuận]
    D4 -->|Tap| M[❌ Epic 4: Hủy đăng ký]
```

### Sub-flow: Lịch sử giao dịch

```mermaid
flowchart TD
    A[📜 Lịch sử giao dịch] --> B{Có dữ liệu?}
    B -->|Không| C[🫥 Empty state: "Chưa có giao dịch"]
    B -->|Có| D[📋 Danh sách giao dịch]

    D --> E[🔽 Bộ lọc]
    E --> E1[Filter loại: Tất cả / Lãi / Nạp / Rút]
    E --> E2[Filter thời gian: Calendar picker]
    E2 --> E3{Khoảng thời gian > 90 ngày?}
    E3 -->|Có| E4[⚠️ "Tối đa 90 ngày"]
    E3 -->|Không| E5[✅ Áp dụng filter]

    E5 --> F{Kết quả?}
    F -->|Có data| G[📋 Danh sách filtered]
    F -->|Không có| H[🫥 "Không tìm thấy giao dịch"]

    G -->|Tap 1 giao dịch| I[📄 Chi tiết giao dịch]
    I --> I1[Loại giao dịch]
    I --> I2[Số tiền]
    I --> I3[Ngày giờ]
    I --> I4[Trạng thái: Thành công / Đang xử lý / Thất bại]
    I --> I5[Mã giao dịch]

    D --> J{Scroll hết list?}
    J -->|Có thêm| K[⏳ Load thêm - infinite scroll]
    J -->|Hết data| L[Hiển thị footer]
```

### Sub-flow: Tổng kết lợi nhuận

```mermaid
flowchart TD
    A[📊 Tổng kết lợi nhuận] --> B[Chọn năm: 2026 / 2025]
    B --> C[📋 Danh sách theo tháng]
    C --> C1[Tháng X: +Y đ]
    C --> C2[Tháng đang chạy: ước tính flag]
    C --> C3[Tổng cả năm]

    A --> D{Có dữ liệu?}
    D -->|Không| E[🫥 Empty: "Chưa có dữ liệu lợi nhuận"]
    D -->|Có| C
```

---

## Epic 3 — Nạp/Rút tiền

### Flow Nạp tiền

```mermaid
flowchart TD
    A[💵 Nạp tiền] --> B[Tab component: Nạp / Rút]
    B -->|Tab "Nạp"| C[📝 Nhập số tiền]

    C --> C1[Hiển thị: Số dư ví hiện tại]
    C --> C2[Input số tiền + Quick chips: 500K, 1M, 5M, 10M]
    C --> C3[Ước tính lãi nhận được]

    C2 -->|Nhập xong| D{Validate}
    D -->|Số tiền = 0| E1[⚠️ "Vui lòng nhập số tiền"]
    D -->|Số tiền > Số dư ví| E2[⚠️ "Số dư ví không đủ"]
    D -->|Tổng SL > 100M| E3[⚠️ "Vượt hạn mức tối đa 100.000.000đ"]
    D -->|Hợp lệ| F[🟢 Button "Tiếp tục" enabled]

    F -->|Tap "Tiếp tục"| G[📋 Xác nhận nạp]
    G --> G1[Số tiền nạp]
    G --> G2[Từ: Ví V-Smart Pay]
    G --> G3[Lãi ước tính/ngày]
    G --> G4[Lãi ước tính/tháng]

    G -->|Tap "Xác nhận"| H{Phương thức xác thực}
    H -->|Biometric khả dụng| I1[🔐 Xác thực Biometric]
    H -->|Không có biometric| I2[🔐 Nhập OTP]

    I1 -->|Thành công| J{API Nạp tiền}
    I1 -->|Thất bại| I2
    I2 -->|OTP đúng| J
    I2 -->|OTP sai| K[⚠️ Sai OTP → retry]
    K --> I2

    J -->|200 OK| L[✅ Kết quả: Nạp thành công]
    J -->|Processing| M[⏳ Kết quả: Đang xử lý]
    J -->|Error| N[❌ Kết quả: Thất bại]

    L --> L1[Số tiền nạp]
    L --> L2[Số dư mới]
    L --> L3[Thời gian]
    L -->|Tap "Về Dashboard"| O[📊 Dashboard]
    L -->|Tap "Nạp thêm"| C

    M -->|Tap "Về trang chủ"| P[🏠 Homepage]
    N -->|Tap "Thử lại"| C
    N -->|Tap "Về Dashboard"| O
```

### Flow Rút tiền

```mermaid
flowchart TD
    A[💵 Rút tiền] --> B[Tab component: Nạp / Rút]
    B -->|Tab "Rút"| C[📝 Nhập số tiền rút]

    C --> C1[Hiển thị: Số dư sinh lời hiện tại]
    C --> C2[Input số tiền + Quick chips]
    C --> C3[Ước tính lãi bị giảm]

    C2 -->|Nhập xong| D{Validate}
    D -->|Số tiền = 0| E1[⚠️ "Vui lòng nhập số tiền"]
    D -->|Số tiền > Số dư SL| E2[⚠️ "Số dư sinh lời không đủ"]
    D -->|Số tiền > 30M/ngày| E3[⚠️ "Vượt hạn mức rút 30.000.000đ/ngày"]
    D -->|Hợp lệ| F[🟢 Button "Tiếp tục" enabled]

    F -->|Tap "Tiếp tục"| G[📋 Xác nhận rút]
    G --> G1[Số tiền rút]
    G --> G2[Về: Ví V-Smart Pay]
    G --> G3[Lãi bị giảm ước tính/ngày]

    G -->|Tap "Xác nhận"| H{Phương thức xác thực}
    H -->|Biometric| I1[🔐 Biometric]
    H -->|OTP| I2[🔐 OTP]

    I1 -->|Thành công| J{API Rút tiền}
    I1 -->|Thất bại| I2
    I2 -->|OTP đúng| J
    I2 -->|OTP sai| K[⚠️ Sai OTP → retry]
    K --> I2

    J -->|200 OK| L[✅ Rút thành công]
    J -->|Processing| M[⏳ Đang xử lý]
    J -->|Error| N[❌ Thất bại]

    L --> L1[Số tiền rút]
    L --> L2[Số dư SL còn lại]
    L --> L3[Số dư ví mới]
    L -->|Tap "Về Dashboard"| O[📊 Dashboard]

    M -->|Tap "Về trang chủ"| P[🏠 Homepage]
    N -->|Tap "Thử lại"| C
```

### Switch Nạp/Rút

```mermaid
flowchart TD
    A[Tab Nạp đang active] -->|Tap tab "Rút"| B{Đã nhập số tiền?}
    B -->|Có| C[⚠️ Reset input, chuyển tab]
    B -->|Chưa| D[Chuyển tab bình thường]
    D --> E[Tab Rút active]
    C --> E
```

---

## Epic 4 — Hủy đăng ký

```mermaid
flowchart TD
    A[⚙️ Tab Quản lý] -->|Tap "Hủy đăng ký"| B{Số dư SL > 0?}

    B -->|Có| C[⚠️ Dialog: "Vui lòng rút hết tiền trước khi hủy"]
    C -->|Tap "Rút tiền"| D[💵 Epic 3: Rút tiền - prefill full balance]
    C -->|Tap "Đóng"| A

    B -->|Không - Số dư = 0| E[📋 Xác nhận hủy đăng ký]
    E --> E1[⚠️ Warning: "Sau khi hủy, tiền lời sẽ ngừng được tính"]
    E --> E2[Thông tin: Tổng lợi nhuận đã nhận]

    E -->|Tap "Xác nhận hủy"| F{Gửi OTP}
    F -->|Thành công| G[🔑 Nhập OTP]
    F -->|Lỗi| H[⚠️ Toast: Lỗi gửi OTP]
    H -->|Retry| F

    G -->|OTP đúng| I{API Hủy}
    I -->|200 OK| J[✅ Hủy thành công]
    I -->|Error| K[❌ Hủy thất bại]

    J --> J1["Tài khoản sinh lời đã được hủy"]
    J -->|Tap "Về trang chủ"| L[🏠 Homepage]

    K -->|Tap "Thử lại"| E
    K -->|Tap "Về trang chủ"| L

    G -->|OTP sai| M[⚠️ Sai OTP]
    M --> G
    G -->|Hết hạn| N[Gửi lại OTP]
    N --> F
```

### Flow hủy khi có pending transactions

```mermaid
flowchart TD
    A[Tap "Hủy đăng ký"] --> B{Có giao dịch đang xử lý?}
    B -->|Có| C[⚠️ Dialog: "Có giao dịch đang xử lý, vui lòng đợi hoàn tất"]
    C -->|Tap "Xem giao dịch"| D[📜 Lịch sử - filter Đang xử lý]
    C -->|Tap "Đóng"| E[Quay lại Dashboard]
    B -->|Không| F[Tiếp tục flow hủy bình thường]
```

---

## 5. Edge Cases Matrix

| # | Edge Case | Epic | Screen | Expected Behavior |
|---|-----------|------|--------|-------------------|
| **Đăng ký** | | | | |
| 1 | User chưa eKYC | 1 | Product Intro → Confirm | Block, hiển thị Dialog yêu cầu eKYC trước |
| 2 | User đã kích hoạt rồi | 1 | Entry point | Skip intro, vào thẳng Dashboard |
| 3 | OTP sai 3 lần | 1 | OTP Screen | Hiển thị "Thử lại sau 5 phút", disable input |
| 4 | OTP hết hạn | 1 | OTP Screen | Hiển thị "Hết hạn" + button "Gửi lại" |
| 5 | Gửi lại OTP quá limit | 1 | OTP Screen | "Thử lại sau X phút" |
| 6 | API timeout kích hoạt | 1 | Result | Hiển thị "Đang xử lý", hướng dẫn kiểm tra sau |
| 7 | Mất mạng khi gửi OTP | 1 | OTP Screen | Toast lỗi mạng + retry |
| 8 | Double tap button kích hoạt | 1 | Confirm | Disable button sau tap đầu tiên |
| 9 | Back button giữa flow OTP | 1 | OTP Screen | Quay về Confirm, OTP session vẫn valid trong 60s |
| 10 | App kill giữa flow đăng ký | 1 | Bất kỳ | Restart flow từ đầu, không resume |
| **Dashboard** | | | | |
| 11 | Dashboard load lần đầu | 2 | Dashboard | Skeleton loading → data |
| 12 | API lỗi khi load Dashboard | 2 | Dashboard | Hiển thị lỗi + button "Thử lại" |
| 13 | Số dư = 0 lần đầu | 2 | Tab Sản phẩm | Hiển thị "0đ", prompt "Nạp tiền ngay" |
| 14 | Pull to refresh | 2 | Dashboard | Refresh data, hiển thị loading indicator |
| 15 | Ẩn/hiện số dư persist | 2 | Tab Sản phẩm | Trạng thái ẩn/hiện lưu local, persist qua sessions |
| 16 | Lịch sử trống | 2 | Lịch sử GD | FeedbackState: "Chưa có giao dịch nào" |
| 17 | Filter không có kết quả | 2 | Lịch sử GD | "Không tìm thấy giao dịch phù hợp" |
| 18 | Calendar range > 90 ngày | 2 | Lịch sử GD | Block, hiển thị "Tối đa 90 ngày" |
| 19 | Infinite scroll hết data | 2 | Lịch sử GD | Footer text, không load thêm |
| 20 | Lợi nhuận chưa có data | 2 | Tổng kết LN | Empty state: "Chưa có dữ liệu lợi nhuận" |
| 21 | Tháng hiện tại = ước tính | 2 | Tổng kết LN | Flag "Ước tính" bên cạnh số tiền (isEstimate: true) |
| **Nạp tiền** | | | | |
| 22 | Số tiền = 0 | 3 | Input nạp | Button disabled, không hiển thị error |
| 23 | Số tiền > số dư ví | 3 | Input nạp | Inline error: "Số dư ví không đủ" |
| 24 | Tổng SL vượt 100M | 3 | Input nạp | Inline error: "Vượt hạn mức tối đa 100.000.000đ" |
| 25 | Nhập rồi xóa hết | 3 | Input nạp | Quay về empty state, button disabled |
| 26 | Tap quick chip | 3 | Input nạp | Fill số tiền, auto validate |
| 27 | Quick chip > balance | 3 | Input nạp | Fill nhưng hiện error ngay |
| 28 | Lãi suất thay đổi giữa flow | 3 | Confirm nạp | Warning: "Lãi suất đã cập nhật", hiện lãi suất mới |
| 29 | Biometric fail | 3 | Auth | Fallback sang OTP |
| 30 | Biometric chưa đăng ký | 3 | Auth | Chỉ hiện OTP, không có option biometric |
| 31 | API nạp timeout | 3 | Result | "Đang xử lý", hướng dẫn kiểm tra lịch sử |
| 32 | Nạp thành công → nạp thêm | 3 | Result success | Tap "Nạp thêm" → quay lại input, số dư đã cập nhật |
| 33 | Network lost giữa confirm | 3 | Confirm | Dialog offline, retry khi có mạng |
| **Rút tiền** | | | | |
| 34 | Số tiền = 0 | 3 | Input rút | Button disabled |
| 35 | Số tiền > số dư SL | 3 | Input rút | Inline error: "Số dư sinh lời không đủ" |
| 36 | Số tiền > 30M/ngày | 3 | Input rút | Inline error: "Vượt hạn mức rút 30.000.000đ/ngày" |
| 37 | Đã rút gần hết limit ngày | 3 | Input rút | Hiển thị hạn mức còn lại |
| 38 | Rút khi có pending deposit | 3 | Input rút | Số dư chưa tính pending, rút từ confirmed balance |
| 39 | API rút timeout | 3 | Result | "Đang xử lý" |
| 40 | Switch tab Nạp↔Rút khi đang nhập | 3 | Tab Nạp/Rút | Reset input, chuyển tab |
| **Hủy đăng ký** | | | | |
| 41 | Hủy khi số dư > 0 | 4 | Dialog | Block: "Vui lòng rút hết tiền trước" + link rút tiền |
| 42 | Hủy khi có GD pending | 4 | Dialog | Block: "Có giao dịch đang xử lý, vui lòng đợi" |
| 43 | Hủy thành công | 4 | Result | Xóa trạng thái SL, quay về Homepage |
| 44 | API hủy timeout | 4 | Result | "Đang xử lý, kiểm tra lại sau" |
| 45 | User kích hoạt lại sau hủy | 1 | Product Intro | Cho phép đăng ký lại bình thường |
| **Global** | | | | |
| 46 | Deep link vào Dashboard | — | Dashboard | Load bình thường nếu đã kích hoạt; redirect Product Intro nếu chưa |
| 47 | Deep link vào Nạp tiền | — | Nạp tiền | Load bình thường nếu đã kích hoạt; redirect thích hợp nếu chưa |
| 48 | Mất mạng bất kỳ lúc nào | — | Mọi screen | Toast offline, retry khi có mạng |
| 49 | Session hết hạn giữa flow | — | Mọi screen | Dialog "Phiên đăng nhập hết hạn" → Login |
| 50 | Currency formatting | — | Mọi input/display | Luôn dùng locale vi-VN: `1.000.000đ` |
| 51 | Dark mode | — | Mọi screen | Tất cả dùng semantic tokens, không raw color |
| 52 | Accessibility | — | Mọi screen | VoiceOver đọc đúng thứ tự, contrast >= 4.5:1 |

---

## 6. State Transitions

### Screen: Product Intro
| State | Trigger | Next State |
|-------|---------|------------|
| `idle` | Load trang | `loaded` |
| `loaded` | Tap "Kích hoạt ngay" | Check eKYC |
| `loaded` | User chưa eKYC | `ekyc_required` (Dialog) |
| `ekyc_required` | Tap "Xác thực ngay" | Navigate eKYC |
| `ekyc_required` | Tap "Để sau" | Navigate Home |

### Screen: Xác nhận kích hoạt
| State | Trigger | Next State |
|-------|---------|------------|
| `initial` | Load | Hiển thị info (readonly) |
| `checkbox_partial` | Tick 1 checkbox | Button vẫn disabled |
| `checkbox_complete` | Tick cả 2 checkbox | `ready` → Button enabled |
| `ready` | Tap "Kích hoạt" | `loading` |
| `loading` | API gửi OTP OK | Navigate OTP Screen |
| `loading` | API gửi OTP fail | `error` → Toast + quay về `ready` |

### Screen: OTP
| State | Trigger | Next State |
|-------|---------|------------|
| `waiting` | OTP sent, countdown chạy | Chờ user nhập |
| `entering` | User nhập partial | Chờ đủ 6 ký tự |
| `verifying` | Nhập đủ, auto submit | `loading` |
| `loading` | API verify | `success` / `error` |
| `success` | OTP đúng | Navigate Result |
| `error` | OTP sai | Clear input, hiện error, `waiting` |
| `expired` | Countdown = 0 | Hiện "Gửi lại", disable input |
| `resending` | Tap "Gửi lại" | Reset countdown, `waiting` |
| `locked` | Resend > 3 lần | "Thử lại sau 5 phút" |

### Screen: Dashboard (Tab Sản phẩm)
| State | Trigger | Next State |
|-------|---------|------------|
| `loading` | Load trang | Skeleton |
| `loaded` | API trả data | Hiển thị data |
| `error` | API fail | Error state + Retry |
| `balance_visible` | Tap eye icon | `balance_hidden` |
| `balance_hidden` | Tap eye icon | `balance_visible` |
| `refreshing` | Pull to refresh | Re-fetch → `loaded` |

### Screen: Input Nạp/Rút tiền
| State | Trigger | Next State |
|-------|---------|------------|
| `empty` | Load | Button disabled, no error |
| `typing` | Nhập số | Validate realtime |
| `valid` | Pass validation | Button enabled, hiện ước tính lãi |
| `invalid` | Fail validation | Button disabled, hiện inline error |
| `loading` | Tap "Tiếp tục" | Navigate Confirm |

### Screen: Confirm Nạp/Rút
| State | Trigger | Next State |
|-------|---------|------------|
| `loaded` | Hiện chi tiết | Ready |
| `confirming` | Tap "Xác nhận" | Navigate Auth |
| `stale` | Ở quá lâu (>5 phút) | Re-fetch data, check rate change |

### Screen: Result
| State | Trigger | Next State |
|-------|---------|------------|
| `success` | API 200 | Hiện chi tiết + actions |
| `processing` | API pending | Hiện "Đang xử lý" + "Về trang chủ" |
| `failed` | API error | Hiện lỗi + "Thử lại" / "Về trang chủ" |

### Screen: Hủy đăng ký
| State | Trigger | Next State |
|-------|---------|------------|
| `check_balance` | Tap "Hủy đăng ký" | Check số dư |
| `blocked_balance` | Số dư > 0 | Dialog rút tiền trước |
| `blocked_pending` | Có GD pending | Dialog chờ GD hoàn tất |
| `confirm` | Số dư = 0, không pending | Hiện warning + confirm |
| `otp` | Tap "Xác nhận hủy" | OTP flow |
| `result` | API trả kết quả | Success / Failed |

---

## Ghi chú thiết kế

### Nguyên tắc áp dụng (từ Design Principles)
- **Progressive Disclosure (P5):** Product Intro chỉ show highlights. Chi tiết điều khoản ở Confirm screen.
- **One primary action per screen (P4):** Mỗi screen chỉ 1 button primary (Kích hoạt / Tiếp tục / Xác nhận).
- **Clean & Premium (P1):** Không border giữa sections. Dùng `pt-[32px]` spacing.
- **Proximity (P7):** Ước tính lãi phải ở ngay dưới input số tiền, không tách xa.

### Data constraints (từ data.ts)
- `maxBalance`: 100.000.000đ — validate tổng không vượt
- `dailyWithdrawLimit`: 30.000.000đ — validate rút/ngày
- `monthlyDepositLimit`: 100.000.000đ — validate nạp/tháng
- Transaction types: `interest` | `deposit` | `withdrawal`
- Transaction status: `success` | `pending` | `failed`
- Quick amounts: 500K, 1M, 5M, 10M

---

*Nate — UX Researcher | V-Smart Pay Team*

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]

# Quỹ Nhóm — Flow Inventory (v2)

## Actors
- **Admin**: người tạo quỹ, toàn quyền (rút tiền, remove member, giải tán, cài đặt)
- **Member**: người được mời, góp tiền + yêu cầu rút

---

## F0: Danh sách quỹ
```
Entry (từ tab Dịch vụ hoặc Home) → List quỹ đã tham gia → Tap → Dashboard
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S0: Danh sách quỹ | `/quy-nhom/list` | ❌ | default, empty, loading |

**Edge cases:**
- [ ] User chưa tham gia quỹ nào → empty state + CTA tạo
- [ ] Quỹ đã giải tán → hiện tag "Đã đóng" hay ẩn?
- [ ] Max bao nhiêu quỹ/user?

---

## F1: Tạo quỹ
```
List → [+] Tạo quỹ → Nhập tên + mô tả → Set mục tiêu (optional) → Chọn privacy → Tạo → Dashboard (empty)
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S1: Form tạo quỹ | `/quy-nhom/tao` | ✅ done | default, filled |
| → Dashboard empty | `/quy-nhom/dashboard?state=empty` | ✅ done | empty |

**Edge cases:**
- [ ] Tên trùng với quỹ đã có
- [ ] Tên quá dài (max 50 chars?)
- [ ] User chưa eKYC → block?
- [ ] Max quỹ tạo: 2 (MoMo rule)

---

## F2: Mời bạn
```
Dashboard tab Thành viên → Mời → Chọn từ danh bạ / QR / Link → Gửi → Chờ accept
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S2: Mời thành viên | `/quy-nhom/moi` | ❌ | search, invite-sent, qr-share, link-copy |

**Edge cases:**
- [ ] Mời người chưa có VSP → gửi SMS/link download
- [ ] Mời người đã trong quỹ → báo "đã tham gia"
- [ ] Max members: 200
- [ ] Huỷ lời mời đã gửi
- [ ] Người được mời từ chối

---

## F3: Góp tiền
```
Dashboard → Góp tiền → Nhập số tiền → Confirm → Auth → Success/Fail
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S3a: Nhập số tiền | `/quy-nhom/gop` | ✅ done | input |
| S3b: Xác nhận | `/quy-nhom/gop?state=confirm` | ✅ done | confirm |
| S3c: Kết quả | `/quy-nhom/gop?state=success` | ✅ done | success, failed |

**Edge cases:**
- [ ] Số dư ví không đủ
- [ ] Số tiền < 1.000 ₫
- [ ] Số tiền khiến quỹ > 25.000.000 ₫
- [ ] Góp khi quỹ đã đạt mục tiêu
- [ ] Mất mạng giữa chừng
- [ ] Auth sai PIN 3 lần

---

## F4: Rút tiền
```
Admin: Dashboard → Rút tiền → Nhập số tiền → Confirm → Auth → Success/Fail
Member: Dashboard → Yêu cầu rút → Nhập số tiền + lý do → Gửi → Chờ admin duyệt
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S4a: Nhập số tiền rút | `/quy-nhom/rut` | ❌ | input-admin, input-member |
| S4b: Xác nhận | `/quy-nhom/rut?state=confirm` | ❌ | confirm |
| S4c: Kết quả | `/quy-nhom/rut?state=success` | ❌ | success, failed, pending (member) |

**Edge cases:**
- [ ] Rút > số dư quỹ
- [ ] Rút khi quỹ = 0
- [ ] Member request → admin approve/reject (notification)
- [ ] Admin không phản hồi (timeout 7 ngày?)

---

## F5: Cài đặt quỹ
```
Dashboard → Settings icon → Sửa tên/mô tả/mục tiêu/privacy → Save
Includes: Remove member (dialog), Rời quỹ (dialog), Giải tán (dialog)
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S5: Settings | `/quy-nhom/settings` | ❌ | admin-view, member-view |

**Sub-actions (dialogs, không cần screen riêng):**
- Remove member → confirm dialog → done
- Rời quỹ (member) → confirm dialog → done
- Giải tán quỹ (admin) → confirm dialog → hoàn tiền → done
- Chuyển quyền admin → chọn member → confirm → done

**Edge cases:**
- [ ] Chỉ admin sửa được
- [ ] Đổi privacy public → private
- [ ] Remove member có tiền → hoàn lại?
- [ ] Admin rời → chuyển quyền cho ai?
- [ ] Giải tán quỹ còn tiền → hoàn theo tỷ lệ góp
- [ ] Quỹ chỉ còn 1 người → tự giải tán?

---

## F6: Auth (shared)
```
Bất kỳ action nào cần xác thực → PIN → (hoặc Biometric) → pass/fail
```
| Screen | Route | Status | States |
|--------|-------|--------|--------|
| S6: Auth PIN/Bio | shared (`/quy-nhom/auth`) | ❌ | pin-input, wrong-pin, locked, biometric |

**Edge cases:**
- [ ] Sai PIN 3 lần → locked 30 phút
- [ ] Biometric fail → fallback PIN
- [ ] Device không hỗ trợ biometric

---

## Summary

| Flow | Screens | Done | Remaining |
|------|---------|------|-----------|
| F0: Danh sách quỹ | 1 | 0 | 1 |
| F1: Tạo quỹ | 2 | 2 | 0 |
| F2: Mời bạn | 1 | 0 | 1 |
| F3: Góp tiền | 3 | 3 | 0 |
| F4: Rút tiền | 3 | 0 | 3 |
| F5: Cài đặt | 1 | 0 | 1 |
| F6: Auth (shared) | 1 | 0 | 1 |
| Dashboard (3 tabs) | 1 | 1 | 0 |
| **TOTAL** | **13** | **6** | **7** |

**Edge cases: 28**
**Screens cần build: 7** (list, mời, rút×3, settings, auth)

# Wallet Entrypoint Research — Context Export

> **Conversation date:** 29/04/2026
> **Project:** VSP × XanhSM embedded wallet
> **Output:** `docs/wallet-entrypoint-research.html`
> **Author:** Huy Kiều · huykieu.design@gmail.com

---

## 1. Bối cảnh task

User đang làm Product Design cho **VSP × XanhSM embedded wallet**. Đã có sẵn:
- **Slide Product** (`/Users/huykieu/Downloads/VSP x GSM.pdf`, 8 trang) — market research GoPay/GrabPay, service tree, scope, onboarding flow.
- **Demo Vercel** (`https://xanh-vsp.vercel.app/xanhsm-vsp`) — 1 epic 10 state cho flow embedded wallet (claim Kỷ Sự Xanh → PIN → T&C → 3-step wallet progress). Thiếu home XanhSM với wallet entrypoint.
- **5 ảnh competitor** chụp từ Mobbin (Gojek x2, Grab, Careem x2).
- **1 ảnh home XanhSM hiện tại** (chụp từ device user).

---

## 2. Câu hỏi cốt lõi

> **Khi user mở app XanhSM, ví VSP sẽ xuất hiện ở đâu trên màn hình?**

Đây là điểm chưa ai trả lời, quyết định adoption rate trong 90 ngày đầu launch.

---

## 3. Scope & Constraint chốt với user

### Scope
- Entry point của VSP trên XanhSM
- UI Green wallet 1.0
- **Chỉ User flow** (không cover Merchant / Driver)

### Constraint
- 5 ảnh competitor đã có (không research thêm app khác)
- Format output: HTML để paste Notion
- Tone: tiếng Việt thuần, văn phong Product Designer (Steve Jobs–style: ngắn, sắc, dứt khoát)
- Không tie vào campaign ngắn hạn (Kỷ Sự Xanh / Green Race)

---

## 4. Lộ trình iteration (sai → đúng)

| Vòng | User feedback | Sửa gì |
|---|---|---|
| 1 | Ban đầu tôi viết research super-app entrypoint chung chung | Sai scope — đổi sang research wallet entrypoint cụ thể |
| 2 | "Section 'Vì sao research này tồn tại' không cần lắm" | Bỏ section dài, thêm Mục tiêu ngắn |
| 3 | "Gom heuristics + audit + principles lại" | Gom 3 section thành 1 |
| 4 | "Chỉ cần chốt ở các option" | Bỏ Open questions + Next steps + Appendix dài |
| 5 | "Viết HTML cho Notion" | Convert MD → HTML |
| 6 | "Ngôn ngữ AI quá, thiếu mục tiêu, 'Out of scope' liệt kê thừa" | Rewrite tone, bỏ liệt kê thừa, thêm Mục tiêu |
| 7 | "Tone tiếng Việt thuần, kể chuyện hơn, không matrix A/B/C" | Rewrite phần đối thủ kể chuyện |
| 8 | "Bỏ ASCII layout, thay hình thật" | Copy 5 ảnh + home XanhSM vào `docs/img/`, embed |
| 9 | "Đối thủ làm gì show dạng bảng. Phân tích deep hơn (gamification → motivation user funnel)" | Đổi 4 đoạn → bảng compact + thêm phần phân tích phễu adoption |
| 10 | "Đừng chế claim về Gojek/Grab user base" | Bỏ claim không có cơ sở, chỉ dùng framework + đọc từ ảnh |
| 11 | "Visualize phễu, tóm gọn, văn phong CEO/Steve Jobs hiểu được" | Convert phễu thành journey map 4 stage |
| 12 | "Sao dùng từ 'Vũ khí UI'? Viết đúng tên UI component. Activation motivation = claim cây xanh. Habit Loop = Careem topup tag" | Sửa tên column thành "UI Pattern" / "Tham khảo", dùng tên component chuẩn (Service tile, Onboarding banner, Wallet hub, Top-up shortcut tag), swap First Use ↔ Habit Loop |
| 13 | "Bỏ UI ảnh vào trong bảng đối thủ" | Embed thumbnail vào bảng |
| 14 | "Đổi Gojek (RpO) → Gojek 2026, bỏ Gojek (GoPay), bỏ Careem Pay cell" | Bảng còn 3 row |
| 15 | "Phần Scope/Vấn đề thiếu chuyên nghiệp. Viết theo cấu trúc 'as a user / as a product', vai trò Product Design" | Rewrite thành PRD-lite: Bối cảnh → User Stories → Mục tiêu → Constraint |

---

## 5. Cấu trúc cuối cùng của doc

```
1. Bối cảnh — 1 đoạn + ảnh home XanhSM
2. User Stories — bảng 4 row (As a XanhSM user / user mới / Product / Design)
3. Mục tiêu thiết kế — 4 bullet đo được
4. Constraint thiết kế — 4 ràng buộc bắt buộc
5. Đối thủ làm gì — bảng có thumbnail (Gojek 2026, Grab, Careem Top-up)
6. Tại sao họ làm vậy — Journey map 4 stage (Awareness / Activation / First Use / Habit Loop)
   ├── Phễu user (visual bar)
   ├── User nghĩ gì
   ├── Khoảnh khắc
   ├── Cảm xúc (emoji)
   ├── Động lực (Activation = claim cây xanh)
   ├── UI Pattern (Service tile / Onboarding banner / Wallet hub / Top-up shortcut tag)
   └── Tham khảo (Careem / Grab / Gojek / Careem variant)
7. Đề xuất cho XanhSM — 3 state + lý do
8. Câu hỏi cần Product trả lời — 3 câu cụ thể
```

---

## 6. Bài học rút ra (lưu cho future task)

### Lỗi AI hay mắc khi viết research doc
1. **Liệt kê thừa "Out of scope"** — nếu user đã nói "chỉ X" thì không cần list những thứ KHÔNG có.
2. **Tone academic** — "Lens", "Pattern decomposition", "adoption stage mapping" → người Việt không nói thế.
3. **Matrix mọi thứ** — pattern A/B/C/D/E + state S0–S5 + Phase 1/2/3 → reader mệt.
4. **Tiếng Anh chèn lung tung** — "Daily before monthly", "One entrypoint two states" → giữ tiếng Việt thuần.
5. **"Open questions" / "Decision options A/B/C"** — format template, không phải cách Vietnamese designer kết luận.
6. **Chế claim** — "Gojek có 100M users" không có evidence → chỉ dùng framework chung + đọc từ ảnh.

### Cách viết đúng (Product Design VN style)
- **PRD-lite header**: Bối cảnh → User Stories → Mục tiêu → Constraint
- **User Stories format**: `As a [persona], tôi muốn [behavior], để [outcome]`
- **Steve Jobs style**: ngắn, sắc, mỗi câu một ý, có conclusion dứt khoát
- **Visualize**: bảng + journey map + thumbnail trong bảng > đoạn văn dài
- **Tên component đúng**: Service tile, Onboarding banner, Wallet hub, Top-up shortcut tag (không tự chế "Pay cell", "Vũ khí UI")

### Cấu trúc Journey Map chuẩn
| | Stage 1 | Stage 2 | Stage 3 | Stage 4 |
|---|---|---|---|---|
| Phễu user (%) | 100% | 40% | 20% | 10% |
| User nghĩ gì | "..." | "..." | "..." | "..." |
| Khoảnh khắc | trigger 1 | trigger 2 | trigger 3 | trigger 4 |
| Cảm xúc | 🤔 | 🤨 | 😊 | 😌 |
| Động lực | ... | tiền/reward | ... | ... |
| UI Pattern | tên component | tên component | tên component | tên component |
| Tham khảo | Careem | Grab | Gojek | Careem variant |

---

## 7. Files liên quan

```
/Users/huykieu/Documents/vsp-ui/
├── docs/
│   ├── wallet-entrypoint-research.html  ← FINAL DOC
│   ├── wallet-entrypoint-context.md     ← THIS FILE (context export)
│   └── img/wallet-entrypoint/
│       ├── gojek-rpo.png         (Gojek 2026 wallet hub)
│       ├── gojek-gopay.png       (variant — không dùng nữa)
│       ├── grab.png              (Grab activate row + Finance tab)
│       ├── careem-paycell.png    (variant — không dùng nữa)
│       ├── careem-topup.png      (Careem top-up shortcut)
│       └── xanhsm-home.png       (Home XanhSM hiện tại)
└── ...
```

---

## 8. Source tham khảo

- **Slide Product** "V-Smart Pay và GSM" (8 trang): Market research, Service tree, Scope flow VSP × GSM, Onboarding flow.
- **Demo Vercel**: `xanh-vsp.vercel.app/xanhsm-vsp` — 10 state hiện có, KHÔNG cover home entrypoint.
- **Mobbin**: 5 ảnh ride-hailing entrypoint (Gojek 2026 RpO, Gojek GoPay, Grab Activate row, Careem Pay cell, Careem Top up shortcut).
- **XanhSM home screenshot**: 29/04/2026, device user.

---

## 9. Câu hỏi cần Product trả lời (open ở doc cuối)

1. Khi user đã activate, có cần thêm tab "Ví" trong bottom nav như Grab Finance không, hay Wallet Hub trên home là đủ? Nếu có tab riêng, cái nào trong 4 tab hiện tại sẽ bị thay (vì bottom nav không thể quá 5 tab cộng floating Trophy)?
2. Câu mời ở State 1 ("nhận 50.000₫") có ngân sách marketing thực không, hay chỉ là placeholder? Nếu không có incentive, message sẽ phải đổi hướng — ví dụ "Thanh toán nhanh hơn 30%".
3. Khi user thanh toán cuốc xe mà ví VSP balance = 0, flow xử lý ra sao — fall back sang tiền mặt, hay block và bắt top up trước? Việc này ảnh hưởng tới logic State 3 (balance thấp).

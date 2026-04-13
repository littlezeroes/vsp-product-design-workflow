---
name: ia-spec-style
description: Style guide cho V-Smart Pay IA Specification — tone, format, terminology
user-invocable: false
---

# V-Smart Pay IA Spec — Style Guide

## Tone & Voice
- **Executive-ready**: Quyết đoán, sắc bén, tự tin. Không mơ hồ, không lan man.
- **Decision-driven**: Mỗi section phải dẫn đến 1 quyết định hoặc kết luận rõ ràng.
- **Premium feel**: Viết như Staff Principal Designer trình bày cho C-level.
- Câu ngắn. Mỗi paragraph tối đa 3 câu. Ưu tiên bảng + bullet hơn prose.

## Ngôn ngữ
- Tiếng Việt **có dấu đầy đủ** (Nguyễn, không phải Nguyen).
- **Không viết tắt** tiếng Việt (Chuyển tiền, không phải CT; Giai đoạn, không phải GĐ; Quý 3, không phải Q3).
- **Thuật ngữ chuyên ngành giữ tiếng Anh**: progressive disclosure, behavioral graduation, feature flag, cross-sell, fallback, rage tap, widget, quick actions, A/B test, deep link, MATU, RWA, BNPL, mental model.
- Không dùng "Financial OS" trừ blockquote tầm nhìn.

## Format HTML
- Body: Georgia serif, max-width 720px, trắng đen.
- Heading: -apple-system sans-serif, font-weight 700-800.
- Table: sans-serif 13px, uppercase header, hover row.
- Blockquote: border-left 3px solid #111, font-weight 600 — dùng cho triết lý thiết kế.
- Callout: bg #f8f8f8, border-left 3px solid #111 — dùng cho quy tắc/fallback.
- Wireframe: img trong .frame-border (rounded-20px, border 2px solid #111). Không iframe.
- Ảnh đối thủ: .comp-gallery flex, .comp-card width 110px, rounded-14px.
- Nav evolution: .nav-evo styled rows, .nav-tab.new = bg #111 text #fff.

## Cấu trúc 11 sections (v3.1)
1. Executive Summary — vision blockquote + 4 decisions table + nav diagram
2. Bối cảnh kinh doanh — 3 trụ cột + ràng buộc
3. Nghiên cứu người dùng — JTBD 3 jobs + Journey Map 3 modes
4. Phân tích hiện trạng — bảng 4 tab + pain points + screenshot placeholder
5. Phân tích cạnh tranh — Market → Gap VN → Current Problem → VSP Premium Fit + ảnh gallery
6. Kiến trúc đề xuất — 5 Core Principles + nav evolution + Home 70/30 + RWA widget + IA tree
7. Kế hoạch triển khai — 3 phases + behavioral graduation + fallback mỗi phase
8. Wireframe — ảnh tĩnh wireframe + annotation ngắn
9. Chỉ số thành công — MATU + per-tab impact + guardrails
10. Triển khai & Rủi ro — feature flag + risk register
11. Phụ lục — glossary 6 terms

## Quy tắc nội dung
- Trang chủ = TRẠNG THÁI. Tab = HÀNH ĐỘNG. Không lặp.
- Tab Tài chính: không có thẻ tổng tài sản (đã có widget Trang chủ). Đi thẳng product cards.
- Số dư ví (Trang chủ) tách biệt hoàn toàn với Tài sản đầu tư (widget + tab).
- Widget Thanh toán: mẫu OKX (outer grey container + white header + 2-col white cards).
- RWA widget: Giai đoạn 1 = teaser trong thẻ ví. Giai đoạn 2+ = thẻ riêng behavioral.
- Mỗi section tối đa 0.8-1 trang khi in.

## Ảnh có sẵn (Ref/)
- Wireframe: wire-home-p1.png, wire-home-p2.png, wire-home-p3.png, wire-tab-tt.png, wire-tab-tc.png, wire-tab-ud.png
- Đối thủ: comp-momo1-5.jpeg, comp-zalo1-4.jpeg, comp-revolut1-4.png, comp-monzo1-5.png, comp-cake1-4.jpeg

---
Back: [[agents/index|Agents]]

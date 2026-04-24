"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Moon, Sun, Copy, Link2, Camera, Check, Plus, Minus, PanelLeft } from "lucide-react"

/* ── Data ─────────────────────────────────────────────────────── */
interface Zone {
  zone: string
  content: string
  why: string
  /** Bounding box in percentage [x, y, width, height] of 390×844 screen */
  bbox?: [number, number, number, number]
}
interface MentalModel {
  userGoal: string           // Mục tiêu người dùng khi vào màn này
  context: string            // Hoàn cảnh sử dụng — ai, khi nào, ở đâu
  emotion: string            // Trạng thái cảm xúc khi vào màn
  decisionPoints: string[]   // Những quyết định người dùng phải đưa ra
  successCriteria: string    // Khi nào user cảm thấy "xong việc"
}
interface ScreenInfo { mentalModel: MentalModel; zones: Zone[]; pattern?: string; reference?: string }
interface Screen { screen: string; route: string; states: { label: string; param: string }[] }
interface Epic { id: string; title: string; desc: string; color: string; screens: Screen[] }

/* Source: .claude/features/quy-nhom/info-design.md
 * Ngôn ngữ: Tiếng Việt có dấu, formal.
 * POV: Người dùng — mô tả điều họ cần và nhận được, không phải ý đồ của designer.
 * Nguyên tắc: Chỉ giải thích những zone có quyết định thiết kế đáng bàn. Zone hiển nhiên có thể bỏ qua.
 */
const INFO_DESIGN: Record<string, ScreenInfo> = {
  "S0 · Danh sách quỹ": {
    mentalModel: {
      userGoal: "Người dùng muốn thấy toàn bộ quỹ mình đang tham gia trong một lần nhìn, và biết quỹ nào cần hành động ngay.",
      context: "Vào app nhiều lần mỗi tuần, phần lớn là để kiểm tra số dư — không phải để đọc. Có thể đang ở nơi công cộng, ít thời gian.",
      emotion: "Muốn kiểm soát nhanh. Nếu phải scroll hoặc đọc hiểu, người dùng sẽ thoát.",
      decisionPoints: [
        "Quỹ nào đáng mở chi tiết?",
        "Đã đến lúc tạo quỹ mới chưa?",
      ],
      successCriteria: "Trong 3 giây đầu nhận ra mình có bao nhiêu quỹ, tổng tiền đang ở đâu, và quỹ nào cần chú ý.",
    },
    zones: [
      { zone: "Card màu pastel cho từng quỹ", content: "Mỗi quỹ một màu pastel, số dư cỡ lớn, progress bar mỏng, avatar thành viên ở đáy.", why: "Người dùng nhận diện quỹ qua màu trước, qua tên sau. Khi có 3-4 quỹ, mắt quét màu nhanh hơn đọc chữ. Số dư là thông tin họ quay lại để xem — nên lớn nhất trong card.", bbox: [5, 25, 90, 52] },
      { zone: "CTA \"Tạo quỹ nhóm\" cố định ở đáy", content: "Nút đen tròn floating với shadow rõ, luôn hiện khi scroll.", why: "Người dùng không muốn cuộn về đầu để tìm nút [+]. Đặt cố định ở vùng ngón tay cái với tay để họ tạo quỹ bất cứ lúc nào có ý tưởng.", bbox: [7, 88, 86, 8] },
      { zone: "Empty state (first-time)", content: "Icon heo đất + câu \"Chưa có quỹ nào\" + mô tả ngắn + CTA.", why: "Lần đầu mở màn này, người dùng chưa có mental model về tính năng. Empty state thay thế cho orientation — một câu giải thích, một nút để bắt đầu.", bbox: [5, 25, 90, 40] },
    ],
    reference: "Cash App Pools — card list đủ thông tin để quyết định mở, không cần đọc.",
  },

  "S1 · Tạo quỹ nhóm": {
    mentalModel: {
      userGoal: "Người dùng vừa nảy ra ý tưởng quỹ và muốn tạo nhanh trước khi quên hoặc mất hứng.",
      context: "Thường trong tình huống nhóm đang bàn bạc — đi du lịch, tổ chức sinh nhật, lớp học. Cần hoàn thành trong 30-60 giây.",
      emotion: "Háo hức nhưng dễ bỏ dở nếu form dài. Sợ phải suy nghĩ nhiều về mục tiêu số tiền chính xác.",
      decisionPoints: [
        "Đặt tên gì để bạn bè hiểu đây là quỹ gì?",
        "Có nên set mục tiêu ngay không?",
        "Riêng tư hay công khai?",
      ],
      successCriteria: "Tạo xong và vào ngay màn mời bạn, không bị chặn bởi field tuỳ chọn.",
    },
    zones: [
      { zone: "Avatar upload (gradient xanh lá)", content: "Vòng tròn 96px gradient mint + icon camera + badge plus đen.", why: "Người dùng muốn quỹ có \"mặt\" riêng để phân biệt trong list. Đặt ở đầu form biến việc upload từ task phụ thành một phần của hành trình tạo quỹ.", bbox: [38, 13, 24, 13] },
      { zone: "Mô tả và Mục tiêu tuỳ chọn", content: "Hai trường có label \"tuỳ chọn\" rõ ràng, placeholder là ví dụ cụ thể.", why: "Bắt buộc mục tiêu số sẽ chặn các quỹ không có deadline cụ thể (quỹ lớp, quỹ gia đình). Người dùng không phải suy nghĩ chính xác 5 triệu hay 7 triệu — họ có thể điền sau.", bbox: [5, 37, 90, 20] },
      { zone: "Chip segmented Privacy + caption động", content: "Hai chip \"Riêng tư\" / \"Công khai\". Dòng mô tả bên dưới đổi nội dung theo lựa chọn.", why: "Radio list bắt người dùng đọc hết description trước khi chọn. Chip cho phép họ thử — tap vào đâu, caption đổi, hiểu ngay hậu quả.", bbox: [5, 64, 90, 14] },
      { zone: "CTA cố định đáy + backdrop blur", content: "Nút primary đen ở đáy, nền mờ tách khỏi content.", why: "Form dài hơn một màn — người dùng scroll xuống sẽ mất nút submit. Backdrop blur cho người dùng biết đây là vùng cố định, không phải mất content.", bbox: [5, 88, 90, 8] },
    ],
  },

  "S2 · Mời thành viên": {
    mentalModel: {
      userGoal: "Người dùng muốn đưa bạn bè vào quỹ ngay lập tức, bằng phương thức phù hợp với tình huống hiện tại.",
      context: "Hai tình huống chính: đang ngồi cạnh nhau (cần QR), hoặc nhắn tin qua Zalo (cần link). Người dùng biết rõ mình đang ở tình huống nào.",
      emotion: "Không muốn giải thích dài. Muốn xong để quay lại cuộc trò chuyện.",
      decisionPoints: [
        "QR hay link — tuỳ tình huống.",
        "Ai đã mời rồi, ai chưa?",
      ],
      successCriteria: "Một hoặc hai tap là xong. Có feedback rõ ràng (\"Đã mời\", \"Đã copy link\") để không lặp thao tác.",
    },
    zones: [
      { zone: "QR hero với gradient mint", content: "QR 200px trong card gradient mint, logo quỹ ở giữa QR.", why: "Use case thường gặp nhất là đang gặp mặt — QR nhanh hơn copy paste link nhiều lần. Đặt lớn nhất màn hình để ưu tiên use case này thay vì treat QR là lựa chọn phụ.", bbox: [5, 22, 90, 36] },
      { zone: "Danh bạ + nút trạng thái mỗi hàng", content: "Search bar + list contact, mỗi người có nút \"Mời\" hoặc \"Đã mời\" disabled.", why: "Người dùng muốn mời nhiều người cùng lúc mà không mất dấu đã mời ai. Trạng thái disabled ngăn mời lặp — một sai lầm phổ biến khi danh sách dài.", bbox: [0, 70, 100, 28] },
    ],
    reference: "Revolut Add member — QR prominent, share row AirDrop-style.",
  },

  "S3 · Dashboard quỹ": {
    mentalModel: {
      userGoal: "Người dùng mở quỹ để kiểm tra tình trạng và quyết định hành động tiếp theo — góp thêm, rút ra, hoặc xem ai đang làm gì.",
      context: "Truy cập thường xuyên — đây là màn chính của tính năng. Người dùng có thể là admin hoặc member với quyền khác nhau.",
      emotion: "Giống cảm giác mở app banking — muốn thấy số tiền ngay, không chờ loading hay đọc.",
      decisionPoints: [
        "Có cần góp thêm để đạt mục tiêu không?",
        "Ai đã góp, ai chưa? Mình có đang chậm không?",
      ],
      successCriteria: "Thấy số dư và progress trong 1 giây. Biết phải tap đâu để thực hiện hành động kế tiếp.",
    },
    zones: [
      { zone: "Hero gradient xanh lá", content: "Status bar + navbar + số dư + progress + members + actions, chỉ hiện ở tab Quỹ nhóm.", why: "Gradient xanh lá báo cho người dùng \"đây là brand zone, thông tin quan trọng nhất\". Ẩn hero ở tab Thành viên và Lịch sử vì 2 tab đó cần white space để đọc danh sách dày.", bbox: [0, 0, 100, 44] },
      { zone: "Số dư cỡ 44px + eye toggle", content: "Số tiền font-black 44px. Eye icon nhỏ cho phép ẩn/hiện.", why: "Người dùng đôi khi mở app ở nơi công cộng (quán cafe, họp nhóm). Eye toggle cho họ chủ động che số khi có người đứng cạnh — không phải đóng app.", bbox: [5, 18, 80, 10] },
      { zone: "Glass bar island 3 tabs", content: "Bar floating đáy: Quỹ nhóm / Thành viên / Lịch sử, blur nền, shadow depth.", why: "Nếu nhét 3 loại nội dung (tổng quan, thành viên, lịch sử) vào cùng một màn scroll dài, người dùng sẽ mất phương hướng. Chia thành tabs giúp họ có context rõ — đang ở phần nào.", bbox: [4, 88, 92, 8] },
    ],
    reference: "Cash App balance typography + RWA app glass bar pattern.",
  },

  "S4a · Góp tiền — Nhập số tiền": {
    mentalModel: {
      userGoal: "Người dùng đã quyết định góp tiền — giờ chỉ cần nhập số và tiếp tục.",
      context: "Vừa tap \"Góp tiền\" từ dashboard. Có thể đang họp nhóm cần góp ngay, hoặc đóng quỹ định kỳ hàng tháng.",
      emotion: "Quyết đoán, nhưng có chút thận trọng vì đang chuyển tiền thật. Cần cảm giác \"không có chuyện gì sai\".",
      decisionPoints: [
        "Góp bao nhiêu? (thường là số tròn quen thuộc)",
      ],
      successCriteria: "Nhập số trong 1-2 tap qua quick chips, hoặc vài giây gõ tay. CTA bật sáng ngay khi nhập đủ.",
    },
    zones: [
      { zone: "Quick chips 100K / 200K / 500K / 1M", content: "4 chip tròn cho số tiền phổ biến.", why: "Dữ liệu thực tế cho thấy 80% giao dịch góp quỹ là 4 mức này. Chip cho phép người dùng hoàn thành trong 1 tap thay vì gõ 6 số — giảm ma sát và giảm lỗi đánh máy.", bbox: [5, 36, 90, 7] },
      { zone: "CTA \"Tiếp tục\" (không \"Góp tiền\")", content: "Primary button với text \"Tiếp tục\".", why: "Người dùng chưa thực sự góp ở bước này — còn màn xác nhận và PIN. Nếu dùng \"Góp tiền\" ngay đây, họ tap xong rồi thấy \"Xác nhận\" sẽ nghĩ bị lỗi hoặc bị lừa bước.", bbox: [5, 88, 90, 8] },
    ],
  },

  "S5a · Rút tiền — Admin": {
    mentalModel: {
      userGoal: "Admin cần rút tiền để chi tiêu (mua vé, đặt cọc). Member cần xin rút với lý do cụ thể để admin xét duyệt.",
      context: "Admin rút khi cần thanh toán. Member rút trong tình huống đặc biệt — sự kiện thay đổi, kế hoạch huỷ, hoặc nhu cầu cá nhân.",
      emotion: "Admin: bình tĩnh, như giao dịch ngân hàng. Member: hơi ngại, vì phải viết lý do cho người khác đọc.",
      decisionPoints: [
        "Admin: Rút bao nhiêu mà không ảnh hưởng kế hoạch chung?",
        "Member: Lý do có đủ hợp lý để admin đồng ý không?",
      ],
      successCriteria: "Admin: rút xong thấy số dư cập nhật ngay. Member: biết rõ đang ở trạng thái chờ duyệt, không nhầm với thành công.",
    },
    zones: [
      { zone: "Title đổi theo role", content: "\"Rút tiền\" cho admin / \"Yêu cầu rút\" cho member.", why: "Member ban đầu có thể nghĩ mình có quyền rút như admin. Title khác nhau cho họ biết ngay đây là yêu cầu, không phải hành động rút trực tiếp.", bbox: [10, 7, 60, 5] },
      { zone: "Số dư quỹ hiện tại trên card", content: "Hiển thị quỹ đang có bao nhiêu ngay trên fund card.", why: "Người dùng cần biết giới hạn TRƯỚC khi nhập số. Nếu chỉ báo lỗi sau khi gõ xong, họ cảm giác bị chặn một cách đột ngột — phải gõ lại.", bbox: [5, 14, 90, 10] },
      { zone: "Lý do (chỉ member)", content: "TextArea bắt buộc với member, ẩn hoàn toàn với admin.", why: "Admin cần context để quyết định duyệt — một số tiền không có lý do sẽ bị reject. Member bắt buộc điền để tránh tạo yêu cầu rỗng làm phiền admin.", bbox: [5, 48, 90, 16] },
    ],
  },

  "S6 · Cài đặt quỹ": {
    mentalModel: {
      userGoal: "Người dùng vào đây để điều chỉnh thông tin hoặc rời quỹ — hai nhu cầu khác biệt nhưng cùng màn.",
      context: "Ít truy cập. Khi vào thường có lý do cụ thể: sửa typo tên quỹ, đổi mục tiêu, chuyển quyền, hoặc quyết định giải tán.",
      emotion: "Cẩn thận — biết đây là khu vực có nút nguy hiểm. Sợ tap nhầm mất tiền hoặc mất quỹ không phục hồi được.",
      decisionPoints: [
        "Chỉ sửa info hay có hành động lớn hơn?",
        "Nếu giải tán / rời, tiền sẽ về đâu?",
      ],
      successCriteria: "Sửa info xong có feedback rõ. Destructive actions qua dialog confirm, không execute trực tiếp khi tap.",
    },
    zones: [
      { zone: "Danger zone ở cuối + màu đỏ", content: "Section cuối cùng: \"Rời quỹ\" (member) hoặc \"Giải tán quỹ\" (admin), icon + text đỏ.", why: "Convention iOS: hành động destructive luôn đặt cuối. Người dùng học pattern này từ Settings native — đặt nút \"Rời quỹ\" ở trên sẽ khiến họ tap nhầm khi đang tìm nút sửa info. Màu đỏ là tín hiệu stop cuối cùng trước dialog.", bbox: [5, 82, 90, 10] },
      { zone: "Ẩn Quản lý khi là member", content: "Section \"Quản lý thành viên\" và \"Chuyển quyền admin\" chỉ hiện với admin.", why: "Member không có quyền — hiện mà disabled sẽ tạo cảm giác bị hạn chế, thiếu tôn trọng. Ẩn hẳn cho họ experience clean, không thấy thứ mình không thể dùng.", bbox: [5, 65, 90, 15] },
    ],
    reference: "iOS Settings — clean rows, destructive actions đỏ ở bottom.",
  },

  "S7 · Xác thực PIN": {
    mentalModel: {
      userGoal: "Người dùng đã cam kết hành động ở màn trước (tap Xác nhận) — giờ chỉ xác thực danh tính để hoàn tất.",
      context: "Đến từ flow góp, rút, hoặc giải tán. Họ đã biết sẽ phải nhập PIN — đây không phải surprise.",
      emotion: "Muốn xong nhanh. Sai PIN gây khó chịu. Locked 30 phút là tệ nhất.",
      decisionPoints: [
        "Dùng Biometric (nếu có) hay gõ PIN?",
      ],
      successCriteria: "Đúng PIN một lần, auto submit khi đủ 6 số, redirect ngay về flow gốc với kết quả.",
    },
    zones: [
      { zone: "Context text dưới title", content: "Dòng mô tả action đang xác thực — \"Góp 500.000 ₫ vào Du lịch Đà Lạt 2026\".", why: "Nếu có nhiều tab / flow đang mở, người dùng có thể không chắc đang xác thực cái gì. Context text loại bỏ sự mơ hồ — họ xác nhận một cách có ý thức, không tap máy móc.", bbox: [10, 16, 80, 8] },
      { zone: "Numpad tuỳ chỉnh thay vì keyboard hệ thống", content: "Grid 3×4 với số 0-9 + biometric + delete.", why: "System keyboard có autocomplete, suggestions, và có thể cache — rủi ro leak PIN. Numpad tuỳ chỉnh không lưu input, không có autocomplete, giữ PIN an toàn.", bbox: [8, 52, 84, 38] },
      { zone: "Link \"Quên mã PIN\" dưới numpad", content: "Text link nhỏ, không prominent.", why: "Hầu hết người dùng không quên PIN — đặt prominent sẽ gây phân tâm. Nhưng khi cần, họ vẫn thấy được thay vì bị lock hoàn toàn khỏi app.", bbox: [30, 92, 40, 5] },
    ],
  },
}

const EPICS: Epic[] = [
  {
    id: "e0",
    title: "Epic 0 · Danh sách quỹ",
    desc: "S0: Danh sách quỹ đã tham gia, empty state, loading.",
    color: "#64748b",
    screens: [
      {
        screen: "S0 · Danh sách quỹ",
        route: "/quy-nhom/list",
        states: [
          { label: "default", param: "" },
          { label: "empty", param: "?state=empty" },
          { label: "loading", param: "?state=loading" },
        ],
      },
    ],
  },
  {
    id: "e1",
    title: "Epic 1 · Tạo quỹ nhóm",
    desc: "S1: Đặt tên, mục tiêu, quyền riêng tư.",
    color: "#6366f1",
    screens: [
      {
        screen: "S1 · Tạo quỹ nhóm",
        route: "/quy-nhom/tao",
        states: [
          { label: "default (empty)", param: "" },
          { label: "set goal", param: "?state=set-goal" },
        ],
      },
    ],
  },
  {
    id: "e2",
    title: "Epic 2 · Dashboard quỹ",
    desc: "S3: Dashboard — số dư, progress, thành viên, lịch sử.",
    color: "#22c55e",
    screens: [
      {
        screen: "S3 · Dashboard quỹ",
        route: "/quy-nhom/dashboard",
        states: [
          { label: "loaded (admin)", param: "" },
          { label: "member view", param: "?state=member-view" },
          { label: "empty", param: "?state=empty" },
          { label: "goal reached", param: "?state=goal-reached" },
        ],
      },
    ],
  },
  {
    id: "e3",
    title: "Epic 3 · Góp tiền",
    desc: "S4: Nhập số tiền → Xác nhận → Thành công.",
    color: "#f59e0b",
    screens: [
      {
        screen: "S4a · Góp tiền — Nhập số tiền",
        route: "/quy-nhom/gop",
        states: [{ label: "input", param: "" }],
      },
      {
        screen: "S4b · Góp tiền — Xác nhận",
        route: "/quy-nhom/gop",
        states: [{ label: "confirm", param: "?state=confirm" }],
      },
      {
        screen: "S4c · Góp tiền — Thành công",
        route: "/quy-nhom/gop",
        states: [{ label: "success", param: "?state=success" }],
      },
    ],
  },
  {
    id: "e4",
    title: "Epic 4 · Mời thành viên",
    desc: "S2: QR code lớn, copy link, chia sẻ, danh bạ.",
    color: "#ec4899",
    screens: [
      {
        screen: "S2 · Mời thành viên",
        route: "/quy-nhom/moi",
        states: [
          { label: "default", param: "" },
          { label: "link copied", param: "?state=link-copied" },
        ],
      },
    ],
  },
  {
    id: "e5",
    title: "Epic 5 · Rút tiền",
    desc: "S5: Admin rút trực tiếp hoặc member gửi yêu cầu chờ duyệt.",
    color: "#06b6d4",
    screens: [
      {
        screen: "S5a · Rút tiền — Admin",
        route: "/quy-nhom/rut",
        states: [{ label: "input admin", param: "" }],
      },
      {
        screen: "S5a · Rút tiền — Thành viên (có lý do)",
        route: "/quy-nhom/rut",
        states: [{ label: "input member", param: "?role=member" }],
      },
      {
        screen: "S5b · Rút tiền — Xác nhận",
        route: "/quy-nhom/rut",
        states: [
          { label: "confirm admin", param: "?state=confirm" },
          { label: "confirm member", param: "?state=confirm&role=member" },
        ],
      },
      {
        screen: "S5c · Rút tiền — Kết quả",
        route: "/quy-nhom/rut",
        states: [
          { label: "success (admin)", param: "?state=success" },
          { label: "pending (member)", param: "?state=pending&role=member" },
          { label: "failed", param: "?state=failed" },
        ],
      },
    ],
  },
  {
    id: "e6",
    title: "Epic 6 · Cài đặt quỹ",
    desc: "S6: Thông tin, quyền riêng tư, quản lý, khu vực nguy hiểm.",
    color: "#ef4444",
    screens: [
      {
        screen: "S6 · Cài đặt quỹ",
        route: "/quy-nhom/settings",
        states: [
          { label: "admin view", param: "" },
          { label: "member view", param: "?role=member" },
          { label: "dialog: dissolve", param: "?state=dissolve" },
          { label: "dialog: leave (member)", param: "?role=member&state=leave" },
          { label: "dialog: remove member", param: "?state=remove-member" },
          { label: "dialog: transfer admin", param: "?state=transfer-admin" },
          { label: "dialog: edit name", param: "?state=edit-name" },
        ],
      },
    ],
  },
  {
    id: "e7",
    title: "Epic 7 · Xác thực PIN",
    desc: "S7: Màn PIN dùng chung cho góp, rút, giải tán.",
    color: "#a855f7",
    screens: [
      {
        screen: "S7 · Xác thực PIN",
        route: "/quy-nhom/auth",
        states: [
          { label: "pin input", param: "" },
          { label: "wrong pin", param: "?state=wrong-pin" },
          { label: "locked", param: "?state=locked" },
          { label: "biometric", param: "?state=biometric" },
        ],
      },
    ],
  },
]

const FLOW_CHARTS: Record<string, string> = {
  e0: `flowchart LR
  START((Từ Home<br/>hoặc Dịch vụ)) --> S0[S0: Danh sách quỹ<br/>Card + Empty state]
  S0 --> D0{Đã có<br/>quỹ nào?}
  D0 -->|Không| EMPTY[Empty state<br/>CTA Tạo quỹ]
  D0 -->|Có| TAP[Tap card]
  EMPTY --> E1((Epic 1:<br/>Tạo quỹ))
  S0 -->|Nút +| E1
  TAP --> DASH((Dashboard))
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#64748b,color:#080808,stroke-width:2.5px,font-weight:700
  classDef lk fill:#A3D5FF,stroke:#2563eb,color:#1e3a8a,stroke-width:2px,font-weight:700
  class START ep
  class S0,EMPTY,TAP sc
  class D0 dc
  class E1,DASH lk
  linkStyle 3 stroke:#22c55e,color:#16a34a,stroke-width:2px`,

  e1: `flowchart LR
  START((Vào<br/>Quỹ nhóm)) --> S1[S1: Tạo quỹ nhóm<br/>Tên + Mục tiêu + Privacy]
  S1 --> D1{Đã điền<br/>đủ thông tin?}
  D1 -->|Không| S1
  D1 -->|Có| CREATE[Tạo quỹ]
  CREATE --> S2[S2: Mời thành viên<br/>QR + Link + Danh bạ]
  S2 --> DASH((Dashboard))
  classDef st fill:#080808,stroke:#080808,color:#fff
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#f59e0b,color:#080808,stroke-width:2.5px,font-weight:700
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  class START,DASH ep
  class S1,S2,CREATE sc
  class D1 dc
  linkStyle 2 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 3 stroke:#22c55e,color:#16a34a,stroke-width:2px`,

  e2: `flowchart LR
  DASH((Dashboard)) --> FUND[Card số dư<br/>Số dư + Mục tiêu + Progress]
  DASH --> MEMBERS[Thành viên<br/>Avatar ring + Danh sách]
  DASH --> FEED[Activity feed<br/>Ai góp/rút + Thời gian]
  FUND --> DETAIL[Chi tiết quỹ]
  DASH -->|Góp tiền| GOP((Epic 3:<br/>Góp tiền))
  DASH -->|Rút tiền| RUT[Yêu cầu rút<br/>Admin duyệt]
  DASH -->|Cài đặt| SET[Cài đặt quỹ<br/>Sửa info + danger zone]
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#22c55e,color:#080808,stroke-width:2.5px,font-weight:700
  classDef lk fill:#A3D5FF,stroke:#2563eb,color:#1e3a8a,stroke-width:2px,font-weight:700
  class DASH ep
  class FUND,MEMBERS,FEED,DETAIL,SET sc
  class GOP lk
  class RUT dc`,

  e3: `flowchart LR
  START((Từ<br/>Dashboard)) --> S4A[S4a: Nhập số tiền<br/>Quick chips hoặc gõ]
  S4A --> D4{Số tiền<br/>hợp lệ?}
  D4 -->|Không| S4A
  D4 -->|Có| S4B[S4b: Xác nhận<br/>Quỹ + Số tiền + Số dư]
  S4B --> D4B{Xác nhận?}
  D4B -->|Không| S4A
  D4B -->|Có| AUTH[Xác thực<br/>PIN hoặc Biometric]
  AUTH -->|Có| S4C[S4c: Góp thành công<br/>Số tiền + Tổng quỹ + %]
  AUTH -->|Không| FAIL[Thất bại<br/>Thử lại]
  S4C --> DASH((Dashboard))
  FAIL --> S4A
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#f59e0b,color:#080808,stroke-width:2.5px,font-weight:700
  classDef ok fill:#A7F0BA,stroke:#16a34a,color:#064e3b,stroke-width:2px,font-weight:700
  classDef fl fill:#FFA3B3,stroke:#dc2626,color:#7f1d1d,stroke-width:2px,font-weight:700
  class START,DASH ep
  class S4A,S4B,AUTH sc
  class D4,D4B dc
  class S4C ok
  class FAIL fl
  linkStyle 2 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 3 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 5 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 6 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 7 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 8 stroke:#ef4444,color:#ef4444,stroke-width:2px`,

  e4: `flowchart LR
  DASH((Dashboard<br/>tab Thành viên)) --> S2[S2: Mời thành viên]
  S2 --> QR[QR code lớn<br/>Người gặp mặt scan]
  S2 --> LINK[Copy link<br/>Gửi qua Zalo hoặc SMS]
  S2 --> SEARCH[Search danh bạ<br/>Mời từng người]
  QR --> WAIT[Chờ chấp nhận]
  LINK --> WAIT
  SEARCH --> WAIT
  WAIT -->|Có| DASH
  WAIT -->|Không| S2
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#fef3c7,stroke:#f59e0b,color:#92400e
  class DASH ep
  class S2,QR,LINK,SEARCH sc
  class WAIT dc
  linkStyle 7 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 8 stroke:#ef4444,color:#ef4444,stroke-width:2px`,

  e5: `flowchart LR
  DASH((Dashboard)) --> ROLE{Vai trò?}
  ROLE -->|Admin| S5A_A[S5a: Nhập số tiền<br/>Quick chips]
  ROLE -->|Thành viên| S5A_M[S5a: Số tiền + Lý do]
  S5A_A --> S5B_A[S5b: Xác nhận<br/>Quỹ + Nhận tại ví]
  S5A_M --> S5B_M[S5b: Xác nhận<br/>Gửi đến admin]
  S5B_A --> AUTH[Xác thực PIN]
  S5B_M --> GUI[Gửi yêu cầu]
  AUTH -->|Có| S5C_OK[S5c: Rút thành công]
  AUTH -->|Không| S5C_F[S5c: Thất bại<br/>Thử lại]
  GUI --> S5C_P[S5c: Chờ duyệt]
  S5C_P -->|Có| S5C_OK
  S5C_P -->|Không| S5C_F
  S5C_OK --> DASH
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#06b6d4,color:#080808,stroke-width:2.5px,font-weight:700
  classDef ok fill:#A7F0BA,stroke:#16a34a,color:#064e3b,stroke-width:2px,font-weight:700
  classDef fl fill:#FFA3B3,stroke:#dc2626,color:#7f1d1d,stroke-width:2px,font-weight:700
  classDef pending fill:#FFD27A,stroke:#d97706,color:#78350f,stroke-width:2px,font-weight:700
  class DASH ep
  class S5A_A,S5A_M,S5B_A,S5B_M,AUTH,GUI sc
  class ROLE dc
  class S5C_OK ok
  class S5C_F fl
  class S5C_P pending
  linkStyle 7 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 8 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 10 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 11 stroke:#ef4444,color:#ef4444,stroke-width:2px`,

  e6: `flowchart LR
  DASH((Dashboard)) --> S6[S6: Cài đặt quỹ]
  S6 --> INFO[Thông tin quỹ<br/>Tên + Mô tả + Mục tiêu]
  S6 --> PRIV[Quyền riêng tư<br/>Riêng tư hoặc Công khai]
  S6 --> ROLE{Vai trò?}
  ROLE -->|Admin| MGMT[Quản lý<br/>Thành viên + Chuyển admin]
  ROLE -->|Admin| DANGER_A[Nguy hiểm<br/>Giải tán quỹ]
  ROLE -->|Thành viên| DANGER_M[Nguy hiểm<br/>Rời quỹ]
  DANGER_A --> DIALOG_D[Dialog xác nhận<br/>Hoàn tiền theo tỷ lệ]
  DANGER_M --> DIALOG_L[Dialog xác nhận<br/>Hoàn tiền đã góp]
  DIALOG_D --> DASH
  DIALOG_L --> EXIT((Thoát))
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#ef4444,color:#080808,stroke-width:2.5px,font-weight:700
  classDef fl fill:#FFA3B3,stroke:#dc2626,color:#7f1d1d,stroke-width:2px,font-weight:700
  class DASH,EXIT ep
  class S6,INFO,PRIV,MGMT sc
  class ROLE dc
  class DANGER_A,DANGER_M,DIALOG_D,DIALOG_L fl
  linkStyle 5 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 6 stroke:#ef4444,color:#ef4444,stroke-width:2px`,

  e7: `flowchart LR
  START((Từ flow<br/>Góp / Rút / Giải tán)) --> S7[S7: Nhập PIN<br/>6 số + context]
  S7 --> D7{Có<br/>biometric?}
  D7 -->|Có| BIO[Face ID / Touch ID]
  D7 -->|Không| PIN[Nhập 6 số PIN]
  BIO -->|Không| PIN
  PIN --> CHECK{PIN đúng?}
  CHECK -->|Có| OK[Xác thực thành công]
  CHECK -->|Không| ATT{Lần thứ dưới 3?}
  ATT -->|Có| S7
  ATT -->|Không| LOCK[Khoá 30 phút]
  BIO -->|Có| OK
  OK --> BACK((Quay lại<br/>flow gốc))
  classDef ep fill:#080808,stroke:#080808,color:#fff,font-weight:700
  classDef sc fill:#FFE770,stroke:#EAB308,color:#080808,stroke-width:2px,font-weight:700
  classDef dc fill:#FFFFFF,stroke:#a855f7,color:#080808,stroke-width:2.5px,font-weight:700
  classDef ok fill:#A7F0BA,stroke:#16a34a,color:#064e3b,stroke-width:2px,font-weight:700
  classDef fl fill:#FFA3B3,stroke:#dc2626,color:#7f1d1d,stroke-width:2px,font-weight:700
  class START,BACK ep
  class S7,PIN,BIO sc
  class D7,CHECK,ATT dc
  class OK ok
  class LOCK fl
  linkStyle 2 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 4 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 6 stroke:#22c55e,color:#16a34a,stroke-width:2px
  linkStyle 7 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 9 stroke:#ef4444,color:#ef4444,stroke-width:2px
  linkStyle 10 stroke:#22c55e,color:#16a34a,stroke-width:2px`,
}

/* Flatten */
const ALL_SCREENS = EPICS.flatMap((e) => e.screens)
const TOTAL_STATES = ALL_SCREENS.reduce((acc, s) => acc + s.states.length, 0)

function findEpicIdx(flatScreenIdx: number): number {
  let count = 0
  for (let i = 0; i < EPICS.length; i++) { count += EPICS[i].screens.length; if (flatScreenIdx < count) return i }
  return 0
}

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const tabStyle = (active: boolean): React.CSSProperties => ({ padding: "8px 16px", fontSize: 12, fontWeight: 600, fontFamily: FONT, border: "none", borderBottom: active ? "2px solid var(--foreground)" : "2px solid transparent", background: "transparent", color: active ? "var(--foreground)" : "var(--muted-foreground)", cursor: "pointer", letterSpacing: "0.5px" })

function FlowRenderer({ chart, epicId, onNodeHover, onNodeLeave, onNodeClick, containerRef }: {
  chart: string
  epicId: string
  onNodeHover?: (info: { id: string; label: string; x: number; y: number }) => void
  onNodeLeave?: () => void
  onNodeClick?: (id: string, label: string) => void
  containerRef?: React.RefObject<HTMLDivElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false
    async function render() {
      const mermaid = (await import("mermaid")).default
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          background: "transparent",
          primaryColor: "#f5f5f5",
          primaryTextColor: "#080808",
          primaryBorderColor: "#a3a3a3",
          lineColor: "#94a3b8",
          secondaryColor: "#f5f5f5",
          tertiaryColor: "#fafafa",
          fontSize: "13px",
          fontFamily: FONT,
        },
        flowchart: {
          htmlLabels: true,
          curve: "step",
          padding: 32,
          nodeSpacing: 48,
          rankSpacing: 100,
          useMaxWidth: false,
        },
      })
      if (cancelled || !ref.current) return
      const uid = `flow-${epicId}-${Date.now()}`
      const { svg } = await mermaid.render(uid, chart)
      if (cancelled || !ref.current) return
      ref.current.innerHTML = svg
      const svgEl = ref.current.querySelector("svg")
      if (svgEl) {
        svgEl.style.maxWidth = "none"
        svgEl.style.display = "block"

        // Inject FigJam-style tweaks: rx=12, bold text, subtle shadow
        const styleTag = document.createElementNS("http://www.w3.org/2000/svg", "style")
        styleTag.textContent = `
          .node rect { rx: 12 !important; ry: 12 !important; }
          .node .label, .node .nodeLabel, .node foreignObject div, .node foreignObject span {
            font-family: ${FONT};
            background: transparent !important;
          }
          .node rect, .node polygon, .node circle { filter: drop-shadow(0 1px 2px rgba(0,0,0,0.06)); }
          .edgeLabel foreignObject div, .edgeLabel foreignObject span {
            font-weight: 700 !important;
            font-size: 11px !important;
          }
          /* Kill inner backgrounds inside edge labels — but keep outer div (our pill) intact */
          .edgeLabel foreignObject > div *, .edgeLabel foreignObject > span *,
          .edgeLabels foreignObject > div *, .edgeLabels foreignObject > span * {
            background: transparent !important;
            background-color: transparent !important;
          }
          /* Also kill any default mermaid nodeLabel/edgeLabel span background */
          .edgeLabel .edgeLabel, .edgeLabel .nodeLabel, .edgeLabel p {
            background: transparent !important;
            background-color: transparent !important;
          }
          /* Hide mermaid's default white background rect behind edge labels */
          .edgeLabel rect, .edgeLabel > rect, .edgeLabels rect {
            fill: transparent !important;
            stroke: none !important;
          }
          .edgeLabel .labelBkg { fill: transparent !important; }
        `
        svgEl.insertBefore(styleTag, svgEl.firstChild)

        // Classify edge labels: yes (Có) green, no (Không) red, others neutral
        const yesPattern = /^có$/i
        const noPattern = /^không$/i
        svgEl.querySelectorAll("g.edgeLabel").forEach((label) => {
          const fo = label.querySelector("foreignObject") as SVGForeignObjectElement | null
          const container = label.querySelector("foreignObject > div, foreignObject > span") as HTMLElement | null
          if (!container || !fo) return
          const text = (container.textContent || "").trim().toLowerCase()
          let bg = "#ffffff", color = "#475569", border = "1.5px solid #cbd5e1"
          if (yesPattern.test(text)) {
            bg = "#DCFCE7"; color = "#15803D"; border = "1.5px solid #22c55e"
          } else if (noPattern.test(text)) {
            bg = "#FEE2E2"; color = "#B91C1C"; border = "1.5px solid #ef4444"
          }
          // Prevent overflow: allow fo to expand, make container inline
          fo.setAttribute("overflow", "visible")
          fo.style.overflow = "visible"
          // Measure needed width: recompute via inner span
          container.style.background = bg
          container.style.color = color
          container.style.border = border
          container.style.padding = "3px 10px"
          container.style.borderRadius = "100px"
          container.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"
          container.style.letterSpacing = "0.01em"
          container.style.whiteSpace = "nowrap"
          container.style.display = "inline-block"
          // Shift foreignObject left by extra padding to keep centered
          const currentWidth = parseFloat(fo.getAttribute("width") || "0")
          const currentX = parseFloat(fo.getAttribute("x") || "0")
          const extraPad = 24 // extra horizontal room for pill padding + border
          fo.setAttribute("width", String(currentWidth + extraPad))
          fo.setAttribute("x", String(currentX - extraPad / 2))
        })

        // Expand rect nodes only to fit bold text (skip circles + polygons)
        svgEl.querySelectorAll("g.node").forEach((n) => {
          const fo = n.querySelector("foreignObject") as SVGForeignObjectElement | null
          const rect = n.querySelector(":scope > rect") as SVGRectElement | null
          const polygon = n.querySelector("polygon")
          const circle = n.querySelector("circle")
          if (!fo || !rect || polygon || circle) return // skip diamonds + circles
          const foW = parseFloat(fo.getAttribute("width") || "0")
          const foX = parseFloat(fo.getAttribute("x") || "0")
          const rectW = parseFloat(rect.getAttribute("width") || "0")
          const rectX = parseFloat(rect.getAttribute("x") || "0")
          const extra = 24
          fo.setAttribute("width", String(foW + extra))
          fo.setAttribute("x", String(foX - extra / 2))
          rect.setAttribute("width", String(rectW + extra))
          rect.setAttribute("x", String(rectX - extra / 2))
        })

        // Attach hover + click handlers on all nodes
        const nodes = svgEl.querySelectorAll("g.node")
        nodes.forEach((node) => {
          const el = node as SVGGElement
          el.style.cursor = "pointer"
          const nodeId = el.id.replace(/^flowchart-/, "").replace(/-\d+$/, "")
          const labelEl = el.querySelector("foreignObject span.nodeLabel") || el.querySelector("text")
          const label = (labelEl?.textContent || nodeId).trim()

          el.addEventListener("mouseenter", () => {
            const rect = el.getBoundingClientRect()
            const parentRect = (containerRef?.current || ref.current!.parentElement!).getBoundingClientRect()
            onNodeHover?.({
              id: nodeId,
              label,
              x: rect.right - parentRect.left + 8,
              y: rect.top - parentRect.top + 4,
            })
            el.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
          })
          el.addEventListener("mouseleave", () => {
            onNodeLeave?.()
            el.style.filter = ""
          })
          el.addEventListener("click", (e) => {
            e.stopPropagation()
            onNodeClick?.(nodeId, label)
          })
        })
      }
    }
    render()
    return () => { cancelled = true }
  }, [chart, epicId, onNodeHover, onNodeLeave, onNodeClick, containerRef])
  return <div ref={ref} style={{ display: "flex", justifyContent: "center" }} />
}

function Sidebar({ epics, expandedEpic, setExpandedEpic, activeEpicId, onSelectEpic, mode, screenIdx, stateIdx, onSelectScreen, onSelectState, getFlatIdx }: { epics: Epic[]; expandedEpic: string; setExpandedEpic: (id: string) => void; activeEpicId?: string; onSelectEpic?: (id: string) => void; mode: "ui" | "flow"; screenIdx?: number; stateIdx?: number; onSelectScreen?: (flatIdx: number) => void; onSelectState?: (idx: number) => void; getFlatIdx?: (epicIdx: number, localScreenIdx: number) => number }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 6px 8px" }}>
      {epics.map((epic, eIdx) => {
        const isExpanded = expandedEpic === epic.id
        const epicStateCount = epic.screens.reduce((a, s) => a + s.states.length, 0)
        return (
          <div key={epic.id}>
            <button
              onClick={() => { setExpandedEpic(isExpanded ? "" : epic.id); if (mode === "flow" && onSelectEpic) onSelectEpic(epic.id) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                textAlign: "left",
                padding: "5px 8px",
                borderRadius: 6,
                background: isExpanded ? "var(--tool-sidebar-row)" : "transparent",
                border: "none",
                color: "var(--tool-text)",
                fontSize: 12,
                fontWeight: isExpanded ? 600 : 500,
                cursor: "pointer",
                fontFamily: FONT,
                transition: "background 0.1s",
                minHeight: 28,
              }}
            >
              <ChevronIcon expanded={isExpanded} />
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{epic.title}</span>
              <span style={{ fontSize: 10, color: "var(--tool-text-muted)", fontVariantNumeric: "tabular-nums", minWidth: 14, textAlign: "right" }}>{mode === "ui" ? epicStateCount : epic.screens.length}</span>
            </button>

            {mode === "ui" && isExpanded && getFlatIdx && onSelectScreen && onSelectState && epic.screens.map((screen, sIdx) => {
              const flatIdx = getFlatIdx(eIdx, sIdx)
              const isActive = flatIdx === screenIdx
              return (
                <div key={sIdx}>
                  <button
                    onClick={() => onSelectScreen(flatIdx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      textAlign: "left",
                      padding: "4px 8px 4px 26px",
                      borderRadius: 6,
                      background: isActive ? "var(--tool-sidebar-row)" : "transparent",
                      border: "none",
                      color: isActive ? "var(--tool-text)" : "var(--tool-text-secondary)",
                      fontSize: 11,
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      fontFamily: FONT,
                      minHeight: 24,
                      position: "relative",
                    }}
                  >
                    {isActive && <span style={{ position: "absolute", left: 12, top: 6, bottom: 6, width: 2, background: "var(--tool-text)", borderRadius: 1 }} />}
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{screen.screen}</span>
                  </button>
                  {isActive && (
                    <div style={{ padding: "2px 8px 6px 26px", display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {screen.states.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectState(idx)}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 100,
                            fontSize: 10,
                            fontWeight: idx === stateIdx ? 600 : 500,
                            background: idx === stateIdx ? "var(--tool-text)" : "var(--tool-canvas)",
                            color: idx === stateIdx ? "var(--tool-canvas)" : "var(--tool-text-secondary)",
                            cursor: "pointer",
                            fontFamily: FONT,
                            border: idx === stateIdx ? "none" : "1px solid var(--tool-border)",
                          }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {mode === "flow" && isExpanded && epic.screens.map((screen, sIdx) => (
              <div key={sIdx} style={{ padding: "4px 8px 4px 26px", fontSize: 11, color: "var(--tool-text-secondary)", fontFamily: FONT, minHeight: 24, display: "flex", alignItems: "center" }}>
                {screen.screen}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* ── Zoomable Canvas — Figma-style smooth pan & zoom with cursor-anchored zoom ─────── */
function ZoomableCanvas({ children, initialScale = 1 }: { children: React.ReactNode; initialScale?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef(initialScale)
  const panRef = useRef({ x: 0, y: 0 })
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick((t) => t + 1)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      // Cmd/Ctrl + wheel = zoom. Also pinch-to-zoom sends ctrl key on trackpad.
      if (e.ctrlKey || e.metaKey) {
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2
        const oldZoom = zoomRef.current
        // Smoother scaling with exponential mapping
        const scaleFactor = Math.exp(-e.deltaY * 0.002)
        const newZoom = Math.min(8, Math.max(0.1, oldZoom * scaleFactor))
        // Anchor zoom at cursor position
        const zoomRatio = newZoom / oldZoom
        panRef.current = {
          x: mouseX - (mouseX - panRef.current.x) * zoomRatio,
          y: mouseY - (mouseY - panRef.current.y) * zoomRatio,
        }
        zoomRef.current = newZoom
        forceUpdate()
      } else {
        panRef.current = {
          x: panRef.current.x - e.deltaX,
          y: panRef.current.y - e.deltaY,
        }
        forceUpdate()
      }
    }
    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    // Don't pan if clicking interactive content
    const target = e.target as HTMLElement
    if (target.closest("iframe, button, a, input, textarea, select")) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    panRef.current = {
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    }
    forceUpdate()
  }
  const onMouseUp = () => setIsDragging(false)

  const resetView = () => { zoomRef.current = initialScale; panRef.current = { x: 0, y: 0 }; forceUpdate() }
  const zoomIn = () => { zoomRef.current = Math.min(8, zoomRef.current * 1.25); forceUpdate() }
  const zoomOut = () => { zoomRef.current = Math.max(0.1, zoomRef.current / 1.25); forceUpdate() }

  const zoom = zoomRef.current
  const pan = panRef.current

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        flex: 1,
        overflow: "hidden",
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
        // Dot grid background scales with zoom, anchored to pan
        backgroundImage: "radial-gradient(circle, var(--tool-border-strong) 0.8px, transparent 0.8px)",
        backgroundSize: `${22 * zoom}px ${22 * zoom}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          willChange: "transform",
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        <div style={{ transform: "translate(-50%, -50%)" }}>
          {children}
        </div>
      </div>

      {/* Zoom controls — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          background: "var(--tool-canvas)",
          border: "1px solid var(--tool-border)",
          borderRadius: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          overflow: "hidden",
          zIndex: 40,
        }}
      >
        <ZoomBtn onClick={zoomIn} title="Zoom in">+</ZoomBtn>
        <div style={{ height: 1, background: "var(--tool-border)" }} />
        <ZoomBtn onClick={zoomOut} title="Zoom out">−</ZoomBtn>
        <div style={{ height: 1, background: "var(--tool-border)" }} />
        <ZoomBtn onClick={resetView} title="Reset view" fontSize={10}>
          {Math.round(zoom * 100)}%
        </ZoomBtn>
      </div>
    </div>
  )
}

function ZoomBtn({ children, onClick, title, fontSize = 16 }: { children: React.ReactNode; onClick: () => void; title: string; fontSize?: number }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 36,
        height: 32,
        border: "none",
        background: "transparent",
        color: "var(--foreground)",
        fontSize,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONT,
        transition: "background 0.1s",
      }}
      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--secondary)")}
      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {children}
    </button>
  )
}

/* ── Flow Panel — header + zoomable canvas + hover AI tooltip ─────── */
function FlowPanel({ flowEpic, flowEpicId, sidebarOpen, topPadding = 0, onNavigateToScreen, onNavigateToEpic }: {
  flowEpic: Epic
  flowEpicId: string
  sidebarOpen: boolean
  topPadding?: number
  onNavigateToScreen: (screenName: string) => void
  onNavigateToEpic: (epicId: string) => void
}) {
  const [hoveredNode, setHoveredNode] = useState<{ id: string; label: string; x: number; y: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const hoverTimeoutRef = useRef<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleNodeClick = (id: string, label: string) => {
    // If clicking a screen node (id starts with S), navigate to UI tab
    if (/^S\d/.test(id)) {
      onNavigateToScreen(id.replace(/_.+$/, ""))
      return
    }
    // If clicking epic reference node (id starts with E or contains Epic), navigate to that epic's flow
    if (/^E\d/i.test(id) || label.toLowerCase().includes("epic")) {
      const match = label.match(/Epic (\d+)/i)
      if (match) {
        const epicId = `e${match[1]}`
        onNavigateToEpic(epicId)
        return
      }
    }
  }

  const handleCopyAI = async (node: { id: string; label: string }) => {
    const prompt = `Trong user flow **${flowEpic.title}** (feature Quỹ nhóm — VSP), node đang review: **${node.label}** (id: ${node.id}).

Hãy phân tích: Node này có đặt đúng chỗ không? Có edge case nào thiếu? Nên có bước trung gian gì không? Pattern industry tương đương là gì?`
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div ref={panelRef} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", paddingTop: topPadding }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 12, paddingLeft: sidebarOpen ? 332 : 68 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--tool-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>User Flow</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tool-text-muted)" }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>{flowEpic.title}</span>
        <span style={{ fontSize: 12, color: "var(--tool-text-secondary)" }}>— {flowEpic.desc}</span>
      </div>

      {/* Legend */}
      <div style={{ position: "absolute", top: 80, left: 32, display: "flex", flexDirection: "column", gap: 5, padding: "10px 12px", background: "var(--tool-canvas)", border: "1px solid var(--tool-border)", borderRadius: 10, zIndex: 5, fontSize: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--tool-text-muted)", marginBottom: 2 }}>Legend</div>
        <LegendRow color="#22c55e" label="Path thành công" />
        <LegendRow color="#ef4444" label="Path thất bại / quay lại" />
        <LegendRow color="#3b82f6" label="Link sang epic khác" />
      </div>

      <ZoomableCanvas>
        <FlowRenderer
          key={flowEpicId}
          chart={FLOW_CHARTS[flowEpicId]}
          epicId={flowEpicId}
          containerRef={panelRef}
          onNodeHover={(info) => {
            if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
            setHoveredNode(info)
          }}
          onNodeLeave={() => {
            if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = window.setTimeout(() => setHoveredNode(null), 200)
          }}
          onNodeClick={handleNodeClick}
        />
      </ZoomableCanvas>

      {/* Floating Ask AI tooltip on hover */}
      {hoveredNode && (
        <div
          onMouseEnter={() => { if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current) }}
          onMouseLeave={() => setHoveredNode(null)}
          style={{
            position: "absolute",
            left: hoveredNode.x,
            top: hoveredNode.y,
            zIndex: 40,
          }}
        >
          <button
            onClick={() => handleCopyAI(hoveredNode)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              background: copied ? "#00b182" : "rgba(8,8,8,0.92)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
            {copied ? "Đã copy · paste vào AI" : `Hỏi AI về "${hoveredNode.label.slice(0, 24)}${hoveredNode.label.length > 24 ? "…" : ""}"`}
          </button>
        </div>
      )}
    </div>
  )
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 16, height: 2, background: color, borderRadius: 2 }} />
      <span style={{ color: "var(--tool-text-secondary)" }}>{label}</span>
    </div>
  )
}

/* ── Meta stat — small "label · value" inline ─────── */
function MetaStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tool-text)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <span style={{ fontSize: 11, color: "var(--tool-text-secondary)" }}>{label}</span>
    </div>
  )
}

/* ── Capsule tab — used in floating top toolbar ─────── */
function CapsuleTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        border: "none",
        background: active ? "var(--tool-canvas)" : "transparent",
        color: active ? "var(--tool-text)" : "var(--tool-text-secondary)",
        borderRadius: 100,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.12s",
        minWidth: 60,
      }}
    >
      {children}
    </button>
  )
}

/* ── Tab button — underline-active style ─────── */
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        border: "none",
        borderBottom: active ? "2px solid var(--tool-text)" : "2px solid transparent",
        background: "transparent",
        color: active ? "var(--tool-text)" : "var(--tool-text-secondary)",
        cursor: "pointer",
        fontFamily: "inherit",
        marginBottom: -1,
        transition: "color 0.12s, border-color 0.12s",
      }}
    >
      {children}
    </button>
  )
}

/* ── Chevron icon — minimal SVG instead of unicode triangle ─────── */
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s",
        flexShrink: 0,
        color: "var(--foreground-secondary)",
      }}
    >
      <path d="M3.5 2L7 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Floating copy toolbar — one button: copy full context for AI ─────── */
function FloatingCopyToolbar({ zone, screen, iframeSrc }: { zone: Zone; screen: string; iframeSrc: string }) {
  const [copied, setCopied] = useState(false)

  const aiPrompt = `Tôi đang review màn **${screen}** trong feature Quỹ nhóm (VSP — app ví điện tử).

**Zone đang inspect:** ${zone.zone}
**Mô tả zone:** ${zone.content}
**Lý do thiết kế hiện tại:** ${zone.why}

**Preview URL:** ${typeof window !== "undefined" ? window.location.origin : ""}${iframeSrc}

Hãy review như một senior product designer: phân tích điểm mạnh/yếu, đề xuất cải thiện cụ thể, và so sánh với pattern industry nếu có.`

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(aiPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy context này để paste vào Claude/ChatGPT"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        border: "none",
        background: copied ? "#00b182" : "rgba(8,8,8,0.92)",
        backdropFilter: "blur(8px)",
        borderRadius: 8,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        fontFamily: "Poppins, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s",
      }}
    >
      {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2} />}
      {copied ? "Đã copy · paste vào AI" : "Copy context hỏi AI"}
    </button>
  )
}

/* ── Zone copy action — minimal icon buttons (kept for other uses) ─────── */
function ZoneCopyActions({ zone, screen, route, iframeSrc }: { zone: Zone; screen: string; route: string; iframeSrc: string }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const markdownText = `**${screen}** · Zone: ${zone.zone}
Nội dung: ${zone.content}
Lý do: ${zone.why}
URL preview: ${typeof window !== "undefined" ? window.location.origin : ""}${iframeSrc}`

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const copyScreenshot = async () => {
    // Screenshot the iframe by copying its URL — user can right-click "Save image" or open dev tools
    // Real screenshot copy requires html2canvas or browser's native capture API
    try {
      const iframeEl = document.querySelector(`iframe[src="${iframeSrc}"]`) as HTMLIFrameElement | null
      if (iframeEl && iframeEl.contentWindow) {
        // Best-effort: copy the iframe URL + zone label for agent context
        await navigator.clipboard.writeText(`Screenshot URL: ${window.location.origin}${iframeSrc}\nZone: ${zone.zone}`)
        setCopiedKey("shot")
        setTimeout(() => setCopiedKey(null), 1500)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const actionBtn: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--background)",
    fontSize: 11,
    fontWeight: 500,
    color: "var(--foreground)",
    cursor: "pointer",
    fontFamily: FONT,
    display: "flex",
    alignItems: "center",
    gap: 5,
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={() => copyText(markdownText, "md")}
        style={actionBtn}
        title="Copy markdown để paste vào Claude / Notion"
      >
        {copiedKey === "md" ? "✓" : "📋"} Markdown
      </button>
      <button
        onClick={() => copyText(`${window.location.origin}${iframeSrc}`, "url")}
        style={actionBtn}
        title="Copy URL của state hiện tại"
      >
        {copiedKey === "url" ? "✓" : "🔗"} URL
      </button>
      <button
        onClick={copyScreenshot}
        style={actionBtn}
        title="Copy screenshot reference cho agent"
      >
        {copiedKey === "shot" ? "✓" : "📸"} Screenshot
      </button>
    </div>
  )
}

/* ── Mental model sub-row ─────── */
function MentalRow({ label, text, items, last }: { label: string; text?: string; items?: string[]; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, paddingBottom: last ? 0 : 10, marginBottom: last ? 0 : 10, borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, minWidth: 96, color: "var(--foreground-secondary)", paddingTop: 1 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, lineHeight: "20px" }}>
        {text}
        {items && (
          <ul style={{ margin: 0, paddingLeft: 16, listStyleType: "disc" }}>
            {items.map((item, i) => <li key={i} style={{ marginBottom: i === items.length - 1 ? 0 : 2 }}>{item}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ──────── Handoff Panel — user flow layout with screen nodes replaced by live iframes ──────── */

/** Map flow node ID → iframe route. Only screen-like nodes get replaced; decisions/actions stay as Mermaid shapes. */
const HANDOFF_IFRAMES: Record<string, string> = {
  S0: "/quy-nhom/list",
  S1: "/quy-nhom/tao",
  S2: "/quy-nhom/moi",
  S3: "/quy-nhom/dashboard",
  S4A: "/quy-nhom/gop",
  S4B: "/quy-nhom/gop?state=confirm",
  S4C: "/quy-nhom/gop?state=success",
  FAIL: "/quy-nhom/gop?state=failed",
  S5A_A: "/quy-nhom/rut",
  S5A_M: "/quy-nhom/rut?role=member",
  S5B_A: "/quy-nhom/rut?state=confirm",
  S5B_M: "/quy-nhom/rut?state=confirm&role=member",
  S5C_OK: "/quy-nhom/rut?state=success",
  S5C_F: "/quy-nhom/rut?state=failed",
  S5C_P: "/quy-nhom/rut?state=pending&role=member",
  S6: "/quy-nhom/settings",
  S7: "/quy-nhom/auth",
  PIN: "/quy-nhom/auth",
  BIO: "/quy-nhom/auth?state=biometric",
  OK: "/quy-nhom/auth",
  LOCK: "/quy-nhom/auth?state=locked",
  QR: "/quy-nhom/moi",
  LINK: "/quy-nhom/moi?state=link-copied",
  FUND: "/quy-nhom/dashboard",
  MEMBERS: "/quy-nhom/dashboard?state=members-view",
  FEED: "/quy-nhom/dashboard",
  SET: "/quy-nhom/settings",
  RUT: "/quy-nhom/rut",
  INFO: "/quy-nhom/settings",
  PRIV: "/quy-nhom/settings",
  MGMT: "/quy-nhom/dashboard",
  DIALOG_D: "/quy-nhom/settings?state=dissolve",
  DIALOG_L: "/quy-nhom/settings?role=member&state=leave",
  DANGER_A: "/quy-nhom/settings",
  DANGER_M: "/quy-nhom/settings?role=member",
}

/** Frame label (short, human-readable) for each screen node. Shown above the phone frame — Figma style. */
const HANDOFF_LABELS: Record<string, string> = {
  S0: "S0 · Danh sách quỹ",
  S1: "S1 · Tạo quỹ nhóm",
  S2: "S2 · Mời thành viên",
  S3: "S3 · Dashboard quỹ",
  S4A: "S4a · Góp tiền — Nhập số",
  S4B: "S4b · Góp tiền — Xác nhận",
  S4C: "S4c · Góp tiền — Thành công",
  FAIL: "S4 · Góp tiền — Thất bại",
  S5A_A: "S5a · Rút tiền — Admin",
  S5A_M: "S5a · Rút tiền — Member",
  S5B_A: "S5b · Xác nhận — Admin",
  S5B_M: "S5b · Xác nhận — Member",
  S5C_OK: "S5c · Thành công",
  S5C_F: "S5c · Thất bại",
  S5C_P: "S5c · Chờ duyệt",
  S6: "S6 · Cài đặt quỹ",
  S7: "S7 · Xác thực PIN",
  PIN: "S7 · PIN",
  BIO: "S7 · Biometric",
  OK: "S7 · PIN đúng",
  LOCK: "S7 · PIN khoá",
  QR: "S2 · QR",
  LINK: "S2 · Link copied",
  FUND: "S3 · Card số dư",
  MEMBERS: "S3 · Tab thành viên",
  FEED: "S3 · Activity feed",
  SET: "S6 · Cài đặt",
  RUT: "S5 · Rút tiền",
  INFO: "S6 · Thông tin",
  PRIV: "S6 · Riêng tư",
  MGMT: "S3 · Quản lý",
  DIALOG_D: "S6 · Dialog giải tán",
  DIALOG_L: "S6 · Dialog rời quỹ",
  DANGER_A: "S6 · Danger zone · Admin",
  DANGER_M: "S6 · Danger zone · Member",
}

/** Per-epic: which screen node is the "flow starting point" (Figma's blue play badge). */
const HANDOFF_FLOW_STARTS: Record<string, string> = {
  e0: "S0",
  e1: "S1",
  e2: "FUND",
  e3: "S4A",
  e4: "S2",
  e5: "S5A_A",
  e6: "S6",
  e7: "S7",
}

function HandoffPanel({ epics, sidebarOpen, onOpenScreen, getFlatIdx }: {
  epics: Epic[]
  sidebarOpen: boolean
  onOpenScreen: (flatIdx: number) => void
  getFlatIdx: (epicIdx: number, localScreenIdx: number) => number
}) {
  // Selection state — single frame selected across all epics (epicId + nodeId)
  const [selected, setSelected] = useState<{ epicId: string; nodeId: string } | null>(null)

  const handleOpenRoute = (route: string) => {
    // Find the flatIdx for that route
    let bestMatchIdx = -1
    let bestMatchLen = 0
    epics.forEach((epic, eIdx) => {
      epic.screens.forEach((screen, sIdx) => {
        if (route.startsWith(screen.route) && screen.route.length > bestMatchLen) {
          bestMatchIdx = getFlatIdx(eIdx, sIdx)
          bestMatchLen = screen.route.length
        }
      })
    })
    if (bestMatchIdx >= 0) onOpenScreen(bestMatchIdx)
  }

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      paddingTop: 56,
      paddingLeft: sidebarOpen ? 320 : 0,
      // click outside frames = deselect
    }}
      onClick={(e) => {
        const t = e.target as HTMLElement
        if (!t.closest("[data-handoff-frame]")) setSelected(null)
      }}
    >
      <ZoomableCanvas initialScale={0.35}>
        <div style={{ display: "flex", flexDirection: "column", gap: 120, padding: 48, minWidth: 1200 }}>
          {epics.map((epic) => (
            <section key={epic.id}>
              {/* Figma-style section label — monospaced uppercase tag + title */}
              <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                  padding: "4px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  background: "#ffffff",
                }}>Section · {epic.id.toUpperCase()}</span>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: "-0.3px", color: "#111827" }}>{epic.title.replace(/^Epic \d+ · /, "")}</h2>
                <span style={{ fontSize: 12, color: "var(--tool-text-secondary)" }}>{epic.desc}</span>
              </div>
              <HandoffFlowRender
                epic={epic}
                onOpenRoute={handleOpenRoute}
                selectedNodeId={selected?.epicId === epic.id ? selected.nodeId : null}
                onSelectNode={(nodeId) => setSelected({ epicId: epic.id, nodeId })}
                flowStartLabel={`Flow ${epic.id.replace(/^e/, "")}`}
              />
            </section>
          ))}
        </div>
      </ZoomableCanvas>
    </div>
  )
}

/* Renders a single epic's Mermaid flow, then overlays live iframes for screen nodes */
function HandoffFlowRender({ epic, onOpenRoute, selectedNodeId, onSelectNode, flowStartLabel }: {
  epic: Epic
  onOpenRoute: (route: string) => void
  selectedNodeId: string | null
  onSelectNode: (nodeId: string) => void
  flowStartLabel: string
}) {
  const svgRef = useRef<HTMLDivElement>(null)
  const [overlays, setOverlays] = useState<Array<{ id: string; src: string; cx: number; cy: number; w: number; h: number }>>([])
  const [svgDims, setSvgDims] = useState({ width: 0, height: 0 })

  useEffect(() => {
    let cancelled = false
    async function render() {
      const mermaid = (await import("mermaid")).default
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        themeVariables: {
          background: "transparent",
          primaryColor: "#ffffff",
          primaryTextColor: "#111827",
          primaryBorderColor: "#d1d5db",
          // Figma's signature "noodle" blue
          lineColor: "#0d99ff",
          secondaryColor: "#ffffff",
          tertiaryColor: "#f9fafb",
          fontSize: "13px",
          fontFamily: FONT,
        },
        flowchart: {
          htmlLabels: true,
          // Bezier curves like Figma / FigJam connectors
          curve: "basis",
          padding: 40,
          nodeSpacing: 120,
          rankSpacing: 200,
          useMaxWidth: false,
        },
      })
      if (cancelled || !svgRef.current) return

      // FULL phone frame size — iframe native 390×844
      const PHONE_W = 390
      const PHONE_H = 844
      let chart = FLOW_CHARTS[epic.id]
      Object.keys(HANDOFF_IFRAMES).forEach((nodeId) => {
        const rectRegex = new RegExp(`(\\b${nodeId})\\[([^\\]]*)\\]`, "g")
        chart = chart.replace(rectRegex, (_, id) => {
          return `${id}["<div style='width:${PHONE_W}px;height:${PHONE_H}px;'>&nbsp;</div>"]`
        })
      })

      const uid = `handoff-${epic.id}-${Date.now().toString(36)}`
      let svg: string
      try {
        const out = await mermaid.render(uid, chart)
        svg = out.svg
      } catch (err) {
        console.error("Handoff mermaid render failed for", epic.id, err)
        return
      }
      if (cancelled || !svgRef.current) return
      svgRef.current.innerHTML = svg
      const svgEl = svgRef.current.querySelector("svg") as SVGSVGElement | null
      if (!svgEl) return

      svgEl.style.maxWidth = "none"
      svgEl.style.display = "block"

      // Read viewBox to know dimensions
      const vb = svgEl.getAttribute("viewBox")?.split(" ").map(Number) || [0, 0, 0, 0]
      setSvgDims({ width: vb[2], height: vb[3] })

      // Style edge labels as Có/Không pills (same as Flow tab)
      // + Force ALL edge paths to Figma blue (#0d99ff), 1.5px — override any linkStyle() set in the chart source.
      const styleTag = document.createElementNS("http://www.w3.org/2000/svg", "style")
      styleTag.textContent = `
        .node rect { rx: 12 !important; ry: 12 !important; }
        .edgeLabel foreignObject div, .edgeLabel foreignObject span { font-weight: 700 !important; font-size: 11px !important; }
        .edgeLabel foreignObject > div *, .edgeLabel foreignObject > span * { background: transparent !important; }
        .edgeLabel rect, .edgeLabels rect { fill: transparent !important; stroke: none !important; }
        .edgeLabel .labelBkg { fill: transparent !important; }
        /* Figma "noodles" — thin blue bezier with round caps */
        .edgePaths .flowchart-link,
        .edgePaths path {
          stroke: #0d99ff !important;
          stroke-width: 1.5 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
          fill: none !important;
        }
        /* Arrow markers — blue fill to match */
        marker path { fill: #0d99ff !important; stroke: #0d99ff !important; }
        marker polygon { fill: #0d99ff !important; stroke: #0d99ff !important; }
      `
      svgEl.insertBefore(styleTag, svgEl.firstChild)

      // Also force-override inline stroke from Mermaid's linkStyle directives
      svgEl.querySelectorAll(".edgePaths path, .edgePaths .flowchart-link").forEach((p) => {
        (p as SVGPathElement).setAttribute("stroke", "#0d99ff")
        ;(p as SVGPathElement).setAttribute("stroke-width", "1.5")
      })

      const yesPattern = /^có$/i
      const noPattern = /^không$/i
      svgEl.querySelectorAll("g.edgeLabel").forEach((label) => {
        const fo = label.querySelector("foreignObject") as SVGForeignObjectElement | null
        const container = label.querySelector("foreignObject > div, foreignObject > span") as HTMLElement | null
        if (!container || !fo) return
        const text = (container.textContent || "").trim().toLowerCase()
        let bg = "#ffffff", color = "#475569", border = "1.5px solid #cbd5e1"
        if (yesPattern.test(text)) { bg = "#DCFCE7"; color = "#15803D"; border = "1.5px solid #22c55e" }
        else if (noPattern.test(text)) { bg = "#FEE2E2"; color = "#B91C1C"; border = "1.5px solid #ef4444" }
        fo.setAttribute("overflow", "visible")
        container.style.background = bg
        container.style.color = color
        container.style.border = border
        container.style.padding = "3px 10px"
        container.style.borderRadius = "100px"
        container.style.whiteSpace = "nowrap"
        container.style.display = "inline-block"
        const w = parseFloat(fo.getAttribute("width") || "0")
        const x = parseFloat(fo.getAttribute("x") || "0")
        fo.setAttribute("width", String(w + 24))
        fo.setAttribute("x", String(x - 12))
      })

      // Find screen nodes — extract positions, hide their rect+label, prepare overlays
      const newOverlays: typeof overlays = []
      svgEl.querySelectorAll("g.node").forEach((node) => {
        const nodeId = node.id.replace(/^flowchart-/, "").replace(/-\d+$/, "")
        const iframeRoute = HANDOFF_IFRAMES[nodeId]
        if (!iframeRoute) return

        // Get node center in SVG coordinates from transform
        const transformAttr = node.getAttribute("transform") || ""
        const match = transformAttr.match(/translate\(([-\d.]+),?\s*([-\d.]+)\)/)
        if (!match) return
        const cx = parseFloat(match[1])
        const cy = parseFloat(match[2])

        // Get rect dimensions (currently large due to our spacer)
        const rect = node.querySelector(":scope > rect")
        const rectW = parseFloat(rect?.getAttribute("width") || "140")
        const rectH = parseFloat(rect?.getAttribute("height") || "240")

        // Hide rect + label — we'll overlay iframe
        if (rect) {
          (rect as SVGRectElement).style.setProperty("fill", "transparent", "important")
          ;(rect as SVGRectElement).style.setProperty("stroke", "transparent", "important")
          ;(rect as SVGRectElement).style.setProperty("filter", "none", "important")
        }
        const fo = node.querySelector(":scope > foreignObject")
        if (fo) (fo as SVGForeignObjectElement).style.display = "none"

        newOverlays.push({ id: nodeId, src: iframeRoute, cx, cy, w: PHONE_W, h: PHONE_H })
      })

      setOverlays(newOverlays)
    }
    render()
    return () => { cancelled = true }
  }, [epic.id])

  const flowStartNodeId = HANDOFF_FLOW_STARTS[epic.id]

  return (
    <div style={{ position: "relative", minHeight: 400, display: "inline-block" }}>
      <div ref={svgRef} />
      {/* Iframe overlays */}
      {overlays.map((o) => (
        <HandoffScreenOverlay
          key={o.id}
          nodeId={o.id}
          label={HANDOFF_LABELS[o.id] || o.id}
          src={o.src}
          cx={o.cx}
          cy={o.cy}
          w={o.w}
          h={o.h}
          isStart={o.id === flowStartNodeId}
          flowStartLabel={flowStartLabel}
          isSelected={o.id === selectedNodeId}
          onSelect={() => onSelectNode(o.id)}
          onOpen={() => onOpenRoute(o.src)}
        />
      ))}
    </div>
  )
}

/* Lazy iframe overlay — native 390×844 size, same as UI tab but clickable to open fullscreen.
   Figma-prototype styling: frame label above, flow-start blue pill, selection & hover blue outlines. */
function HandoffScreenOverlay({ nodeId, label, src, cx, cy, w, h, isStart, flowStartLabel, isSelected, onSelect, onOpen }: {
  nodeId: string
  label: string
  src: string
  cx: number
  cy: number
  w: number
  h: number
  isStart: boolean
  flowStartLabel: string
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: "800px", threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const PAD = 10
  // Outer phone frame: w×h + padding for bezel
  const frameW = w + PAD * 2
  const frameH = h + PAD * 2

  // Selection-outline ring sits OUTSIDE the phone bezel (Figma-style). We render it as a
  // scaled-up absolute box so it never affects layout. Blue when selected, lighter blue on hover.
  const showOutline = isSelected || hovered
  const outlineColor = isSelected ? "#0d99ff" : "rgba(13,153,255,0.55)"
  const outlineWidth = isSelected ? 2 : 1.5
  const labelColor = isSelected ? "#0d99ff" : "#374151"
  const labelWeight = isSelected ? 700 : 600

  // Label + start badge sit ABOVE the phone frame, like Figma's frame-name anchor
  const LABEL_HEIGHT = 28
  const LABEL_GAP = 10

  return (
    <div
      ref={wrapRef}
      data-handoff-frame={nodeId}
      style={{
        position: "absolute",
        left: cx - frameW / 2,
        top: cy - frameH / 2,
        width: frameW,
        height: frameH,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Frame label — above the frame, Figma style (small, muted when idle, blue when selected) */}
      <div style={{
        position: "absolute",
        left: 0,
        top: -(LABEL_HEIGHT + LABEL_GAP),
        width: frameW,
        height: LABEL_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none",
        userSelect: "none",
      }}>
        {isStart && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            height: 22,
            padding: "0 9px 0 7px",
            borderRadius: 5,
            background: "#0d99ff",
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.01em",
            boxShadow: "0 1px 2px rgba(13,153,255,0.35)",
          }}>
            {/* Play triangle (pure SVG to avoid extra icon import) */}
            <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden>
              <path d="M0.5 0.5L7.5 4.5L0.5 8.5V0.5Z" fill="#ffffff" />
            </svg>
            {flowStartLabel}
          </span>
        )}
        <span style={{
          fontSize: 12,
          fontWeight: labelWeight,
          color: labelColor,
          fontFamily: FONT,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          letterSpacing: "-0.005em",
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 11,
          color: "#9ca3af",
          fontFamily: FONT,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}>
          {w}×{h}
        </span>
      </div>

      {/* Selection / hover outline — offset 6px outside the bezel */}
      {showOutline && (
        <div style={{
          position: "absolute",
          left: -6,
          top: -6,
          width: frameW + 12,
          height: frameH + 12,
          borderRadius: 58,
          border: `${outlineWidth}px solid ${outlineColor}`,
          pointerEvents: "none",
          transition: "border-color 0.12s",
        }} />
      )}

      {/* Phone bezel */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: 52,
        background: "#1a1a1a",
        border: "1px solid #333",
        padding: PAD,
        boxShadow: isSelected
          ? "0 24px 60px rgba(13,153,255,0.16), 0 4px 16px rgba(0,0,0,0.12)"
          : "0 16px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s",
      }}>
        {/* Dynamic island */}
        <div style={{
          position: "absolute",
          top: PAD + 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 36,
          borderRadius: 18,
          background: "#000",
          zIndex: 3,
          pointerEvents: "none",
        }} />
        {/* Inner screen area — iframe native size */}
        <div style={{ width: w, height: h, borderRadius: 44, overflow: "hidden", background: "#0a0a0a", position: "relative" }}>
          {visible ? (
            <iframe
              src={src}
              loading="lazy"
              title={src}
              style={{ width: w, height: h, border: "none", pointerEvents: "auto" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #2a2a2a, #1a1a1a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", fontSize: 20 }}>
              Loading…
            </div>
          )}
          {/* "Mở trong UI" — visible on selected frames (Figma-like action affordance) */}
          {(hovered || isSelected) && (
            <button
              onClick={(e) => { e.stopPropagation(); onOpen() }}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                padding: "8px 14px",
                borderRadius: 100,
                border: "none",
                background: "rgba(8,8,8,0.92)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 5,
              }}
            >
              Mở trong UI →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Inspect Panel — shows iframe + zones with rationale + hotspot overlay + Ask Agent ─────── */
function InspectPanel({ screen, state, iframeSrc, sidebarOpen = true }: { screen: Screen; state: { label: string; param: string }; iframeSrc: string; sidebarOpen?: boolean }) {
  const [activeZone, setActiveZone] = useState<number | null>(null)
  const info = INFO_DESIGN[screen.screen]

  const SCALE = 0.6, W = 390, H = 844, PAD = 6
  const frameW = Math.round(W * SCALE) + PAD * 2
  const frameH = Math.round(H * SCALE) + PAD * 2
  const innerW = Math.round(W * SCALE)
  const innerH = Math.round(H * SCALE)

  const activeZoneData = activeZone !== null && info ? info.zones[activeZone] : null

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", paddingTop: 56, paddingLeft: sidebarOpen ? 328 : 56 }}>
      {/* Left: iframe preview with hotspot overlay */}
      <div style={{ width: frameW + 64, padding: "24px 32px", borderRight: "1px solid var(--tool-border)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{screen.screen}</div>
          <div style={{ fontSize: 10, color: "var(--foreground-secondary)", marginTop: 2 }}>{state.label}</div>
        </div>
        <div style={{ width: frameW, height: frameH, borderRadius: Math.round(52 * SCALE), background: "#1a1a1a", border: "1px solid #333", padding: PAD, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", position: "relative" }}>
          <div style={{ position: "absolute", top: Math.round(12 * SCALE) + PAD, left: "50%", transform: "translateX(-50%)", width: Math.round(120 * SCALE), height: Math.round(36 * SCALE), borderRadius: 12, background: "#000", zIndex: 10 }} />
          <div style={{ width: innerW, height: innerH, borderRadius: Math.round(44 * SCALE), overflow: "hidden", background: "#000", position: "relative" }}>
            <iframe key={iframeSrc} src={iframeSrc} style={{ width: W, height: H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0" }} title={screen.screen} />
            {/* Hotspot overlays — positioned absolute over iframe */}
            {info?.zones.map((zone, i) => {
              if (!zone.bbox) return null
              const [x, y, w, h] = zone.bbox
              const isActive = activeZone === i
              return (
                <button
                  key={i}
                  onClick={() => setActiveZone(i)}
                  onMouseEnter={() => setActiveZone(i)}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${w}%`,
                    height: `${h}%`,
                    background: isActive ? "rgba(0,221,163,0.15)" : "transparent",
                    border: `2px solid ${isActive ? "#00b182" : "transparent"}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    padding: 0,
                    outline: "none",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(0,221,163,0.08)";
                      (e.currentTarget as HTMLElement).style.border = "2px dashed rgba(0,177,130,0.5)"
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.border = "2px solid transparent"
                    }
                  }}
                >
                  {/* Number badge */}
                  <span style={{
                    position: "absolute",
                    top: -10,
                    left: -10,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    background: isActive ? "#00b182" : "#080808",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  }}>{i + 1}</span>
                </button>
              )
            })}

          </div>

          {/* Floating copy toolbar — anchored at top-right OUTSIDE the phone frame */}
          {activeZoneData?.bbox && (
            <div
              style={{
                position: "absolute",
                top: Math.round(innerH * (activeZoneData.bbox[1] / 100)) + PAD + 10,
                left: frameW + 12,
                zIndex: 30,
                pointerEvents: "auto",
              }}
            >
              <FloatingCopyToolbar zone={activeZoneData} screen={screen.screen} iframeSrc={iframeSrc} />
            </div>
          )}
        </div>
        <div style={{ fontSize: 10, color: "var(--foreground-secondary)", textAlign: "center", maxWidth: 220 }}>
          Hover vào vùng số — toolbar xuất hiện bên phải iframe
        </div>
      </div>

      {/* Right: zones + rationale */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        {info ? (
          <>
            {/* Mental model — 5 layers */}
            <div style={{ marginBottom: 28, padding: "18px 20px", background: "var(--secondary)", borderRadius: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--foreground-secondary)", marginBottom: 12 }}>Mental model của người dùng</div>
              <MentalRow label="Mục tiêu" text={info.mentalModel.userGoal} />
              <MentalRow label="Hoàn cảnh" text={info.mentalModel.context} />
              <MentalRow label="Cảm xúc" text={info.mentalModel.emotion} />
              <MentalRow label="Quyết định" items={info.mentalModel.decisionPoints} />
              <MentalRow label="Thành công khi" text={info.mentalModel.successCriteria} last />
            </div>

            {/* Zones */}
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--foreground-secondary)", marginBottom: 12 }}>
              Zones · {info.zones.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {info.zones.map((zone, i) => {
                const isActive = activeZone === i
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActiveZone(i)}
                    onClick={() => setActiveZone(i)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: `1px solid ${isActive ? "#00b182" : "var(--border)"}`,
                      background: isActive ? "rgba(0,221,163,0.06)" : "var(--background)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 11, background: isActive ? "#00b182" : "var(--foreground)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{zone.zone}</div>
                        <div style={{ fontSize: 12, color: "var(--foreground-secondary)", lineHeight: "18px" }}>{zone.content}</div>
                      </div>
                    </div>
                    <div style={{ paddingLeft: 32, fontSize: 12, lineHeight: "18px", color: isActive ? "var(--foreground)" : "var(--foreground-secondary)" }}>
                      <span style={{ fontWeight: 600 }}>Lý do: </span>{zone.why}
                    </div>
                  </div>
                )
              })}
            </div>


            {/* Pattern + Reference */}
            {(info.pattern || info.reference) && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                {info.pattern && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--foreground-secondary)", marginBottom: 4 }}>Pattern</div>
                    <div style={{ fontSize: 12, lineHeight: "18px" }}>{info.pattern}</div>
                  </div>
                )}
                {info.reference && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--foreground-secondary)", marginBottom: 4 }}>Reference</div>
                    <div style={{ fontSize: 12, lineHeight: "18px", color: "var(--foreground-secondary)" }}>{info.reference}</div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Chưa có info design</div>
            <div style={{ fontSize: 12, color: "var(--foreground-secondary)", maxWidth: 320, margin: "0 auto", lineHeight: "18px" }}>
              Thêm entry cho <code style={{ background: "var(--secondary)", padding: "2px 6px", borderRadius: 4 }}>{screen.screen}</code> vào <code style={{ background: "var(--secondary)", padding: "2px 6px", borderRadius: 4 }}>INFO_DESIGN</code> ở app/quy-nhom/page.tsx (source: info-design.md).
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QuyNhomStates() {
  const [tab, setTab] = useState<"ui" | "flow" | "inspect" | "handoff">("ui")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [screenIdx, setScreenIdx] = useState(0)
  const [stateIdx, setStateIdx] = useState(0)
  const [expandedEpicUI, setExpandedEpicUI] = useState("e0")
  const [flowEpicId, setFlowEpicId] = useState("e0")
  const [expandedEpicFlow, setExpandedEpicFlow] = useState("e0")

  const currentScreen = ALL_SCREENS[screenIdx]
  const currentState = currentScreen.states[stateIdx]
  const iframeSrc = `${currentScreen.route}${currentState.param}`
  const flowEpic = EPICS.find((e) => e.id === flowEpicId) || EPICS[0]

  function selectScreen(flatIdx: number) { setScreenIdx(flatIdx); setStateIdx(0); setExpandedEpicUI(EPICS[findEpicIdx(flatIdx)].id) }
  function getFlatIdx(epicIdx: number, localScreenIdx: number): number { let flat = 0; for (let i = 0; i < epicIdx; i++) flat += EPICS[i].screens.length; return flat + localScreenIdx }
  const globalStatePos = ALL_SCREENS.slice(0, screenIdx).reduce((acc, s) => acc + s.states.length, 0) + stateIdx + 1

  return (
    <div className="qn-tool-scope" data-theme={theme} style={{ display: "flex", height: "100vh", background: "var(--tool-canvas)", color: "var(--tool-text)", fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: "0.025em", position: "relative", overflow: "hidden", backgroundImage: "radial-gradient(circle, var(--tool-border-strong) 0.8px, transparent 0.8px)", backgroundSize: "22px 22px" }}>
      <style>{`
        .qn-tool-scope[data-theme="light"] {
          --tool-canvas: oklch(0.9940 0.0032 91.4455);
          --tool-sidebar: oklch(0.9750 0.0055 91.4843);
          --tool-sidebar-row: oklch(0.9550 0.0080 91.4857);
          --tool-border: oklch(0.9500 0.0080 91.4857);
          --tool-border-strong: oklch(0.9000 0.0080 91.4857);
          --tool-text: oklch(0.2046 0 0);
          --tool-text-secondary: oklch(0.4386 0 0);
          --tool-text-muted: oklch(0.5800 0.0060 91.4843);
          --tool-accent: oklch(0.8348 0.1302 160.9080);
        }
        .qn-tool-scope[data-theme="dark"] {
          --tool-canvas: oklch(0.1822 0 0);
          --tool-sidebar: oklch(0.2200 0 0);
          --tool-sidebar-row: oklch(0.2700 0 0);
          --tool-border: oklch(0.2809 0 0);
          --tool-border-strong: oklch(0.3500 0 0);
          --tool-text: oklch(0.9288 0.0126 255.5078);
          --tool-text-secondary: oklch(0.7348 0 0);
          --tool-text-muted: oklch(0.6301 0 0);
          --tool-accent: oklch(0.8003 0.1821 151.7110);
        }
        .qn-tool-scope {
          --background: var(--tool-canvas);
          --foreground: var(--tool-text);
          --foreground-secondary: var(--tool-text-secondary);
          --secondary: var(--tool-sidebar);
          --border: var(--tool-border);
          --border-bold: var(--tool-border-strong);
          --muted-foreground: var(--tool-text-muted);
        }
        .qn-tool-scope * { font-family: inherit !important; }
      `}</style>
      {/* Floating sidebar toggle — shown when sidebar closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          title="Hiện sidebar"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--tool-border)",
            background: "var(--tool-canvas)",
            color: "var(--tool-text)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <PanelLeft size={14} strokeWidth={1.8} />
        </button>
      )}

      <div style={{
        position: "absolute",
        top: 16,
        left: 16,
        bottom: 16,
        width: sidebarOpen ? 296 : 0,
        opacity: sidebarOpen ? 1 : 0,
        pointerEvents: sidebarOpen ? "auto" : "none",
        background: "var(--tool-sidebar)",
        border: "1px solid var(--tool-border)",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-20px)",
        zIndex: 20,
      }}>
        {/* Compact Figma-style header */}
        <div style={{ padding: "12px 12px 10px", borderBottom: "1px solid var(--tool-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/design-review" style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: "linear-gradient(135deg, #00b182 0%, #00dda3 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 13,
              textDecoration: "none",
              transition: "transform 0.1s",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.95)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
              title="Quay lại Dashboard"
            >V</Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.2px", lineHeight: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Quỹ nhóm</div>
              <div style={{ fontSize: 10, color: "var(--tool-text-muted)", lineHeight: "14px" }}>
                {EPICS.length} epics · {ALL_SCREENS.length} màn · {TOTAL_STATES} states
              </div>
            </div>
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              title={theme === "light" ? "Dark mode" : "Light mode"}
              style={{
                width: 26, height: 26, borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "var(--tool-text-secondary)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--tool-sidebar-row)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              {theme === "light" ? <Moon size={13} strokeWidth={1.8} /> : <Sun size={13} strokeWidth={1.8} />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              title="Ẩn sidebar"
              style={{
                width: 26, height: 26, borderRadius: 6,
                border: "none",
                background: "transparent",
                color: "var(--tool-text-secondary)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--tool-sidebar-row)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <PanelLeft size={13} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Layers header */}
        <div style={{ padding: "10px 14px 6px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--tool-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Layers</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: "var(--tool-text-muted)", padding: "1px 6px", borderRadius: 10, background: "var(--tool-sidebar-row)", fontVariantNumeric: "tabular-nums" }}>
            {EPICS.length}
          </span>
        </div>
        {tab === "inspect"
          ? <Sidebar epics={EPICS} expandedEpic={expandedEpicUI} setExpandedEpic={setExpandedEpicUI} mode="ui" screenIdx={screenIdx} stateIdx={stateIdx} onSelectScreen={selectScreen} onSelectState={setStateIdx} getFlatIdx={getFlatIdx} />
          : tab === "ui"
          ? <Sidebar epics={EPICS} expandedEpic={expandedEpicUI} setExpandedEpic={setExpandedEpicUI} mode="ui" screenIdx={screenIdx} stateIdx={stateIdx} onSelectScreen={selectScreen} onSelectState={setStateIdx} getFlatIdx={getFlatIdx} />
          : <Sidebar epics={EPICS} expandedEpic={expandedEpicFlow} setExpandedEpic={(id) => { setExpandedEpicFlow(id); if (id) setFlowEpicId(id) }} activeEpicId={flowEpicId} onSelectEpic={setFlowEpicId} mode="flow" />}
      </div>

      {/* ─────── Floating top toolbar — center capsule ─────── */}
      <div style={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: 4,
        background: "var(--tool-sidebar)",
        border: "1px solid var(--tool-border)",
        borderRadius: 100,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <CapsuleTab active={tab === "ui"} onClick={() => setTab("ui")}>UI</CapsuleTab>
        <CapsuleTab active={tab === "flow"} onClick={() => setTab("flow")}>Flow</CapsuleTab>
        <CapsuleTab active={tab === "inspect"} onClick={() => setTab("inspect")}>Inspect</CapsuleTab>
        <CapsuleTab active={tab === "handoff"} onClick={() => setTab("handoff")}>Handoff</CapsuleTab>
      </div>

      {/* ─────── Main canvas area — full viewport, shifts right when sidebar open ─────── */}
      {tab === "handoff" ? (
        <HandoffPanel
          epics={EPICS}
          sidebarOpen={sidebarOpen}
          onOpenScreen={(flatIdx) => { selectScreen(flatIdx); setTab("ui") }}
          getFlatIdx={getFlatIdx}
        />
      ) : tab === "inspect" ? (
        <InspectPanel screen={currentScreen} state={currentState} iframeSrc={iframeSrc} sidebarOpen={sidebarOpen} />
      ) : tab === "ui" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: 56 }}>
          {/* Canvas header — breadcrumb + state pill */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: sidebarOpen ? "20px 24px 20px 332px" : "20px 24px 20px 68px", borderBottom: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ color: "var(--tool-text-secondary)" }}>{EPICS[findEpicIdx(screenIdx)].title}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "var(--tool-text-muted)" }}><path d="M3.5 2L7 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ color: "var(--tool-text)", fontWeight: 600 }}>{currentScreen.screen}</span>
              <span style={{ padding: "2px 8px", fontSize: 10, fontWeight: 600, background: "var(--tool-sidebar)", borderRadius: 100, color: "var(--tool-text-secondary)", border: "1px solid var(--tool-border)" }}>
                {currentState.label}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--tool-text-muted)", fontVariantNumeric: "tabular-nums" }}>
              {iframeSrc}
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 16, padding: "28px 32px", overflow: "auto" }}>
            {(() => { const SCALE = 0.78, W = 390, H = 844, PAD = 8, frameW = Math.round(W * SCALE) + PAD * 2, frameH = Math.round(H * SCALE) + PAD * 2; return (
              <div style={{ width: frameW, height: frameH, borderRadius: Math.round(52 * SCALE), background: "#1a1a1a", border: "1px solid #333", padding: PAD, boxShadow: "0 25px 60px rgba(0,0,0,0.3)", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: Math.round(12 * SCALE) + PAD, left: "50%", transform: "translateX(-50%)", width: Math.round(120 * SCALE), height: Math.round(36 * SCALE), borderRadius: 16, background: "#000", zIndex: 10 }} />
                <div style={{ width: Math.round(W * SCALE), height: Math.round(H * SCALE), borderRadius: Math.round(44 * SCALE), overflow: "hidden", background: "#000" }}>
                  <iframe key={iframeSrc} src={iframeSrc} style={{ width: W, height: H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0", pointerEvents: "auto" }} title={currentScreen.screen} />
                </div>
              </div>
            ) })()}
          </div>
        </div>
      ) : (
        <FlowPanel
          flowEpic={flowEpic}
          flowEpicId={flowEpicId}
          sidebarOpen={sidebarOpen}
          topPadding={56}
          onNavigateToScreen={(screenName) => {
            const idx = ALL_SCREENS.findIndex((s) => s.screen.includes(screenName) || screenName.includes(s.screen))
            if (idx >= 0) { selectScreen(idx); setTab("ui") }
          }}
          onNavigateToEpic={(epicId) => {
            setFlowEpicId(epicId)
            setExpandedEpicFlow(epicId)
          }}
        />
      )}

      {/* ─────── Floating bottom controls — Prev/Next (UI + Inspect tabs) ─────── */}
      {tab !== "flow" && tab !== "handoff" && (
        <div style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 4,
          background: "var(--tool-sidebar)",
          border: "1px solid var(--tool-border)",
          borderRadius: 100,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          <button
            onClick={() => { if (stateIdx > 0) setStateIdx(stateIdx - 1); else if (screenIdx > 0) { const prev = ALL_SCREENS[screenIdx - 1]; selectScreen(screenIdx - 1); setStateIdx(prev.states.length - 1) } }}
            disabled={screenIdx === 0 && stateIdx === 0}
            style={{
              width: 32, height: 32, borderRadius: 100,
              border: "none",
              background: "transparent",
              color: screenIdx === 0 && stateIdx === 0 ? "var(--tool-text-muted)" : "var(--tool-text)",
              cursor: screenIdx === 0 && stateIdx === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}
            title="Previous state"
          >
            ←
          </button>
          <div style={{ padding: "0 12px", fontSize: 11, color: "var(--tool-text-secondary)", minWidth: 70, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
            {globalStatePos} / {TOTAL_STATES}
          </div>
          <button
            onClick={() => { if (stateIdx < currentScreen.states.length - 1) setStateIdx(stateIdx + 1); else if (screenIdx < ALL_SCREENS.length - 1) selectScreen(screenIdx + 1) }}
            disabled={screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1}
            style={{
              width: 32, height: 32, borderRadius: 100,
              border: "none",
              background: "transparent",
              color: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "var(--tool-text-muted)" : "var(--tool-text)",
              cursor: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}
            title="Next state"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}

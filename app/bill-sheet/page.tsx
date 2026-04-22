"use client";

import { useEffect, useState } from "react";
import { Moon, PanelLeft, Sun } from "lucide-react";

/* ── Data ────────────────────────────────────────────────────── */

interface Zone {
  zone: string;
  content: string;
  why: string;
  /** Bounding box in percentage [x, y, width, height] of 390×844 */
  bbox?: [number, number, number, number];
}
interface MentalModel {
  userGoal: string;
  context: string;
  emotion: string;
  decisionPoints: string[];
  successCriteria: string;
}
interface StateDef {
  label: string;
  param: string;
  mentalModel: MentalModel;
  zones: Zone[];
  reference?: string;
}

const STATES: StateDef[] = [
  {
    label: "Default (chưa áp voucher)",
    param: "1",
    mentalModel: {
      userGoal:
        "Người dùng vừa chọn thanh toán hóa đơn, muốn xác nhận số tiền và bấm trả ngay.",
      context:
        "Dùng trên mobile, 1 tay, thường khi đi ra ngoài hoặc lúc rảnh vài giây. Không muốn đọc nhiều.",
      emotion: "Muốn xong nhanh. Nếu thấy thao tác nhiều bước sẽ bỏ dở.",
      decisionPoints: [
        "Số tiền có đúng không?",
        "Có voucher nào đang có sẵn để tiết kiệm thêm không?",
        "Nguồn thanh toán có đủ số dư?",
      ],
      successCriteria: "Trong 3 giây nhận ra số tiền và bấm xác thực.",
    },
    zones: [
      {
        zone: "Title + BIG amount",
        content:
          "Title '17px' bên trên, số tiền '44px' bold bên dưới, đơn vị ₫ muted nhẹ.",
        why:
          "Người dùng quan tâm 'trả bao nhiêu' trước khi quan tâm 'vì sao'. Số tiền làm hero dominant, title chỉ cần xác nhận context.",
        bbox: [5, 9, 70, 14],
      },
      {
        zone: "Voucher offer (xanh CTA)",
        content:
          "Chip xanh emerald 'Giảm giá 10k cho lần đầu sử dụng' nằm trên Nguồn thanh toán.",
        why:
          "Chưa áp dụng nhưng có offer sẵn — cần nổi bật để user thấy có thể tiết kiệm. Đặt gần CTA nhưng không chen giữa amount và payment source.",
        bbox: [5, 57, 90, 6],
      },
      {
        zone: "Thông tin giao dịch (compact rows)",
        content:
          "3 row Dịch vụ / Nhà cung cấp / Mã KH, text 13px, label trái / value phải, không divider.",
        why:
          "Thông tin meta để người dùng verify context. Không cần to — chỉ là checklist. Bỏ divider giữa rows giảm noise.",
        bbox: [5, 39, 90, 16],
      },
    ],
    reference: "Apple Pay confirm — amount dominant, details chỉ verify context.",
  },
  {
    label: "Discount applied (có tiết kiệm)",
    param: "2",
    mentalModel: {
      userGoal:
        "Người dùng đã áp voucher, muốn xác nhận số thực trả sau giảm và thấy rõ tiết kiệm được bao nhiêu.",
      context:
        "Đã tương tác với voucher trước đó (hoặc hệ thống auto apply). Kiểm tra xem số tiền có đúng kỳ vọng.",
      emotion: "Cảm giác 'được lợi' — muốn thấy rõ phần tiết kiệm để yên tâm.",
      decisionPoints: [
        "Tiết kiệm bao nhiêu so với bill gốc?",
        "Có muốn đổi voucher khác không?",
        "Số thực trả có đúng như mong đợi?",
      ],
      successCriteria: "Nhận ra số tiết kiệm rõ ràng, tin tưởng bấm xác thực.",
    },
    zones: [
      {
        zone: "Amount tween + savings badge",
        content:
          "Số tiền đếm từ 2.000.000 → 1.960.000 (900ms). Badge '✓ Tiết kiệm 40.000 ₫' hiện ngay từ đầu, shine sweep animation chạy 1 lần.",
        why:
          "Tween amount cho cảm giác 'đã apply discount'. Badge hiện ngay không giật, shine sweep thu hút mắt 1 lần — không gây lo lắng UI thay đổi.",
        bbox: [5, 9, 70, 16],
      },
      {
        zone: "Chi tiết giao dịch (collapsible)",
        content:
          "Header 'Chi tiết giao dịch ▼' — khi expand: Hóa đơn gốc / Phí / Giảm giá. Không có cột ± đầu dòng.",
        why:
          "Mặc định collapse để không overwhelm. User nào muốn hiểu tại sao giá đổi tự bấm ra. Bỏ dấu ± giảm visual noise — số âm tự minh họa bằng − và màu xanh.",
        bbox: [5, 26, 90, 6],
      },
      {
        zone: "Voucher applied (xanh)",
        content:
          "Chip xanh 'Voucher thành viên VIP −50k' với chevron right cho phép đổi.",
        why:
          "Xác nhận voucher đã áp. Click được để thay voucher khác. Chữ trong chip match với dòng 'Giảm giá' trong breakdown — cùng 1 thứ 2 cách nhìn.",
        bbox: [5, 57, 90, 6],
      },
    ],
    reference: "Stripe checkout — subtotal → fees → discount → total với delta hiển thị rõ.",
  },
  {
    label: "Surcharge (có phí, không giảm)",
    param: "3",
    mentalModel: {
      userGoal:
        "Người dùng xem chi tiết hóa đơn có phí dịch vụ, kiểm tra tổng tăng bao nhiêu so với bill.",
      context:
        "Có phí bắt buộc (NCC + phí thanh toán). User có thể hoặc không có voucher trong tay.",
      emotion: "Trung tính. Không muốn bị surprise khi thấy tổng khác bill.",
      decisionPoints: [
        "Tổng tiền sau phí là bao nhiêu?",
        "Có voucher nào để bù không?",
      ],
      successCriteria: "Nhận ra tổng tăng và chấp nhận, hoặc chủ động tìm voucher.",
    },
    zones: [
      {
        zone: "Amount KHÔNG badge",
        content:
          "Số tiền 2.010.000 ₫ (đã cộng phí 10k). Không hiện badge 'Phụ thu' — tránh stress user.",
        why:
          "Fintech UX: muted red/orange chỉ dùng khi thực sự cần cảnh báo. Phí là bình thường, không phải error — chỉ cần hiển minh bạch trong breakdown là đủ.",
        bbox: [5, 9, 70, 12],
      },
      {
        zone: "Voucher empty state (gray)",
        content:
          "Chip 'Chọn voucher khuyến mãi' nền trắng, border xám, invite user thêm.",
        why:
          "State 'chưa chọn' phải khác biệt visual với 'đã chọn'. Gray border = affordance tap, không giả làm đã active.",
        bbox: [5, 57, 90, 6],
      },
      {
        zone: "Breakdown bắt buộc hiển",
        content:
          "Có fees → 'Chi tiết giao dịch' collapsible xuất hiện. Case 1 (không fees, không discount) thì ẩn luôn.",
        why:
          "Progressive disclosure — chỉ hiện khi có nội dung đáng xem. Case 1 không có gì thì không cần click để xác nhận 'không có gì'.",
        bbox: [5, 22, 90, 6],
      },
    ],
    reference: "Grab/Shopee — phí dịch vụ hiển thị trong breakdown, không dùng badge cảnh báo.",
  },
];

/* ── Theme ──────────────────────────────────────────────────── */

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = localStorage.getItem("bill-sheet.theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("bill-sheet.theme", next);
      return next;
    });
  };
  return { theme, toggle };
}

/* ── Page ───────────────────────────────────────────────────── */

export default function BillSheetStatesBrowser() {
  const [tab, setTab] = useState<"ui" | "inspect">("ui");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stateIdx, setStateIdx] = useState(0);
  const { theme, toggle } = useTheme();

  // Detect viewport on mount / resize — default sidebar open on desktop
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const currentState = STATES[stateIdx];
  const iframeSrc = `/bill-sheet/view?case=${currentState.param}`;

  return (
    <div
      className="relative min-h-screen flex"
      style={
        {
          background: theme === "dark" ? "#0a0a0a" : "#fafafa",
          color: theme === "dark" ? "#e5e5e5" : "#171717",
          "--tool-bg": theme === "dark" ? "#0a0a0a" : "#fafafa",
          "--tool-sidebar": theme === "dark" ? "#111" : "#fff",
          "--tool-sidebar-row": theme === "dark" ? "#1a1a1a" : "#f3f3f3",
          "--tool-border": theme === "dark" ? "#222" : "#e5e5e5",
          "--tool-text": theme === "dark" ? "#e5e5e5" : "#171717",
          "--tool-text-secondary": theme === "dark" ? "#a3a3a3" : "#525252",
          "--tool-text-muted": theme === "dark" ? "#737373" : "#a3a3a3",
          "--tool-accent": theme === "dark" ? "#60a5fa" : "#2563eb",
        } as React.CSSProperties
      }
    >
      {/* Mobile backdrop */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <aside
          style={{
            width: 260,
            maxWidth: "85vw",
            minHeight: "100vh",
            background: "var(--tool-sidebar)",
            borderRight: "1px solid var(--tool-border)",
            position: isMobile ? "fixed" : "sticky",
            top: 0,
            left: 0,
            alignSelf: "flex-start",
            zIndex: 50,
          }}
        >
          {/* Sidebar header */}
          <div
            style={{
              height: 46,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--tool-border)",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>Bill Sheet</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={toggle}
                title="Toggle theme"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: "none",
                  background: "transparent",
                  color: "var(--tool-text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                title="Hide sidebar"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: "none",
                  background: "transparent",
                  color: "var(--tool-text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PanelLeft size={13} />
              </button>
            </div>
          </div>

          {/* Layers */}
          <div style={{ padding: "12px 14px 6px" }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--tool-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              States
            </span>
          </div>
          <div style={{ padding: "0 8px 12px" }}>
            {STATES.map((s, i) => {
              const active = i === stateIdx;
              return (
                <button
                  key={s.param}
                  onClick={() => setStateIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "8px 10px",
                    border: "none",
                    borderRadius: 6,
                    background: active ? "var(--tool-sidebar-row)" : "transparent",
                    color: "var(--tool-text)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: active ? 600 : 500,
                  }}
                  onMouseEnter={(e) =>
                    !active &&
                    ((e.currentTarget as HTMLElement).style.background =
                      "var(--tool-sidebar-row)")
                  }
                  onMouseLeave={(e) =>
                    !active &&
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <span
                    style={{
                      width: 18,
                      fontSize: 10,
                      color: "var(--tool-text-muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* Floating show-sidebar when hidden */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          title="Show sidebar"
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 40,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--tool-border)",
            background: "var(--tool-sidebar)",
            color: "var(--tool-text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PanelLeft size={14} />
        </button>
      )}

      {/* Top tabs — capsule */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          display: "flex",
          gap: 2,
          padding: 4,
          background: "var(--tool-sidebar)",
          border: "1px solid var(--tool-border)",
          borderRadius: 100,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <CapsuleTab active={tab === "ui"} onClick={() => setTab("ui")}>
          UI
        </CapsuleTab>
        <CapsuleTab active={tab === "inspect"} onClick={() => setTab("inspect")}>
          Inspect
        </CapsuleTab>
      </div>

      {/* Main canvas */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: isMobile ? 64 : 56, width: "100%", minWidth: 0 }}>
        {/* Breadcrumb header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "12px 16px" : "20px 24px",
            flexShrink: 0,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, flexWrap: "wrap", minWidth: 0 }}>
            {!isMobile && (
              <>
                <span style={{ color: "var(--tool-text-secondary)" }}>Bill Sheet</span>
                <span style={{ color: "var(--tool-text-muted)" }}>/</span>
              </>
            )}
            <span style={{ color: "var(--tool-text)", fontWeight: 600 }}>
              Thanh toán hóa đơn điện
            </span>
            <span
              style={{
                padding: "2px 8px",
                fontSize: 10,
                fontWeight: 600,
                background: "var(--tool-sidebar)",
                borderRadius: 100,
                color: "var(--tool-text-secondary)",
                border: "1px solid var(--tool-border)",
              }}
            >
              {currentState.label}
            </span>
          </div>
          {!isMobile && (
            <div
              style={{
                fontSize: 11,
                color: "var(--tool-text-muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {iframeSrc}
            </div>
          )}
        </div>

        {tab === "ui" ? (
          <UIPanel states={STATES} isMobile={isMobile} />
        ) : (
          <InspectPanel state={currentState} iframeSrc={iframeSrc} isMobile={isMobile} />
        )}
      </main>

      {/* Prev/Next capsule */}
      <div
        style={{
          position: "fixed",
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
        }}
      >
        <button
          onClick={() => setStateIdx((i) => Math.max(0, i - 1))}
          disabled={stateIdx === 0}
          style={{
            width: 32,
            height: 32,
            borderRadius: 100,
            border: "none",
            background: "transparent",
            color:
              stateIdx === 0 ? "var(--tool-text-muted)" : "var(--tool-text)",
            cursor: stateIdx === 0 ? "not-allowed" : "pointer",
            fontSize: 14,
          }}
        >
          ←
        </button>
        <div
          style={{
            padding: "0 12px",
            fontSize: 11,
            color: "var(--tool-text-secondary)",
            minWidth: 70,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {stateIdx + 1} / {STATES.length}
        </div>
        <button
          onClick={() => setStateIdx((i) => Math.min(STATES.length - 1, i + 1))}
          disabled={stateIdx === STATES.length - 1}
          style={{
            width: 32,
            height: 32,
            borderRadius: 100,
            border: "none",
            background: "transparent",
            color:
              stateIdx === STATES.length - 1
                ? "var(--tool-text-muted)"
                : "var(--tool-text)",
            cursor: stateIdx === STATES.length - 1 ? "not-allowed" : "pointer",
            fontSize: 14,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

function CapsuleTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        fontSize: 12,
        fontWeight: 600,
        border: "none",
        borderRadius: 100,
        background: active ? "var(--tool-text)" : "transparent",
        color: active ? "var(--tool-sidebar)" : "var(--tool-text-secondary)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* ── UI panel — 3 phones side by side ──────────────────────── */

function UIPanel({ states, isMobile }: { states: StateDef[]; isMobile: boolean }) {
  const SCALE = isMobile ? 0.72 : 0.6;
  const W = 390;
  const H = 844;
  const PAD = 6;
  const frameW = Math.round(W * SCALE) + PAD * 2;
  const frameH = Math.round(H * SCALE) + PAD * 2;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: isMobile ? 16 : 28,
        padding: isMobile ? "0 16px 80px" : "0 32px 60px",
        overflow: "auto",
        flexWrap: "wrap",
      }}
    >
      {states.map((s) => (
        <div
          key={s.param}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              width: frameW,
              height: frameH,
              borderRadius: Math.round(52 * SCALE),
              background: "#1a1a1a",
              border: "1px solid #333",
              padding: PAD,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: Math.round(12 * SCALE) + PAD,
                left: "50%",
                transform: "translateX(-50%)",
                width: Math.round(120 * SCALE),
                height: Math.round(36 * SCALE),
                borderRadius: 16,
                background: "#000",
                zIndex: 10,
              }}
            />
            <div
              style={{
                width: Math.round(W * SCALE),
                height: Math.round(H * SCALE),
                borderRadius: Math.round(44 * SCALE),
                overflow: "hidden",
                background: "#000",
              }}
            >
              <iframe
                src={`/bill-sheet/view?case=${s.param}`}
                style={{
                  width: W,
                  height: H,
                  border: "none",
                  transform: `scale(${SCALE})`,
                  transformOrigin: "0 0",
                  pointerEvents: "auto",
                }}
                title={s.label}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--tool-text)",
              textAlign: "center",
              maxWidth: frameW,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Inspect panel ─────────────────────────────────────────── */

function InspectPanel({
  state,
  iframeSrc,
  isMobile,
}: {
  state: StateDef;
  iframeSrc: string;
  isMobile: boolean;
}) {
  const SCALE = isMobile ? 0.62 : 0.68;
  const W = 390;
  const H = 844;
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : `${Math.round(W * SCALE) + 40}px 1fr`,
        gap: isMobile ? 20 : 24,
        padding: isMobile ? "0 16px 80px" : "0 32px 60px",
        overflow: "auto",
      }}
    >
      {/* Phone preview with zone overlays */}
      <div
        style={{
          position: isMobile ? "static" : "sticky",
          top: 80,
          alignSelf: "start",
          justifySelf: isMobile ? "center" : "start",
        }}
      >
        <div
          style={{
            width: Math.round(W * SCALE),
            height: Math.round(H * SCALE),
            borderRadius: Math.round(44 * SCALE),
            overflow: "hidden",
            background: "#000",
            position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            style={{
              width: W,
              height: H,
              border: "none",
              transform: `scale(${SCALE})`,
              transformOrigin: "0 0",
              pointerEvents: "none",
            }}
          />
          {/* Zone overlays */}
          {state.zones.map(
            (z, i) =>
              z.bbox && (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${z.bbox[0]}%`,
                    top: `${z.bbox[1]}%`,
                    width: `${z.bbox[2]}%`,
                    height: `${z.bbox[3]}%`,
                    border: "2px dashed var(--tool-accent)",
                    borderRadius: 6,
                    background: "rgba(37, 99, 235, 0.06)",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: -18,
                      left: 0,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--tool-accent)",
                      background: "var(--tool-sidebar)",
                      border: "1px solid var(--tool-accent)",
                      padding: "1px 6px",
                      borderRadius: 100,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
              ),
          )}
        </div>
      </div>

      {/* Info panel */}
      <div style={{ minWidth: 0, fontSize: 13, lineHeight: 1.6 }}>
        <Section title="Mental model">
          <Row label="User goal" value={state.mentalModel.userGoal} />
          <Row label="Context" value={state.mentalModel.context} />
          <Row label="Emotion" value={state.mentalModel.emotion} />
          <Row
            label="Decision points"
            value={
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 16,
                  color: "var(--tool-text-secondary)",
                }}
              >
                {state.mentalModel.decisionPoints.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            }
          />
          <Row label="Success" value={state.mentalModel.successCriteria} />
        </Section>

        <Section title="Zones">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {state.zones.map((z, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 14px",
                  background: "var(--tool-sidebar)",
                  border: "1px solid var(--tool-border)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      background: "var(--tool-accent)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontWeight: 600 }}>{z.zone}</span>
                </div>
                <div
                  style={{
                    color: "var(--tool-text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  {z.content}
                </div>
                <div
                  style={{
                    color: "var(--tool-text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  <b style={{ fontStyle: "normal" }}>Why: </b>
                  {z.why}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {state.reference && (
          <Section title="Reference">
            <div style={{ color: "var(--tool-text-secondary)" }}>
              {state.reference}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--tool-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid var(--tool-border)",
      }}
    >
      <div style={{ color: "var(--tool-text-muted)", fontSize: 12 }}>
        {label}
      </div>
      <div style={{ color: "var(--tool-text-secondary)", fontSize: 13 }}>
        {value}
      </div>
    </div>
  );
}

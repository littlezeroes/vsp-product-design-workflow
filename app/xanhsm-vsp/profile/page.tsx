"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Home,
  Clock,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Info,
  Crown,
  Heart,
  Star,
  UserPlus,
  FileText,
  Headphones,
  Building2,
  Map as MapIcon,
  IdCard,
  Languages,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Users,
  Leaf,
  TrendingUp,
  Plus,
  ArrowLeftRight,
  QrCode,
  Check,
} from "lucide-react"

type HomeState = "no-vsp" | "fresh-50k" | "half-unlocked" | "active"

const BG_GRAD = "linear-gradient(180deg, #c9e7e8 0%, #e8f3f3 45%, #f4f6f7 100%)"

function StatusBar() {
  return (
    <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
      <span className="text-[15px] font-semibold">10:05</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <span className="text-[11px] font-bold">5G</span>
        <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div></div>
      </div>
    </div>
  )
}

function ProfileInner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as HomeState) ?? "no-vsp"

  // CTA claim logic: cả 2 case đều đi thẳng T&C. PIN làm sau trong Wallet progress card.
  const claimHref =
    state === "no-vsp"
      ? "/xanhsm-vsp/claim?state=tnc&case=new"
      : "/xanhsm-vsp/claim?state=tnc&case=existing"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col" style={{ background: BG_GRAD }}>
      {/* map texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%), linear-gradient(45deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col pb-[120px]">
        <StatusBar />

        {/* User card — Profile là TAB, không có NavBar/back arrow */}
        <div className="px-[16px] pt-[6px] pb-[14px]">
          <div className="bg-white rounded-[18px] px-[14px] py-[12px] flex items-center gap-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0" style={{ background: "#cfe9ff" }}>
              <User size={26} className="text-[#4a90d9]" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <span className="text-[17px] font-black leading-none">Cao Minh</span>
              </div>
              <div className="text-[12px] text-foreground-secondary mt-[4px] leading-none">+84834838607</div>
            </div>
            <button className="h-[34px] px-[14px] rounded-full border border-foreground/10 flex items-center gap-[4px] active:opacity-70">
              <span className="text-[12px] font-semibold">Hồ sơ</span>
              <ChevronRight size={12} className="text-foreground-secondary" />
            </button>
          </div>
        </div>

        {/* ═══ KỲ SỰ XANH — entry point NỔI BẬT (hero) ═══ */}
        <div className="px-[16px] pb-[16px]">
          <div
            className="rounded-[22px] overflow-hidden relative shadow-[0_6px_20px_rgba(40,189,191,0.18)]"
            style={{
              background:
                "linear-gradient(135deg, #c9f0d5 0%, #d9f0a8 50%, #f4e88a 100%)",
            }}
          >
            {/* floating leaf deco */}
            <div className="absolute -top-[18px] -right-[10px] text-[90px] opacity-40 pointer-events-none leading-none select-none">
              🌿
            </div>

            <div className="relative px-[18px] pt-[16px] pb-[16px]">
              {/* Badge */}
              <div className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full bg-white/70 backdrop-blur-sm mb-[14px]">
                <Leaf size={12} style={{ color: "#0a6b4e" }} strokeWidth={2.5} />
                <span className="text-[11px] font-black tracking-wide" style={{ color: "#0a6b4e" }}>
                  KỲ SỰ XANH
                </span>
              </div>

              {/* Main number */}
              <div className="flex items-baseline gap-[6px] mb-[4px]">
                <span className="text-[40px] font-black tracking-[-1px] leading-none" style={{ color: "#0a6b4e" }}>
                  2.687
                </span>
                <span className="text-[15px] font-bold leading-none" style={{ color: "#0a6b4e" }}>
                  cây xanh
                </span>
              </div>
              <div className="text-[13px] font-semibold mb-[12px]" style={{ color: "#0b5457" }}>
                Tương đương <span className="font-black">50.000₫</span> phần thưởng
              </div>

              {/* Benefits — 50K dùng được cho */}
              <div className="mb-[6px]">
                <span className="text-[10.5px] font-semibold" style={{ color: "#0a6b4e" }}>
                  Tiền đổi dùng được cho
                </span>
              </div>
              <div className="flex gap-[6px] mb-[14px] flex-wrap">
                {[
                  { emoji: "🚗", label: "Gọi xe" },
                  { emoji: "🍜", label: "Đặt đồ ăn" },
                  { emoji: "🎁", label: "Nạp Green e-Card" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="h-[26px] px-[10px] rounded-full bg-white/70 backdrop-blur-sm flex items-center gap-[5px]"
                  >
                    <span className="text-[12px] leading-none">{b.emoji}</span>
                    <span className="text-[10.5px] font-bold leading-none" style={{ color: "#0a6b4e" }}>
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA pill — prominent tiffany */}
              <button
                onClick={() => router.push(claimHref)}
                className="w-full h-[52px] rounded-full text-white font-black text-[15px] flex items-center justify-center gap-[8px] active:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #28bdbf 0%, #0b5457 100%)",
                  boxShadow: "0 4px 14px rgba(40,189,191,0.45)",
                }}
              >
                <TrendingUp size={18} strokeWidth={2.5} />
                <span>Đổi thành tiền · +50.000₫</span>
              </button>

              <div className="text-center text-[10.5px] font-semibold mt-[8px]" style={{ color: "#0b5457", opacity: 0.75 }}>
                Quy đổi 1 lần → cộng trực tiếp vào ví V-Smart Pay
              </div>
            </div>
          </div>
        </div>

        {/* Feature tiles — Thanh toán + VSP (row1) · Hồ sơ DN + Tài khoản gia đình (row2) */}
        <div className="px-[16px] pb-[14px] grid grid-cols-2 gap-[8px]">
          <button className="bg-white rounded-[14px] h-[88px] px-[12px] py-[10px] flex flex-col items-start justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:opacity-80">
            <div className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center" style={{ background: "#e8f4fe" }}>
              <FileText size={18} className="text-[#4a90d9]" strokeWidth={2} />
            </div>
            <div className="text-[12px] font-black leading-tight text-left">Thanh toán</div>
          </button>

          {/* VSP small card — state-aware */}
          <button
            onClick={() =>
              router.push(
                state === "no-vsp"
                  ? "/xanhsm-vsp/claim?state=tnc&case=new"
                  : `/xanhsm-vsp/wallet?state=${state}`
              )
            }
            className="rounded-[14px] h-[88px] px-[12px] py-[10px] flex flex-col items-start justify-between active:opacity-90 text-left relative overflow-hidden"
            style={{
              background:
                state === "active"
                  ? "linear-gradient(135deg, #28bdbf 0%, #0b5457 100%)"
                  : "#ffffff",
              boxShadow:
                state === "active"
                  ? "0 2px 10px rgba(40,189,191,0.25)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
              border: state === "no-vsp" ? "1.5px dashed #bfd5d4" : undefined,
            }}
          >
            <div className="flex items-center gap-[6px]">
              <Image src="/vsp-logo.png" alt="VSP" width={28} height={28} className="rounded-[22%]" />
              {(state === "fresh-50k" || state === "half-unlocked") && (
                <div
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#28bdbf ${state === "half-unlocked" ? 66 : 33}%, #e5e7eb 0)`,
                  }}
                >
                  <div className="w-[13px] h-[13px] rounded-full bg-white" />
                </div>
              )}
            </div>
            {state === "active" ? (
              <div>
                <div className="text-[9.5px] font-bold text-white/75 uppercase tracking-wide leading-none">V-Smart Pay</div>
                <div className="text-[14px] font-black text-white leading-none mt-[3px] tracking-[-0.2px]">
                  156.000<span className="text-[9px] font-bold text-white/60 ml-[1px]">₫</span>
                </div>
              </div>
            ) : state === "fresh-50k" || state === "half-unlocked" ? (
              <div>
                <div className="text-[9.5px] font-bold text-foreground-secondary uppercase tracking-wide leading-none">V-Smart Pay</div>
                <div className="text-[12px] font-black leading-tight mt-[3px]" style={{ color: "#0b5457" }}>
                  Còn {state === "half-unlocked" ? "1" : "2"} bước
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[9.5px] font-bold text-foreground-secondary uppercase tracking-wide leading-none">V-Smart Pay</div>
                <div className="text-[12px] font-black leading-tight mt-[3px]" style={{ color: "#0b5457" }}>
                  Kích hoạt ví
                </div>
              </div>
            )}
          </button>

          <button className="bg-white rounded-[14px] h-[88px] px-[12px] py-[10px] flex flex-col items-start justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:opacity-80">
            <div className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center" style={{ background: "#fff5d9" }}>
              <ShoppingBag size={18} className="text-[#c89614]" strokeWidth={2} />
            </div>
            <div className="text-[12px] font-black leading-tight text-left">Hồ sơ doanh nghiệp</div>
          </button>

          <button className="bg-white rounded-[14px] h-[88px] px-[12px] py-[10px] flex flex-col items-start justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:opacity-80">
            <div className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center" style={{ background: "#e4f7ee" }}>
              <Users size={18} className="text-[#2d9d6e]" strokeWidth={2} />
            </div>
            <div className="text-[12px] font-black leading-tight text-left">Tài khoản gia đình</div>
          </button>
        </div>

        {/* Xác thực danh tính info card */}
        <div className="px-[16px] pb-[14px]">
          <button className="w-full bg-white/70 rounded-[14px] px-[14px] py-[12px] flex items-start gap-[10px] text-left active:opacity-80">
            <Info size={14} className="shrink-0 mt-[1px]" style={{ color: "#4a90d9" }} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-black leading-tight" style={{ color: "#234a78" }}>Xác thực danh tính</div>
              <div className="text-[10.5px] leading-[1.4] mt-[3px]" style={{ color: "#234a78", opacity: 0.75 }}>
                Vui lòng hoàn tất xác minh danh tính bằng cách quét mặt hoặc giấy tờ tùy thân ngay hôm nay, để bảo vệ tài khoản của bạn và giao dịch an toàn hơn.
              </div>
            </div>
            <ChevronRight size={14} className="text-foreground-secondary shrink-0 mt-[2px]" />
          </button>
        </div>

        {/* Section: Hạng thành viên & Ưu đãi */}
        <Section title="Hạng thành viên & Ưu đãi">
          <Row icon={Crown} label="Gói hội viên" />
          <Row icon={Heart} label="Mã Khuyến mại" />
          <Row icon={Star} label="Hạng thành viên" />
          <Row icon={UserPlus} label="Giới thiệu bạn bè" />
        </Section>

        {/* Section: Thông tin cá nhân */}
        <Section title="Thông tin cá nhân">
          <Row icon={FileText} label="Thông tin hoá đơn" />
          <Row icon={Heart} label="Địa chỉ đã lưu" />
        </Section>

        <Section title="Hỗ trợ">
          <Row icon={Info} label="Điều khoản và Chính sách" />
          <Row icon={Headphones} label="Trung tâm hỗ trợ" />
          <Row icon={Building2} label="Thông tin công ty" />
        </Section>

        <Section title="Cơ hội hợp tác">
          <Row icon={MapIcon} label="Đóng góp bản đồ" />
          <Row icon={IdCard} label="Trở thành tài xế Green SM" />
        </Section>

        <Section title="Cài đặt chung">
          <Row icon={Languages} label="Ngôn ngữ" />
          <Row icon={ShieldCheck} label="Đăng nhập & Bảo mật" />
        </Section>

        {/* Logout + version */}
        <div className="pt-[22px] pb-[22px] flex flex-col items-center gap-[8px]">
          <button className="flex items-center gap-[6px] active:opacity-70">
            <LogOut size={17} className="text-foreground" strokeWidth={2} />
            <span className="text-[16px] font-black">Đăng xuất</span>
          </button>
          <div className="text-[12px] text-foreground-secondary mt-[14px]">Green SM - v5.0.7(344)</div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-[22px] left-[18px] right-[18px] max-w-[354px] mx-auto z-50 flex items-center gap-[8px]">
        <div
          className="flex-1 h-[60px] rounded-full backdrop-blur-[24px] flex items-center justify-around px-[8px] shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
          style={{ background: "rgba(255,255,255,0.82)" }}
        >
          {[
            { icon: Home, label: "Trang chủ", active: false, onClick: () => router.push(`/xanhsm-vsp/gsm-home?state=${state}`) },
            { icon: Clock, label: "Hoạt động", active: false, onClick: () => {} },
            { icon: Bell, label: "Thông báo", active: false, onClick: () => {} },
            { icon: User, label: "Tài khoản", active: true, onClick: () => {} },
          ].map((t) => (
            <button
              key={t.label}
              onClick={t.onClick}
              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${t.active ? "bg-[#86c9cc]/30" : ""}`}
            >
              <t.icon size={22} className={t.active ? "text-[#0b5457]" : "text-foreground-secondary"} strokeWidth={t.active ? 2.2 : 1.7} />
            </button>
          ))}
        </div>
        <button
          className="w-[60px] h-[60px] rounded-full flex flex-col items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
          style={{ background: "radial-gradient(circle at 50% 40%, #b0e8c4 0%, #7fcf9a 100%)" }}
        >
          <span className="text-[18px] leading-none">🌿</span>
          <span className="text-[8px] font-black text-[#0b5457] leading-tight mt-[2px]">XEM NGAY</span>
        </button>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-[60]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-[14px]">
      <div className="px-[22px] pb-[10px]">
        <span className="text-[14px] font-black">{title}</span>
      </div>
      <div className="bg-white/60 mx-[16px] rounded-[14px] divide-y divide-foreground/5">
        {children}
      </div>
    </div>
  )
}

function Row({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; label: string }) {
  return (
    <button className="w-full px-[16px] py-[12px] flex items-center gap-[14px] active:opacity-70">
      <Icon size={18} className="text-foreground-secondary" strokeWidth={1.8} />
      <span className="flex-1 text-left text-[14px] font-semibold">{label}</span>
      <ChevronRight size={14} className="text-foreground-secondary" />
    </button>
  )
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileInner />
    </Suspense>
  )
}

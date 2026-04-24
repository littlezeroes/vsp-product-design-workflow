"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Link2, MessageCircle, Share2, Search, Check, QrCode } from "lucide-react"

const CONTACTS = [
  { name: "Nguyễn Văn An", avatar: "NA", phone: "0901 234 567", invited: false },
  { name: "Bùi Thị Bình", avatar: "BB", phone: "0912 345 678", invited: false },
  { name: "Cao Đức Cường", avatar: "CC", phone: "0923 456 789", invited: true },
  { name: "Đinh Thuỳ Dung", avatar: "DD", phone: "0934 567 890", invited: false },
  { name: "Phạm Minh Quân", avatar: "MQ", phone: "0945 678 901", invited: false },
  { name: "Trần Hồng Sơn", avatar: "HS", phone: "0956 789 012", invited: false },
]

function InviteInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const state = searchParams.get("state") ?? "default"
  const [search, setSearch] = useState("")
  const [invited, setInvited] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(state === "link-copied")

  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Status bar */}
      <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
        <span className="text-[15px] font-semibold">9:41</span>
        <div className="flex items-center gap-[6px]">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div><div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full"/></div>
        </div>
      </div>

      {/* NavBar */}
      <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
        <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={18} />
        </button>
        <span className="flex-1 text-[18px] font-bold">Mời thành viên</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-[40px]">
        {/* Fund context */}
        <div className="px-[22px] pt-[4px]">
          <div className="bg-secondary rounded-14 px-[14px] py-[10px] flex items-center gap-[10px]">
            <div className="w-[32px] h-[32px] rounded-8 bg-background flex items-center justify-center text-[18px] shrink-0">
              🏔️
            </div>
            <div className="min-w-0">
              <div className="text-[12px] text-foreground-secondary">Đang mời vào</div>
              <div className="text-[13px] font-semibold truncate">Du lịch Đà Lạt 2026</div>
            </div>
          </div>
        </div>

        {/* QR hero card */}
        <div className="px-[22px] pt-[20px]">
          <div
            className="rounded-28 p-[24px] flex flex-col items-center text-center"
            style={{ background: "linear-gradient(180deg, #e6f9f1 0%, #c2f0e0 100%)" }}
          >
            {/* QR placeholder — stylised pattern */}
            <div className="w-[200px] h-[200px] bg-background rounded-[20px] p-[12px] relative shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              <div
                className="w-full h-full"
                style={{
                  background: `
                    radial-gradient(circle at 12% 12%, #080808 0 18%, transparent 18%),
                    radial-gradient(circle at 88% 12%, #080808 0 18%, transparent 18%),
                    radial-gradient(circle at 12% 88%, #080808 0 18%, transparent 18%),
                    repeating-linear-gradient(45deg, #080808 0 3px, transparent 3px 7px),
                    repeating-linear-gradient(-45deg, #080808 0 3px, transparent 3px 7px)
                  `,
                  backgroundColor: "#fff",
                  backgroundBlendMode: "normal, normal, normal, multiply, multiply",
                }}
              />
              {/* Center logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] bg-background rounded-[10px] flex items-center justify-center shadow">
                <div className="text-[24px] leading-none">🏔️</div>
              </div>
            </div>
            <div className="mt-[16px] text-[14px] font-bold">Quét QR để tham gia</div>
            <div className="mt-[4px] text-[12px] text-foreground/60">Hoặc dùng link bên dưới</div>
          </div>
        </div>

        {/* Share actions */}
        <div className="px-[22px] pt-[16px] flex gap-[8px]">
          <button
            onClick={handleCopy}
            className="flex-1 h-[56px] bg-secondary rounded-14 flex flex-col items-center justify-center gap-[2px] active:bg-border transition-colors"
          >
            {copied ? (
              <Check size={18} className="text-success" strokeWidth={2.5} />
            ) : (
              <Link2 size={18} />
            )}
            <span className="text-[11px] font-semibold">
              {copied ? "Đã copy" : "Copy link"}
            </span>
          </button>
          <button className="flex-1 h-[56px] bg-secondary rounded-14 flex flex-col items-center justify-center gap-[2px] active:bg-border transition-colors">
            <MessageCircle size={18} />
            <span className="text-[11px] font-semibold">Zalo / SMS</span>
          </button>
          <button className="flex-1 h-[56px] bg-secondary rounded-14 flex flex-col items-center justify-center gap-[2px] active:bg-border transition-colors">
            <Share2 size={18} />
            <span className="text-[11px] font-semibold">Khác</span>
          </button>
        </div>

        {/* Contact search */}
        <div className="pt-[32px]">
          <div className="px-[22px] pb-[12px] flex items-center justify-between">
            <span className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">Từ danh bạ</span>
          </div>

          <div className="px-[22px]">
            <div className="h-[44px] bg-secondary rounded-full flex items-center px-[14px] gap-[10px]">
              <Search size={16} className="text-foreground-secondary shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên hoặc số điện thoại"
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-foreground-secondary"
              />
            </div>
          </div>

          <div className="pt-[8px]">
            {filtered.length === 0 ? (
              <div className="px-[22px] py-[32px] text-center">
                <div className="text-[14px] text-foreground-secondary">Không tìm thấy</div>
              </div>
            ) : (
              filtered.map((contact) => {
                const isInvited = contact.invited || invited[contact.phone]
                return (
                  <div key={contact.phone} className="flex items-center gap-[14px] py-[10px] px-[22px]">
                    <div className="w-[40px] h-[40px] rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold shrink-0">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate">{contact.name}</div>
                      <div className="text-[12px] text-foreground-secondary">{contact.phone}</div>
                    </div>
                    <button
                      onClick={() => setInvited((s) => ({ ...s, [contact.phone]: true }))}
                      disabled={isInvited}
                      className={`h-[32px] px-[14px] rounded-full text-[12px] font-semibold transition-colors ${
                        isInvited
                          ? "bg-secondary text-foreground-secondary"
                          : "bg-foreground text-background active:opacity-80"
                      }`}
                    >
                      {isInvited ? "Đã mời" : "Mời"}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Toast — copied */}
      {copied && (
        <div className="fixed bottom-[40px] left-1/2 -translate-x-1/2 bg-foreground text-background px-[18px] py-[12px] rounded-full text-[13px] font-semibold flex items-center gap-[8px] z-50 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <Check size={14} strokeWidth={2.5} />
          Đã copy link mời
        </div>
      )}

      {/* Home indicator */}
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function QuyNhomInvite() {
  return (
    <Suspense>
      <InviteInner />
    </Suspense>
  )
}

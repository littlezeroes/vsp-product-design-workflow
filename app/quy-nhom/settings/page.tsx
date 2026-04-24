"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Globe,
  LogOut,
  Trash2,
  UserMinus,
  Crown,
  AlertTriangle,
} from "lucide-react"
import { Header } from "@/components/ui/header"
import { Dialog } from "@/components/ui/dialog"

function SettingsInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get("role") ?? "admin"
  const state = searchParams.get("state")
  const isAdmin = role !== "member"

  const [privacy, setPrivacy] = useState<"private" | "public">("private")
  const [dialog, setDialog] = useState<string | null>(state)

  const openDialog = (id: string) => setDialog(id)
  const closeDialog = () => setDialog(null)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title="Cài đặt" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

      <div className="flex-1 overflow-y-auto pb-[24px]">
        {/* Fund info card */}
        <div className="px-[22px] pt-[16px]">
          <div className="flex items-center gap-[14px] py-[12px]">
            <div className="w-[56px] h-[56px] rounded-[18px] bg-secondary flex items-center justify-center text-[32px] shrink-0">
              🏔️
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[17px] font-bold truncate">Du lịch Đà Lạt 2026</div>
              <div className="text-[12px] text-foreground-secondary">5 thành viên · Tạo 01/04/2026</div>
            </div>
          </div>
        </div>

        {/* Section: Thông tin quỹ */}
        <SectionTitle>Thông tin quỹ</SectionTitle>
        <div className="px-[22px]">
          <SettingRow
            label="Tên quỹ"
            value="Du lịch Đà Lạt 2026"
            editable={isAdmin}
            onPress={isAdmin ? () => openDialog("edit-name") : undefined}
            divider
          />
          <SettingRow
            label="Mô tả"
            value="Gom tiền đi Đà Lạt tháng 6"
            editable={isAdmin}
            onPress={isAdmin ? () => openDialog("edit-desc") : undefined}
            divider
          />
          <SettingRow
            label="Mục tiêu"
            value="5.000.000 ₫"
            editable={isAdmin}
            onPress={isAdmin ? () => openDialog("edit-goal") : undefined}
          />
        </div>

        {/* Section: Quyền riêng tư */}
        <SectionTitle>Quyền riêng tư</SectionTitle>
        <div className="px-[22px]">
          <button
            onClick={() => isAdmin && setPrivacy("private")}
            disabled={!isAdmin}
            className="w-full flex items-center gap-[12px] py-[14px] border-b border-border text-left disabled:opacity-60"
          >
            <Lock size={18} className="text-foreground-secondary shrink-0" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">Riêng tư</div>
              <div className="text-[12px] text-foreground-secondary">Chỉ người được mời mới tham gia</div>
            </div>
            <RadioDot checked={privacy === "private"} />
          </button>

          <button
            onClick={() => isAdmin && setPrivacy("public")}
            disabled={!isAdmin}
            className="w-full flex items-center gap-[12px] py-[14px] text-left disabled:opacity-60"
          >
            <Globe size={18} className="text-foreground-secondary shrink-0" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">Công khai</div>
              <div className="text-[12px] text-foreground-secondary">Ai có link đều tham gia được</div>
            </div>
            <RadioDot checked={privacy === "public"} />
          </button>
        </div>

        {/* Section: Quản lý (admin only) */}
        {isAdmin && (
          <>
            <SectionTitle>Quản lý</SectionTitle>
            <div className="px-[22px]">
              <SettingRow
                label="Quản lý thành viên"
                value="5 thành viên"
                onPress={() => router.push("/quy-nhom/dashboard")}
                divider
              />
              <SettingRow
                label="Chuyển quyền admin"
                value="Cho thành viên khác"
                onPress={() => openDialog("transfer-admin")}
                prefix={<Crown size={18} className="text-foreground-secondary" />}
              />
            </div>
          </>
        )}

        {/* Danger zone */}
        <SectionTitle>Khu vực cảnh báo</SectionTitle>
        <div className="px-[22px]">
          {isAdmin ? (
            <button
              onClick={() => openDialog("dissolve")}
              className="w-full flex items-center gap-[12px] py-[14px] text-left"
            >
              <Trash2 size={18} className="text-danger shrink-0" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-danger">Giải tán quỹ</div>
                <div className="text-[12px] text-foreground-secondary">Hoàn tiền về ví từng thành viên</div>
              </div>
              <ChevronRight size={16} className="text-danger opacity-60" />
            </button>
          ) : (
            <button
              onClick={() => openDialog("leave")}
              className="w-full flex items-center gap-[12px] py-[14px] text-left"
            >
              <LogOut size={18} className="text-danger shrink-0" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-danger">Rời quỹ</div>
                <div className="text-[12px] text-foreground-secondary">Hoàn tiền bạn đã góp</div>
              </div>
              <ChevronRight size={16} className="text-danger opacity-60" />
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      {/* Dialogs */}
      <Dialog
        open={dialog === "dissolve"}
        onClose={closeDialog}
        type="icon"
        icon={<AlertTriangle size={36} className="text-danger" strokeWidth={1.5} />}
        title="Giải tán quỹ?"
        description="Toàn bộ 1.200.000 ₫ sẽ được hoàn về ví từng thành viên theo tỷ lệ góp. Hành động không thể hoàn tác."
        primaryLabel="Giải tán"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { intent: "danger", onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />

      <Dialog
        open={dialog === "leave"}
        onClose={closeDialog}
        type="icon"
        icon={<LogOut size={36} className="text-danger" strokeWidth={1.5} />}
        title="Rời quỹ?"
        description="Bạn sẽ nhận lại số tiền đã góp. Sau khi rời, bạn không thể tham gia lại trừ khi được admin mời."
        primaryLabel="Rời quỹ"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { intent: "danger", onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />

      <Dialog
        open={dialog === "transfer-admin"}
        onClose={closeDialog}
        type="icon"
        icon={<Crown size={36} className="text-foreground" strokeWidth={1.5} />}
        title="Chuyển quyền admin"
        description="Chọn thành viên để trao quyền admin. Bạn sẽ mất quyền quản lý sau khi chuyển."
        primaryLabel="Chọn thành viên"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />

      <Dialog
        open={dialog === "edit-name"}
        onClose={closeDialog}
        title="Sửa tên quỹ"
        description="Tên mới sẽ hiển thị cho toàn bộ thành viên."
        primaryLabel="Lưu"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />

      <Dialog
        open={dialog === "edit-desc"}
        onClose={closeDialog}
        title="Sửa mô tả"
        description="Mô tả giúp thành viên hiểu mục đích quỹ."
        primaryLabel="Lưu"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />

      <Dialog
        open={dialog === "edit-goal"}
        onClose={closeDialog}
        title="Sửa mục tiêu"
        description="Số tiền mục tiêu quỹ hướng tới."
        primaryLabel="Lưu"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />

      <Dialog
        open={dialog === "remove-member"}
        onClose={closeDialog}
        type="icon"
        icon={<UserMinus size={36} className="text-danger" strokeWidth={1.5} />}
        title="Xoá thành viên?"
        description="Tiền đã góp sẽ được hoàn về ví của họ. Họ sẽ không thể góp thêm trừ khi được mời lại."
        primaryLabel="Xoá"
        secondaryLabel="Huỷ"
        footerProps={{
          primaryProps: { intent: "danger", onClick: closeDialog },
          secondaryProps: { onClick: closeDialog },
        }}
      />
    </div>
  )
}

/* ── Section title ─────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[22px] pt-[24px] pb-[12px]">
      <span className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">
        {children}
      </span>
    </div>
  )
}

/* ── Setting row ─────────────────────── */
function SettingRow({
  label,
  value,
  editable,
  onPress,
  divider,
  prefix,
}: {
  label: string
  value: string
  editable?: boolean
  onPress?: () => void
  divider?: boolean
  prefix?: React.ReactNode
}) {
  const Tag = onPress ? "button" : "div"
  return (
    <Tag
      onClick={onPress}
      className={`w-full flex items-center gap-[12px] py-[14px] text-left ${divider ? "border-b border-border" : ""}`}
    >
      {prefix}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-foreground-secondary">{label}</div>
        <div className="text-[14px] font-semibold truncate">{value}</div>
      </div>
      {onPress && <ChevronRight size={16} className="text-foreground-secondary shrink-0" />}
    </Tag>
  )
}

/* ── Radio dot (visual only) ─────────────────────── */
function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div className={`w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${checked ? "border-foreground" : "border-border-bold"}`}>
      {checked && <div className="w-[10px] h-[10px] rounded-full bg-foreground" />}
    </div>
  )
}

export default function QuyNhomSettings() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  )
}

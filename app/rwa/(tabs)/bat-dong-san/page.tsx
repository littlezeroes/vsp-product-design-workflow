"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  MapPin, Bed, Maximize2, ChevronRight,
  ArrowRightLeft, Coins, Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tip } from "@/components/ui/tip"
import {
  getAllProperties, getProject, formatVNDShort,
  HOLDINGS,
  type RwaProperty,
} from "../../data"

/* ── Type filter ─────────────────────────────────────────────────── */
type TypeFilter = "all" | "apartment" | "villa" | "penthouse" | "shophouse"

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "apartment", label: "Căn hộ" },
  { key: "villa", label: "Biệt thự" },
  { key: "penthouse", label: "Penthouse" },
  { key: "shophouse", label: "Shophouse" },
]

/* ── Property Card ───────────────────────────────────────────────── */
function PropertyCard({ property }: { property: RwaProperty }) {
  const router = useRouter()
  const project = getProject(property.projectId)

  // Check if user holds tokens in this project
  const holding = HOLDINGS.find((h) => h.projectId === property.projectId)
  const userTokens = holding?.shares ?? 0
  const progress = Math.min(100, Math.round((userTokens / property.tokensRequired) * 100))

  return (
    <button
      type="button"
      onClick={() => router.push(`/rwa/project/${property.projectId}`)}
      className="w-full bg-secondary rounded-[28px] overflow-hidden text-left"
    >
      <div className="px-[18px] py-[16px]">
        {/* Property identity */}
        <div className="flex gap-[14px]">
          {/* Thumbnail */}
          <div className="w-[72px] h-[72px] rounded-[16px] bg-foreground/5 flex items-center justify-center shrink-0">
            <Building2 size={24} className="text-foreground-secondary/20" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-foreground leading-tight line-clamp-2">
              {property.name}
            </p>
            {project && (
              <div className="flex items-center gap-[4px] mt-[4px]">
                <MapPin size={11} className="text-foreground-secondary shrink-0" />
                <span className="text-xs text-foreground-secondary truncate">{project.location}</span>
              </div>
            )}
            {/* Specs */}
            <div className="flex items-center gap-[10px] mt-[6px]">
              <div className="flex items-center gap-[3px]">
                <Maximize2 size={11} className="text-foreground-secondary" />
                <span className="text-[11px] text-foreground-secondary">{property.area} m²</span>
              </div>
              <div className="flex items-center gap-[3px]">
                <Bed size={11} className="text-foreground-secondary" />
                <span className="text-[11px] text-foreground-secondary">{property.bedrooms} PN</span>
              </div>
              <span className="text-[11px] text-foreground-secondary">Tầng {property.floor}</span>
            </div>
          </div>
        </div>

        {/* Token requirement — subtle, informational */}
        <div className="mt-[14px] flex items-center justify-between">
          <div>
            <p className="text-[10px] text-foreground-secondary">Giá trị BĐS</p>
            <p className="text-[17px] font-bold text-foreground tabular-nums">
              {formatVNDShort(property.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-foreground-secondary">Đổi từ</p>
            <p className="text-sm font-semibold text-foreground tabular-nums">
              {property.tokensRequired.toLocaleString()} token
            </p>
          </div>
        </div>

        {/* Token progress — only show if user has tokens */}
        {userTokens > 0 && (
          <div className="mt-[10px]">
            <div className="flex items-center justify-between mb-[4px]">
              <span className="text-[11px] text-foreground-secondary">
                Bạn có {userTokens} / {property.tokensRequired.toLocaleString()} token
              </span>
              <span className="text-[11px] font-semibold text-foreground-secondary tabular-nums">
                {progress}%
              </span>
            </div>
            <div className="h-[3px] bg-foreground/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/20"
                style={{ width: `${Math.max(progress, 2)}%` }}
              />
            </div>
          </div>
        )}

        {/* Redemption note — subtle */}
        <div className="mt-[10px] flex items-center justify-between">
          <span className="text-[10px] text-foreground-secondary/60">
            Đổi token → BĐS thật · Sắp mở
          </span>
          <ChevronRight size={14} className="text-foreground-secondary/30" />
        </div>
      </div>
    </button>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function PropertyListPage() {
  const [filter, setFilter] = React.useState<TypeFilter>("all")
  const allProperties = getAllProperties()

  const filtered = React.useMemo(() => {
    if (filter === "all") return allProperties
    return allProperties.filter((p) => p.type === filter)
  }, [filter, allProperties])

  return (
    <div>
      {/* Intro — subtle explainer */}
      <div className="px-[22px] pt-[4px] pb-[12px]">
        <div className="bg-secondary rounded-[16px] px-[14px] py-[10px]">
          <div className="flex items-center gap-[8px]">
            <ArrowRightLeft size={14} className="text-foreground-secondary shrink-0" />
            <p className="text-xs text-foreground-secondary">
              BĐS cơ sở của các dự án token — sau này có thể <Tip text="Khi bạn sở hữu đủ số token tương ứng, bạn có quyền đổi token lấy quyền sở hữu BĐS thật">đổi token lấy BĐS thật</Tip>
            </p>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-[22px] pb-[8px]">
        <div className="flex items-center gap-[6px] overflow-x-auto no-scrollbar">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={cn(
                "px-[12px] py-[7px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0",
                filter === t.key
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground-secondary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property list */}
      <div className="px-[22px] pt-[4px]">
        {filtered.length > 0 ? (
          <div className="space-y-[14px]">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="py-[40px] text-center">
            <p className="text-sm text-foreground-secondary">Chưa có bất động sản nào</p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Clock,
  Moon,
  Sun,
  LayoutGrid,
  List,
  Star,
  Share2,
  Trash2,
  Folder,
  ChevronDown,
  MoreHorizontal,
  Users,
  FileText,
  Sparkles,
} from "lucide-react"

/* ──────── Feature registry ──────── */
interface FeatureCard {
  id: string
  name: string
  description: string
  route: string
  /** route to iframe for thumbnail preview */
  previewRoute: string
  status: "in-progress" | "done" | "draft"
  epics: number
  screens: number
  states: number
  lastUpdated: string
  lastUpdatedRelative: string
  owner: string
}

const FEATURES: FeatureCard[] = [
  {
    id: "quy-nhom",
    name: "Quỹ nhóm",
    description: "Nhóm góp tiền chung mục tiêu",
    route: "/quy-nhom",
    previewRoute: "/quy-nhom/list",
    status: "in-progress",
    epics: 8,
    screens: 13,
    states: 32,
    lastUpdated: "2026-04-18T21:45",
    lastUpdatedRelative: "vài giây trước",
    owner: "Huy",
  },
  {
    id: "sinhloi",
    name: "Sinh lời",
    description: "Tài khoản tích lũy sinh lãi",
    route: "/sinhloi/states",
    previewRoute: "/sinhloi/dashboard",
    status: "done",
    epics: 5,
    screens: 11,
    states: 24,
    lastUpdated: "2026-04-15",
    lastUpdatedRelative: "3 ngày trước",
    owner: "Huy",
  },
  {
    id: "bidv-link",
    name: "Liên kết ngân hàng",
    description: "Kết nối ví với BIDV",
    route: "/bidv-link/states",
    previewRoute: "/bidv-link/bank-management",
    status: "done",
    epics: 6,
    screens: 14,
    states: 28,
    lastUpdated: "2026-04-11",
    lastUpdatedRelative: "1 tuần trước",
    owner: "Huy",
  },
  {
    id: "transfer",
    name: "Chuyển tiền",
    description: "Chuyển tiền liên ví và liên ngân hàng",
    route: "/transfer/states",
    previewRoute: "/transfer",
    status: "done",
    epics: 4,
    screens: 9,
    states: 19,
    lastUpdated: "2026-04-04",
    lastUpdatedRelative: "2 tuần trước",
    owner: "Huy",
  },
  {
    id: "vas",
    name: "Dịch vụ tiện ích",
    description: "Nạp điện thoại, hoá đơn, thẻ cào",
    route: "/vas/states",
    previewRoute: "/vas",
    status: "done",
    epics: 3,
    screens: 8,
    states: 16,
    lastUpdated: "2026-04-04",
    lastUpdatedRelative: "2 tuần trước",
    owner: "Huy",
  },
  {
    id: "sbh",
    name: "SBH · Sổ ghi",
    description: "Sổ tay ghi chép chi tiêu",
    route: "/sbh/states",
    previewRoute: "/sbh",
    status: "in-progress",
    epics: 3,
    screens: 7,
    states: 14,
    lastUpdated: "2026-03-18",
    lastUpdatedRelative: "1 tháng trước",
    owner: "Huy",
  },
  {
    id: "sub-merchants",
    name: "Đối tác phụ",
    description: "Quản lý sub-merchant",
    route: "/sub-merchants/states",
    previewRoute: "/sub-merchants",
    status: "draft",
    epics: 2,
    screens: 5,
    states: 10,
    lastUpdated: "2026-03-18",
    lastUpdatedRelative: "1 tháng trước",
    owner: "Huy",
  },
  {
    id: "service-hub",
    name: "Service Hub",
    description: "Entry point đến tất cả dịch vụ",
    route: "/service-hub",
    previewRoute: "/service-hub/home",
    status: "draft",
    epics: 1,
    screens: 3,
    states: 6,
    lastUpdated: "2026-02-18",
    lastUpdatedRelative: "2 tháng trước",
    owner: "Huy",
  },
]

type NavSection = "recents" | "starred" | "shared" | "drafts" | "trash"
type Filter = "all" | "in-progress" | "done" | "draft"
type View = "grid" | "list"

export default function DesignReviewDashboard() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [view, setView] = useState<View>("grid")
  const [section, setSection] = useState<NavSection>("recents")
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  const filtered = FEATURES.filter((f) => {
    const matchSearch = search === "" || f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || f.status === filter
    return matchSearch && matchFilter
  })

  const recents = [...filtered].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))

  return (
    <div className="dr-scope" data-theme={theme}>
      <style>{`
        .dr-scope[data-theme="light"] {
          --canvas: #fafaf9;
          --surface: #ffffff;
          --sidebar: #f4f4f2;
          --hover: #ebebe8;
          --active: #e6e6e3;
          --border: #e5e5e2;
          --border-strong: #d4d4d1;
          --text: #0a0a0a;
          --text-secondary: #525252;
          --text-muted: #737373;
          --accent: #0a0a0a;
          --accent-text: #ffffff;
        }
        .dr-scope[data-theme="dark"] {
          --canvas: #0c0c0c;
          --surface: #141414;
          --sidebar: #0a0a0a;
          --hover: #1a1a1a;
          --active: #222222;
          --border: #1f1f1f;
          --border-strong: #2a2a2a;
          --text: #f5f5f5;
          --text-secondary: #a3a3a3;
          --text-muted: #737373;
          --accent: #ffffff;
          --accent-text: #0a0a0a;
        }
        .dr-scope {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: var(--canvas);
          color: var(--text);
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: -0.005em;
        }
        .dr-scope * { font-family: inherit; }
        .dr-scope a { color: inherit; text-decoration: none; }
        .dr-thumb-wrap {
          position: relative;
          background: var(--hover);
          overflow: hidden;
        }
        .dr-thumb-iframe {
          width: 390px;
          height: 844px;
          border: none;
          transform: scale(0.42);
          transform-origin: 0 0;
          pointer-events: none;
        }
      `}</style>

      {/* ─────── Left nav sidebar — fixed, own scroll ─────── */}
      <aside style={{
        width: 232,
        minWidth: 232,
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
        padding: "16px 0 0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}>
        {/* Team switcher */}
        <button style={{
          margin: "0 10px 18px",
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          color: "var(--text)",
          fontFamily: "inherit",
          transition: "background 0.1s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "linear-gradient(135deg, #00b182 0%, #00dda3 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 12,
            flexShrink: 0,
          }}>V</div>
          <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>VSP Design</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Team workspace</div>
          </div>
          <ChevronDown size={12} strokeWidth={1.8} style={{ color: "var(--text-muted)" }} />
        </button>

        {/* Nav sections */}
        <nav style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 1 }}>
          <NavItem icon={Clock} label="Recents" active={section === "recents"} onClick={() => setSection("recents")} />
          <NavItem icon={Star} label="Starred" active={section === "starred"} onClick={() => setSection("starred")} />
          <NavItem icon={Share2} label="Shared with me" active={section === "shared"} onClick={() => setSection("shared")} />
          <NavItem icon={FileText} label="Drafts" active={section === "drafts"} onClick={() => setSection("drafts")} />
          <NavItem icon={Trash2} label="Trash" active={section === "trash"} onClick={() => setSection("trash")} />
        </nav>

        {/* Teams / Projects section */}
        <div style={{ padding: "18px 10px 6px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", padding: "0 10px", marginBottom: 6 }}>
            Projects
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <NavItem icon={Folder} label="V-Smart Pay v1.0" />
            <NavItem icon={Folder} label="V-Smart Pay v2.0" />
            <NavItem icon={Folder} label="Design System" />
          </nav>
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer actions */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setTheme((t) => t === "light" ? "dark" : "light")}
            style={{
              width: "100%",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 12,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {theme === "light" ? <Moon size={13} strokeWidth={1.8} /> : <Sun size={13} strokeWidth={1.8} />}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </aside>

      {/* ─────── Main content — header sticky, body scrolls ─────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>
        {/* Top bar — sticky */}
        <header style={{
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "var(--canvas)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{
            flex: 1,
            maxWidth: 520,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface)",
          }}>
            <Search size={13} strokeWidth={1.8} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm file, screen, epic..."
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                color: "var(--text)",
                fontSize: 12,
                fontFamily: "inherit",
              }}
            />
            <kbd style={{
              fontSize: 10,
              color: "var(--text-muted)",
              padding: "1px 5px",
              borderRadius: 4,
              background: "var(--hover)",
              fontFamily: "inherit",
            }}>⌘K</kbd>
          </div>

          <div style={{ flex: 1 }} />

          <button style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            background: "var(--accent)",
            color: "var(--accent-text)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <Plus size={13} strokeWidth={2.2} />
            Create new
          </button>

          <div style={{
            width: 30, height: 30, borderRadius: 15,
            background: "linear-gradient(135deg, #00b182 0%, #00dda3 100%)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>HK</div>
        </header>

        {/* Secondary breadcrumb bar */}
        <div style={{
          padding: "10px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--canvas)",
          flexShrink: 0,
          fontSize: 12,
          color: "var(--text-secondary)",
        }}>
          <span>VSP Design</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 2L7 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <span style={{ color: "var(--text)", fontWeight: 600, textTransform: "capitalize" }}>{section}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{filtered.length} file{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Content body */}
        <main style={{ flex: 1, overflow: "auto", padding: "20px 28px 60px" }}>
          {/* Recent row — horizontal scroll */}
          {section === "recents" && search === "" && filter === "all" && (
            <section style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Sparkles size={13} strokeWidth={1.8} style={{ color: "var(--text-secondary)" }} />
                <h2 style={{ fontSize: 12, fontWeight: 600, margin: 0, color: "var(--text-secondary)" }}>Recently viewed</h2>
                <div style={{ flex: 1 }} />
                <button style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>View all</button>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "thin" }}>
                {recents.slice(0, 6).map((f) => (
                  <RecentCard key={f.id} feature={f} />
                ))}
              </div>
            </section>
          )}

          {/* All files */}
          <section>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: "var(--text-secondary)" }}>
                All files · {filtered.length}
              </h2>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FilterDropdown filter={filter} setFilter={setFilter} />
                <div style={{ display: "flex", padding: 2, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7 }}>
                  <ViewToggle active={view === "grid"} onClick={() => setView("grid")}>
                    <LayoutGrid size={12} strokeWidth={1.8} />
                  </ViewToggle>
                  <ViewToggle active={view === "list"} onClick={() => setView("list")}>
                    <List size={12} strokeWidth={1.8} />
                  </ViewToggle>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState search={search} />
            ) : view === "grid" ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}>
                {filtered.map((f) => <FileGridCard key={f.id} feature={f} />)}
              </div>
            ) : (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 0.8fr 32px", padding: "8px 16px", fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)" }}>
                  <div>Name</div>
                  <div>Status</div>
                  <div style={{ textAlign: "right" }}>Screens</div>
                  <div style={{ textAlign: "right" }}>States</div>
                  <div style={{ textAlign: "right" }}>Edited</div>
                  <div />
                </div>
                {filtered.map((f) => <FileListRow key={f.id} feature={f} />)}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

/* ──────── Nav item ─────── */
function NavItem({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 10px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: active ? "var(--active)" : "transparent",
        border: "none",
        borderRadius: 7,
        cursor: "pointer",
        color: active ? "var(--text)" : "var(--text-secondary)",
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        fontFamily: "inherit",
        textAlign: "left",
        width: "100%",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover)" }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent" }}
    >
      <Icon size={13} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  )
}

/* ──────── Recent card — compact horizontal ─────── */
function RecentCard({ feature }: { feature: FeatureCard }) {
  return (
    <Link href={feature.route}>
      <div style={{
        width: 200,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.12s, transform 0.12s",
        flexShrink: 0,
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)" }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
      >
        <div className="dr-thumb-wrap" style={{ height: 110 }}>
          <iframe
            className="dr-thumb-iframe"
            src={feature.previewRoute}
            loading="lazy"
            title={feature.name}
            style={{ transform: "scale(0.28)" }}
          />
        </div>
        <div style={{ padding: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{feature.name}</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Edited {feature.lastUpdatedRelative}</div>
        </div>
      </div>
    </Link>
  )
}

/* ──────── Grid card ─────── */
function FileGridCard({ feature }: { feature: FeatureCard }) {
  return (
    <Link href={feature.route}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)" }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
      >
        <div className="dr-thumb-wrap" style={{ aspectRatio: "4 / 3" }}>
          <iframe
            className="dr-thumb-iframe"
            src={feature.previewRoute}
            loading="lazy"
            title={feature.name}
          />
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <StatusPill status={feature.status} />
          </div>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{feature.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Edited {feature.lastUpdatedRelative} · {feature.screens} screens
              </div>
            </div>
            <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
              <MoreHorizontal size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ──────── List row ─────── */
function FileListRow({ feature }: { feature: FeatureCard }) {
  return (
    <Link href={feature.route}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 0.8fr 32px",
        alignItems: "center",
        padding: "10px 16px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        transition: "background 0.1s",
        fontSize: 12,
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover)" }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div className="dr-thumb-wrap" style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0 }}>
            <iframe
              className="dr-thumb-iframe"
              src={feature.previewRoute}
              loading="lazy"
              title={feature.name}
              style={{ transform: "scale(0.085)" }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{feature.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{feature.description}</div>
          </div>
        </div>
        <div><StatusPill status={feature.status} /></div>
        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{feature.screens}</div>
        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{feature.states}</div>
        <div style={{ textAlign: "right", color: "var(--text-muted)" }}>{feature.lastUpdatedRelative}</div>
        <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2 }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
          <MoreHorizontal size={14} strokeWidth={1.8} />
        </button>
      </div>
    </Link>
  )
}

/* ──────── Status pill ─────── */
function StatusPill({ status }: { status: FeatureCard["status"] }) {
  const config = {
    "in-progress": { label: "In progress", dot: "#f59e0b" },
    "done": { label: "Done", dot: "#22c55e" },
    "draft": { label: "Draft", dot: "#737373" },
  }[status]
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "2px 7px",
      borderRadius: 100,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      fontSize: 10,
      fontWeight: 600,
      color: "var(--text-secondary)",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: config.dot }} />
      {config.label}
    </span>
  )
}

/* ──────── Filter dropdown ─────── */
function FilterDropdown({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) {
  const labels: Record<Filter, string> = {
    all: "All",
    "in-progress": "In progress",
    done: "Done",
    draft: "Draft",
  }
  return (
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value as Filter)}
      style={{
        padding: "6px 10px",
        paddingRight: 28,
        borderRadius: 7,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text)",
        fontSize: 11,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2.5 4L5 6.5L7.5 4' stroke='currentColor' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {Object.entries(labels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  )
}

/* ──────── View toggle button ─────── */
function ViewToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 26, height: 26,
        borderRadius: 5,
        border: "none",
        background: active ? "var(--active)" : "transparent",
        color: active ? "var(--text)" : "var(--text-muted)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  )
}

/* ──────── Empty state ─────── */
function EmptyState({ search }: { search: string }) {
  return (
    <div style={{
      padding: "60px 20px",
      textAlign: "center",
      background: "var(--surface)",
      border: "1px dashed var(--border-strong)",
      borderRadius: 10,
      color: "var(--text-secondary)",
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>
        {search ? `Không tìm thấy "${search}"` : "No files yet"}
      </div>
      <div style={{ fontSize: 11 }}>
        {search ? "Thử từ khoá khác hoặc clear filter" : "Create your first file to get started"}
      </div>
    </div>
  )
}

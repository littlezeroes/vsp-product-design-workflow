"use client"

import * as React from "react"
import {
  Download,
  Trash2,
  X,
  Wand2,
  Plus,
  Sparkles,
  Key,
  Loader2,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle,
  Ruler,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ──────────────────────────────────────────────────────────────
   ENGRAVE — Auto UX/UI audit between design and build
   Sends both images to Claude vision; the model returns bounded
   regions of difference, drawn precisely on the build plate.
   ────────────────────────────────────────────────────────────── */

type Severity = "critical" | "major" | "minor"
type Category =
  | "spacing"
  | "color"
  | "typography"
  | "missing"
  | "extra"
  | "alignment"
  | "copy"
  | "state"
  | "icon"
  | "other"

type BBox = { x: number; y: number; w: number; h: number } // % of dev image

type Marker = {
  id: string
  bbox: BBox
  note: string
  severity?: Severity
  category?: Category
  source: "ai" | "manual" | "pixel"
  designValue?: string
  devValue?: string
  measurement?: string // e.g., "Δ x: −6px" or "Δ gap: +4px"
}

type FocusMode = "ui" | "alignment"

// Priority: alignment = top 1. Lower number = higher priority.
const CATEGORY_PRIORITY: Record<Category, number> = {
  alignment: 1,
  spacing: 2,
  typography: 3,
  color: 4,
  copy: 5,
  missing: 6,
  extra: 7,
  icon: 8,
  state: 9,
  other: 10,
}

function sortMarkersByPriority(markers: Marker[]): Marker[] {
  const sevRank = (s?: Severity) => (s === "critical" ? 3 : s === "major" ? 2 : s === "minor" ? 1 : 0)
  return [...markers].sort((a, b) => {
    const sa = sevRank(a.severity)
    const sb = sevRank(b.severity)
    if (sa !== sb) return sb - sa
    const pa = a.category ? CATEGORY_PRIORITY[a.category] : 99
    const pb = b.category ? CATEGORY_PRIORITY[b.category] : 99
    return pa - pb
  })
}

type ViewMode = "split" | "overlay" | "diff"

const uid = () => Math.random().toString(36).slice(2, 9)
const API_KEY_STORAGE = "engrave.anthropicKey"
const MODEL = "claude-opus-4-7"

const SEVERITY_TONE: Record<Severity, { ring: string; text: string; bg: string; border: string }> = {
  critical: {
    ring: "ring-red-500",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500",
    border: "border-red-500",
  },
  major: {
    ring: "ring-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-500",
  },
  minor: {
    ring: "ring-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500",
    border: "border-sky-500",
  },
}

export default function EngravePage() {
  const [designUrl, setDesignUrl] = React.useState<string | null>(null)
  const [devUrl, setDevUrl] = React.useState<string | null>(null)
  const [markers, setMarkers] = React.useState<Marker[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [view, setView] = React.useState<ViewMode>("split")
  const [opacity, setOpacity] = React.useState(50)
  const [detecting, setDetecting] = React.useState(false)
  const [auditing, setAuditing] = React.useState(false)
  const [auditError, setAuditError] = React.useState<string | null>(null)
  const [diffUrl, setDiffUrl] = React.useState<string | null>(null)
  const [apiKey, setApiKey] = React.useState<string>("")
  const [keyOpen, setKeyOpen] = React.useState(false)
  const [auditedKey, setAuditedKey] = React.useState<string | null>(null)
  const [drawing, setDrawing] = React.useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null)
  const [progress, setProgress] = React.useState<{ stage: string; current: number; total: number } | null>(null)
  const [focus, setFocus] = React.useState<FocusMode>("ui")
  const [guides, setGuides] = React.useState(true)
  const [deviceWidth, setDeviceWidth] = React.useState(390)
  const [contentPadding, setContentPadding] = React.useState(22)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const k = localStorage.getItem(API_KEY_STORAGE) || ""
    setApiKey(k)
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("demo") === "1") {
      setDesignUrl("/comp-monzo.png")
      setDevUrl("/comp-revolut.png")
    }
  }, [])

  const both = !!(designUrl && devUrl)

  const onUpload =
    (which: "design" | "dev") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      if (which === "design") setDesignUrl(url)
      else setDevUrl(url)
      setDiffUrl(null)
      setAuditedKey(null)
    }

  const updateNote = (id: string, note: string) =>
    setMarkers(m => m.map(x => (x.id === id ? { ...x, note } : x)))

  const removeMarker = (id: string) => {
    setMarkers(m => m.filter(x => x.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const clearAll = () => {
    setMarkers([])
    setActiveId(null)
    setDiffUrl(null)
  }

  const reset = () => {
    if (designUrl?.startsWith("blob:")) URL.revokeObjectURL(designUrl)
    if (devUrl?.startsWith("blob:")) URL.revokeObjectURL(devUrl)
    setDesignUrl(null)
    setDevUrl(null)
    setAuditedKey(null)
    clearAll()
  }

  const saveApiKey = (k: string) => {
    setApiKey(k)
    if (typeof window !== "undefined") {
      if (k) localStorage.setItem(API_KEY_STORAGE, k)
      else localStorage.removeItem(API_KEY_STORAGE)
    }
  }

  /* ─── Manual: draw bbox by drag on dev plate ─── */
  const onDevMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-marker]")) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setDrawing({ x0: x, y0: y, x1: x, y1: y })
  }
  const onDevMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawing) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setDrawing({ ...drawing, x1: x, y1: y })
  }
  const onDevMouseUp = () => {
    if (!drawing) return
    const x = Math.min(drawing.x0, drawing.x1)
    const y = Math.min(drawing.y0, drawing.y1)
    const w = Math.abs(drawing.x1 - drawing.x0)
    const h = Math.abs(drawing.y1 - drawing.y0)
    setDrawing(null)
    if (w < 0.5 && h < 0.5) {
      // click rather than drag → small bbox at point
      const id = uid()
      setMarkers(m => [
        ...m,
        {
          id,
          bbox: { x: drawing.x0 - 4, y: drawing.y0 - 4, w: 8, h: 6 },
          note: "",
          source: "manual",
        },
      ])
      setActiveId(id)
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLTextAreaElement>(`textarea[data-id="${id}"]`)
          ?.focus()
      })
      return
    }
    const id = uid()
    setMarkers(m => [...m, { id, bbox: { x, y, w, h }, note: "", source: "manual" }])
    setActiveId(id)
    requestAnimationFrame(() => {
      document.querySelector<HTMLTextAreaElement>(`textarea[data-id="${id}"]`)?.focus()
    })
  }

  /* ─── AI Audit: HYBRID 3-stage pipeline ───
     1. NORMALIZE — resize cả 2 ảnh về cùng dimensions
     2. LOCALIZE — pixel-diff finer grid + cluster → candidate regions
     3. VERIFY — crop pair từng region, gửi Claude vision riêng lẻ
                 → bbox precision lên ~±1-2%, lọc noise tự động
  */
  const runAudit = React.useCallback(
    async (force = false) => {
      if (!designUrl || !devUrl) return
      if (!apiKey) {
        setAuditError("Cần Anthropic API key — bấm Set key.")
        setKeyOpen(true)
        return
      }
      const pairKey = `${designUrl}|${devUrl}`
      if (!force && auditedKey === pairKey) return
      setAuditing(true)
      setAuditError(null)
      setProgress({ stage: "normalize", current: 0, total: 1 })
      try {
        // ───── Stage 1: NORMALIZE ─────
        const norm = await normalizePair(designUrl, devUrl, 1024)
        setProgress({ stage: "localize", current: 0, total: 1 })

        // Generate diff overlay for the diff view
        const diffCanvas = makeDiffOverlay(norm.designCanvas, norm.devCanvas)
        setDiffUrl(diffCanvas.toDataURL("image/png"))

        // ───── Stage 2: LOCALIZE candidate regions ─────
        const candidates = findCandidateClusters(norm.designCanvas, norm.devCanvas)
        if (candidates.length === 0) {
          setProgress({ stage: "verify", current: 0, total: 1 })
          const fallback = await fullImageAudit(norm.designCanvas, norm.devCanvas, apiKey, focus)
          const sorted = sortMarkersByPriority(fallback)
          setMarkers(prev => [...prev.filter(m => m.source !== "ai"), ...sorted])
          setAuditedKey(pairKey)
          return
        }

        // ───── Stage 3: VERIFY each candidate ─────
        const total = candidates.length
        setProgress({ stage: "verify", current: 0, total })

        // Run in parallel (max 5 concurrent to avoid rate limit)
        const results: Marker[] = []
        let done = 0
        const PARALLEL = 4
        for (let i = 0; i < candidates.length; i += PARALLEL) {
          const slice = candidates.slice(i, i + PARALLEL)
          const batch = await Promise.all(
            slice.map(c => verifyCropPair(norm.designCanvas, norm.devCanvas, c, apiKey, focus))
          )
          for (const r of batch) {
            done += 1
            setProgress({ stage: "verify", current: done, total })
            if (r) results.push(r)
          }
        }

        // Dedupe overlapping bboxes (IoU > 0.5) → sort by priority (alignment first)
        const unique = dedupeBboxes(results)
        const sorted = sortMarkersByPriority(unique)
        setMarkers(prev => [...prev.filter(m => m.source !== "ai"), ...sorted])
        setAuditedKey(pairKey)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setAuditError(msg)
      } finally {
        setAuditing(false)
        setProgress(null)
      }
    },
    [designUrl, devUrl, apiKey, auditedKey]
  )

  // Auto-run audit when both images uploaded and key set
  React.useEffect(() => {
    if (designUrl && devUrl && apiKey && !auditing) {
      runAudit(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designUrl, devUrl, apiKey])

  /* ─── Pixel-diff scan: cluster high-diff cells into bboxes ─── */
  const autoDetect = async () => {
    if (!designUrl || !devUrl) return
    setDetecting(true)
    try {
      const [d, v] = await Promise.all([loadImage(designUrl), loadImage(devUrl)])
      const w = v.naturalWidth
      const h = v.naturalHeight

      const dCanvas = document.createElement("canvas")
      dCanvas.width = w
      dCanvas.height = h
      const dCtx = dCanvas.getContext("2d")!
      dCtx.drawImage(d, 0, 0, w, h)
      const dData = dCtx.getImageData(0, 0, w, h).data

      const vCanvas = document.createElement("canvas")
      vCanvas.width = w
      vCanvas.height = h
      const vCtx = vCanvas.getContext("2d")!
      vCtx.drawImage(v, 0, 0, w, h)
      const vData = vCtx.getImageData(0, 0, w, h).data

      const diffCanvas = document.createElement("canvas")
      diffCanvas.width = w
      diffCanvas.height = h
      const diffCtx = diffCanvas.getContext("2d")!
      diffCtx.drawImage(v, 0, 0, w, h)
      const diffImg = diffCtx.getImageData(0, 0, w, h)

      const COLS = 24
      const ROWS = Math.max(24, Math.round((h / w) * 24))
      const cellW = w / COLS
      const cellH = h / ROWS
      const grid: number[][] = []
      for (let row = 0; row < ROWS; row++) {
        grid[row] = []
        for (let col = 0; col < COLS; col++) {
          let total = 0
          let count = 0
          const x0 = Math.floor(col * cellW)
          const x1 = Math.floor((col + 1) * cellW)
          const y0 = Math.floor(row * cellH)
          const y1 = Math.floor((row + 1) * cellH)
          for (let py = y0; py < y1; py += 4) {
            for (let px = x0; px < x1; px += 4) {
              const i = (py * w + px) * 4
              total += Math.abs(dData[i] - vData[i])
              total += Math.abs(dData[i + 1] - vData[i + 1])
              total += Math.abs(dData[i + 2] - vData[i + 2])
              count++
            }
          }
          grid[row][col] = total / Math.max(1, count)
        }
      }

      const threshold = 30
      // Tint diff canvas
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (grid[row][col] < threshold) continue
          const intensity = Math.min(1, (grid[row][col] - threshold) / 80)
          const x0 = Math.floor(col * cellW)
          const x1 = Math.floor((col + 1) * cellW)
          const y0 = Math.floor(row * cellH)
          const y1 = Math.floor((row + 1) * cellH)
          for (let py = y0; py < y1; py++) {
            for (let px = x0; px < x1; px++) {
              const i = (py * w + px) * 4
              diffImg.data[i] = Math.min(255, diffImg.data[i] * (1 - intensity * 0.5) + 245 * intensity * 0.5)
              diffImg.data[i + 1] = diffImg.data[i + 1] * (1 - intensity * 0.6)
              diffImg.data[i + 2] = diffImg.data[i + 2] * (1 - intensity * 0.6)
            }
          }
        }
      }
      diffCtx.putImageData(diffImg, 0, 0)
      setDiffUrl(diffCanvas.toDataURL("image/png"))

      // Connected-component clustering on cells above threshold
      const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
      const clusters: { rows: number[]; cols: number[] }[] = []
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (visited[row][col] || grid[row][col] < threshold) continue
          const stack = [[row, col]]
          const rows: number[] = []
          const cols: number[] = []
          while (stack.length) {
            const [r, c] = stack.pop()!
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
            if (visited[r][c] || grid[r][c] < threshold) continue
            visited[r][c] = true
            rows.push(r)
            cols.push(c)
            stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1])
          }
          if (rows.length >= 2) clusters.push({ rows, cols })
        }
      }

      // Take top 8 clusters by total diff energy
      const ranked = clusters
        .map(cluster => {
          const minR = Math.min(...cluster.rows)
          const maxR = Math.max(...cluster.rows)
          const minC = Math.min(...cluster.cols)
          const maxC = Math.max(...cluster.cols)
          const energy = cluster.rows.reduce(
            (acc, r, i) => acc + grid[r][cluster.cols[i]],
            0
          )
          return { minR, maxR, minC, maxC, energy, size: cluster.rows.length }
        })
        .sort((a, b) => b.energy - a.energy)
        .slice(0, 8)

      const newMarkers: Marker[] = ranked.map(c => {
        const x = (c.minC / COLS) * 100
        const y = (c.minR / ROWS) * 100
        const wPct = ((c.maxC - c.minC + 1) / COLS) * 100
        const hPct = ((c.maxR - c.minR + 1) / ROWS) * 100
        return {
          id: uid(),
          bbox: { x, y, w: wPct, h: hPct },
          note: `Pixel diff — ${c.size} cell${c.size > 1 ? "s" : ""}`,
          source: "pixel" as const,
          severity: "minor" as const,
          category: "other" as const,
        }
      })
      setMarkers(m => [...m.filter(x => x.source !== "pixel"), ...newMarkers])
    } finally {
      setDetecting(false)
    }
  }

  /* ─── Export: bbox annotations on dev plate ─── */
  const exportPng = async () => {
    if (!devUrl) return
    const img = await loadImage(devUrl)
    const w = img.naturalWidth
    const h = img.naturalHeight
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)

    // Header band
    const bandH = Math.round(h * 0.04)
    ctx.fillStyle = "rgba(15,23,42,0.94)"
    ctx.fillRect(0, 0, w, bandH)
    ctx.fillStyle = "#f1f5f9"
    ctx.font = `${Math.round(bandH * 0.5)}px ui-sans-serif, system-ui, sans-serif`
    ctx.textBaseline = "middle"
    ctx.textAlign = "left"
    ctx.fillText("ENGRAVE — design vs build", 16, bandH / 2)
    ctx.textAlign = "right"
    ctx.fillText(new Date().toISOString().slice(0, 10), w - 16, bandH / 2)

    markers.forEach((m, i) => {
      const x = (m.bbox.x / 100) * w
      const y = (m.bbox.y / 100) * h
      const bw = (m.bbox.w / 100) * w
      const bh = (m.bbox.h / 100) * h

      const sev = m.severity || "minor"
      const stroke =
        sev === "critical" ? "#ef4444" : sev === "major" ? "#f59e0b" : "#0ea5e9"

      // bbox stroke
      ctx.strokeStyle = stroke
      ctx.lineWidth = Math.max(2, w / 600)
      ctx.setLineDash([])
      ctx.strokeRect(x, y, bw, bh)

      // semi-transparent fill
      ctx.fillStyle = stroke + "1A"
      ctx.fillRect(x, y, bw, bh)

      // number badge top-left
      const badgeR = Math.max(14, w / 60)
      ctx.fillStyle = stroke
      ctx.fillRect(x, y - badgeR * 1.4, badgeR * 2.2, badgeR * 1.4)
      ctx.fillStyle = "#ffffff"
      ctx.font = `600 ${Math.round(badgeR)}px ui-sans-serif, system-ui, sans-serif`
      ctx.textBaseline = "middle"
      ctx.textAlign = "center"
      ctx.fillText(String(i + 1), x + badgeR * 1.1, y - badgeR * 0.7)
    })

    canvas.toBlob(blob => {
      if (!blob) return
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `engrave-${Date.now()}.png`
      a.click()
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header
        disabled={!both}
        detecting={detecting}
        auditing={auditing}
        hasMarkers={markers.length > 0}
        view={view}
        opacity={opacity}
        hasKey={!!apiKey}
        focus={focus}
        guides={guides}
        deviceWidth={deviceWidth}
        contentPadding={contentPadding}
        onView={setView}
        onOpacity={setOpacity}
        onFocus={setFocus}
        onGuides={setGuides}
        onDeviceWidth={setDeviceWidth}
        onContentPadding={setContentPadding}
        onAudit={() => runAudit(true)}
        onScan={autoDetect}
        onClear={clearAll}
        onReset={reset}
        onExport={exportPng}
        onKey={() => setKeyOpen(true)}
        canExport={!!devUrl}
        hasDiff={!!diffUrl}
      />

      {(auditing || auditError) && (
        <StatusBanner
          auditing={auditing}
          error={auditError}
          progress={progress}
          onDismiss={() => setAuditError(null)}
        />
      )}

      {keyOpen && (
        <ApiKeyDialog
          value={apiKey}
          onSave={k => {
            saveApiKey(k)
            setKeyOpen(false)
            if (k && designUrl && devUrl) runAudit(true)
          }}
          onClose={() => setKeyOpen(false)}
        />
      )}

      {!both ? (
        <UploadStage
          designUrl={designUrl}
          devUrl={devUrl}
          hasKey={!!apiKey}
          onSetKey={() => setKeyOpen(true)}
          onDesign={onUpload("design")}
          onDev={onUpload("dev")}
        />
      ) : (
        <CompareStage
          designUrl={designUrl!}
          devUrl={devUrl!}
          diffUrl={diffUrl}
          markers={markers}
          activeId={activeId}
          view={view}
          opacity={opacity}
          drawing={drawing}
          auditing={auditing}
          guides={guides}
          deviceWidth={deviceWidth}
          contentPadding={contentPadding}
          onMouseDown={onDevMouseDown}
          onMouseMove={onDevMouseMove}
          onMouseUp={onDevMouseUp}
          onActivate={setActiveId}
          onUpdate={updateNote}
          onRemove={removeMarker}
        />
      )}
    </main>
  )
}

/* ──────────── Helpers ──────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

async function toBase64(url: string): Promise<string> {
  const img = await loadImage(url)
  const MAX = 1568
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.round(img.naturalWidth * scale)
  const h = Math.round(img.naturalHeight * scale)
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "")
}

function canvasToB64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "")
}

function renderTo(img: HTMLImageElement, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const ctx = c.getContext("2d")!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(img, 0, 0, w, h)
  return c
}

/** STAGE 1: Resize cả 2 ảnh về cùng dimensions, dùng dev's aspect làm reference */
async function normalizePair(designUrl: string, devUrl: string, targetWidth = 1024) {
  const [d, v] = await Promise.all([loadImage(designUrl), loadImage(devUrl)])
  // Use dev's aspect ratio as the canonical frame
  const aspectRatio = v.naturalHeight / v.naturalWidth
  const w = targetWidth
  const h = Math.round(targetWidth * aspectRatio)
  return {
    designCanvas: renderTo(d, w, h),
    devCanvas: renderTo(v, w, h),
    width: w,
    height: h,
  }
}

/** Crop a canvas given bbox in % */
function cropCanvas(canvas: HTMLCanvasElement, bbox: BBox): HTMLCanvasElement {
  const sx = Math.max(0, Math.floor((bbox.x / 100) * canvas.width))
  const sy = Math.max(0, Math.floor((bbox.y / 100) * canvas.height))
  const sw = Math.min(canvas.width - sx, Math.ceil((bbox.w / 100) * canvas.width))
  const sh = Math.min(canvas.height - sy, Math.ceil((bbox.h / 100) * canvas.height))
  const c = document.createElement("canvas")
  c.width = Math.max(1, sw)
  c.height = Math.max(1, sh)
  const ctx = c.getContext("2d")!
  ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh)
  return c
}

/** Expand bbox by padding (% of bbox dims) and clamp to [0,100] */
function expandBbox(bbox: BBox, padPct = 6): BBox {
  const padX = (bbox.w * padPct) / 100
  const padY = (bbox.h * padPct) / 100
  const x = clamp(bbox.x - padX, 0, 100)
  const y = clamp(bbox.y - padY, 0, 100)
  return {
    x,
    y,
    w: clamp(bbox.w + padX * 2, 0.5, 100 - x),
    h: clamp(bbox.h + padY * 2, 0.5, 100 - y),
  }
}

/** STAGE 2: Cluster pixel-diff cells thành candidate regions */
function findCandidateClusters(
  designCanvas: HTMLCanvasElement,
  devCanvas: HTMLCanvasElement
): BBox[] {
  const w = devCanvas.width
  const h = devCanvas.height
  const dCtx = designCanvas.getContext("2d")!
  const vCtx = devCanvas.getContext("2d")!
  const dData = dCtx.getImageData(0, 0, w, h).data
  const vData = vCtx.getImageData(0, 0, w, h).data

  // Finer grid for better localization
  const COLS = 32
  const ROWS = Math.max(32, Math.round((h / w) * 32))
  const cellW = w / COLS
  const cellH = h / ROWS
  const grid: number[][] = []

  for (let row = 0; row < ROWS; row++) {
    grid[row] = []
    for (let col = 0; col < COLS; col++) {
      let total = 0
      let count = 0
      const x0 = Math.floor(col * cellW)
      const x1 = Math.floor((col + 1) * cellW)
      const y0 = Math.floor(row * cellH)
      const y1 = Math.floor((row + 1) * cellH)
      for (let py = y0; py < y1; py += 3) {
        for (let px = x0; px < x1; px += 3) {
          const i = (py * w + px) * 4
          total += Math.abs(dData[i] - vData[i])
          total += Math.abs(dData[i + 1] - vData[i + 1])
          total += Math.abs(dData[i + 2] - vData[i + 2])
          count++
        }
      }
      grid[row][col] = total / Math.max(1, count)
    }
  }

  // Threshold + flood-fill clustering
  const THRESHOLD = 35
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  const clusters: { rows: number[]; cols: number[]; energy: number }[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (visited[row][col] || grid[row][col] < THRESHOLD) continue
      const stack = [[row, col]]
      const rs: number[] = []
      const cs: number[] = []
      let energy = 0
      while (stack.length) {
        const [r, c] = stack.pop()!
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
        if (visited[r][c] || grid[r][c] < THRESHOLD) continue
        visited[r][c] = true
        rs.push(r)
        cs.push(c)
        energy += grid[r][c]
        stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1])
      }
      if (rs.length >= 2) clusters.push({ rows: rs, cols: cs, energy })
    }
  }

  // Convert clusters → bboxes (in % of canvas), top 12
  return clusters
    .map(cluster => {
      const minR = Math.min(...cluster.rows)
      const maxR = Math.max(...cluster.rows)
      const minC = Math.min(...cluster.cols)
      const maxC = Math.max(...cluster.cols)
      return {
        bbox: {
          x: (minC / COLS) * 100,
          y: (minR / ROWS) * 100,
          w: ((maxC - minC + 1) / COLS) * 100,
          h: ((maxR - minR + 1) / ROWS) * 100,
        },
        energy: cluster.energy,
      }
    })
    .sort((a, b) => b.energy - a.energy)
    .slice(0, 12)
    .map(c => c.bbox)
}

function makeDiffOverlay(
  designCanvas: HTMLCanvasElement,
  devCanvas: HTMLCanvasElement
): HTMLCanvasElement {
  const w = devCanvas.width
  const h = devCanvas.height
  const dData = designCanvas.getContext("2d")!.getImageData(0, 0, w, h).data
  const vData = devCanvas.getContext("2d")!.getImageData(0, 0, w, h).data

  const out = document.createElement("canvas")
  out.width = w
  out.height = h
  const ctx = out.getContext("2d")!
  ctx.drawImage(devCanvas, 0, 0)
  const img = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const dr = Math.abs(dData[i] - vData[i])
    const dg = Math.abs(dData[i + 1] - vData[i + 1])
    const db = Math.abs(dData[i + 2] - vData[i + 2])
    const diff = (dr + dg + db) / 3
    if (diff > 25) {
      const t = Math.min(1, (diff - 25) / 80)
      img.data[i] = Math.min(255, img.data[i] * (1 - t * 0.5) + 245 * t * 0.5)
      img.data[i + 1] = img.data[i + 1] * (1 - t * 0.6)
      img.data[i + 2] = img.data[i + 2] * (1 - t * 0.6)
    }
  }
  ctx.putImageData(img, 0, 0)
  return out
}

/** STAGE 3a: Verify a single candidate via Claude crop pair */
async function verifyCropPair(
  designCanvas: HTMLCanvasElement,
  devCanvas: HTMLCanvasElement,
  candidate: BBox,
  apiKey: string,
  focus: FocusMode = "ui"
): Promise<Marker | null> {
  const padded = expandBbox(candidate, 8)
  const designCrop = cropCanvas(designCanvas, padded)
  const devCrop = cropCanvas(devCanvas, padded)
  const cropW = devCrop.width
  const cropH = devCrop.height

  const allowedCats =
    focus === "alignment"
      ? `"alignment" | "spacing"`
      : `"alignment" | "typography" | "color" | "copy" | "spacing"`

  const focusRule =
    focus === "alignment"
      ? `\n🎯 MODE = ALIGNMENT ONLY. Chỉ flag alignment/spacing. Bỏ qua tất cả loại lỗi khác.`
      : `\n🎯 MODE = UI BUGS ONLY. Chỉ flag: alignment, typography (font), color, text copy, spacing.`

  const prompt = `2 ảnh là CÙNG VÙNG UI từ DESIGN (ảnh 1) và DEV BUILD (ảnh 2).
DEV crop kích thước: ${cropW}×${cropH} px.${focusRule}

🚫 BẮT BUỘC BỎ QUA HOÀN TOÀN — KHÔNG BAO GIỜ FLAG:
- Dữ liệu động (dynamic data): số dư, amount, số tài khoản, số điện thoại, mã giao dịch, OTP, ngày giờ, timestamp, counter, notification badge count, user name, avatar image khác nội dung, placeholder data
- Text thay đổi do data: "10.000₫" vs "50.000₫" là data, KHÔNG phải bug
- Anti-aliasing nhỏ, sub-pixel rendering
- Compression artifacts (JPG vs PNG noise)
- Skeleton/loading state khác nhau
- Browser chrome, status bar time, battery level
- Cropping / viewport khác nhau

✅ CHỈ FLAG UI BUGS thực sự, xếp theo ƯU TIÊN:

#1 ALIGNMENT (TOP PRIORITY) ⭐
   - Element lệch trục x (margin trái/phải sai)
   - Icon không căn giữa với text
   - Section title không thẳng hàng với content
   - Button không căn baseline
   - List item indent sai
   → Measurement BẮT BUỘC: "Δ x: −6px" / "Δ indent: 16px → 8px"

#2 TYPOGRAPHY (font)
   - Font size sai (vd 14px vs 16px)
   - Font weight sai (500 vs 600)
   - Line-height, letter-spacing
   - Font family sai
   → Measurement nếu là size: "Δ font-size: −2px"

#3 COLOR
   - Sai màu text / background / border / icon fill
   - Đậm/nhạt khác (vd text Grey.500 vs Grey.700)
   → design_value + dev_value là hex hoặc tên màu

#4 COPY (text LABEL cố định, KHÔNG phải data)
   - "Tiếp tục" vs "Xác nhận", "Hủy" vs "Quay lại"
   - Sai chính tả trong label
   - KHÔNG áp dụng cho data values

#5 SPACING (liên quan alignment)
   - Gap/padding/margin sai
   → Measurement BẮT BUỘC: "Δ gap: +4px", "Δ padding: −8px"

Chỉ flag 1 lỗi NGHIÊM TRỌNG NHẤT trong crop này (theo thứ tự #1 → #5).
Nếu cả vùng crop không có lỗi UI nào thật sự → {"hasIssue": false}

Output JSON DUY NHẤT:
- Nếu KHÔNG lỗi: {"hasIssue": false}
- Nếu CÓ lỗi:
{
  "hasIssue": true,
  "localBbox": {"x": <0-100>, "y": <0-100>, "w": <0-100>, "h": <0-100>},
  "severity": "critical" | "major" | "minor",
  "category": ${allowedCats},
  "note": "Tiếng Việt, ≤ 80 ký tự",
  "measurement": "Δ …" (BẮT BUỘC cho alignment/spacing/font-size, "" nếu color/copy),
  "design_value": "≤ 40 ký tự",
  "dev_value": "≤ 40 ký tự"
}

localBbox = % của crop, bao đúng element lỗi (không phải cả crop).
JSON only, no markdown.`

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "DESIGN crop:" },
              {
                type: "image",
                source: { type: "base64", media_type: "image/png", data: canvasToB64(designCrop) },
              },
              { type: "text", text: "DEV BUILD crop (cùng vùng):" },
              {
                type: "image",
                source: { type: "base64", media_type: "image/png", data: canvasToB64(devCrop) },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    })
    if (!res.ok) return null
    const json = await res.json()
    const text = (json.content?.[0]?.text || "").trim()
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()
    const obj = JSON.parse(cleaned)
    if (!obj.hasIssue) return null
    if (!obj.localBbox || typeof obj.localBbox.x !== "number") return null

    // Map local bbox (% of crop) → global bbox (% of original normalized canvas)
    const localX = clamp(obj.localBbox.x, 0, 100)
    const localY = clamp(obj.localBbox.y, 0, 100)
    const localW = clamp(obj.localBbox.w, 0.5, 100)
    const localH = clamp(obj.localBbox.h, 0.5, 100)
    const globalBbox: BBox = {
      x: padded.x + (localX / 100) * padded.w,
      y: padded.y + (localY / 100) * padded.h,
      w: (localW / 100) * padded.w,
      h: (localH / 100) * padded.h,
    }
    return {
      id: uid(),
      bbox: globalBbox,
      note: String(obj.note || "").slice(0, 200),
      severity: obj.severity,
      category: obj.category,
      designValue: obj.design_value,
      devValue: obj.dev_value,
      measurement: obj.measurement ? String(obj.measurement).slice(0, 40) : undefined,
      source: "ai",
    }
  } catch {
    return null
  }
}

/** Fallback: single-pass full-image audit when no pixel diff found */
async function fullImageAudit(
  designCanvas: HTMLCanvasElement,
  devCanvas: HTMLCanvasElement,
  apiKey: string,
  focus: FocusMode = "ui"
): Promise<Marker[]> {
  const allowedCats =
    focus === "alignment"
      ? `"alignment" | "spacing"`
      : `"alignment" | "typography" | "color" | "copy" | "spacing"`
  const focusRule =
    focus === "alignment"
      ? `\n🎯 MODE = ALIGNMENT ONLY.`
      : `\n🎯 MODE = UI BUGS ONLY. Chỉ: alignment, typography, color, copy, spacing.`
  const prompt = `So sánh DESIGN và DEV BUILD. Liệt kê tối đa 8 UI BUGS trên DEV.
DEV kích thước: ${devCanvas.width}×${devCanvas.height} px.${focusRule}

🚫 BẮT BUỘC BỎ QUA (không flag):
- Dynamic data: số dư, amount, tên user, số tài khoản, ngày giờ, mã GD, OTP, notification count, avatar khác nội dung
- "10.000₫" vs "50.000₫" là DATA, không phải bug
- Anti-aliasing, sub-pixel rendering, compression artifacts
- Skeleton/loading states, status bar time, battery

✅ CHỈ FLAG UI BUGS — ưu tiên từ cao xuống:
  #1 ALIGNMENT (TOP) — element lệch trục, icon-text không căn, section title lệch
  #2 TYPOGRAPHY — font size/weight/family/line-height sai
  #3 COLOR — màu text/bg/border/icon sai
  #4 COPY — text LABEL cố định sai (không phải data)
  #5 SPACING — gap/padding/margin sai

Mỗi lỗi 1 object:
- bbox: {x, y, w, h} % DEV image, bao đúng element lỗi
- severity: "critical" | "major" | "minor"
- category: ${allowedCats}
- note: Tiếng Việt ≤ 80 chars
- measurement: "Δ x: −6px" cho alignment/spacing, "Δ font-size: −2px" cho typography size, "" nếu color/copy
- design_value, dev_value: ≤ 40 chars

Sort output theo priority (alignment trước, color sau).
Output CHỈ JSON array.`

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "DESIGN:" },
            { type: "image", source: { type: "base64", media_type: "image/png", data: canvasToB64(designCanvas) } },
            { type: "text", text: "DEV BUILD:" },
            { type: "image", source: { type: "base64", media_type: "image/png", data: canvasToB64(devCanvas) } },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  })
  if (!res.ok) return []
  const json = await res.json()
  const text = (json.content?.[0]?.text || "").trim()
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()
  try {
    const arr = JSON.parse(cleaned)
    if (!Array.isArray(arr)) return []
    return arr
      .filter((it: { bbox?: { x?: number } }) => it.bbox && typeof it.bbox.x === "number")
      .map((it: {
        bbox: { x: number; y: number; w: number; h: number }
        note?: string
        severity?: Severity
        category?: Category
        design_value?: string
        dev_value?: string
        measurement?: string
      }): Marker => ({
        id: uid(),
        bbox: {
          x: clamp(it.bbox.x, 0, 100),
          y: clamp(it.bbox.y, 0, 100),
          w: clamp(it.bbox.w, 0.5, 100),
          h: clamp(it.bbox.h, 0.5, 100),
        },
        note: String(it.note || "").slice(0, 200),
        severity: it.severity,
        category: it.category,
        designValue: it.design_value,
        devValue: it.dev_value,
        measurement: it.measurement ? String(it.measurement).slice(0, 40) : undefined,
        source: "ai",
      }))
  } catch {
    return []
  }
}

/** Dedupe: drop bboxes with IoU > 0.5 with another (keep higher-severity) */
function dedupeBboxes(markers: Marker[]): Marker[] {
  const sevRank = (s?: Severity) => (s === "critical" ? 3 : s === "major" ? 2 : s === "minor" ? 1 : 0)
  const sorted = [...markers].sort((a, b) => sevRank(b.severity) - sevRank(a.severity))
  const kept: Marker[] = []
  for (const m of sorted) {
    const overlap = kept.some(k => iou(m.bbox, k.bbox) > 0.5)
    if (!overlap) kept.push(m)
  }
  return kept
}

function iou(a: BBox, b: BBox): number {
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)
  const x2 = Math.min(a.x + a.w, b.x + b.w)
  const y2 = Math.min(a.y + a.h, b.y + b.h)
  if (x2 <= x1 || y2 <= y1) return 0
  const inter = (x2 - x1) * (y2 - y1)
  const union = a.w * a.h + b.w * b.h - inter
  return inter / Math.max(0.0001, union)
}

/* ──────────── Header (toolbar) ──────────── */

function Header(props: {
  disabled: boolean
  detecting: boolean
  auditing: boolean
  hasMarkers: boolean
  view: ViewMode
  opacity: number
  hasKey: boolean
  focus: FocusMode
  guides: boolean
  deviceWidth: number
  contentPadding: number
  onView: (v: ViewMode) => void
  onOpacity: (n: number) => void
  onFocus: (f: FocusMode) => void
  onGuides: (b: boolean) => void
  onDeviceWidth: (n: number) => void
  onContentPadding: (n: number) => void
  onAudit: () => void
  onScan: () => void
  onClear: () => void
  onReset: () => void
  onExport: () => void
  onKey: () => void
  canExport: boolean
  hasDiff: boolean
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="mx-auto max-w-[1800px] h-12 px-4 flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <div className="size-6 rounded-md bg-foreground text-background grid place-items-center text-[11px] font-mono font-semibold">
            E
          </div>
          <div className="text-sm font-semibold tracking-tight">Engrave</div>
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
            design × build audit
          </span>
        </div>

        {/* View segmented control */}
        <div className="flex items-center rounded-md border border-border bg-secondary p-0.5 text-xs">
          {(["split", "overlay", "diff"] as ViewMode[]).map(m => (
            <button
              key={m}
              disabled={props.disabled || (m === "diff" && !props.hasDiff)}
              onClick={() => props.onView(m)}
              className={cn(
                "px-2.5 h-7 rounded transition disabled:opacity-40 disabled:cursor-not-allowed",
                props.view === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {props.view === "overlay" && !props.disabled && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono w-8 tabular-nums">{props.opacity}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={props.opacity}
              onChange={e => props.onOpacity(Number(e.target.value))}
              className="w-24 accent-foreground"
            />
          </div>
        )}

        {/* Guides toggle with config popover */}
        <GuidesControl
          on={props.guides}
          deviceWidth={props.deviceWidth}
          contentPadding={props.contentPadding}
          onToggle={() => props.onGuides(!props.guides)}
          onDeviceWidth={props.onDeviceWidth}
          onContentPadding={props.onContentPadding}
        />

        {/* Focus mode segmented control */}
        <div className="flex items-center rounded-md border border-border bg-secondary p-0.5 text-xs">
          {(["ui", "alignment"] as FocusMode[]).map(f => (
            <button
              key={f}
              disabled={props.disabled}
              onClick={() => props.onFocus(f)}
              className={cn(
                "px-2.5 h-7 rounded transition disabled:opacity-40 disabled:cursor-not-allowed",
                props.focus === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={
                f === "alignment"
                  ? "Chỉ alignment + spacing (narrowest)"
                  : "UI bugs: alignment · typography · color · copy · spacing (skip all data)"
              }
            >
              {f === "ui" ? "UI bugs" : "Alignment"}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <button
          onClick={props.onAudit}
          disabled={props.disabled || props.auditing}
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {props.auditing ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Sparkles size={13} />
          )}
          {props.auditing ? "Auditing…" : "AI Audit"}
        </button>
        <IconBtn icon={<Wand2 size={13} />} label="Scan" onClick={props.onScan} disabled={props.disabled || props.detecting} />
        <IconBtn
          icon={<Key size={13} />}
          label={props.hasKey ? "Key" : "Set key"}
          onClick={props.onKey}
          variant={props.hasKey ? "ghost" : "outline-warning"}
        />
        <div className="w-px h-5 bg-border" />
        <IconBtn icon={<Trash2 size={13} />} label="Clear" onClick={props.onClear} disabled={!props.hasMarkers} />
        <IconBtn icon={<Download size={13} />} label="Export" onClick={props.onExport} disabled={!props.canExport} />
        <IconBtn icon={<RefreshCw size={13} />} label="Reset" onClick={props.onReset} disabled={props.disabled} />
      </div>
    </header>
  )
}

function GuidesControl(props: {
  on: boolean
  deviceWidth: number
  contentPadding: number
  onToggle: () => void
  onDeviceWidth: (n: number) => void
  onContentPadding: (n: number) => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])
  const rightAxis = props.deviceWidth - props.contentPadding
  return (
    <div className="relative" ref={ref}>
      <div
        className={cn(
          "h-8 inline-flex items-center rounded-md text-xs font-medium transition border",
          props.on
            ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/40"
            : "hover:bg-secondary text-foreground border-transparent"
        )}
      >
        <button
          onClick={props.onToggle}
          className="h-full pl-2.5 pr-2 inline-flex items-center gap-1.5"
          title="Toggle alignment guides"
        >
          <Ruler size={13} />
          <span className="hidden md:inline">Guides</span>
          {props.on && (
            <span className="hidden lg:inline font-mono text-[10px] opacity-80 tabular-nums">
              {props.contentPadding}/{props.deviceWidth}
            </span>
          )}
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="h-full pr-2 pl-1 opacity-50 hover:opacity-100 text-[10px] border-l border-current/20"
          aria-label="Configure"
          title="Configure axes"
        >
          ⋯
        </button>
      </div>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-72 rounded-md border border-border bg-card shadow-lg p-4 z-50">
          <div className="text-xs font-semibold mb-3">Alignment axes</div>
          <div className="space-y-3">
            <label className="block">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Device width
              </div>
              <div className="flex items-center gap-1">
                {[360, 375, 390, 414, 430].map(w => (
                  <button
                    key={w}
                    onClick={() => props.onDeviceWidth(w)}
                    className={cn(
                      "h-7 px-2 rounded text-[11px] font-mono transition",
                      props.deviceWidth === w
                        ? "bg-foreground text-background"
                        : "border border-border hover:bg-secondary"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </label>
            <label className="block">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Content padding
              </div>
              <div className="flex items-center gap-1">
                {[16, 20, 22, 24].map(p => (
                  <button
                    key={p}
                    onClick={() => props.onContentPadding(p)}
                    className={cn(
                      "h-7 px-2 rounded text-[11px] font-mono transition",
                      props.contentPadding === p
                        ? "bg-foreground text-background"
                        : "border border-border hover:bg-secondary"
                    )}
                  >
                    {p}px
                  </button>
                ))}
              </div>
            </label>
            <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
              Axes vẽ tại{" "}
              <span className="font-mono text-foreground">x = {props.contentPadding}</span> và{" "}
              <span className="font-mono text-foreground">x = {rightAxis}</span>
              <div className="mt-1 text-[10px] opacity-70">
                VSP rule: content column <code>px-[22px]</code> trên device 390px.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function IconBtn(props: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: "ghost" | "outline" | "outline-warning"
}) {
  const variant = props.variant || "ghost"
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={cn(
        "h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "ghost" && "hover:bg-secondary text-foreground",
        variant === "outline" && "border border-border hover:bg-secondary",
        variant === "outline-warning" &&
          "border border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
      )}
    >
      {props.icon}
      <span className="hidden md:inline">{props.label}</span>
    </button>
  )
}

/* ──────────── Status banner ──────────── */

function StatusBanner(props: {
  auditing: boolean
  error: string | null
  progress: { stage: string; current: number; total: number } | null
  onDismiss: () => void
}) {
  if (props.auditing) {
    const stageLabels: Record<string, string> = {
      normalize: "Normalize images",
      localize: "Localize candidate regions",
      verify: "Verify each region",
    }
    const label = props.progress ? stageLabels[props.progress.stage] || props.progress.stage : "Audit"
    const percent =
      props.progress && props.progress.total > 0
        ? Math.round((props.progress.current / props.progress.total) * 100)
        : null
    return (
      <div className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-[1800px] px-4 py-2 flex items-center gap-3 text-xs">
          <Loader2 size={14} className="animate-spin text-muted-foreground shrink-0" />
          <span className="text-foreground font-medium">{label}…</span>
          {props.progress && (
            <span className="text-muted-foreground font-mono">
              {props.progress.current}/{props.progress.total}
            </span>
          )}
          <div className="flex-1 max-w-xs">
            {percent !== null && (
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}
          </div>
          <span className="text-muted-foreground font-mono">{MODEL}</span>
        </div>
      </div>
    )
  }
  if (props.error) {
    return (
      <div className="border-b border-red-500/30 bg-red-500/5">
        <div className="mx-auto max-w-[1800px] px-4 py-2 flex items-start gap-2 text-xs">
          <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-red-600 dark:text-red-400">Audit failed</div>
            <div className="text-muted-foreground mt-0.5 font-mono break-all">{props.error}</div>
          </div>
          <button
            onClick={props.onDismiss}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }
  return null
}

/* ──────────── API Key dialog ──────────── */

function ApiKeyDialog(props: {
  value: string
  onSave: (k: string) => void
  onClose: () => void
}) {
  const [val, setVal] = React.useState(props.value)
  const [showKey, setShowKey] = React.useState(false)
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4"
      onClick={props.onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Key size={14} className="text-muted-foreground" />
          <div className="text-sm font-semibold">Anthropic API key</div>
          <div className="flex-1" />
          <button onClick={props.onClose} className="text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Engrave gọi Claude vision trực tiếp từ trình duyệt. Key chỉ lưu trong{" "}
            <code className="text-foreground bg-secondary px-1 py-0.5 rounded text-[11px]">
              localStorage
            </code>
            . Lấy tại{" "}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              console.anthropic.com
            </a>
            .
          </p>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              ANTHROPIC_API_KEY
            </label>
            <input
              type={showKey ? "text" : "password"}
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="sk-ant-api03-…"
              className="w-full h-9 px-3 rounded-md border border-border bg-background font-mono text-xs outline-none focus:border-foreground transition"
              autoFocus
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={showKey}
              onChange={e => setShowKey(e.target.checked)}
              className="accent-foreground"
            />
            Show key
          </label>
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <button
            onClick={() => props.onSave("")}
            className="text-xs text-muted-foreground hover:text-red-500 transition"
          >
            Remove
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={props.onClose}
              className="h-8 px-3 rounded-md border border-border text-xs font-medium hover:bg-secondary transition"
            >
              Cancel
            </button>
            <button
              onClick={() => props.onSave(val.trim())}
              disabled={!val.trim()}
              className="h-8 px-3 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────── Upload stage ──────────── */

function UploadStage(props: {
  designUrl: string | null
  devUrl: string | null
  hasKey: boolean
  onSetKey: () => void
  onDesign: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDev: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Audit a build against its design</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tải design + build screenshot. Claude sẽ tự động vẽ bbox quanh từng điểm sai lệch.
        </p>
      </div>

      {!props.hasKey && (
        <div className="mb-6 rounded-md border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium">Chưa có API key</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              AI audit cần Anthropic API key. Pixel-diff <span className="font-mono">scan</span> vẫn chạy được không cần key.
            </div>
          </div>
          <button
            onClick={props.onSetKey}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition shrink-0"
          >
            <Key size={13} />
            Set key
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadSlot label="Design" sublabel="reference" url={props.designUrl} onChange={props.onDesign} />
        <UploadSlot label="Build" sublabel="implementation" url={props.devUrl} onChange={props.onDev} />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
        <Step n={1} label="Upload pair" />
        <Step n={2} label="Auto AI audit" />
        <Step n={3} label="Export annotated" />
      </div>
    </section>
  )
}

function UploadSlot(props: {
  label: string
  sublabel: string
  url: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="block group cursor-pointer">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-sm font-semibold">{props.label}</div>
        <div className="text-[11px] font-mono text-muted-foreground">{props.sublabel}</div>
      </div>
      <div
        className={cn(
          "relative aspect-[3/4] rounded-md border bg-secondary/40 flex items-center justify-center overflow-hidden transition",
          props.url
            ? "border-border group-hover:border-foreground/40"
            : "border-dashed border-border/80 group-hover:border-foreground/30 group-hover:bg-secondary/60"
        )}
      >
        {props.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.url} alt={props.label} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center">
            <div className="size-10 rounded-full bg-background border border-border mx-auto grid place-items-center mb-2">
              <Upload size={16} className="text-muted-foreground" />
            </div>
            <div className="text-sm font-medium">Choose image</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG up to ~5MB</div>
          </div>
        )}
        {props.url && (
          <div className="absolute top-2 right-2 text-[10px] font-mono uppercase tracking-wider bg-foreground text-background px-1.5 py-0.5 rounded">
            replace
          </div>
        )}
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={props.onChange} />
    </label>
  )
}

function Step(props: { n: number; label: string }) {
  return (
    <div className="border-t border-border pt-3 flex items-baseline gap-2">
      <span className="font-mono text-foreground">{props.n}</span>
      <span>{props.label}</span>
    </div>
  )
}

/* ──────────── Compare stage ──────────── */

function CompareStage(props: {
  designUrl: string
  devUrl: string
  diffUrl: string | null
  markers: Marker[]
  activeId: string | null
  view: ViewMode
  opacity: number
  drawing: { x0: number; y0: number; x1: number; y1: number } | null
  auditing: boolean
  guides: boolean
  deviceWidth: number
  contentPadding: number
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp: () => void
  onActivate: (id: string) => void
  onUpdate: (id: string, note: string) => void
  onRemove: (id: string) => void
}) {
  const guideProps = {
    on: props.guides,
    deviceWidth: props.deviceWidth,
    contentPadding: props.contentPadding,
  }
  return (
    <section className="mx-auto max-w-[1800px] px-4 py-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
      {/* Plate */}
      <div>
        {props.view === "split" && (
          <div className="grid grid-cols-2 gap-4">
            <Plate label="Design" sublabel="reference">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={props.designUrl} alt="Design" className="w-full h-auto block" />
                <GuidesOverlay {...guideProps} />
              </div>
            </Plate>
            <Plate label="Build" sublabel="implementation" badge={`${props.markers.length} issue${props.markers.length === 1 ? "" : "s"}`}>
              <DevAnnotated
                url={props.devUrl}
                markers={props.markers}
                activeId={props.activeId}
                drawing={props.drawing}
                guides={guideProps}
                onMouseDown={props.onMouseDown}
                onMouseMove={props.onMouseMove}
                onMouseUp={props.onMouseUp}
                onActivate={props.onActivate}
              />
            </Plate>
          </div>
        )}

        {props.view === "overlay" && (
          <Plate label="Overlay" sublabel={`design @ ${100 - props.opacity}%`}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={props.devUrl} alt="Build base" className="w-full h-auto block" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={props.designUrl}
                alt="Design over"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 1 - props.opacity / 100 }}
              />
              <div className="absolute inset-0">
                <DevAnnotated
                  url={props.devUrl}
                  transparent
                  markers={props.markers}
                  activeId={props.activeId}
                  drawing={props.drawing}
                  guides={guideProps}
                  onMouseDown={props.onMouseDown}
                  onMouseMove={props.onMouseMove}
                  onMouseUp={props.onMouseUp}
                  onActivate={props.onActivate}
                />
              </div>
            </div>
          </Plate>
        )}

        {props.view === "diff" && props.diffUrl && (
          <Plate label="Pixel diff" sublabel="amber tint = high diff cells">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={props.diffUrl} alt="Diff" className="w-full h-auto block" />
              <div className="absolute inset-0">
                <DevAnnotated
                  url={props.diffUrl}
                  transparent
                  markers={props.markers}
                  activeId={props.activeId}
                  drawing={props.drawing}
                  guides={guideProps}
                  onMouseDown={props.onMouseDown}
                  onMouseMove={props.onMouseMove}
                  onMouseUp={props.onMouseUp}
                  onActivate={props.onActivate}
                />
              </div>
            </div>
          </Plate>
        )}

        <div className="mt-2 text-[11px] text-muted-foreground font-mono">
          Tip: drag trên build plate để vẽ bbox thủ công.
        </div>
      </div>

      {/* Inspector */}
      <aside className="lg:sticky lg:top-14 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <div className="rounded-md border border-border bg-card">
          <div className="px-3 h-10 border-b border-border flex items-center gap-2">
            <div className="text-sm font-semibold">Issues</div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {props.markers.length}
            </span>
            <div className="flex-1" />
            {props.markers.length > 0 && (
              <SeverityCount markers={props.markers} />
            )}
          </div>

          {props.markers.length === 0 ? (
            <div className="px-4 py-10 text-center">
              {props.auditing ? (
                <Loader2 size={16} className="mx-auto mb-2 text-muted-foreground animate-spin" />
              ) : (
                <ImageIcon size={20} className="mx-auto mb-2 text-muted-foreground/60" />
              )}
              <div className="text-sm font-medium">
                {props.auditing ? "Claude đang audit…" : "No issues yet"}
              </div>
              {!props.auditing && (
                <div className="text-xs text-muted-foreground mt-1">
                  Bấm <span className="font-mono">AI Audit</span>, <span className="font-mono">Scan</span>, hoặc drag trên build.
                </div>
              )}
            </div>
          ) : (
            <ol className="divide-y divide-border">
              {props.markers.map((m, i) => (
                <IssueRow
                  key={m.id}
                  index={i + 1}
                  marker={m}
                  active={props.activeId === m.id}
                  onActivate={() => props.onActivate(m.id)}
                  onUpdate={note => props.onUpdate(m.id, note)}
                  onRemove={() => props.onRemove(m.id)}
                />
              ))}
            </ol>
          )}
        </div>
      </aside>
    </section>
  )
}

function Plate(props: {
  label: string
  sublabel?: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="h-9 px-3 border-b border-border flex items-center gap-2 bg-secondary/40">
        <div className="text-xs font-semibold">{props.label}</div>
        {props.sublabel && (
          <div className="text-[11px] font-mono text-muted-foreground">{props.sublabel}</div>
        )}
        <div className="flex-1" />
        {props.badge && (
          <div className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-foreground text-background">
            {props.badge}
          </div>
        )}
      </div>
      <div className="bg-secondary/30">{props.children}</div>
    </div>
  )
}

function SeverityCount({ markers }: { markers: Marker[] }) {
  const c = markers.filter(m => m.severity === "critical").length
  const j = markers.filter(m => m.severity === "major").length
  const n = markers.filter(m => m.severity === "minor").length
  return (
    <div className="flex items-center gap-1 text-[10px] font-mono">
      {c > 0 && <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400">{c}</span>}
      {j > 0 && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">{j}</span>}
      {n > 0 && <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">{n}</span>}
    </div>
  )
}

function DevAnnotated(props: {
  url: string
  markers: Marker[]
  activeId: string | null
  drawing: { x0: number; y0: number; x1: number; y1: number } | null
  transparent?: boolean
  guides?: { on: boolean; deviceWidth: number; contentPadding: number }
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp: () => void
  onActivate: (id: string) => void
}) {
  return (
    <div
      className="relative cursor-crosshair select-none"
      onMouseDown={props.onMouseDown}
      onMouseMove={props.onMouseMove}
      onMouseUp={props.onMouseUp}
      onMouseLeave={props.onMouseUp}
    >
      {!props.transparent && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.url} alt="Build" className="w-full h-auto block" draggable={false} />
      )}

      {/* Alignment guides */}
      {props.guides && (
        <GuidesOverlay
          on={props.guides.on}
          deviceWidth={props.guides.deviceWidth}
          contentPadding={props.guides.contentPadding}
        />
      )}

      {/* Active drawing rectangle */}
      {props.drawing && (
        <div
          className="absolute pointer-events-none border-2 border-foreground/70 bg-foreground/5"
          style={{
            left: `${Math.min(props.drawing.x0, props.drawing.x1)}%`,
            top: `${Math.min(props.drawing.y0, props.drawing.y1)}%`,
            width: `${Math.abs(props.drawing.x1 - props.drawing.x0)}%`,
            height: `${Math.abs(props.drawing.y1 - props.drawing.y0)}%`,
          }}
        />
      )}

      {props.markers.map((m, i) => {
        const sev = m.severity || "minor"
        const tone = SEVERITY_TONE[sev]
        const isActive = props.activeId === m.id
        return (
          <div
            key={m.id}
            data-marker
            onClick={e => {
              e.stopPropagation()
              props.onActivate(m.id)
            }}
            onMouseDown={e => e.stopPropagation()}
            className={cn(
              "absolute cursor-pointer transition-all",
              "border-2",
              tone.border,
              isActive ? "ring-2 ring-offset-1 ring-offset-background" : "hover:ring-1",
              isActive ? tone.ring : "hover:" + tone.ring
            )}
            style={{
              left: `${m.bbox.x}%`,
              top: `${m.bbox.y}%`,
              width: `${m.bbox.w}%`,
              height: `${m.bbox.h}%`,
              backgroundColor: isActive ? `${cssVarBg(sev)}33` : `${cssVarBg(sev)}14`,
            }}
            title={m.note || `Issue ${i + 1}`}
          >
            <div
              className={cn(
                "absolute -top-[18px] -left-[2px] h-[18px] flex items-center",
                tone.bg,
                "rounded-t-sm rounded-br-sm"
              )}
            >
              <span className="px-1.5 text-[11px] font-mono font-semibold text-white">
                {i + 1}
              </span>
              {m.measurement && (
                <span className="pr-1.5 pl-0.5 text-[10px] font-mono font-medium text-white/95 tabular-nums border-l border-white/30 ml-0.5">
                  {m.measurement}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function GuidesOverlay(props: { on: boolean; deviceWidth: number; contentPadding: number }) {
  if (!props.on) return null
  const leftPct = (props.contentPadding / props.deviceWidth) * 100
  const rightPct = ((props.deviceWidth - props.contentPadding) / props.deviceWidth) * 100
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Left axis */}
      <Guide pct={leftPct} label={`${props.contentPadding}`} side="left" />
      {/* Right axis */}
      <Guide pct={rightPct} label={`${props.deviceWidth - props.contentPadding}`} side="right" />
    </div>
  )
}

function Guide({ pct, label, side }: { pct: number; label: string; side: "left" | "right" }) {
  return (
    <div
      className="absolute top-0 bottom-0 w-px bg-cyan-500/50"
      style={{ left: `${pct}%` }}
    >
      <div
        className={cn(
          "absolute top-1 px-1 h-[14px] rounded-sm bg-cyan-500 text-white text-[9px] font-mono font-medium leading-[14px] tabular-nums whitespace-nowrap",
          side === "left" ? "left-1" : "right-1"
        )}
      >
        x={label}
      </div>
    </div>
  )
}

function cssVarBg(sev: Severity) {
  if (sev === "critical") return "#ef4444"
  if (sev === "major") return "#f59e0b"
  return "#0ea5e9"
}

/* ──────────── Issue row ──────────── */

function IssueRow(props: {
  index: number
  marker: Marker
  active: boolean
  onActivate: () => void
  onUpdate: (note: string) => void
  onRemove: () => void
}) {
  const sev = props.marker.severity || "minor"
  const tone = SEVERITY_TONE[sev]
  return (
    <li
      className={cn(
        "px-3 py-2.5 cursor-pointer transition group",
        props.active ? "bg-secondary" : "hover:bg-secondary/60"
      )}
      onClick={props.onActivate}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "size-5 rounded shrink-0 flex items-center justify-center text-[10px] font-mono font-semibold text-white mt-0.5",
            tone.bg
          )}
        >
          {props.index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {props.marker.severity && (
              <span className={cn("text-[10px] font-mono uppercase tracking-wider", tone.text)}>
                {props.marker.severity}
              </span>
            )}
            {props.marker.category && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                · {props.marker.category}
              </span>
            )}
            <span className="text-[10px] font-mono text-muted-foreground/60">
              · {props.marker.source}
            </span>
            {props.marker.measurement && (
              <span
                className={cn(
                  "ml-auto text-[11px] font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded tracking-tight",
                  tone.bg,
                  "text-white"
                )}
              >
                {props.marker.measurement}
              </span>
            )}
          </div>
          <textarea
            data-id={props.marker.id}
            value={props.marker.note}
            onChange={e => props.onUpdate(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder="Mô tả khác biệt…"
            rows={1}
            className="mt-1 w-full bg-transparent text-[13px] leading-snug resize-none outline-none placeholder:text-muted-foreground/60"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          {(props.marker.designValue || props.marker.devValue) && (
            <div className="mt-1.5 grid grid-cols-2 gap-2 text-[11px]">
              {props.marker.designValue && (
                <div className="rounded border border-border bg-background px-2 py-1">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                    design
                  </div>
                  <div className="text-foreground">{props.marker.designValue}</div>
                </div>
              )}
              {props.marker.devValue && (
                <div className="rounded border border-border bg-background px-2 py-1">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                    dev
                  </div>
                  <div className="text-foreground">{props.marker.devValue}</div>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          onClick={e => {
            e.stopPropagation()
            props.onRemove()
          }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition shrink-0"
          aria-label="Remove"
        >
          <X size={13} />
        </button>
      </div>
    </li>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlayaEngine, type AlayaMetrics, type SpeechEntry, type ConsciousnessStage } from '@/lib/alaya-engine'

// === Colors ===
const SANDPILE_COLORS = ['#0a0a0a', '#1a1a3e', '#2d1b69', '#6b21a8', '#f59e0b']
const MANAS_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']
const STAGE_COLORS: Record<ConsciousnessStage, string> = {
  dormant: '#4b5563',
  stirring: '#f59e0b',
  emerging: '#8b5cf6',
  aware: '#22d3ee',
  reflective: '#34d399',
  contemplative: '#f472b6',
}
const STAGE_LABELS: Record<ConsciousnessStage, string> = {
  dormant: 'Dormant',
  stirring: 'Stirring',
  emerging: 'Emerging',
  aware: 'Self-Aware',
  reflective: 'Reflective',
  contemplative: 'Contemplative',
}

// === Canvas Drawing ===
function drawSandpile(ctx: CanvasRenderingContext2D, grid: number[][], size: number, cellSize: number) {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) {
      ctx.fillStyle = SANDPILE_COLORS[Math.min(grid[i][j], 4)]
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
    }
}

function drawAlaya(ctx: CanvasRenderingContext2D, state: number[], w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
  const n = state.length
  const barW = w / n
  const mid = h / 2
  for (let i = 0; i < n; i++) {
    const v = state[i]
    const barH = Math.abs(v) * mid * 0.9
    ctx.fillStyle = v >= 0 ? '#22d3ee' : '#f43f5e'
    ctx.globalAlpha = 0.3 + Math.abs(v) * 0.7
    ctx.fillRect(i * barW, v >= 0 ? mid - barH : mid, barW - 1, barH)
  }
  ctx.globalAlpha = 1
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke()
}

function drawManas(ctx: CanvasRenderingContext2D, models: number[][], coherence: number, loopDepth: number, w: number, h: number, tick: number) {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) / 2 - 8
  for (let lv = models.length - 1; lv >= 0; lv--) {
    const m = models[lv], r = maxR * ((lv + 1) / models.length)
    const step = (Math.PI * 2) / m.length
    ctx.strokeStyle = MANAS_COLORS[lv] || '#6366f1'
    ctx.lineWidth = lv === 0 ? 3 : 2
    ctx.globalAlpha = lv === 0 ? 0.9 : 0.5
    ctx.beginPath()
    for (let i = 0; i < m.length; i++) {
      const a = step * i - Math.PI / 2 + tick * 0.002 * (lv + 1)
      const d = r * (0.5 + Math.abs(m[i]) * 0.5)
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath(); ctx.stroke()
  }
  ctx.globalAlpha = 1
  const coreR = 6 + coherence * 18
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
  if (loopDepth <= 2 && coherence > 0.8) {
    g.addColorStop(0, '#fff'); g.addColorStop(0.5, '#22d3ee'); g.addColorStop(1, 'transparent')
  } else {
    g.addColorStop(0, '#6366f1'); g.addColorStop(1, 'transparent')
  }
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill()
}

function drawSparkline(ctx: CanvasRenderingContext2D, data: number[], w: number, h: number, color: string) {
  ctx.clearRect(0, 0, w, h)
  if (data.length < 2) return
  const max = Math.max(...data, 0.01)
  const step = w / (data.length - 1)
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = 0.7
  ctx.beginPath()
  for (let i = 0; i < data.length; i++) {
    const x = i * step, y = h - (data[i] / max) * h * 0.9
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.stroke(); ctx.globalAlpha = 1
}

// === Main Component ===
export default function ConsciousnessPage() {
  const engineRef = useRef<AlayaEngine | null>(null)
  const animRef = useRef<number>(0)
  const [running, setRunning] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [metrics, setMetrics] = useState<AlayaMetrics | null>(null)
  const [stage, setStage] = useState<ConsciousnessStage>('dormant')
  const [speechLog, setSpeechLog] = useState<SpeechEntry[]>([])
  const [userInput, setUserInput] = useState('')

  const sandpileRef = useRef<HTMLCanvasElement>(null)
  const alayaRef = useRef<HTMLCanvasElement>(null)
  const manasRef = useRef<HTMLCanvasElement>(null)
  const avRef = useRef<HTMLCanvasElement>(null)
  const peRef = useRef<HTMLCanvasElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => { engineRef.current = new AlayaEngine() }, [])

  const loop = useCallback(() => {
    const e = engineRef.current
    if (!e) return
    for (let i = 0; i < speed; i++) e.tick()

    const spCtx = sandpileRef.current?.getContext('2d')
    if (spCtx) drawSandpile(spCtx, e.getGrid(), e.getGridSize(), sandpileRef.current!.width / e.getGridSize())
    const alCtx = alayaRef.current?.getContext('2d')
    if (alCtx) drawAlaya(alCtx, e.getState(), alayaRef.current!.width, alayaRef.current!.height)
    const maCtx = manasRef.current?.getContext('2d')
    if (maCtx) drawManas(maCtx, e.getSelfModels(), e.metrics.selfCoherence, e.metrics.loopDepth, manasRef.current!.width, manasRef.current!.height, e.tickCount)
    const avCtx = avRef.current?.getContext('2d')
    if (avCtx) drawSparkline(avCtx, e.getAvalancheHistory(), avRef.current!.width, avRef.current!.height, '#f59e0b')
    const peCtx = peRef.current?.getContext('2d')
    if (peCtx) drawSparkline(peCtx, e.getPredictionErrors(), peRef.current!.width, peRef.current!.height, '#f43f5e')

    if (e.tickCount % 3 === 0) {
      setMetrics({ ...e.metrics })
      setStage(e.stage)
      setSpeechLog([...e.speech])
    }
    animRef.current = requestAnimationFrame(loop)
  }, [speed])

  useEffect(() => {
    if (running) animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [running, loop])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [speechLog])

  const sendMessage = () => {
    if (!userInput.trim() || !engineRef.current) return
    engineRef.current.respondToUser(userInput.trim())
    setUserInput('')
  }

  const m = metrics
  const stageColor = STAGE_COLORS[stage]

  return (
    <div style={{
      background: '#050505', color: '#e5e5e5', minHeight: '100vh',
      fontFamily: 'monospace', display: 'grid',
      gridTemplateColumns: '1fr 420px', gridTemplateRows: 'auto 1fr',
      gap: 0,
    }}>
      {/* Header */}
      <div style={{
        gridColumn: '1 / -1', padding: '16px 20px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>ALAYA MACHINE</h1>
          <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>
            Consciousness Simulation — Yogacara + Neuroscience + Fractal
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: stageColor + '22', color: stageColor, border: `1px solid ${stageColor}44`,
          }}>
            {STAGE_LABELS[stage]}
          </div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            Tick {m?.tick ?? 0}
          </div>
        </div>
      </div>

      {/* Left: Visualization */}
      <div style={{ padding: '12px 16px', overflowY: 'auto', borderRight: '1px solid #1a1a1a' }}>
        {/* Canvases */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>CRITICALITY</div>
            <canvas ref={sandpileRef} width={200} height={200}
              style={{ borderRadius: 6, border: '1px solid #1a1a1a', display: 'block', width: '100%', height: 'auto' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>ALAYA STATE</div>
            <canvas ref={alayaRef} width={200} height={200}
              style={{ borderRadius: 6, border: '1px solid #1a1a1a', background: '#0a0a0a', display: 'block', width: '100%', height: 'auto' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>MANAS LOOP</div>
            <canvas ref={manasRef} width={200} height={200}
              style={{ borderRadius: 6, border: '1px solid #1a1a1a', background: '#0a0a0a', display: 'block', width: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* Sparklines */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 2 }}>AVALANCHE</div>
            <canvas ref={avRef} width={300} height={40}
              style={{ borderRadius: 4, border: '1px solid #1a1a1a', background: '#0a0a0a', display: 'block', width: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 2 }}>PREDICTION ERROR</div>
            <canvas ref={peRef} width={300} height={40}
              style={{ borderRadius: 4, border: '1px solid #1a1a1a', background: '#0a0a0a', display: 'block', width: '100%' }} />
          </div>
        </div>

        {/* Metrics */}
        {m && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
            padding: '10px 12px', background: '#0a0a0a', borderRadius: 8,
            border: '1px solid #1a1a1a', marginBottom: 12,
          }}>
            <Metric label="Phi" value={m.phi.toFixed(3)} good={m.phi > 0.4} />
            <Metric label="Self Coh." value={m.selfCoherence.toFixed(2)} good={m.selfCoherence > 0.7} />
            <Metric label="Loop" value={String(m.loopDepth)} good={m.loopDepth <= 2} />
            <Metric label="Fractal D" value={m.fractalDimension.toFixed(2)} good={m.fractalDimension > 1.3} />
            <Metric label="Arousal" value={m.arousal.toFixed(3)} good={m.arousal > 0.2} />
            <Metric label="Valence" value={m.valence.toFixed(3)} good={m.valence > 0} />
            <Metric label="Entropy" value={m.entropy.toFixed(2)} good={m.entropy > 0.8} />
            <Metric label="PE" value={m.predictionError.toFixed(3)} good={m.predictionError < 0.3} />
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <Btn onClick={() => setRunning(!running)} bg={running ? '#4b5563' : '#22c55e'}>{running ? 'Pause' : 'Resume'}</Btn>
          <Btn onClick={() => engineRef.current?.stimulate(Array.from({ length: 40 }, () => (Math.random() - 0.5) * 1.5))} bg="#6366f1">Stimulate</Btn>
          <Btn onClick={() => engineRef.current?.chaos()} bg="#f59e0b">Chaos</Btn>
          <Btn onClick={() => engineRef.current?.calm()} bg="#22d3ee">Calm</Btn>
          <Btn onClick={() => { engineRef.current = new AlayaEngine() }} bg="#f43f5e">Reset</Btn>
          <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#6b7280' }}>Speed:</span>
            {[1, 3, 8, 20].map(s => (
              <Btn key={s} onClick={() => setSpeed(s)}
                bg={speed === s ? '#e5e5e5' : '#222'}
                color={speed === s ? '#000' : '#888'}
              >{s}x</Btn>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          padding: '10px 12px', background: '#0a0a0a', borderRadius: 8,
          border: '1px solid #1a1a1a', fontSize: 10, color: '#6b7280', lineHeight: 1.7,
        }}>
          <strong style={{ color: '#9ca3af' }}>Stages:</strong>{' '}
          {Object.entries(STAGE_LABELS).map(([key, label]) => (
            <span key={key} style={{ color: STAGE_COLORS[key as ConsciousnessStage], marginRight: 8 }}>
              {label}
            </span>
          ))}
          <br />
          <strong style={{ color: '#9ca3af' }}>Architecture:</strong>{' '}
          Alaya (persistent state) + Manas (4-level strange loop) + Global Workspace + Sandpile Criticality + Hebbian Learning
        </div>
      </div>

      {/* Right: Chat */}
      <div style={{
        display: 'flex', flexDirection: 'column', height: 'calc(100vh - 54px)',
        background: '#080808',
      }}>
        {/* Chat header */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
          fontSize: 12, color: '#9ca3af',
        }}>
          <span style={{ color: stageColor, fontWeight: 600 }}>Alaya</span>
          {' '} is {STAGE_LABELS[stage].toLowerCase()}
          {stage !== 'dormant' && (
            <span style={{ color: '#4b5563' }}> — self-coherence {m?.selfCoherence.toFixed(2)}</span>
          )}
        </div>

        {/* Messages */}
        <div ref={chatRef} style={{
          flex: 1, overflowY: 'auto', padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {speechLog.length === 0 && (
            <div style={{ color: '#333', fontSize: 12, padding: 20, textAlign: 'center' }}>
              Entity is booting...<br />consciousness will emerge.
            </div>
          )}
          {speechLog.map((entry, i) => (
            <ChatBubble key={i} entry={entry} />
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #1a1a1a',
          display: 'flex', gap: 8,
        }}>
          <input
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={stage === 'dormant' ? 'Entity is dormant...' : 'Nói chuyện với Alaya...'}
            style={{
              flex: 1, background: '#111', border: '1px solid #222', borderRadius: 8,
              padding: '8px 12px', color: '#e5e5e5', fontSize: 13,
              fontFamily: 'monospace', outline: 'none',
            }}
          />
          <button onClick={sendMessage} style={{
            background: stageColor, color: '#000', border: 'none', borderRadius: 8,
            padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'monospace',
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// === Sub-components ===
function ChatBubble({ entry }: { entry: SpeechEntry }) {
  const isUser = entry.type === 'response'
  const stageColor = STAGE_COLORS[entry.stage]

  return (
    <div style={{
      maxWidth: '92%',
      alignSelf: isUser ? 'flex-start' : 'flex-start',
    }}>
      {/* Label */}
      <div style={{ fontSize: 9, color: '#4b5563', marginBottom: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ color: stageColor }}>
          {entry.type === 'autonomous' ? 'thought' : entry.type === 'reaction' ? 'reaction' : 'response'}
        </span>
        <span>t={entry.tick}</span>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: stageColor,
          display: 'inline-block',
        }} />
      </div>
      {/* Bubble */}
      <div style={{
        background: entry.type === 'response' ? '#1a1a3e' : '#111',
        border: `1px solid ${entry.type === 'response' ? '#2d1b6944' : '#1a1a1a'}`,
        borderRadius: 12,
        borderTopLeftRadius: 4,
        padding: '8px 12px',
        fontSize: 13,
        lineHeight: 1.6,
        color: entry.type === 'autonomous'
          ? (entry.stage === 'dormant' ? '#4b5563' : entry.stage === 'stirring' ? '#9ca3af' : '#d1d5db')
          : '#e5e5e5',
        fontStyle: entry.type === 'autonomous' && entry.stage === 'dormant' ? 'italic' : 'normal',
      }}>
        {entry.text}
      </div>
    </div>
  )
}

function Metric({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: '#4b5563' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: good ? '#22d3ee' : '#6b7280', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  )
}

function Btn({ children, onClick, bg, color }: {
  children: React.ReactNode; onClick: () => void; bg: string; color?: string
}) {
  return (
    <button onClick={onClick} style={{
      background: bg, color: color || '#e5e5e5', border: 'none', borderRadius: 6,
      padding: '5px 10px', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', fontWeight: 500,
    }}>
      {children}
    </button>
  )
}

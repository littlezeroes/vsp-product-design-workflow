'use client'

import { useState } from 'react'
import { colorTokens } from '@/lib/ds-data'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group flex items-center gap-[6px] rounded-6 px-[8px] py-[4px] text-[12px] transition-colors"
      style={{
        fontFamily: 'monospace',
        color: copied ? 'var(--success, #00b182)' : 'var(--foreground)',
        backgroundColor: copied ? 'var(--secondary)' : 'transparent',
      }}
      title="Click to copy"
    >
      {text}
      <span className="opacity-0 group-hover:opacity-60 transition-opacity text-[10px]">
        {copied ? '✓' : '⎘'}
      </span>
    </button>
  )
}

function HexCopyButton({ cssVar }: { cssVar: string }) {
  const [copied, setCopied] = useState(false)
  const [hex, setHex] = useState('')

  function handleClick() {
    // Read computed color from CSS variable
    const el = document.documentElement
    const value = getComputedStyle(el).getPropertyValue(cssVar).trim()
    // Convert to hex if not already
    const canvas = document.createElement('canvas')
    canvas.width = 1; canvas.height = 1
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = value
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      const hexVal = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      navigator.clipboard.writeText(hexVal)
      setHex(hexVal)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-[4px] rounded-6 px-[6px] py-[3px] text-[11px] transition-colors"
      style={{
        fontFamily: 'monospace',
        color: copied ? 'var(--success, #00b182)' : 'var(--foreground-secondary)',
        backgroundColor: copied ? 'var(--secondary)' : 'transparent',
      }}
      title="Copy hex value"
    >
      {copied ? hex : 'hex'}
      <span className="opacity-0 group-hover:opacity-60 transition-opacity text-[9px]">
        {copied ? '✓' : '⎘'}
      </span>
    </button>
  )
}

const semanticCategories = [
  {
    name: 'Foreground',
    tokens: [
      { name: '--foreground', usage: 'Primary text, icons (#080808 / #ffffff)' },
      { name: '--foreground-secondary', usage: 'Secondary text, sublabels (#262626 / #a1a1a1)' },
      { name: '--muted-foreground', usage: 'Disabled/muted text (#737373)' },
      { name: '--disabled-fg', usage: 'Disabled interactive elements (#a1a1a1 / #525252)' },
    ],
  },
  {
    name: 'Background',
    tokens: [
      { name: '--background', usage: 'Page background (#ffffff / #080808)' },
      { name: '--secondary', usage: 'Card fills, surface secondary (#f3f3f3 / #262626)' },
      { name: '--muted', usage: 'Muted backgrounds, disabled areas (#f3f3f3 / #262626)' },
      { name: '--accent', usage: 'Hover states, subtle highlights (#fafafa)' },
      { name: '--disabled-bg', usage: 'Disabled element background (#e5e5e5 / #343434)' },
      { name: '--overlay', usage: 'Modal/sheet backdrop (rgba(0,0,0,0.4))' },
    ],
  },
  {
    name: 'Interactive',
    tokens: [
      { name: '--primary', usage: 'Brand color, primary actions (#1f1f1f / #ffffff)' },
      { name: '--primary-foreground', usage: 'Text on primary backgrounds' },
      { name: '--accent-foreground', usage: 'Text on accent backgrounds' },
      { name: '--brand-secondary', usage: 'Brand secondary accent (#00dda3 / #33e4b5)' },
    ],
  },
  {
    name: 'Feedback',
    tokens: [
      { name: '--success', usage: 'Success states (#00b182 / #00dda3)' },
      { name: '--success-foreground', usage: 'Text on success backgrounds' },
      { name: '--danger', usage: 'Error, destructive actions (#eb002b)' },
      { name: '--danger-foreground', usage: 'Text on danger backgrounds' },
      { name: '--destructive', usage: 'Alias for danger (#eb002b)' },
      { name: '--warning', usage: 'Warning states (#eab308 / #facc15)' },
      { name: '--warning-foreground', usage: 'Text on warning backgrounds' },
      { name: '--info', usage: 'Informational states (#2b7fff / #4c94f8)' },
      { name: '--info-foreground', usage: 'Text on info backgrounds' },
    ],
  },
  {
    name: 'Border & Input',
    tokens: [
      { name: '--border', usage: 'Default borders (#e5e5e5 / #262626)' },
      { name: '--border-bold', usage: 'Stronger borders (#d4d4d4 / #404040)' },
      { name: '--input', usage: 'Input field borders' },
      { name: '--ring', usage: 'Focus ring indicator' },
      { name: '--disabled-border', usage: 'Disabled element border (#e5e5e5 / #343434)' },
    ],
  },
  {
    name: 'Component Surfaces',
    tokens: [
      { name: '--card', usage: 'Card background (#ffffff / dark)' },
      { name: '--card-foreground', usage: 'Card text color' },
      { name: '--card-accent', usage: 'Accent card background (dark rose)' },
      { name: '--popover', usage: 'Popover/dropdown background' },
      { name: '--popover-foreground', usage: 'Popover text color' },
      { name: '--toast', usage: 'Toast background (#262626 / #f3f3f3)' },
      { name: '--island', usage: 'Floating island background (#171717)' },
      { name: '--search', usage: 'Search bar background' },
    ],
  },
  {
    name: 'Sidebar',
    tokens: [
      { name: '--sidebar', usage: 'Sidebar background' },
      { name: '--sidebar-foreground', usage: 'Sidebar text' },
      { name: '--sidebar-primary', usage: 'Sidebar active item' },
      { name: '--sidebar-primary-foreground', usage: 'Sidebar active text' },
      { name: '--sidebar-accent', usage: 'Sidebar hover/accent' },
      { name: '--sidebar-accent-foreground', usage: 'Sidebar accent text' },
      { name: '--sidebar-border', usage: 'Sidebar borders' },
    ],
  },
]

const architecture = [
  {
    layer: 'Primitives',
    count: colorTokens.primitives,
    description:
      'Raw color values organized by hue and shade. Grey (17 stops), Green, Red, Blue, Yellow, Rose, Orange, and Purple palettes. These are static and do not change between modes.',
    example: '--color-grey-900: #171717',
  },
  {
    layer: 'Semantic',
    count: colorTokens.semantic,
    description:
      'Purpose-driven tokens that reference primitives. They swap values between light and dark modes, providing the theming layer.',
    example: '--foreground: var(--color-grey-900) / var(--color-grey-50)',
  },
  {
    layer: 'Component',
    count: null,
    description:
      'Component-scoped tokens that reference semantic tokens. Used inside specific components for overrides and state variations.',
    example: '--card: var(--background)',
  },
]

export default function ColorsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Colors
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          VSP uses a three-layer color token architecture: Primitives, Semantic,
          and Component tokens. All colors are CSS variables, enabling automatic
          dark mode support.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-[12px] sm:grid-cols-4">
        {[
          { label: 'Primitive tokens', value: colorTokens.primitives },
          { label: 'Semantic tokens', value: colorTokens.semantic },
          { label: 'Dark mode', value: colorTokens.darkModeCoverage },
          { label: 'Aliasing rate', value: colorTokens.aliasingRate },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-[4px] rounded-12 p-[16px]"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            <span
              className="text-[20px] font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              {s.value}
            </span>
            <span
              className="text-[12px] font-medium"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {s.label}
            </span>
    </div>
        ))}
      </section>

      {/* Architecture */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Token Architecture
        </h2>
        <div className="flex flex-col gap-[12px]">
          {architecture.map((layer, i) => (
            <div
              key={layer.layer}
              className="flex flex-col gap-[8px] rounded-12 border p-[16px]"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-[8px]">
                <span
                  className="flex h-[24px] w-[24px] items-center justify-center rounded-full text-[12px] font-semibold"
                  style={{
                    backgroundColor: 'var(--foreground)',
                    color: 'var(--background)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-[16px] font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {layer.layer}
                </span>
                {layer.count && (
                  <span
                    className="rounded-full px-[8px] py-[2px] text-[11px] font-medium"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground-secondary)',
                    }}
                  >
                    {layer.count} tokens
                  </span>
                )}
    </div>
              <p
                className="text-[14px] leading-[20px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {layer.description}
              </p>
              <code
                className="rounded-8 px-[12px] py-[8px] text-[13px]"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--foreground)',
                  fontFamily: 'monospace',
                }}
              >
                {layer.example}
              </code>
    </div>
          ))}
    </div>
      </section>

      {/* Semantic Categories */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Semantic Tokens
        </h2>
        <p
          className="text-[14px] leading-[20px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          These are the tokens you use in code. They automatically adapt between
          light and dark mode.
        </p>
        <div className="flex flex-col gap-[24px]">
          {semanticCategories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-[8px]">
              <h3
                className="text-[14px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {cat.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="w-[32px] pb-[8px]" />
                      <th className="w-[200px] pb-[8px] text-left font-medium text-[12px]" style={{ color: 'var(--foreground-secondary)' }}>Token</th>
                      <th className="w-[70px] pb-[8px] text-left font-medium text-[12px]" style={{ color: 'var(--foreground-secondary)' }}>Hex</th>
                      <th className="pb-[8px] text-left font-medium text-[12px]" style={{ color: 'var(--foreground-secondary)' }}>Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.tokens.map((token) => (
                      <tr key={token.name} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-[8px]">
                          <div
                            className="h-[20px] w-[20px] rounded-6 border"
                            style={{ backgroundColor: `var(${token.name})`, borderColor: 'var(--border)' }}
                          />
                        </td>
                        <td className="py-[8px]">
                          <CopyButton text={token.name} />
                        </td>
                        <td className="py-[8px]">
                          <HexCopyButton cssVar={token.name} />
                        </td>
                        <td className="py-[8px] text-[12px]" style={{ color: 'var(--foreground-secondary)' }}>
                          {token.usage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
    </div>
          ))}
    </div>
      </section>

      {/* Naming Convention */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Naming Convention
        </h2>
        <div
          className="flex flex-col gap-[8px] rounded-12 p-[16px]"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <p
            className="text-[14px] leading-[20px]"
            style={{ color: 'var(--foreground)' }}
          >
            <strong>Primitives:</strong>{' '}
            <code style={{ fontFamily: 'monospace' }}>
              --color-{'{hue}'}-{'{shade}'}
            </code>{' '}
            (e.g., <code style={{ fontFamily: 'monospace' }}>--color-grey-900</code>)
          </p>
          <p
            className="text-[14px] leading-[20px]"
            style={{ color: 'var(--foreground)' }}
          >
            <strong>Semantic:</strong>{' '}
            <code style={{ fontFamily: 'monospace' }}>
              --{'{purpose}'}
            </code>{' '}
            or{' '}
            <code style={{ fontFamily: 'monospace' }}>
              --{'{purpose}'}-{'{modifier}'}
            </code>{' '}
            (e.g., <code style={{ fontFamily: 'monospace' }}>--foreground-secondary</code>)
          </p>
          <p
            className="text-[14px] leading-[20px]"
            style={{ color: 'var(--foreground)' }}
          >
            <strong>Component:</strong>{' '}
            <code style={{ fontFamily: 'monospace' }}>
              --{'{component}'}
            </code>{' '}
            (e.g., <code style={{ fontFamily: 'monospace' }}>--card</code>,{' '}
            <code style={{ fontFamily: 'monospace' }}>--popover</code>)
          </p>
    </div>
      </section>
    </div>
  )
}

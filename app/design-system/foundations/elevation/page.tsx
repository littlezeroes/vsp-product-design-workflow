import { elevationStyles } from '@/lib/ds-data'

const elevationDetails = [
  {
    name: 'Elevation/Subtle',
    level: 1,
    css: 'box-shadow: 0 1px 2px rgba(0,0,0,0.05)',
    usage: 'Subtle cards, input fields, minor containers',
  },
  {
    name: 'Elevation/Card',
    level: 2,
    css: 'box-shadow: 0 2px 8px rgba(0,0,0,0.08)',
    usage: 'Standard cards, elevated content sections',
  },
  {
    name: 'Elevation/Sheet',
    level: 3,
    css: 'box-shadow: 0 -4px 24px rgba(0,0,0,0.12)',
    usage: 'Bottom sheets, modals, drawers',
  },
  {
    name: 'Elevation/Border',
    level: 1,
    css: 'box-shadow: 0 0 0 1px rgba(0,0,0,0.06)',
    usage: 'Border-like elevation for flat designs',
  },
  {
    name: 'VSP glass',
    level: 4,
    css: 'backdrop-filter: blur(24px); background: rgba(255,255,255,0.8)',
    usage: 'Glass floating bar, frosted glass overlays',
  },
  {
    name: 'Material Blur',
    level: 5,
    css: 'backdrop-filter: blur(40px)',
    usage: 'Heavy overlays, background dimming with blur',
  },
]

export default function ElevationPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Elevation
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          VSP uses {elevationStyles.length} elevation levels to create depth
          hierarchy. This includes traditional shadows and modern glass morphism
          effects.
        </p>
      </section>

      {/* Elevation Cards */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Elevation Hierarchy
        </h2>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          {elevationDetails.map((el) => (
            <div
              key={el.name}
              className="flex flex-col gap-[12px] rounded-12 border p-[20px]"
              style={{ borderColor: 'var(--border)' }}
            >
              {/* Preview box */}
              <div
                className="flex h-[80px] items-center justify-center rounded-8"
                style={{
                  backgroundColor: 'var(--background)',
                  boxShadow:
                    el.level === 1
                      ? '0 1px 3px rgba(0,0,0,0.08)'
                      : el.level === 2
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : el.level === 3
                          ? '0 4px 16px rgba(0,0,0,0.12)'
                          : el.level === 4
                            ? '0 8px 32px rgba(0,0,0,0.08)'
                            : '0 12px 48px rgba(0,0,0,0.16)',
                  border: '1px solid var(--border)',
                }}
              >
                <span
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  Level {el.level}
                </span>
    </div>

              {/* Info */}
              <div className="flex flex-col gap-[4px]">
                <span
                  className="text-[14px] font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {el.name}
                </span>
                <p
                  className="text-[13px] leading-[20px]"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  {el.usage}
                </p>
                <code
                  className="mt-[4px] rounded-8 px-[8px] py-[4px] text-[11px]"
                  style={{
                    fontFamily: 'monospace',
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--foreground-secondary)',
                  }}
                >
                  {el.css}
                </code>
    </div>
    </div>
          ))}
    </div>
      </section>

      {/* Usage Notes */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Usage Notes
        </h2>
        <div className="flex flex-col gap-[8px]">
          {[
            'Use Elevation/Subtle for most cards and containers. Keep the UI flat.',
            'Elevation/Sheet is reserved for bottom sheets and modals only.',
            'VSP Glass requires both backdrop-filter and a semi-transparent background.',
            'In dark mode, shadows are less visible. Glass effects become more prominent.',
            'Inside overflow-hidden containers, use inset box-shadow instead of border/outline.',
          ].map((note, i) => (
            <div
              key={i}
              className="flex items-start gap-[8px] rounded-8 p-[12px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <span
                className="mt-[2px] text-[12px] font-semibold"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {i + 1}.
              </span>
              <span
                className="text-[14px] leading-[20px]"
                style={{ color: 'var(--foreground)' }}
              >
                {note}
              </span>
    </div>
          ))}
    </div>
      </section>
    </div>
  )
}

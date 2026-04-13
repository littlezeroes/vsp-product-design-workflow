import { spacingTokens } from '@/lib/ds-data'

const layoutRules = [
  {
    token: 'content-padding',
    value: '22px',
    usage: 'Content column horizontal padding. All page content uses px-[22px].',
  },
  {
    token: 'section-gap',
    value: '24px',
    usage: 'Top padding above section titles (pt-[24px]).',
  },
  {
    token: 'pb-[12px]',
    value: '12px',
    usage: 'Bottom padding below section titles.',
  },
  {
    token: 'gap-[8px]',
    value: '8px',
    usage: 'Default gap between elements within a group.',
  },
  {
    token: 'gap-[12px]',
    value: '12px',
    usage: 'Gap between cards, list items.',
  },
  {
    token: 'gap-[16px]',
    value: '16px',
    usage: 'Gap between sections or major groups.',
  },
  {
    token: 'pt-[12px] pb-[16px]',
    value: '12/16px',
    usage: 'FixedBottom CTA area vertical padding.',
  },
  {
    token: 'p-[10px]',
    value: '10px',
    usage: 'Icon button touch target padding.',
  },
]

// Separate numeric tokens from named tokens
const numericTokens = spacingTokens.filter(
  (t) => !isNaN(Number(t.name)) && Number(t.name) >= 0
)
const namedTokens = spacingTokens.filter((t) => isNaN(Number(t.name)))

export default function SpacingPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Spacing
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          VSP spacing is based on an 8px grid. All values align to 4px or 8px
          increments. The system includes {spacingTokens.length} tokens covering
          both numeric scale and semantic layout constants.
        </p>
      </section>

      {/* Visual Scale */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Spacing Scale
        </h2>
        <div className="flex flex-col gap-[6px]">
          {numericTokens.map((token) => {
            const px = parseInt(token.value)
            return (
              <div
                key={token.name}
                className="flex items-center gap-[12px]"
              >
                <span
                  className="w-[32px] shrink-0 text-right text-[12px] font-medium"
                  style={{
                    fontFamily: 'monospace',
                    color: 'var(--foreground-secondary)',
                  }}
                >
                  {token.name}
                </span>
                <div
                  className="h-[20px] rounded-3"
                  style={{
                    width: `${Math.max(px, 2)}px`,
                    backgroundColor: 'var(--foreground)',
                    opacity: 0.2,
                  }}
                />
                <span
                  className="text-[12px]"
                  style={{
                    fontFamily: 'monospace',
                    color: 'var(--foreground-secondary)',
                  }}
                >
                  {token.value}
                </span>
    </div>
            )
          })}
    </div>
      </section>

      {/* Named Tokens */}
      {namedTokens.length > 0 && (
        <section className="flex flex-col gap-[16px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Semantic Spacing Tokens
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Token', 'Value'].map((h) => (
                    <th
                      key={h}
                      className="pb-[8px] text-left font-medium"
                      style={{ color: 'var(--foreground-secondary)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {namedTokens.map((token) => (
                  <tr
                    key={token.name}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-[8px]">
                      <code
                        style={{
                          fontFamily: 'monospace',
                          color: 'var(--foreground)',
                        }}
                      >
                        {token.name}
                      </code>
                    </td>
                    <td
                      className="py-[8px]"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {token.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    </div>
        </section>
      )}

      {/* Layout Rules */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Key Layout Rules
        </h2>
        <p
          className="text-[14px] leading-[20px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          These are the critical spacing constants used throughout every screen.
          They are non-negotiable.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Token', 'Value', 'Usage'].map((h) => (
                  <th
                    key={h}
                    className="pb-[8px] text-left font-medium"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {layoutRules.map((rule) => (
                <tr
                  key={rule.token}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="py-[8px]">
                    <code
                      style={{
                        fontFamily: 'monospace',
                        color: 'var(--foreground)',
                      }}
                    >
                      {rule.token}
                    </code>
                  </td>
                  <td
                    className="py-[8px]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {rule.value}
                  </td>
                  <td
                    className="py-[8px]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {rule.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
      </section>

      {/* Base Unit */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          8px Base Unit
        </h2>
        <div
          className="flex flex-col gap-[8px] rounded-12 p-[16px]"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <p
            className="text-[14px] leading-[20px]"
            style={{ color: 'var(--foreground)' }}
          >
            All spacing aligns to a 4px or 8px grid. Common multipliers:
          </p>
          <div className="flex flex-wrap gap-[8px]">
            {[4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80].map((v) => (
              <span
                key={v}
                className="rounded-full px-[10px] py-[4px] text-[12px] font-medium"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontFamily: 'monospace',
                }}
              >
                {v}px
              </span>
            ))}
    </div>
    </div>
      </section>
    </div>
  )
}

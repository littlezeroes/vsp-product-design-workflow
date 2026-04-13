import { radiusTokens } from '@/lib/ds-data'

const componentMapping = [
  { token: 'rounded-0', component: 'Divider, full-width elements' },
  { token: 'rounded-6', component: 'Small badges, code blocks' },
  { token: 'rounded-8', component: 'Checkbox (rounded-8)' },
  { token: 'rounded-12', component: 'Inform message, small cards' },
  { token: 'rounded-14', component: 'TextField (58px height)' },
  { token: 'rounded-20 / rounded-card', component: 'Cards, dialog, sheet corners' },
  { token: 'rounded-full', component: 'Buttons, radio, toggle, badges, pills' },
]

export default function RadiusPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Border Radius
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          VSP uses {radiusTokens.length} named radius tokens. Always use named
          tokens (rounded-8, rounded-14, rounded-28) instead of arbitrary values
          like rounded-[Xpx].
        </p>
      </section>

      {/* Visual Examples */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Radius Scale
        </h2>
        <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-4">
          {radiusTokens.map((token) => {
            const px = token.value === '9999px' ? 9999 : parseInt(token.value)
            return (
              <div
                key={token.name}
                className="flex flex-col items-center gap-[8px] p-[16px]"
              >
                <div
                  className="flex h-[64px] w-[64px] items-center justify-center border-2"
                  style={{
                    borderRadius: token.value === '9999px' ? '9999px' : `${px}px`,
                    borderColor: 'var(--foreground)',
                    opacity: 0.8,
                  }}
                />
                <div className="flex flex-col items-center gap-[2px]">
                  <code
                    className="text-[12px] font-semibold"
                    style={{
                      fontFamily: 'monospace',
                      color: 'var(--foreground)',
                    }}
                  >
                    {token.name}
                  </code>
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {token.value}
                  </span>
    </div>
    </div>
            )
          })}
    </div>
      </section>

      {/* Token Table */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Token Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Token', 'Value', 'Tailwind Class'].map((h) => (
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
              {radiusTokens.map((token) => (
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
                  <td className="py-[8px]">
                    <code
                      className="rounded-3 px-[6px] py-[2px] text-[12px]"
                      style={{
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--foreground)',
                      }}
                    >
                      rounded-{token.name}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
      </section>

      {/* Component Mapping */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Component Mapping
        </h2>
        <p
          className="text-[14px] leading-[20px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Each component uses a specific radius token. This ensures visual consistency.
        </p>
        <div className="flex flex-col gap-[4px]">
          {componentMapping.map((m) => (
            <div
              key={m.token}
              className="flex items-center gap-[12px] rounded-8 p-[12px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <code
                className="shrink-0 text-[12px] font-medium"
                style={{
                  fontFamily: 'monospace',
                  color: 'var(--foreground)',
                  minWidth: '180px',
                }}
              >
                {m.token}
              </code>
              <span
                className="text-[13px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {m.component}
              </span>
    </div>
          ))}
    </div>
      </section>

      {/* Rule */}
      <section
        className="rounded-12 border p-[16px]"
        style={{ borderColor: 'var(--border)' }}
      >
        <p
          className="text-[14px] font-semibold leading-[20px]"
          style={{ color: 'var(--foreground)' }}
        >
          Rule: Never use rounded-[Xpx] arbitrary values.
        </p>
        <p
          className="mt-[4px] text-[13px] leading-[20px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Tailwind v4 has a known bug with arbitrary radius values. Always use
          named tokens: rounded-3, rounded-8, rounded-10, rounded-12, rounded-14,
          rounded-28, etc.
        </p>
      </section>
    </div>
  )
}

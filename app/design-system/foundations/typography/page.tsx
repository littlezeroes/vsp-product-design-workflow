import { typographyStyles } from '@/lib/ds-data'

const weightMap: Record<string, number> = {
  'Regular': 400,
  'Medium': 500,
  'Semi Bold': 600,
  'Bold': 700,
}

const usageMap: Record<string, string> = {
  'Heading/XL': 'Hero displays, splash screens',
  'Heading/L': 'Large titles, result screens',
  'Heading/M': 'Section heroes, feature highlights',
  'Title/XL': 'Major section titles',
  'Title/L': 'Page titles, large section headers',
  'Title/M': 'Section hero, product name',
  'Title/M-Subtle': 'Section hero (lighter weight)',
  'Title/S': 'Section titles, button text, nav labels',
  'Title/S-Subtle': 'Section titles (lighter weight)',
  'Title/XS': 'Card titles, labels, form labels',
  'Title/XS-Subtle': 'Card titles (lighter weight)',
  'Body/L': 'Large body text, introductions',
  'Body/M': 'Body text, descriptions',
  'Body/S': 'Sublabels, secondary text',
  'Body/XS': 'Help text, disclaimers',
  'Caption/M': 'Footnotes, legal text',
  'Caption/M-Subtle': 'Footnotes (lighter weight)',
  'Caption/S': 'Date badges, tiny labels',
  'Caption/2XS': 'Smallest label text',
}

const groups = [
  { name: 'Heading', prefix: 'Heading/' },
  { name: 'Title', prefix: 'Title/' },
  { name: 'Body', prefix: 'Body/' },
  { name: 'Caption', prefix: 'Caption/' },
]

export default function TypographyPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Typography
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          VSP uses Inter as the primary typeface with {typographyStyles.length} text
          styles organized into Heading, Title, Body, and Caption scales.
        </p>
      </section>

      {/* Type Ramp Preview */}
      <section className="flex flex-col gap-[24px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Type Scale
        </h2>
        {groups.map((group) => {
          const styles = typographyStyles.filter((s) =>
            s.name.startsWith(group.prefix)
          )
          if (styles.length === 0) return null
          return (
            <div key={group.name} className="flex flex-col gap-[12px]">
              <h3
                className="text-[14px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {group.name}
              </h3>
              <div className="flex flex-col gap-[8px]">
                {styles.map((style) => (
                  <div
                    key={style.name}
                    className="flex flex-col gap-[4px] rounded-12 border p-[16px] sm:flex-row sm:items-baseline sm:gap-[24px]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex shrink-0 flex-col gap-[2px] sm:w-[160px]">
                      <span
                        className="text-[12px] font-medium"
                        style={{
                          color: 'var(--foreground-secondary)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {style.name}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: 'var(--foreground-secondary)' }}
                      >
                        {style.size}px / {style.lineHeight}px / {style.weight}
                      </span>
    </div>
                    <span
                      style={{
                        fontSize: `${Math.min(style.size, 32)}px`,
                        fontWeight: weightMap[style.weight] || 400,
                        lineHeight: `${Math.min(style.lineHeight, 40)}px`,
                        color: 'var(--foreground)',
                      }}
                    >
                      The quick brown fox jumps
                    </span>
    </div>
                ))}
    </div>
    </div>
          )
        })}
      </section>

      {/* Full Reference Table */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Reference Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Size', 'Weight', 'Line Height', 'Usage'].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-[8px] text-left font-medium"
                      style={{ color: 'var(--foreground-secondary)' }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {typographyStyles.map((style) => (
                <tr
                  key={style.name}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="py-[8px]">
                    <code
                      style={{
                        fontFamily: 'monospace',
                        color: 'var(--foreground)',
                      }}
                    >
                      {style.name}
                    </code>
                  </td>
                  <td
                    className="py-[8px]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {style.size}px
                  </td>
                  <td
                    className="py-[8px]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {style.weight}
                  </td>
                  <td
                    className="py-[8px]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {style.lineHeight}px
                  </td>
                  <td
                    className="py-[8px]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {usageMap[style.name] || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
      </section>

      {/* Usage Guidelines */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Guidelines
        </h2>
        <div className="flex flex-col gap-[8px]">
          {[
            'All text is left-aligned by default. Never center body text.',
            'Metadata and values in list items are right-aligned (text-right).',
            'Center text only on result/feedback screens (status icon + hero text).',
            'Use -Subtle variants when you need the same size but lighter visual weight.',
            'Heading styles are reserved for hero moments. Do not use them for section titles.',
          ].map((rule, i) => (
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
                {rule}
              </span>
    </div>
          ))}
    </div>
      </section>
    </div>
  )
}

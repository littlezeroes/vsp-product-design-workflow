const rules = [
  {
    number: 1,
    title: 'Financial Amounts',
    summary: 'Right-align amounts, use tabular (monospace) numerals, and prefix with sign (+/-).',
    points: [
      'Apply tabular-nums class for consistent digit width and alignment.',
      'Positive amounts use "+" prefix in success color; negative use "-" in danger color.',
      'Format with thousand separators and currency suffix: "500,000 VND".',
    ],
  },
  {
    number: 2,
    title: 'Status Badges',
    summary: 'Use semantic colors for status badges — success, warning, danger, and info.',
    points: [
      'Badge height is 22px with rounded-full and px-[8px] horizontal padding.',
      'Use Caption/S (10px medium) for badge text.',
      'Map statuses consistently: green = success/active, yellow = pending, red = failed, blue = info.',
    ],
  },
  {
    number: 3,
    title: 'List Layout',
    summary: 'Left-align labels and right-align values in key-value list rows.',
    points: [
      'Labels use foreground-secondary color; values use foreground color.',
      'Use ItemList rows with py-[8px] vertical padding and consistent height.',
      'Group related rows under section titles with pt-[24px] pb-[12px] spacing.',
    ],
  },
  {
    number: 4,
    title: 'Table Readability',
    summary: 'Sticky header row and alternating row backgrounds improve scan speed.',
    points: [
      'Header cells use Title/XS (14px semibold) with foreground-secondary color.',
      'Alternate row backgrounds between transparent and secondary color.',
      'Make the header row sticky so column labels remain visible during scroll.',
    ],
  },
  {
    number: 5,
    title: 'Text Truncation',
    summary: 'Truncate long text with an ellipsis and show the full value on hover or tap.',
    points: [
      'Apply truncate class (overflow-hidden, text-ellipsis, whitespace-nowrap).',
      'On desktop, show a tooltip with the full text on hover.',
      'On mobile, tapping a truncated value expands it inline or opens a detail view.',
    ],
  },
  {
    number: 6,
    title: 'Empty Values',
    summary: 'Display an em dash for missing or null values — never leave cells blank.',
    points: [
      'Use the character "\u2014" (em dash) in foreground-secondary color.',
      'This applies to table cells, list values, and detail fields uniformly.',
      'Never use "N/A", "null", or "undefined" in user-facing displays.',
    ],
  },
]

export default function DataDisplayPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Data Display
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Standards for presenting financial data, statuses, lists, and tables consistently.
        </p>
      </section>

      {/* Rules */}
      <section className="flex flex-col gap-[24px]">
        {rules.map((r) => (
          <div key={r.number} className="flex flex-col gap-[8px]">
            <div
              className="h-[1px] w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="flex items-baseline gap-[8px]">
              <span
                className="text-[13px] font-medium tabular-nums"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {String(r.number).padStart(2, '0')}
              </span>
              <h3
                className="text-[18px] font-semibold leading-[28px]"
                style={{ color: 'var(--foreground)' }}
              >
                {r.title}
              </h3>
            </div>
            <p
              className="pl-[28px] text-[14px] font-medium leading-[20px]"
              style={{ color: 'var(--foreground)' }}
            >
              {r.summary}
            </p>
            <div className="flex flex-col gap-[4px] pl-[28px]">
              {r.points.map((point, i) => (
                <div key={i} className="flex items-start gap-[8px]">
                  <span
                    className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full"
                    style={{ backgroundColor: 'var(--foreground-secondary)' }}
                  />
                  <p
                    className="text-[13px] leading-[20px]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

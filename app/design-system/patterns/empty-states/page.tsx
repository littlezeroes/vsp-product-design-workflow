const rules = [
  {
    number: 1,
    title: 'Centered Layout',
    summary: 'Empty states use a vertically centered composition: icon, title, description, and CTA.',
    points: [
      'Stack elements vertically with center alignment and 16px gap between groups.',
      'The composition sits in the middle of the available content area.',
    ],
  },
  {
    number: 2,
    title: 'Icon Treatment',
    summary: 'Use a Lucide icon at 48px in a muted color as the visual anchor.',
    points: [
      'Choose an icon that represents the empty content type (e.g., FileText for no documents).',
      'Apply foreground-secondary color — never use brand or semantic colors for empty state icons.',
    ],
  },
  {
    number: 3,
    title: 'Empathetic Title',
    summary: 'Write a short, human title that acknowledges the empty state without blame.',
    points: [
      'Use Title/S (16px semibold) for the heading.',
      'Frame positively: "No transactions yet" not "Error: no data found".',
    ],
  },
  {
    number: 4,
    title: 'Actionable Description',
    summary: 'Explain why the state is empty and what the user can do next.',
    points: [
      'Use Body/S (14px regular) in foreground-secondary color.',
      'Keep it to one or two sentences maximum.',
    ],
  },
  {
    number: 5,
    title: 'Primary CTA',
    summary: 'Provide a primary button for the main action to resolve the empty state.',
    points: [
      'Use variant="primary" for the main action (e.g., "Add first transaction").',
      'If no action is possible, omit the button entirely — do not show a disabled CTA.',
    ],
  },
  {
    number: 6,
    title: 'Empty State Types',
    summary: 'Different empty states require different tone and content.',
    points: [
      'First-time: welcoming tone, explain the feature, CTA to get started.',
      'No results: suggest adjusting search or filters, show "Clear filters" action.',
      'Error: acknowledge the problem, show retry button and support link.',
      'Permission denied: explain what access is needed and how to request it.',
    ],
  },
]

export default function EmptyStatesPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Empty States
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          How to handle screens with no content — guiding users instead of showing blank pages.
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

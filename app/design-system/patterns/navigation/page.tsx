const rules = [
  {
    number: 1,
    title: 'Header Back Button',
    summary: 'Always use ChevronLeft for back navigation — it returns to the previous screen.',
    points: [
      'Use the ChevronLeft icon from Lucide, never ArrowLeft.',
      'Back navigates to the previous screen in the stack, not a hardcoded route.',
      'On the root screen of a flow, back exits the flow entirely.',
    ],
  },
  {
    number: 2,
    title: 'Tab Navigation',
    summary: 'Use tabs for switching views within a single page — maximum 5 tabs, no nesting.',
    points: [
      'Tabs live below the header with a 2.5px underline indicator on the active tab.',
      'Tab labels are short (one or two words) and describe the content, not the action.',
      'Never nest tabs inside tabs — use a different pattern for sub-categorization.',
    ],
  },
  {
    number: 3,
    title: 'Bottom Navigation',
    summary: 'The Glass Floating Bar handles main app section switching.',
    points: [
      'Maximum 5 items in the bottom bar — Home, Payments, QR, History, Account.',
      'Active item uses foreground color; inactive uses foreground-secondary.',
      'The bar floats above content with a glass blur effect background.',
    ],
  },
  {
    number: 4,
    title: 'Sheet Navigation',
    summary: 'Use bottom sheets for detailed selection or actions within the current context.',
    points: [
      'Sheets slide up from the bottom and can be dismissed by swiping down.',
      'Use for bank selection, filter options, or action menus.',
      'Sheets do not push a new screen — they overlay the current one.',
    ],
  },
  {
    number: 5,
    title: 'Deep Linking',
    summary: 'Every screen must have a unique URL that can be shared or bookmarked.',
    points: [
      'Use Next.js App Router file-based routing to ensure every page has a path.',
      'Dynamic routes use [id] segments for detail screens.',
      'Deep links should restore the full screen state including active tab.',
    ],
  },
  {
    number: 6,
    title: 'Breadcrumb',
    summary: 'Use breadcrumbs only in the web portal — never in the mobile app.',
    points: [
      'Breadcrumbs show the navigation hierarchy for web dashboard pages.',
      'Separate levels with a ChevronRight icon, not a slash.',
      'The current page is displayed as plain text; parent levels are links.',
    ],
  },
]

export default function NavigationPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Navigation Flow
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          How users move between screens, sections, and contexts across the app.
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

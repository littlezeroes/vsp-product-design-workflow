const rules = [
  {
    number: 1,
    title: 'Skeleton Screens',
    summary: 'Use skeleton placeholders for content loading — they must match the layout shape.',
    points: [
      'Render gray rounded rectangles that mirror the size and position of real content.',
      'Animate with a subtle shimmer (left-to-right pulse) to indicate activity.',
      'Never show a skeleton that does not match the final layout structure.',
    ],
  },
  {
    number: 2,
    title: 'Spinner Usage',
    summary: 'Reserve spinners for action feedback only — button loading, form submission, pull-to-refresh.',
    points: [
      'Show a spinner inside the button that triggered the action, replacing the label.',
      'Disable the button while the spinner is active to prevent double-submission.',
      'Never use a full-screen spinner for page loads — use skeletons instead.',
    ],
  },
  {
    number: 3,
    title: 'Progress Bar',
    summary: 'Use a determinate progress bar when the completion percentage is known.',
    points: [
      'Show for uploads, downloads, and multi-step processes with measurable progress.',
      'Display percentage or step count alongside the bar for clarity.',
    ],
  },
  {
    number: 4,
    title: 'Pull to Refresh',
    summary: 'Support the native pull-to-refresh gesture with a spinner at the top of scrollable lists.',
    points: [
      'The spinner appears above the first item and disappears when loading completes.',
      'Do not reset scroll position after refresh — maintain the user\'s place.',
    ],
  },
  {
    number: 5,
    title: 'No Blank Pages',
    summary: 'Never show a blank white screen during loading — always provide visual feedback.',
    points: [
      'Even a minimal skeleton or centered spinner is better than nothing.',
      'For server-rendered pages, use streaming or suspense boundaries to show partial content.',
    ],
  },
  {
    number: 6,
    title: 'Timing Thresholds',
    summary: 'Match the loading indicator to the expected wait time.',
    points: [
      'Under 1 second: show no loading indicator — the result appears instantly.',
      '1 to 3 seconds: show a spinner or inline loading state.',
      'Over 3 seconds: show a skeleton screen with an optional status message.',
      'Over 10 seconds: add a progress indicator or estimated time remaining.',
    ],
  },
]

export default function LoadingPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Loading States
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Patterns for communicating progress and keeping users informed during wait times.
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

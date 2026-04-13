const rules = [
  {
    number: 1,
    title: 'Inline Errors',
    summary: 'Show validation errors directly below the field with red text and an icon prefix.',
    points: [
      'Error text uses text-danger color, 12px size, placed immediately below the input.',
      'The input border changes to border-danger to visually connect field and message.',
      'Prefix error text with a small alert icon for scannability.',
    ],
  },
  {
    number: 2,
    title: 'Toast Errors',
    summary: 'Use toast notifications for system or network errors — never for field validation.',
    points: [
      'Toasts appear at the top of the screen and auto-dismiss after 4 seconds.',
      'Use the ToastBar component with variant="danger" for error toasts.',
      'Include a brief description and optional retry action.',
    ],
  },
  {
    number: 3,
    title: 'Dialog Errors',
    summary: 'Reserve dialog errors for blocking or destructive situations that require a user decision.',
    points: [
      'Use when the user cannot proceed without acknowledging the error.',
      'Provide two clear actions: a primary resolution and a secondary escape.',
      'Example: session expired dialog with "Log in again" and "Cancel".',
    ],
  },
  {
    number: 4,
    title: 'Error Recovery',
    summary: 'Every error message must include a clear next step — retry, edit, or contact support.',
    points: [
      'Never leave the user at a dead end with just an error message.',
      'For transient errors, offer a "Retry" button that repeats the failed action.',
      'For persistent errors, link to support or provide a reference code.',
    ],
  },
  {
    number: 5,
    title: 'Specific & Actionable Messages',
    summary: 'Error messages must tell the user exactly what went wrong and how to fix it.',
    points: [
      'Write "Enter a valid email address" not "Invalid input".',
      'Write "Amount must be at least 10,000 VND" not "Invalid amount".',
      'Avoid technical jargon, error codes, or stack traces in user-facing messages.',
    ],
  },
  {
    number: 6,
    title: 'Network Errors',
    summary: 'Show a retry button and preserve the last loaded state when the network fails.',
    points: [
      'Display a centered message with a retry CTA when a request fails.',
      'If stale data exists, show it with a banner indicating the data may be outdated.',
      'Auto-retry once silently before showing the error to the user.',
    ],
  },
]

export default function ErrorPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Error Handling
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Patterns for communicating errors clearly and helping users recover gracefully.
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

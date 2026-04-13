const rules = [
  {
    number: 1,
    title: 'One Field Per Focus',
    summary: 'Guide users step by step instead of showing the full form at once.',
    points: [
      'Break long forms into sequential steps with a progress indicator.',
      'Each step should contain one logical group of inputs to reduce cognitive load.',
      'Auto-advance to the next step when possible (e.g., after OTP entry).',
    ],
  },
  {
    number: 2,
    title: 'Label Above Input',
    summary: 'Labels must always appear above the field — never floating or placeholder-only.',
    points: [
      'Floating labels cause accessibility and scanning issues; fixed labels above are clearer.',
      'Placeholder text is for hints or examples, not labels — it disappears on focus.',
    ],
  },
  {
    number: 3,
    title: 'Required by Default',
    summary: 'All fields are required unless explicitly marked as optional.',
    points: [
      'Mark optional fields with "(Optional)" suffix in the label.',
      'Never use asterisks (*) to indicate required fields — users misread them.',
    ],
  },
  {
    number: 4,
    title: 'Inline Error Handling',
    summary: 'Show errors inline below the field with a red border and focus the first error on submit.',
    points: [
      'Error text appears directly below the invalid field in text-danger color.',
      'The field border changes to border-danger to draw attention.',
      'On submit, scroll to and focus the first field with an error.',
    ],
  },
  {
    number: 5,
    title: 'Field Grouping',
    summary: 'Group related fields into sections with a section title.',
    points: [
      'Use section titles (Title/S, 16px semibold) to label each group.',
      'Maintain pt-[24px] pb-[12px] spacing between section titles and content.',
    ],
  },
  {
    number: 6,
    title: 'CTA Placement',
    summary: 'The submit button always lives in the FixedBottom area — one primary per screen.',
    points: [
      'Use the FixedBottom component with px-[22px] padding.',
      'Only one variant="primary" button per screen; secondary for other actions.',
      'Disable the primary button until all required fields pass validation.',
    ],
  },
  {
    number: 7,
    title: 'Mobile Keyboard',
    summary: 'Use the correct input type to surface the right mobile keyboard.',
    points: [
      'Use type="tel" for phone numbers, type="email" for emails, inputMode="numeric" for amounts.',
      'Set autoComplete attributes to enable autofill (name, email, address).',
    ],
  },
]

export default function FormPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Form Patterns
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Guidelines for building accessible, user-friendly forms that reduce friction and errors.
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

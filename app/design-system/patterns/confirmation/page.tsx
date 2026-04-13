const rules = [
  {
    number: 1,
    title: 'Review Before Submit',
    summary: 'Always show a summary screen before irreversible actions like payments or transfers.',
    points: [
      'Display all key details (amount, recipient, fee) in a read-only review layout.',
      'Use ItemList rows with left-aligned labels and right-aligned values.',
      'The submit button label should be specific: "Transfer 500,000 VND" not just "Confirm".',
    ],
  },
  {
    number: 2,
    title: 'Dialog Confirmation',
    summary: 'Use a confirmation dialog for destructive actions like delete, cancel, or suspend.',
    points: [
      'The dialog title states the action: "Cancel this transaction?".',
      'The description explains the consequence: "This cannot be undone.".',
      'Use a danger-styled primary button for the destructive action and a secondary button for escape.',
    ],
  },
  {
    number: 3,
    title: 'Success State',
    summary: 'Show the FeedbackState component with icon, title, and description after a successful action.',
    points: [
      'Use a checkmark circle icon in success color, centered on screen.',
      'Title confirms what happened: "Transfer successful".',
      'Description provides key details: amount, recipient, reference number.',
    ],
  },
  {
    number: 4,
    title: 'Toast Confirmation',
    summary: 'Use toast notifications for non-critical success feedback like saving or updating.',
    points: [
      'Toasts appear at the top and auto-dismiss after 3 seconds.',
      'Use variant="success" with a brief message: "Settings saved".',
      'Do not use toasts for financial transaction results — those require a full success screen.',
    ],
  },
  {
    number: 5,
    title: 'Biometric & PIN',
    summary: 'Require biometric or PIN verification for all financial transactions.',
    points: [
      'Trigger Face ID / fingerprint after the user taps the final submit button.',
      'Fall back to PIN entry if biometric fails or is unavailable.',
      'Show a loading state while the biometric prompt is active.',
    ],
  },
  {
    number: 6,
    title: 'Undo Over Confirm',
    summary: 'For reversible actions, prefer an undo mechanism over a confirmation dialog.',
    points: [
      'Show a toast with an "Undo" action button for actions like archive or remove from list.',
      'The undo window lasts 5 seconds before the action is committed.',
      'Reserve confirmation dialogs for truly irreversible or high-stakes actions.',
    ],
  },
]

export default function ConfirmationPatternsPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Confirmation Flow
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Patterns for verifying user intent and providing feedback after actions complete.
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

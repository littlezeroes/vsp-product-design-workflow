const pageTypes = [
  {
    name: 'Dashboard',
    description: 'Balance display + quick actions grid + recent activity list.',
    rules: [
      'Balance is the hero element — largest text, top of page',
      'Quick actions: 4-column grid with icon + label, tappable 44x44px targets',
      'Recent activity: ItemList with transaction icon, name, amount, date',
      'Pull-to-refresh supported',
      'Hide/show balance toggle in NavBar',
    ],
  },
  {
    name: 'List / Index',
    description: 'Searchable, filterable collection — transactions, contacts, banks.',
    rules: [
      'SearchBar below NavBar (optional but common)',
      'Tab or Chip filter for categories',
      'ItemList rows: 44–72px height, left icon + text + right metadata',
      'Empty state when no results — illustration + description + CTA',
      'Infinite scroll or pagination at bottom',
      'Skeleton loading for initial load',
    ],
  },
  {
    name: 'Detail',
    description: 'Single item view — transaction detail, account info, product detail.',
    rules: [
      'Hero section: key info (amount, status) prominently displayed',
      'Info sections: grouped key-value pairs using ItemList',
      'Related actions at bottom via FixedBottom or inline buttons',
      'Share / copy actions in NavBar if applicable',
      'Status badge for transaction state',
    ],
  },
  {
    name: 'Form',
    description: 'Data input — transfer, top-up, KYC, profile edit.',
    rules: [
      'One question per screen when possible (progressive disclosure)',
      'TextField height: 58px, rounded-14',
      'Labels above fields, helper text below',
      'Primary CTA in FixedBottom — disabled until valid',
      'Inline validation — show error immediately under field',
      'Preserve input on back navigation',
      'Keyboard-aware: scroll field into view when focused',
    ],
  },
  {
    name: 'Result / Feedback',
    description: 'Success, failure, or pending state after an action.',
    rules: [
      'Centered layout — icon + title + description',
      'Icon: large (64–80px), semantic color (epic for success, destructive for failure)',
      'Title: Heading/L (24px semibold)',
      'Description: Body/M, max 2 lines',
      'Primary CTA: "Về trang chủ" or next action',
      'Secondary CTA: "Xem chi tiết" or share',
      'No back button in NavBar — user must use CTAs',
    ],
  },
  {
    name: 'Settings',
    description: 'Grouped configuration rows — toggles, navigation, profile.',
    rules: [
      'Grouped sections with Section Title',
      'ItemList rows with right-aligned Toggle or ChevronRight',
      'Destructive actions (logout, delete) at bottom, text-destructive color',
      'No FixedBottom — all actions inline',
      'Dividers between groups only (not between individual rows)',
    ],
  },
  {
    name: 'Onboarding',
    description: 'First-time user flows — intro slides, feature discovery.',
    rules: [
      'Large title variant NavBar (variant="large-title")',
      'Illustration or animation: centered, max 60% viewport height',
      'Title: Heading/L or Title/M',
      'Description: Body/M, max 3 lines, left-aligned',
      'Primary CTA in FixedBottom',
      'Skip button as text link (secondary)',
      'Page dots indicator for multi-step',
    ],
  },
  {
    name: 'OTP / PIN',
    description: 'Security code input — OTP verification, PIN setup.',
    rules: [
      'Individual input boxes — 6 for OTP, 6 for PIN',
      'Auto-focus first box, auto-advance on input',
      'Custom numpad (no system keyboard)',
      'Timer for OTP resend (countdown in foreground-secondary)',
      'Error state: shake animation + red border',
      'Biometric option below PIN boxes when applicable',
    ],
  },
  {
    name: 'Confirmation',
    description: 'Review summary before executing an action — transfer, payment.',
    rules: [
      'Summary card: rounded-28, all key-value pairs of the transaction',
      'Amount prominently displayed — Heading/L size',
      'Recipient info clearly shown',
      'T&C checkbox above FixedBottom when required',
      'Primary CTA: specific label ("Chuyển 500.000đ" not "Xác nhận")',
      'Secondary CTA: "Quay lại" to edit',
      'No editable fields — read-only review only',
    ],
  },
]

export default function PageTypesPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Page Types
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Catalog of page archetypes in V-Smart Pay. Every screen maps to one of these types.
        </p>
      </section>

      {/* Page Types */}
      <section className="flex flex-col gap-[24px]">
        {pageTypes.map((pt, idx) => (
          <div key={idx} className="flex flex-col gap-[8px]">
            <div
              className="h-[1px] w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="flex items-baseline gap-[8px]">
              <span
                className="text-[13px] font-medium tabular-nums"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h2
                className="text-[18px] font-semibold leading-[28px]"
                style={{ color: 'var(--foreground)' }}
              >
                {pt.name}
              </h2>
            </div>
            <p
              className="pl-[28px] text-[14px] font-medium leading-[22px]"
              style={{ color: 'var(--foreground)' }}
            >
              {pt.description}
            </p>
            <div className="flex flex-col gap-[4px] pl-[28px]">
              {pt.rules.map((rule, rIdx) => (
                <div key={rIdx} className="flex items-start gap-[8px]">
                  <span
                    className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full"
                    style={{ backgroundColor: 'var(--foreground-secondary)' }}
                  />
                  <p
                    className="text-[13px] leading-[20px]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {rule}
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

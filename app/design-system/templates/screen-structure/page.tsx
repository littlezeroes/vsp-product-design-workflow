const structureLayers = [
  {
    name: 'StatusBar',
    height: '54px',
    description: 'System status bar — time, battery, signal. Always present on full-screen pages.',
    optional: false,
  },
  {
    name: 'NavBar',
    height: '56px',
    description: 'Page title + action buttons. Use Header component with variant="default" or variant="large-title".',
    optional: false,
  },
  {
    name: 'SearchBar',
    height: 'auto',
    description: 'Search input field — used on list/index pages. Placed below NavBar.',
    optional: true,
  },
  {
    name: 'Tab',
    height: 'auto',
    description: 'Tab navigation — underline style, 2.5px indicator. Placed below NavBar or SearchBar.',
    optional: true,
  },
  {
    name: 'Section Title',
    height: 'auto',
    description: 'pt-[24px] pb-[12px], px-[22px]. Text: 16px/semibold. Optional suffix Label.',
    optional: false,
  },
  {
    name: 'Section Content',
    height: 'auto',
    description: 'px-[22px]. Your main content area. Repeatable — multiple sections per page.',
    optional: false,
  },
  {
    name: 'T&C Checkbox',
    height: 'auto',
    description: 'Terms & conditions agreement — placed above ButtonGroup when needed.',
    optional: true,
  },
  {
    name: 'ButtonGroup (FixedBottom)',
    height: 'auto',
    description: 'px-[22px], pt-[12px] pb-[16px]. Primary CTA + optional secondary button.',
    optional: true,
  },
  {
    name: 'Home Indicator',
    height: '5px',
    description: 'w-[139px] h-[5px] bg-foreground rounded-full. Centered, pb safe area.',
    optional: false,
  },
]

const spacingTokens = [
  { token: 'px-[22px]', value: '22px', usage: 'Content column padding — ALL content, no exceptions' },
  { token: 'px-[12px]', value: '12px', usage: 'Card inner padding (inside cards/sections)' },
  { token: 'pt-[24px]', value: '24px', usage: 'Section title top spacing' },
  { token: 'pb-[12px]', value: '12px', usage: 'Section title bottom spacing' },
  { token: 'gap-[8px]', value: '8px', usage: 'Default gap between elements' },
  { token: 'gap-[12px]', value: '12px', usage: 'Gap between cards, list items' },
  { token: 'gap-[16px]', value: '16px', usage: 'Gap between sections/groups' },
  { token: 'pt-[12px] pb-[16px]', value: '12/16px', usage: 'FixedBottom CTA area' },
  { token: 'pb-[8px]', value: '8px', usage: 'Home indicator bottom' },
  { token: 'py-[12px]', value: '12px', usage: 'Tab item vertical padding' },
  { token: 'py-[8px]', value: '8px', usage: 'ItemList row vertical padding' },
  { token: 'p-[10px]', value: '10px', usage: 'Icon button touch target padding' },
]

const componentSizes = [
  { component: 'StatusBar', height: '54px', radius: '—' },
  { component: 'NavBar', height: '56px', radius: '—' },
  { component: 'Button primary/secondary', height: '48px', radius: 'rounded-full' },
  { component: 'Button small', height: '32px', radius: 'rounded-full' },
  { component: 'TextField', height: '58px', radius: 'rounded-14' },
  { component: 'ItemList row', height: '44–72px', radius: '—' },
  { component: 'Checkbox / Radio', height: '24px', radius: 'rounded-8 / rounded-full' },
  { component: 'Toggle', height: '32×52px', radius: 'rounded-full' },
  { component: 'Card', height: 'auto', radius: 'rounded-[20px] or rounded-28' },
  { component: 'Action icon button', height: '44×44px', radius: 'rounded-full' },
  { component: 'Badge', height: '22px', radius: 'rounded-full' },
  { component: 'Tab underline', height: '2.5px', radius: '—' },
  { component: 'Home indicator', height: '5×139px', radius: 'rounded-full' },
]

const alignmentRules = [
  'All text left-aligned by default — NEVER center body text',
  'Metadata/values in ItemList = right-aligned (text-right)',
  'Status icons + hero text = centered only on result/feedback screens',
  'Cards: px-[10px] outer margin from screen edge, px-[12px] inner padding',
  'Section titles: ALWAYS px-[22px] from edge, same line as content',
  'FixedBottom buttons: ALWAYS px-[22px] from edge',
]

const typographyScale = [
  { style: 'Heading/L', size: '24px', weight: '600', lineHeight: '32px', usage: 'Large titles, result screens' },
  { style: 'Title/M', size: '20px', weight: '600', lineHeight: '24px', usage: 'Section hero, product name' },
  { style: 'Title/S', size: '16px', weight: '600', lineHeight: '24px', usage: 'Section titles, button text' },
  { style: 'Title/XS', size: '14px', weight: '600', lineHeight: '20px', usage: 'Card titles, labels' },
  { style: 'Body/M', size: '16px', weight: '400', lineHeight: '24px', usage: 'Body text, descriptions' },
  { style: 'Body/S', size: '14px', weight: '400', lineHeight: '20px', usage: 'Sublabels, secondary text' },
  { style: 'Body/XS', size: '12px', weight: '400', lineHeight: '20px', usage: 'Help text, disclaimers' },
  { style: 'Caption/M', size: '12px', weight: '500', lineHeight: '20px', usage: 'Footnotes, legal' },
  { style: 'Caption/S', size: '10px', weight: '500', lineHeight: '16px', usage: 'Date badges, tiny labels' },
]

export default function ScreenStructurePage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Screen Structure
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Every VSP screen follows this mandatory composition from the DLS _Section v1 template (Figma node 40018626:2082).
        </p>
      </section>

      {/* ASCII Diagram */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Structure Overview
        </h2>
        <pre
          className="overflow-x-auto rounded-14 p-[16px] text-[13px] leading-[22px]"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--foreground)',
            fontFamily: 'monospace',
          }}
        >{`┌─────────────────────────────────┐
│ StatusBar (54px)                │
│ NavBar (56px) — Title + Actions │  ← Header component
│ SearchBar (optional)            │
│ Tab (optional)                  │
├─────────────────────────────────┤
│ Section Title (pt-24 pb-12)     │
│   px-[22px], 16px semibold      │
│   + optional suffix Label       │  ← Section (repeatable)
│ Section Content (px-[22px])     │
│   [your content here]           │
├─────────────────────────────────┤
│ T&C checkbox (optional)         │
│ ButtonGroup (px-[22px])         │  ← FixedBottom component
│ Home Indicator (pb safe area)   │
└─────────────────────────────────┘`}</pre>
      </section>

      {/* Layer Breakdown */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Layer Breakdown
        </h2>
        {structureLayers.map((layer, idx) => (
          <div
            key={idx}
            className="flex items-start gap-[16px] rounded-14 p-[12px]"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            <div className="w-[160px] shrink-0">
              <p
                className="text-[14px] font-semibold leading-[20px]"
                style={{ color: 'var(--foreground)' }}
              >
                {layer.name}
              </p>
              <div className="mt-[2px] flex items-center gap-[6px]">
                <code
                  className="text-[12px]"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  {layer.height}
                </code>
                {layer.optional && (
                  <span
                    className="rounded-full px-[6px] py-[1px] text-[10px] font-medium"
                    style={{
                      backgroundColor: 'var(--border)',
                      color: 'var(--foreground-secondary)',
                    }}
                  >
                    optional
                  </span>
                )}
              </div>
            </div>
            <p
              className="text-[13px] leading-[20px]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {layer.description}
            </p>
          </div>
        ))}
      </section>

      {/* Spacing Tokens */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Spacing Tokens (8px base unit)
        </h2>
        <div className="flex flex-col gap-[2px] overflow-hidden rounded-14">
          {spacingTokens.map((t, idx) => (
            <div
              key={idx}
              className="flex items-start gap-[16px] p-[12px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <code
                className="w-[180px] shrink-0 text-[13px] font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                {t.token}
              </code>
              <span
                className="w-[60px] shrink-0 text-[13px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {t.value}
              </span>
              <p
                className="text-[13px] leading-[20px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {t.usage}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Typography Scale (Inter)
        </h2>
        <div className="flex flex-col gap-[2px] overflow-hidden rounded-14">
          {typographyScale.map((t, idx) => (
            <div
              key={idx}
              className="flex items-start gap-[12px] p-[12px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <span
                className="w-[90px] shrink-0 text-[13px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {t.style}
              </span>
              <code
                className="w-[50px] shrink-0 text-[12px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {t.size}
              </code>
              <span
                className="w-[40px] shrink-0 text-[12px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {t.weight}
              </span>
              <code
                className="w-[50px] shrink-0 text-[12px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {t.lineHeight}
              </code>
              <p
                className="text-[13px] leading-[20px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {t.usage}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Component Sizes */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Component Sizes
        </h2>
        <div className="flex flex-col gap-[2px] overflow-hidden rounded-14">
          {componentSizes.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center gap-[16px] p-[12px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <span
                className="w-[180px] shrink-0 text-[13px] font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                {c.component}
              </span>
              <code
                className="w-[90px] shrink-0 text-[12px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {c.height}
              </code>
              <code
                className="text-[12px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {c.radius}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Alignment Rules */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Alignment Rules
        </h2>
        <div className="flex flex-col gap-[6px]">
          {alignmentRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-[10px]">
              <span
                className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--foreground-secondary)' }}
              />
              <p
                className="text-[14px] leading-[22px]"
                style={{ color: 'var(--foreground)' }}
              >
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

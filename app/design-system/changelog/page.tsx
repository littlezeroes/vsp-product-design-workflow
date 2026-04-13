const releases = [
  {
    version: 'v1.0',
    date: '2026-04-13',
    title: 'Initial Release',
    changes: [
      { type: 'added', text: '82 components with full documentation and live examples' },
      { type: 'added', text: '316 design tokens (colors, spacing, radius, elevation)' },
      { type: 'added', text: '100% dark mode coverage via semantic tokens' },
      { type: 'added', text: 'Foundations: Colors, Typography, Spacing, Radius, Elevation' },
      { type: 'added', text: '8 UX Patterns: Forms, Search, Empty States, Loading, Errors, Navigation, Confirmation, Data Display' },
      { type: 'added', text: 'Content & Voice: Tone of Voice (5Cs), Writing Guidelines, Error Messages' },
      { type: 'added', text: 'Templates: Screen Structure, Page Types' },
      { type: 'added', text: 'Design Principles documentation' },
      { type: 'added', text: 'Figma DLS integration (KzwbNKTQUkX6xnRSJhx411)' },
    ],
  },
]

const typeColors: Record<string, { bg: string; text: string }> = {
  added: { bg: 'var(--epic)', text: '#fff' },
  changed: { bg: 'var(--warning, #f59e0b)', text: '#000' },
  fixed: { bg: 'var(--info, #3b82f6)', text: '#fff' },
  removed: { bg: 'var(--destructive)', text: '#fff' },
}

export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Changelog
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          All notable changes to the VSP Design System.
        </p>
      </section>

      {releases.map((release) => (
        <section key={release.version} className="flex flex-col gap-[16px]">
          <div className="flex items-baseline gap-[12px]">
            <h2
              className="text-[24px] font-semibold leading-[32px]"
              style={{ color: 'var(--foreground)' }}
            >
              {release.version}
            </h2>
            <span
              className="text-[13px] font-medium"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {release.date}
            </span>
          </div>
          {release.title && (
            <p
              className="text-[16px] font-medium leading-[24px]"
              style={{ color: 'var(--foreground)' }}
            >
              {release.title}
            </p>
          )}
          <div className="flex flex-col gap-[8px]">
            {release.changes.map((change, idx) => {
              const colors = typeColors[change.type] || typeColors.added
              return (
                <div key={idx} className="flex items-start gap-[8px]">
                  <span
                    className="mt-[2px] shrink-0 rounded-full px-[8px] py-[1px] text-[10px] font-semibold uppercase"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {change.type}
                  </span>
                  <span
                    className="text-[14px] leading-[22px]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {change.text}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

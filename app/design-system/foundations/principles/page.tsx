const principles = [
  {
    number: 1,
    title: 'Clean & Premium',
    summary: 'Eliminate visual noise. Let content define structure.',
    points: [
      'Remove dividers and borders. Use spacing and hierarchy to separate content — not lines.',
      'Replace borders with negative space and soft shadows to create depth without clutter.',
      'Borderless thinking: when you remove a frame, content becomes its own architecture.',
    ],
  },
  {
    number: 2,
    title: 'Alignment',
    summary: 'The grid is not a constraint — it is the foundation of trust.',
    points: [
      'Every element sits on the grid. No exceptions. Consistent alignment creates predictability.',
      'Predictability reduces cognitive load. Users scan faster when elements follow a rhythm.',
      'Structure over intuition. Let the grid decide placement, not feelings.',
    ],
  },
  {
    number: 3,
    title: 'Consistency',
    summary: 'Familiarity builds trust. Break rules only with strong justification.',
    points: [
      'A good interface feels familiar from the first touch. The design system exists to enforce this.',
      'Only break a pattern when you have a compelling reason. Otherwise, let consistency do the work.',
    ],
  },
  {
    number: 4,
    title: 'Hierarchy',
    summary: 'Guide the eye. Prioritize what matters.',
    points: [
      'Hierarchy is the art of prioritization — leading users into flow without conscious effort.',
      'Size & weight signal importance. Bold and large = "read this first".',
      'Contrast separates layers. Spacing groups related elements.',
    ],
  },
  {
    number: 5,
    title: 'Progressive Disclosure',
    summary: 'Show only what\'s needed, when it\'s needed.',
    points: [
      'Don\'t show everything at once. Surface the right information at the right moment.',
      'Sequence: break long forms into steps. One question at a time is always lighter.',
      'Orient: always show where the user is (progress bar, step indicator) so they never feel lost.',
    ],
  },
  {
    number: 6,
    title: 'Contrast',
    summary: 'Readability is non-negotiable.',
    points: [
      'Sufficient contrast between text and background at all times.',
      'Contrast applies to size, weight, and spacing — not just color.',
    ],
  },
  {
    number: 7,
    title: 'Proximity',
    summary: 'Related things stay close. Unrelated things stay apart.',
    points: [
      'Users assume elements near each other belong together. Spacing defines relationships.',
      'Intentional spacing creates natural user flows without requiring explanation.',
    ],
  },
]

const whyItMatters = [
  'Beauty earns trust. A polished interface creates confidence before logic kicks in.',
  'Invisible design (Apple principle): the best UI disappears. When hierarchy, contrast, and spacing are right, users act without thinking.',
  'Freedom through discipline. When every pixel has a reason, designers are freed from subjective debates. Governance protects the product from entropy.',
]

import { FigmaEmbed } from '@/components/ui/figma-embed'

export default function PrinciplesPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Design Principles
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Seven principles that govern every design decision in the VSP system.
        </p>
      </section>

      {/* Figma Source */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Figma Source
        </h2>
        <FigmaEmbed
          url="https://www.figma.com/design/KzwbNKTQUkX6xnRSJhx411/VSP-DLS?node-id=5190-1107"
          title="VSP Design Principles"
          height={600}
        />
      </section>

      {/* Why It Matters */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Why Principles Matter
        </h2>
        <div className="flex flex-col gap-[6px]">
          {whyItMatters.map((item, i) => (
            <div key={i} className="flex items-start gap-[10px]">
              <span
                className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--foreground-secondary)' }}
              />
              <p
                className="text-[14px] leading-[22px]"
                style={{ color: 'var(--foreground)' }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7 Principles */}
      <section className="flex flex-col gap-[24px]">
        {principles.map((p) => (
          <div key={p.number} className="flex flex-col gap-[8px]">
            <div
              className="h-[1px] w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="flex items-baseline gap-[8px]">
              <span
                className="text-[13px] font-medium tabular-nums"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {String(p.number).padStart(2, '0')}
              </span>
              <h3
                className="text-[18px] font-semibold leading-[28px]"
                style={{ color: 'var(--foreground)' }}
              >
                {p.title}
              </h3>
            </div>
            <p
              className="pl-[28px] text-[14px] font-medium leading-[20px]"
              style={{ color: 'var(--foreground)' }}
            >
              {p.summary}
            </p>
            <div className="flex flex-col gap-[4px] pl-[28px]">
              {p.points.map((point, i) => (
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

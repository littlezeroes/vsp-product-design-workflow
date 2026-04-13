import Link from 'next/link'
import { dsStats, navigation } from '@/lib/ds-data'

const stats = [
  { label: 'Components', value: dsStats.totalComponents },
  { label: 'Variants', value: dsStats.totalVariants },
  { label: 'Tokens', value: dsStats.totalVariables },
  { label: 'Dark Mode', value: dsStats.darkModeCoverage },
  { label: 'Documented', value: dsStats.descriptionRate },
]

const foundations = navigation.find((s) => s.title === 'Foundations')
const componentSections = navigation.filter(
  (s) => !['Getting Started', 'Foundations'].includes(s.title)
)

export default function DesignSystemOverview() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Hero */}
      <section className="flex flex-col gap-[16px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          VSP Design System
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          The design system powering V-Smart Pay. 82 components, 316 tokens, and
          full dark mode support — built for consistency, speed, and quality across
          every screen.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-[4px] rounded-12 p-[16px]"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            <span
              className="text-[24px] font-semibold leading-[32px]"
              style={{ color: 'var(--foreground)' }}
            >
              {stat.value}
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      {/* Foundations */}
      {foundations && (
        <section className="flex flex-col gap-[16px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Foundations
          </h2>
          <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
            {foundations.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-[4px] rounded-12 border p-[16px] transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <span
                  className="text-[14px] font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {item.label}
                </span>
                <span
                  className="text-[13px]"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  {getFoundationDesc(item.label)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Component Categories */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Components
        </h2>
        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
          {componentSections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-[8px] rounded-12 border p-[16px]"
              style={{ borderColor: 'var(--border)' }}
            >
              <span
                className="text-[14px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {section.title}
              </span>
              <div className="flex flex-wrap gap-[4px]">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-[10px] py-[4px] text-[12px] font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground-secondary)',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Design Principles Summary */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Design Principles
        </h2>
        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="flex flex-col gap-[4px]">
              <span
                className="text-[14px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {p.title}
              </span>
              <span
                className="text-[13px] leading-[20px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {p.desc}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/design-system/foundations/principles"
          className="text-[13px] font-medium underline underline-offset-4"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          View all principles
        </Link>
      </section>
    </div>
  )
}

const principles = [
  {
    title: 'Token-first',
    desc: 'Every color, spacing, and radius value comes from a token. No hardcoded values.',
  },
  {
    title: 'Compose, don\'t create',
    desc: 'Use library components as building blocks. Never rebuild what exists.',
  },
  {
    title: 'Consistent structure',
    desc: 'Every screen follows the same Header + Sections + FixedBottom template.',
  },
  {
    title: 'Dark mode by default',
    desc: '100% dark mode coverage through semantic tokens, not manual overrides.',
  },
]

function getFoundationDesc(label: string): string {
  const map: Record<string, string> = {
    Colors: 'Primitive palette, semantic tokens, and dark mode architecture',
    Typography: '19 text styles with size, weight, and line-height definitions',
    Spacing: '24 spacing tokens from 0px to 80px plus layout constants',
    Radius: '12 radius tokens from sharp corners to fully rounded',
    Elevation: '6 elevation levels including glass morphism effects',
  }
  return map[label] || ''
}

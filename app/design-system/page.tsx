'use client'

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

const sections = [
  {
    title: 'Components',
    desc: '82 components across 10 categories — actions, forms, navigation, feedback, and more.',
    href: '/design-system/components/button',
  },
  {
    title: 'UX Patterns',
    desc: 'Reusable patterns for forms, search, loading, errors, navigation, and confirmation flows.',
    href: '/design-system/patterns/forms',
  },
  {
    title: 'Content & Voice',
    desc: 'Tone of voice, writing guidelines, and error message standards for fintech.',
    href: '/design-system/content/tone-of-voice',
  },
  {
    title: 'Templates',
    desc: 'Screen structure and page type blueprints — the skeleton of every VSP screen.',
    href: '/design-system/templates/screen-structure',
  },
]

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
                className="group flex flex-col gap-[4px] rounded-14 p-[16px] transition-all duration-200 hover:-translate-y-[1px]"
                style={{
                  backgroundColor: 'var(--background)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
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

      {/* Explore Sections */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Explore
        </h2>
        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="flex flex-col gap-[4px] rounded-14 p-[16px] transition-all duration-200 hover:-translate-y-[1px]"
              style={{
                backgroundColor: 'var(--background)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <span
                className="text-[14px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {s.title}
              </span>
              <span
                className="text-[13px] leading-[20px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {s.desc}
              </span>
            </Link>
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
            <div
              key={p.title}
              className="flex flex-col gap-[6px] rounded-14 p-[16px]"
              style={{
                backgroundColor: 'var(--background)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <span
                className="text-[11px] font-medium tabular-nums"
                style={{ color: 'var(--foreground-secondary)', opacity: 0.5 }}
              >
                {p.num}
              </span>
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
    num: '01',
    title: 'Clean & Premium',
    desc: 'Remove borders; use space and shadow instead. Let content define structure.',
  },
  {
    num: '02',
    title: 'Alignment',
    desc: 'Grid decides position, not gut feeling. Consistent alignment creates trust.',
  },
  {
    num: '03',
    title: 'Consistency',
    desc: 'Same component, same token, same behavior — always. No one-off values.',
  },
  {
    num: '04',
    title: 'Hierarchy',
    desc: 'Size + weight + color = reading order. One primary action per screen.',
  },
  {
    num: '05',
    title: 'Progressive Disclosure',
    desc: 'Show what\'s needed now; hide the rest behind a tap.',
  },
  {
    num: '06',
    title: 'Contrast',
    desc: 'Every text-background pair must pass the eye test. Dark mode is not invert.',
  },
  {
    num: '07',
    title: 'Proximity',
    desc: 'Close = related; far = separate. Space is structure.',
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

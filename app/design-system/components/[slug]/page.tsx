import { notFound } from 'next/navigation'
import Link from 'next/link'
import { components } from '@/lib/ds-data'
import { FigmaEmbed } from '@/components/ui/figma-embed'

export function generateStaticParams() {
  return Object.keys(components).map((slug) => ({ slug }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const component = components[slug]

  if (!component) {
    notFound()
  }

  const figmaUrl = `https://www.figma.com/file/KzwbNKTQUkX6xnRSJhx411?node-id=${encodeURIComponent(component.figmaPage)}`

  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[12px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <span
            className="rounded-full px-[10px] py-[3px] text-[12px] font-medium"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--foreground-secondary)',
            }}
          >
            {component.category}
          </span>
          <span
            className="rounded-full px-[10px] py-[3px] text-[12px] font-medium"
            style={{
              backgroundColor: 'var(--secondary)',
              color: 'var(--foreground-secondary)',
            }}
          >
            {component.variants} variant{component.variants !== 1 ? 's' : ''}
          </span>
        </div>
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          {component.name}
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          {component.description}
        </p>
        <a
          href={figmaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-[6px] rounded-full px-[14px] py-[8px] text-[13px] font-medium transition-opacity"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
          }}
        >
          View in Figma
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.7 }}>
            <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      {/* When to Use / When Not to Use */}
      {(component.whenToUse || component.whenNotToUse) && (
        <section className="flex flex-col gap-[12px]">
          <h2 className="text-[20px] font-semibold leading-[24px]" style={{ color: 'var(--foreground)' }}>
            Usage
          </h2>
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            {component.whenToUse && (
              <div className="flex flex-col gap-[8px] rounded-12 p-[16px]" style={{ backgroundColor: 'var(--secondary)' }}>
                <span className="text-[14px] font-semibold" style={{ color: 'var(--foreground)' }}>When to use</span>
                <div className="flex flex-col gap-[4px]">
                  {component.whenToUse.map((item, i) => (
                    <div key={i} className="flex items-start gap-[8px]">
                      <span className="mt-[4px] text-[14px]" style={{ color: 'var(--foreground)' }}>✓</span>
                      <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {component.whenNotToUse && (
              <div className="flex flex-col gap-[8px] rounded-12 border p-[16px]" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[14px] font-semibold" style={{ color: 'var(--foreground)' }}>When NOT to use</span>
                <div className="flex flex-col gap-[4px]">
                  {component.whenNotToUse.map((item, i) => (
                    <div key={i} className="flex items-start gap-[8px]">
                      <span className="mt-[4px] text-[14px]" style={{ color: 'var(--foreground-secondary)' }}>✗</span>
                      <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Anatomy */}
      {component.anatomy && component.anatomy.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Anatomy
          </h2>
          <div
            className="flex flex-col gap-[4px] rounded-12 p-[16px]"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            {component.anatomy.map((part, i) => (
              <div key={i} className="flex items-start gap-[10px]">
                <span
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                  style={{
                    backgroundColor: 'var(--foreground)',
                    color: 'var(--background)',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-[14px] leading-[22px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {part}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Properties */}
      {component.properties.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Properties
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Type', 'Default', 'Options'].map((h) => (
                    <th
                      key={h}
                      className="pb-[8px] text-left font-medium"
                      style={{ color: 'var(--foreground-secondary)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {component.properties.map((prop) => (
                  <tr
                    key={prop.name}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="py-[8px]">
                      <code
                        className="text-[12px] font-medium"
                        style={{
                          fontFamily: 'monospace',
                          color: 'var(--foreground)',
                        }}
                      >
                        {prop.name}
                      </code>
                    </td>
                    <td className="py-[8px]">
                      <span
                        className="rounded-3 px-[6px] py-[2px] text-[11px] font-medium"
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--foreground-secondary)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {prop.type}
                      </span>
                    </td>
                    <td
                      className="py-[8px] text-[12px]"
                      style={{
                        fontFamily: 'monospace',
                        color: 'var(--foreground)',
                      }}
                    >
                      {prop.defaultValue !== undefined
                        ? String(prop.defaultValue)
                        : '—'}
                    </td>
                    <td className="py-[8px]">
                      {prop.options ? (
                        <div className="flex flex-wrap gap-[4px]">
                          {prop.options.map((opt) => (
                            <span
                              key={opt}
                              className="rounded-full px-[8px] py-[2px] text-[11px]"
                              style={{
                                backgroundColor: 'var(--secondary)',
                                color: 'var(--foreground-secondary)',
                              }}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--foreground-secondary)' }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Variants */}
      {component.variantList.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Variants
          </h2>
          <div className="flex flex-wrap gap-[8px]">
            {component.variantList.map((variant) => (
              <div
                key={variant}
                className="flex items-center rounded-8 border px-[14px] py-[10px]"
                style={{ borderColor: 'var(--border)' }}
              >
                <span
                  className="text-[13px] font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  {variant}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guidelines */}
      {component.guidelines && (
        <section className="flex flex-col gap-[12px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Guidelines
          </h2>
          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            {/* Do's */}
            <div
              className="flex flex-col gap-[8px] rounded-12 p-[16px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <span
                className="text-[14px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Do
              </span>
              <div className="flex flex-col gap-[6px]">
                {component.guidelines.do.map((item, i) => (
                  <div key={i} className="flex items-start gap-[8px]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="mt-[2px] shrink-0"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <path
                        d="M13.3 4.3L6 11.6L2.7 8.3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                    <span
                      className="text-[13px] leading-[20px]"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Don'ts */}
            <div
              className="flex flex-col gap-[8px] rounded-12 border p-[16px]"
              style={{ borderColor: 'var(--border)' }}
            >
              <span
                className="text-[14px] font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Don&apos;t
              </span>
              <div className="flex flex-col gap-[6px]">
                {component.guidelines.dont.map((item, i) => (
                  <div key={i} className="flex items-start gap-[8px]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="mt-[2px] shrink-0"
                      style={{ color: 'var(--foreground-secondary)' }}
                    >
                      <path
                        d="M4 4L12 12M12 4L4 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span
                      className="text-[13px] leading-[20px]"
                      style={{ color: 'var(--foreground-secondary)' }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* States */}
      {component.states && component.states.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h2 className="text-[20px] font-semibold leading-[24px]" style={{ color: 'var(--foreground)' }}>
            States
          </h2>
          <div className="flex flex-col gap-[4px]">
            {component.states.map((state, i) => (
              <div key={i} className="flex gap-[12px] rounded-8 p-[10px]" style={{ backgroundColor: i % 2 === 0 ? 'var(--secondary)' : 'transparent' }}>
                <code className="shrink-0 text-[12px] font-semibold w-[100px]" style={{ fontFamily: 'monospace', color: 'var(--foreground)' }}>
                  {state.name}
                </code>
                <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground-secondary)' }}>
                  {state.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Accessibility */}
      {component.accessibility && (
        <section className="flex flex-col gap-[12px]">
          <h2 className="text-[20px] font-semibold leading-[24px]" style={{ color: 'var(--foreground)' }}>
            Accessibility
          </h2>
          <div className="flex flex-col gap-[16px]">
            {component.accessibility.keyboard && (
              <div className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--foreground)' }}>Keyboard</span>
                {component.accessibility.keyboard.map((item, i) => (
                  <div key={i} className="flex items-start gap-[8px] pl-[4px]">
                    <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: 'var(--foreground-secondary)' }} />
                    <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {component.accessibility.aria && (
              <div className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--foreground)' }}>ARIA</span>
                {component.accessibility.aria.map((item, i) => (
                  <div key={i} className="flex items-start gap-[8px] pl-[4px]">
                    <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: 'var(--foreground-secondary)' }} />
                    <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {component.accessibility.screenReader && (
              <div className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--foreground)' }}>Screen Reader</span>
                {component.accessibility.screenReader.map((item, i) => (
                  <div key={i} className="flex items-start gap-[8px] pl-[4px]">
                    <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: 'var(--foreground-secondary)' }} />
                    <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
            {component.accessibility.focusManagement && (
              <div className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-semibold" style={{ color: 'var(--foreground)' }}>Focus Management</span>
                {component.accessibility.focusManagement.map((item, i) => (
                  <div key={i} className="flex items-start gap-[8px] pl-[4px]">
                    <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: 'var(--foreground-secondary)' }} />
                    <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Content Guidelines */}
      {component.contentGuidelines && component.contentGuidelines.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h2 className="text-[20px] font-semibold leading-[24px]" style={{ color: 'var(--foreground)' }}>
            Content Guidelines
          </h2>
          <div className="flex flex-col gap-[4px]">
            {component.contentGuidelines.map((item, i) => (
              <div key={i} className="flex items-start gap-[8px]">
                <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full" style={{ backgroundColor: 'var(--foreground-secondary)' }} />
                <span className="text-[13px] leading-[20px]" style={{ color: 'var(--foreground)' }}>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Components */}
      {component.relatedComponents && component.relatedComponents.length > 0 && (
        <section className="flex flex-col gap-[12px]">
          <h2
            className="text-[20px] font-semibold leading-[24px]"
            style={{ color: 'var(--foreground)' }}
          >
            Related Components
          </h2>
          <div className="flex flex-wrap gap-[8px]">
            {component.relatedComponents.map((name) => {
              const relatedSlug = Object.values(components).find(
                (c) => c.name === name
              )?.slug
              if (!relatedSlug) {
                return (
                  <span
                    key={name}
                    className="rounded-full px-[12px] py-[6px] text-[13px] font-medium"
                    style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--foreground-secondary)',
                    }}
                  >
                    {name}
                  </span>
                )
              }
              return (
                <Link
                  key={name}
                  href={`/design-system/components/${relatedSlug}`}
                  className="rounded-full px-[12px] py-[6px] text-[13px] font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--foreground)',
                  }}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Figma Source — only show embed when nodeId exists */}
      {component.figmaNodeId && (
        <section className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <h2
              className="text-[20px] font-semibold leading-[24px]"
              style={{ color: 'var(--foreground)' }}
            >
              Figma
            </h2>
            <a
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[6px] rounded-full px-[12px] py-[6px] text-[13px] font-medium"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--foreground)',
              }}
            >
              Open in Figma
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
                <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <FigmaEmbed
            url={`https://www.figma.com/design/KzwbNKTQUkX6xnRSJhx411/VSP-DLS?node-id=${component.figmaNodeId.replace(':', '-')}`}
            title={`${component.name} — Figma`}
            height={500}
          />
        </section>
      )}
    </div>
  )
}

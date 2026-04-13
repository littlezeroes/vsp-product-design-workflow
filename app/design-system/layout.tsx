'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/lib/ds-data'
import { ChevronDown, Menu, X, Moon, Sun } from 'lucide-react'

const headerTabs = [
  {
    id: 'components',
    label: 'Components',
    href: '/design-system',
    sections: ['Getting Started', 'Foundations', 'Actions', 'Forms', 'Selections', 'Navigation', 'Feedback', 'Modals', 'Indicators', 'Interface Elements', 'Support'],
  },
  {
    id: 'patterns',
    label: 'UX Patterns',
    href: '/design-system/patterns/forms',
    sections: ['Patterns'],
  },
  {
    id: 'content',
    label: 'Content & Voice',
    href: '/design-system/content/tone-of-voice',
    sections: ['Content & Language'],
  },
  {
    id: 'templates',
    label: 'Templates',
    href: '/design-system/templates/screen-structure',
    sections: ['Templates'],
  },
]

function getActiveTab(pathname: string): string {
  if (pathname.startsWith('/design-system/patterns')) return 'patterns'
  if (pathname.startsWith('/design-system/content')) return 'content'
  if (pathname.startsWith('/design-system/templates')) return 'templates'
  return 'components'
}

function SidebarContent({
  activeTab,
  onNavigate,
}: {
  activeTab: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const tab = headerTabs.find((t) => t.id === activeTab)
  const filteredNav = useMemo(
    () => navigation.filter((s) => tab?.sections.includes(s.title)),
    [tab]
  )

  const toggle = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <nav className="flex flex-col gap-[2px] py-[16px]">
      {filteredNav.map((section) => (
        <div key={section.title}>
          {filteredNav.length > 1 && (
            <button
              onClick={() => toggle(section.title)}
              className="flex w-full items-center justify-between px-[16px] py-[8px] text-[11px] font-medium uppercase tracking-widest"
              style={{ color: 'var(--foreground-secondary)', opacity: 0.6 }}
            >
              {section.title}
              <ChevronDown
                size={14}
                className="transition-transform duration-200"
                style={{
                  transform: collapsed[section.title] ? 'rotate(-90deg)' : 'rotate(0deg)',
                  color: 'var(--foreground-secondary)',
                }}
              />
            </button>
          )}
          {!collapsed[section.title] && (
            <div className="flex flex-col">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex items-center gap-[8px] px-[16px] py-[6px] text-[13px] transition-colors duration-150"
                    style={{
                      color: 'var(--foreground)',
                      fontWeight: isActive ? 600 : 450,
                      backgroundColor: isActive ? 'var(--secondary)' : 'transparent',
                      borderRadius: '6px',
                      marginLeft: '8px',
                      marginRight: '8px',
                    }}
                  >
                    {item.label}
                    {item.badge && (
                      <span
                        className="rounded-full px-[6px] py-[1px] text-[10px] font-medium"
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--foreground-secondary)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ds-theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  function toggleDark() {
    setDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('ds-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 flex h-[56px] items-center justify-between border-b px-[16px] md:px-[24px] relative"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--background)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: hamburger + title */}
        <div className="flex shrink-0 items-center gap-[4px]">
          <button
            className="md:hidden p-[8px] -ml-[8px]"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--foreground)' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/design-system" className="flex items-center gap-[8px]">
            <span className="text-[16px] font-semibold" style={{ color: 'var(--foreground)' }}>
              VSP Design System
            </span>
          </Link>
        </div>

        {/* Center: Tabs */}
        <div className="absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:flex items-center">
          {headerTabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative whitespace-nowrap px-[12px] py-[16px] text-[13px] font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--foreground)' : 'var(--foreground-secondary)',
                }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-[12px] right-[12px] h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--foreground)' }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right: version dropdown + actions */}
        <div className="flex shrink-0 items-center gap-[8px]">
          {/* Version dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setVersionOpen((v) => !v)}
              className="inline-flex items-center gap-[4px] rounded-full px-[10px] py-[4px] text-[11px] font-medium transition-colors"
              style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground-secondary)' }}
            >
              v1.0
              <ChevronDown
                size={12}
                className="transition-transform duration-200"
                style={{ transform: versionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {versionOpen && (
              <>
                <div className="fixed inset-0 z-50" onClick={() => setVersionOpen(false)} />
                <div
                  className="absolute right-0 top-[calc(100%+8px)] z-50 w-[220px] rounded-14 border p-[8px]"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  }}
                >
                  <div className="flex flex-col gap-[2px]">
                    <span
                      className="px-[8px] py-[4px] text-[10px] font-medium uppercase tracking-wider"
                      style={{ color: 'var(--foreground-secondary)', opacity: 0.6 }}
                    >
                      Versions
                    </span>
                    <div
                      className="flex items-center justify-between rounded-8 px-[8px] py-[6px]"
                      style={{ backgroundColor: 'var(--secondary)' }}
                    >
                      <span className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>
                        v1.0
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                        Current
                      </span>
                    </div>
                  </div>
                  <div
                    className="my-[6px] h-[1px]"
                    style={{ backgroundColor: 'var(--border)' }}
                  />
                  <Link
                    href="/design-system/changelog"
                    onClick={() => setVersionOpen(false)}
                    className="flex items-center rounded-8 px-[8px] py-[6px] text-[13px] font-medium transition-colors"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    View Changelog
                  </Link>
                </div>
              </>
            )}
          </div>
          <a
            href="https://www.figma.com/file/KzwbNKTQUkX6xnRSJhx411"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-[4px] rounded-full px-[12px] py-[6px] text-[13px] font-medium transition-colors"
            style={{
              color: 'var(--foreground-secondary)',
              backgroundColor: 'var(--secondary)',
            }}
          >
            Figma DLS
          </a>
          <button
            onClick={toggleDark}
            className="flex items-center justify-center rounded-full p-[8px] transition-colors"
            style={{ color: 'var(--foreground-secondary)' }}
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar — filtered by active tab */}
        <aside
          className="hidden md:block w-[240px] shrink-0 overflow-y-auto border-r"
          style={{
            borderColor: 'var(--border)',
            height: 'calc(100vh - 56px)',
            position: 'sticky',
            top: '56px',
          }}
        >
          <SidebarContent activeTab={activeTab} />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="fixed left-0 top-[56px] z-50 w-[280px] overflow-y-auto border-r md:hidden"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                height: 'calc(100vh - 96px)',
              }}
            >
              <SidebarContent activeTab={activeTab} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[800px] px-[24px] py-[32px] md:px-[48px] md:py-[48px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/lib/ds-data'
import { ChevronDown, Menu, X, Moon, Sun } from 'lucide-react'

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <nav className="flex flex-col gap-[2px] py-[16px]">
      {navigation.map((section) => (
        <div key={section.title}>
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
                      color: isActive ? 'var(--foreground)' : 'var(--foreground)',
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(false)

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
        className="sticky top-0 z-50 flex h-[56px] items-center justify-between border-b px-[16px] md:px-[24px]"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--background)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-[12px]">
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
            <span
              className="rounded-full px-[8px] py-[2px] text-[11px] font-medium"
              style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground-secondary)' }}
            >
              v1.0
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-[8px]">
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
        {/* Desktop sidebar */}
        <aside
          className="hidden md:block w-[240px] shrink-0 overflow-y-auto border-r"
          style={{
            borderColor: 'var(--border)',
            height: 'calc(100vh - 56px)',
            position: 'sticky',
            top: '56px',
          }}
        >
          <SidebarContent />
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
                height: 'calc(100vh - 56px)',
              }}
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
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

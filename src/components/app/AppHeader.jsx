import { useEffect, useState } from 'react'

import {
  ChartColumn,
  History,
  Info,
  LayoutDashboard,
  SlidersHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function AppHeader({ activePage, onPageChange }) {
  const [isNavScrolled, setIsNavScrolled] = useState(false)
  const averagesActive =
    activePage === 'weekly-averages' || activePage === 'monthly-averages'
  const dashboardActive = activePage === 'dashboard'
  const logoSrc = `${import.meta.env.BASE_URL}logo_transparent.svg`
  const navItems = [
    {
      label: 'Dashboard',
      page: 'dashboard',
      active: dashboardActive,
      Icon: LayoutDashboard,
    },
    {
      label: 'History',
      page: 'history',
      active: activePage === 'history',
      Icon: History,
    },
    {
      label: 'Averages',
      page: 'weekly-averages',
      active: averagesActive,
      Icon: ChartColumn,
    },
    {
      label: 'About',
      page: 'about',
      active: activePage === 'about',
      Icon: Info,
    },
    {
      label: 'Settings',
      page: 'settings',
      active: activePage === 'settings',
      Icon: SlidersHorizontal,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header className="border-b border-border/80 pb-5 sm:pb-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => onPageChange('dashboard')}
                aria-pressed={dashboardActive}
                aria-label="Go to dashboard"
                className={cn(
                  'inline-flex shrink-0 items-center justify-center rounded-[1.35rem] border p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:rounded-[1.5rem] sm:p-2.5',
                  dashboardActive
                    ? 'border-[#4F8A5B]/25 bg-[linear-gradient(180deg,rgba(79,138,91,0.14)_0%,rgba(79,138,91,0.05)_100%)] shadow-[0_12px_26px_rgba(79,138,91,0.14),inset_0_1px_0_rgba(255,255,255,0.75)]'
                    : 'border-transparent bg-transparent hover:border-border/60 hover:bg-background/70 hover:shadow-sm'
                )}
              >
                <img
                  src={logoSrc}
                  alt="Leanlog logo"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </button>
              <div className="min-w-0">
                <p className="text-base font-medium tracking-[-0.04em] text-foreground sm:text-lg">
                  Leanlog
                </p>
                <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                  Calm local-first weight-loss tracking.
                </p>
              </div>
            </div>
            <span className="hidden items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
              Sustainable by design
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span>Local-first</span>
            <span aria-hidden="true">•</span>
            <span>IndexedDB</span>
            <span aria-hidden="true">•</span>
            <span>Iteration 1</span>
          </div>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className={cn(
          'sticky top-2 z-20 mt-2 rounded-[1.5rem] py-1 transition-[background-color,box-shadow,transform] duration-200 sm:static sm:mt-6 sm:rounded-none sm:bg-transparent sm:py-0 sm:shadow-none sm:backdrop-blur-0',
          isNavScrolled
            ? 'bg-[linear-gradient(180deg,rgba(247,247,245,0.98)_0%,rgba(247,247,245,0.92)_100%)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur'
            : 'bg-[linear-gradient(180deg,rgba(247,247,245,0.94)_0%,rgba(247,247,245,0.8)_100%)] backdrop-blur'
        )}
      >
        <div className="grid w-full min-w-0 grid-cols-5 gap-0.5 rounded-[1.3rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,248,246,0.94)_100%)] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.75)] sm:flex sm:gap-1 sm:rounded-[1.5rem] sm:p-1.5 sm:items-center">
          {navItems.map(({ label, page, active, Icon }) => (
            <Button
              key={page}
              type="button"
              size="sm"
              variant={active ? 'default' : 'ghost'}
              onClick={() => onPageChange(page)}
              aria-pressed={active}
              className={cn(
                'h-auto min-h-12 w-full min-w-0 shrink rounded-[0.9rem] px-0.5 py-1.5 sm:flex-1 sm:min-h-10 sm:rounded-full sm:px-4 sm:py-0',
                active
                  ? 'shadow-[0_8px_18px_rgba(15,23,42,0.12)]'
                  : 'text-foreground/80 hover:text-foreground'
              )}
            >
              <span className="flex w-full min-w-0 flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-1.5">
                <Icon className="size-3.5 shrink-0 sm:size-3.5" />
                <span className="line-clamp-2 text-center text-[0.5rem] leading-tight break-words sm:line-clamp-none sm:text-[0.8rem] sm:leading-none sm:whitespace-nowrap">
                  {label}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </nav>
    </>
  )
}

export { AppHeader }
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

  return (
    <>
      <header className="border-b border-border/80 pb-4 sm:pb-5">
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
                  alt="LeanLog logo"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </button>
              <div className="min-w-0">
                <p className="text-base font-medium tracking-[-0.04em] text-foreground sm:text-lg">
                  LeanLog
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
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="sticky top-2 z-20 mt-1.5 py-1 sm:static sm:mt-5 sm:py-0"
      >
        <div className="grid w-full min-w-0 grid-cols-5 gap-0.5 rounded-[1.3rem] border border-border/80 bg-background/90 p-1 shadow-sm backdrop-blur sm:flex sm:gap-1 sm:rounded-[1.5rem] sm:p-1.5 sm:items-center">
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
                  ? ''
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
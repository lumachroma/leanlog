import { Button } from '@/components/ui/button'

function AppHeader({ activePage, onPageChange }) {
  return (
    <header className="flex flex-col gap-5 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Leanlog
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-balance sm:text-4xl">
          Calm daily tracking, stored locally first.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Track weight, a forgiving 7DMA trend, calories, steps, and exercise
          details. Missed entries do not break the trend.
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 sm:items-end">
        <div className="flex flex-wrap rounded-full border border-border/80 bg-background/90 p-1 shadow-sm">
          <Button
            type="button"
            size="sm"
            variant={activePage === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => onPageChange('dashboard')}
            aria-pressed={activePage === 'dashboard'}
          >
            Dashboard
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePage === 'weekly-averages' ? 'default' : 'ghost'}
            onClick={() => onPageChange('weekly-averages')}
            aria-pressed={activePage === 'weekly-averages'}
          >
            Weekly Avg
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePage === 'monthly-averages' ? 'default' : 'ghost'}
            onClick={() => onPageChange('monthly-averages')}
            aria-pressed={activePage === 'monthly-averages'}
          >
            Monthly Avg
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePage === 'history' ? 'default' : 'ghost'}
            onClick={() => onPageChange('history')}
            aria-pressed={activePage === 'history'}
          >
            History
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePage === 'settings' ? 'default' : 'ghost'}
            onClick={() => onPageChange('settings')}
            aria-pressed={activePage === 'settings'}
          >
            Settings
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
            Iteration 1
          </span>
          <Button variant="outline" size="sm">
            IndexedDB ready
          </Button>
        </div>
      </div>
    </header>
  )
}

export { AppHeader }
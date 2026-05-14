import { Button } from '@/components/ui/button'

function AppHeader({ activePage, onPageChange }) {
  return (
    <header className="flex flex-col gap-6 border-b border-border/80 pb-6 sm:gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Leanlog
          </p>
          <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Sustainable by design
          </span>
        </div>
        <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-[-0.06em] text-balance sm:text-4xl xl:text-5xl">
          A calm fat-loss system built for real life.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          Leanlog is a calm, local-first weight loss tracker built for fast daily
          logging and lightweight progress review. It is intended to be sustainable,
          scalable, psychologically lightweight, and strong enough for serious
          long-term fat-loss work.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground/90">
          Forgiving trends, simple inputs, and stable summaries keep the system useful
          even when life gets messy and some days go unlogged.
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
import { Button } from '@/components/ui/button'

function AppHeader({ activePage, onPageChange }) {
  const averagesActive =
    activePage === 'weekly-averages' || activePage === 'monthly-averages'

  return (
    <header className="border-b border-border/80 pb-5 sm:pb-8">
      <div className="max-w-2xl sm:max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Leanlog
          </p>
          <span className="hidden items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
            Sustainable by design
          </span>
        </div>
        <h1 className="mt-3 max-w-lg text-[1.95rem] font-medium leading-[1.02] tracking-[-0.06em] text-balance sm:mt-4 sm:max-w-2xl sm:text-4xl sm:leading-tight xl:text-5xl">
          <span className="sm:hidden">Weight-loss OS for real life.</span>
          <span className="hidden sm:inline">
            A personal weight-loss operating system built for real life.
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mt-4 sm:max-w-3xl sm:text-base sm:leading-7">
          Leanlog is a calm, local-first weight-loss tracker for fast daily logging,
          lightweight progress review, and sustainable long-term fat-loss work.
        </p>
        <p className="mt-3 hidden max-w-2xl text-sm leading-7 text-muted-foreground/90 sm:block">
          Forgiving trends, simple inputs, and stable summaries keep the system useful
          even when life gets messy and some days go unlogged.
        </p>

        <div className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:mt-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:hidden">
            <span>Local-first</span>
            <span aria-hidden="true">•</span>
            <span>IndexedDB</span>
            <span aria-hidden="true">•</span>
            <span>Iteration 1</span>
          </div>
          <div className="hidden flex-wrap items-center gap-2 sm:flex">
            <span className="rounded-full bg-muted/45 px-2.5 py-1">Local-first</span>
            <span className="rounded-full bg-muted/45 px-2.5 py-1">IndexedDB</span>
            <span className="rounded-full bg-muted/45 px-2.5 py-1">Iteration 1</span>
          </div>
        </div>
      </div>

      <nav aria-label="Primary" className="mt-5 sm:mt-6">
        <div className="grid grid-cols-2 gap-1.5 rounded-[1.5rem] border border-border/80 bg-background/95 p-1.5 shadow-sm sm:flex sm:w-full sm:items-center">
          <Button
            type="button"
            size="sm"
            variant={activePage === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => onPageChange('dashboard')}
            aria-pressed={activePage === 'dashboard'}
            className="h-9 rounded-[1rem] px-4 sm:flex-1 sm:rounded-full"
          >
            Dashboard
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePage === 'history' ? 'default' : 'ghost'}
            onClick={() => onPageChange('history')}
            aria-pressed={activePage === 'history'}
            className="h-9 rounded-[1rem] px-4 sm:flex-1 sm:rounded-full"
          >
            History
          </Button>
          <Button
            type="button"
            size="sm"
            variant={averagesActive ? 'default' : 'ghost'}
            onClick={() => onPageChange('weekly-averages')}
            aria-pressed={averagesActive}
            className="h-9 rounded-[1rem] px-4 sm:flex-1 sm:rounded-full"
          >
            Averages
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePage === 'settings' ? 'default' : 'ghost'}
            onClick={() => onPageChange('settings')}
            aria-pressed={activePage === 'settings'}
            className="h-9 rounded-[1rem] px-4 sm:flex-1 sm:rounded-full"
          >
            Settings
          </Button>
        </div>
      </nav>
    </header>
  )
}

export { AppHeader }
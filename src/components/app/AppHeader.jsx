import { Button } from '@/components/ui/button'

function AppHeader() {
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
          Track weight, calories, steps, and exercise. Configure your targets once,
          log one day at a time, and keep iteration 2 open for charts, sync, and mobile.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
          Iteration 1
        </span>
        <Button variant="outline" size="sm">
          IndexedDB ready
        </Button>
      </div>
    </header>
  )
}

export { AppHeader }
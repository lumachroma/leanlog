import { BarChart3, CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyStatePanel } from '@/components/app/EmptyStatePanel'
import { formatAverage, formatWeight } from '@/lib/display-formatters'

function AverageSummaryPage({
  eyebrow,
  title,
  description,
  summaries,
  emptyState,
  activePeriod,
  onPeriodChange,
}) {
  return (
    <main className="py-8 xl:py-10">
      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <div
              aria-label="Averages period"
              className="grid w-full grid-cols-2 items-center gap-1 rounded-[1rem] border border-border/80 bg-muted/30 p-1 sm:flex sm:w-auto sm:rounded-full"
            >
              <Button
                type="button"
                size="sm"
                variant={activePeriod === 'weekly-averages' ? 'default' : 'ghost'}
                onClick={() => onPeriodChange('weekly-averages')}
                aria-pressed={activePeriod === 'weekly-averages'}
                className="h-9 rounded-[0.85rem] px-4 sm:rounded-full"
              >
                Weekly
              </Button>
              <Button
                type="button"
                size="sm"
                variant={activePeriod === 'monthly-averages' ? 'default' : 'ghost'}
                onClick={() => onPeriodChange('monthly-averages')}
                aria-pressed={activePeriod === 'monthly-averages'}
                className="h-9 rounded-[0.85rem] px-4 sm:rounded-full"
              >
                Monthly
              </Button>
            </div>
            <BarChart3 className="hidden size-4 text-muted-foreground sm:block" />
          </div>
        </div>

        {summaries.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {summaries.map((summary) => (
              <article
                key={summary.periodKey}
                className="rounded-[1.75rem] border border-border/80 bg-muted/30 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.03em]">{summary.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {summary.daysLogged} days logged • {summary.exerciseDays} exercise days
                    </p>
                  </div>
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Avg Weight</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatWeight(summary.weightAverage)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Calories</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatAverage(summary.calorieAverage, 'kcal')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Steps</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatAverage(summary.stepAverage, '')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyStatePanel className="mt-6">{emptyState}</EmptyStatePanel>
        )}
      </section>
    </main>
  )
}

export { AverageSummaryPage }
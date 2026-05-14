import { BarChart3, CalendarDays } from 'lucide-react'

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const weightFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const formatAverage = (value, suffix) => {
  if (value === null) {
    return suffix ? `-- ${suffix}` : '--'
  }

  return suffix
    ? `${numberFormatter.format(Math.round(value))} ${suffix}`
    : numberFormatter.format(Math.round(value))
}

const formatWeight = (value) =>
  value === null ? '-- kg' : `${weightFormatter.format(value)} kg`

function AverageSummaryPage({ eyebrow, title, description, summaries, emptyState }) {
  return (
    <main className="py-8 xl:py-10">
      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          </div>
          <BarChart3 className="size-4 text-muted-foreground" />
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
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
            {emptyState}
          </div>
        )}
      </section>
    </main>
  )
}

export { AverageSummaryPage }
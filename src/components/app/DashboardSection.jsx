import { CalendarDays, Flame, Footprints, Scale, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-6 text-3xl font-medium tracking-[-0.04em] text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </article>
  )
}

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

const formatPercent = (value) =>
  value === null ? '-- %' : `${numberFormatter.format(value)}%`

const formatSignedWeight = (value) => {
  if (value === null) {
    return null
  }

  const absoluteValue = weightFormatter.format(Math.abs(value))
  const direction = value <= 0 ? 'down' : 'up'
  return `${absoluteValue} kg ${direction} from your baseline`
}

function DashboardSection({
  metrics,
  monthlyCards,
  calorieDelta,
  stepDelta,
  goalDistance,
  targetsConfigured,
  onOpenSettings,
}) {
  return (
    <section className="space-y-6">
      {!targetsConfigured ? (
        <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Setup
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                Add your targets to make the dashboard more useful.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Start weight, goal weight, calorie target, and step target help the
                summaries explain your daily trend instead of only showing raw numbers.
              </p>
            </div>
            <Button type="button" onClick={onOpenSettings}>
              Open settings
            </Button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Scale}
          label="Weight trend"
          value={formatWeight(metrics.latestWeight)}
          detail={
            formatSignedWeight(metrics.weightDelta) ??
            'Set your baseline weight and log a few days to reveal direction.'
          }
        />
        <MetricCard
          icon={Flame}
          label="Avg Calories"
          value={formatAverage(metrics.calorieAverage, 'kcal')}
          detail={
            calorieDelta === null
              ? 'Your average updates automatically from saved daily entries.'
              : `${Math.abs(calorieDelta)} kcal ${calorieDelta <= 0 ? 'under' : 'over'} target`
          }
        />
        <MetricCard
          icon={Footprints}
          label="Avg Steps"
          value={formatAverage(metrics.stepAverage, 'steps')}
          detail={
            stepDelta === null
              ? 'Once you save steps, this card becomes your movement baseline.'
              : `${numberFormatter.format(Math.abs(stepDelta))} steps ${stepDelta >= 0 ? 'above' : 'below'} target`
          }
        />
        <MetricCard
          icon={Target}
          label="Goal Progress %"
          value={formatPercent(metrics.goalProgressPercent)}
          detail={
            metrics.goalProgressPercent === null
              ? 'Add a start weight, goal weight, and current weight to track progress.'
              : goalDistance === 0
                ? 'Goal reached based on your latest logged weight.'
                : `${formatWeight(goalDistance)} remaining to your goal`
          }
        />
      </div>

      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Monthly cards
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
              One month at a glance.
            </h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {metrics.activeDays} logged days
            {goalDistance !== null
              ? ` • ${weightFormatter.format(goalDistance)} kg to goal`
              : ''}
          </div>
        </div>

        {monthlyCards.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {monthlyCards.map((card) => (
              <article
                key={card.monthKey}
                className="rounded-[1.75rem] border border-border/80 bg-muted/30 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.03em]">{card.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {card.daysLogged} days logged • {card.exerciseDays} exercise days
                    </p>
                  </div>
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatWeight(card.latestWeight)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Calories</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatAverage(card.calorieAverage, 'kcal')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Steps</p>
                    <p className="mt-1 font-medium text-foreground">
                      {formatAverage(card.stepAverage, '')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
            Save your first daily entry to generate monthly cards automatically.
          </div>
        )}
      </section>
    </section>
  )
}

export { DashboardSection }
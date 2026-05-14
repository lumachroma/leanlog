import { Activity, Flame, Footprints, Scale, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { WeightTrendChart } from './WeightTrendChart'

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

const formatWeight = (value) =>
  value === null ? '-- kg' : `${weightFormatter.format(value)} kg`

const formatAverage = (value, suffix) => {
  if (value === null) {
    return suffix ? `-- ${suffix}` : '--'
  }

  return suffix
    ? `${numberFormatter.format(Math.round(value))} ${suffix}`
    : numberFormatter.format(Math.round(value))
}

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
  chartSeries,
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
          icon={Activity}
          label="7DMA"
          value={formatWeight(metrics.latestWeight7dma)}
          detail={
            metrics.latestWeight7dma === null
              ? '7-day moving average appears after saved weight entries. Missed days are ignored, not punished.'
              : 'Smoothed weight trend across the trailing 7 days, ignoring blanks.'
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

      <WeightTrendChart points={chartSeries.weightTrend} />
    </section>
  )
}

export { DashboardSection }
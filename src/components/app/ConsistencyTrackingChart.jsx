import { SectionHeading } from '@/components/app/SectionHeading'
import {
  CONSISTENCY_DAY_WINDOW,
  getConsistencyMetricDetails,
} from '@/lib/consistency-metrics'
import { formatAverage, numberFormatter } from '@/lib/display-formatters'

import {
  formatConsistencyDateLabel,
  getConsistencyStateClassName,
  getConsistencyStateLabel,
  getConsistencySummaryText,
} from './ConsistencyTrackingChart.helpers'

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-[1rem] border border-border/70 bg-background/70 px-3 py-2.5 shadow-sm">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-medium tracking-[-0.03em] text-foreground">
        {value}
      </p>
    </div>
  )
}

function ConsistencyMetric({
  label,
  average,
  target,
  suffix,
  delta,
  prefersLower,
  points,
}) {
  const hasAverage = average !== null
  const { days, hasTarget, summary, windowStartDate, windowEndDate } =
    getConsistencyMetricDetails({
      field: suffix === 'kcal' ? 'calories' : 'steps',
      points,
      prefersLower,
      target,
    })
  const firstDateLabel = formatConsistencyDateLabel(windowStartDate)
  const lastDateLabel = formatConsistencyDateLabel(windowEndDate)
  const summaryText = getConsistencySummaryText({
    dayWindow: CONSISTENCY_DAY_WINDOW,
    hasTarget,
    label,
    summary,
  })

  return (
    <article className="rounded-[1.75rem] border border-border/80 bg-background/80 p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium tracking-[-0.02em] text-foreground">
            {label}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasAverage
              ? `${formatAverage(average, suffix)} average`
              : 'No logged average yet'}
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {hasTarget ? `Target ${formatAverage(target, suffix)}` : 'Target not set'}
        </span>
      </div>

      <div
        className="mt-4 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${CONSISTENCY_DAY_WINDOW}, minmax(0, 1fr))`,
        }}
      >
        {days.map((day) => (
          <div
            key={`${label}-${day.date}`}
            className={`aspect-square rounded-[4px] ${getConsistencyStateClassName(day.state)}`}
            aria-label={`${label} on ${formatConsistencyDateLabel(day.date)}: ${getConsistencyStateLabel(day.state)}${day.value !== null ? ` (${formatAverage(day.value, suffix)})` : ''}`}
            title={`${formatConsistencyDateLabel(day.date)} • ${getConsistencyStateLabel(day.state)}${day.value !== null ? ` • ${formatAverage(day.value, suffix)}` : ''}`}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>{firstDateLabel}</span>
        <span>Last 30 Days</span>
        <span>{lastDateLabel}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <SummaryMetric
          label="Hit rate"
          value={summary.hitRate === null ? '--' : `${summary.hitRate}%`}
        />
        <SummaryMetric
          label="Current"
          value={summary.currentStreak === null ? '--' : `${summary.currentStreak}d`}
        />
        <SummaryMetric
          label="Best"
          value={summary.bestStreak === null ? '--' : `${summary.bestStreak}d`}
        />
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4">
        {summaryText}
      </p>

      {delta !== null && hasTarget ? (
        <p className="mt-2 text-sm text-muted-foreground/90">
          {prefersLower
            ? `${Math.abs(delta)} ${suffix} ${delta <= 0 ? 'under' : 'over'} target on average.`
            : `${numberFormatter.format(Math.abs(delta))} ${suffix} ${delta >= 0 ? 'above' : 'below'} target on average.`}
        </p>
      ) : null}
    </article>
  )
}

function ConsistencyTrackingChart({
  calorieAverage,
  calorieTarget,
  calorieDelta,
  caloriePoints = [],
  stepAverage,
  stepTarget,
  stepDelta,
  stepPoints = [],
}) {
  const showLoggedLegend = calorieTarget === null || stepTarget === null

  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="border-b border-border/80 pb-4 sm:pb-5">
        <SectionHeading
          eyebrow="Section 3"
          title="Daily Consistency"
          description="Small daily habits become meaningful when viewed consistently over time."
        />

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500/90" />
            On target
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-400/95" />
            Near target
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-foreground/24" />
            Off target
          </span>
          {showLoggedLegend ? (
            <span className="inline-flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-sky-400/75" />
              Logged
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full border border-dashed border-border/80 bg-background/70" />
            Missing
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 lg:grid-cols-2">
        <ConsistencyMetric
          label="Calories"
          average={calorieAverage}
          target={calorieTarget}
          suffix="kcal"
          delta={calorieDelta}
          prefersLower={true}
          points={caloriePoints}
        />
        <ConsistencyMetric
          label="Steps"
          average={stepAverage}
          target={stepTarget}
          suffix="steps"
          delta={stepDelta}
          prefersLower={false}
          points={stepPoints}
        />
      </div>
    </section>
  )
}

export { ConsistencyTrackingChart }
import { SectionHeading } from '@/components/app/SectionHeading'
import { formatAverage, numberFormatter } from '@/lib/display-formatters'

function ConsistencyMetric({
  label,
  average,
  target,
  suffix,
  delta,
  prefersLower,
}) {
  const hasAverage = average !== null
  const hasTarget = target !== null && target > 0
  const scaleMax = Math.max(average ?? 0, target ?? 0, 1)
  const averageWidth = hasAverage ? `${(average / scaleMax) * 100}%` : '0%'
  const targetOffset = hasTarget ? `${(target / scaleMax) * 100}%` : null
  const isOnTrack =
    hasAverage && hasTarget
      ? prefersLower
        ? average <= target
        : average >= target
      : null

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

      <div className="relative mt-4 h-3 rounded-full bg-muted/70 sm:mt-5">
        <div
          className={`h-full rounded-full transition-all ${
            isOnTrack === null
              ? 'bg-muted-foreground/30'
              : isOnTrack
                ? 'bg-emerald-500/80'
                : 'bg-amber-500/85'
          }`}
          style={{ width: averageWidth }}
        />
        {targetOffset ? (
          <span
            className="absolute top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70"
            style={{ left: targetOffset }}
          />
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4">
        {delta === null || !hasTarget
          ? 'This comparison appears automatically once both an average and a target exist.'
          : prefersLower
            ? `${Math.abs(delta)} ${suffix} ${delta <= 0 ? 'under' : 'over'} target.`
            : `${numberFormatter.format(Math.abs(delta))} ${suffix} ${delta >= 0 ? 'above' : 'below'} target.`}
      </p>
    </article>
  )
}

function ConsistencyTrackingChart({
  calorieAverage,
  calorieTarget,
  calorieDelta,
  stepAverage,
  stepTarget,
  stepDelta,
}) {
  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="border-b border-border/80 pb-4 sm:pb-5">
        <SectionHeading
          eyebrow="Section 3"
          title="Daily Consistency"
          description="Small daily habits become meaningful when viewed consistently over time."
        />
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 lg:grid-cols-2">
        <ConsistencyMetric
          label="Calories"
          average={calorieAverage}
          target={calorieTarget}
          suffix="kcal"
          delta={calorieDelta}
          prefersLower={true}
        />
        <ConsistencyMetric
          label="Steps"
          average={stepAverage}
          target={stepTarget}
          suffix="steps"
          delta={stepDelta}
          prefersLower={false}
        />
      </div>
    </section>
  )
}

export { ConsistencyTrackingChart }
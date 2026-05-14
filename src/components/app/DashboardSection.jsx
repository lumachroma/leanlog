import { Activity, Flame, Footprints, Scale, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { WeightTrendChart } from './WeightTrendChart'

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

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

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

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
    <article className="rounded-[1.75rem] border border-border/80 bg-background/80 p-5 shadow-sm">
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

      <div className="relative mt-5 h-3 rounded-full bg-muted/70">
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

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {delta === null || !hasTarget
          ? 'This comparison appears automatically once both an average and a target exist.'
          : prefersLower
            ? `${Math.abs(delta)} ${suffix} ${delta <= 0 ? 'under' : 'over'} target.`
            : `${numberFormatter.format(Math.abs(delta))} ${suffix} ${delta >= 0 ? 'above' : 'below'} target.`}
      </p>
    </article>
  )
}

function GoalProgressBar({ startWeight, goalWeight, currentWeight, progressPercent }) {
  const hasGoalData =
    startWeight !== null && goalWeight !== null && currentWeight !== null && progressPercent !== null
  const markerPosition = hasGoalData ? `${Math.max(0, Math.min(100, progressPercent))}%` : '0%'

  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Section 4"
          title="Goal Progress Bar"
          description="A clear line from your starting point to your goal, with your current weight anchored visibly in the middle."
        />
        <div className="text-sm text-muted-foreground">
          {hasGoalData ? `${formatPercent(progressPercent)} complete` : 'Add start, goal, and current weight to visualize progress.'}
        </div>
      </div>

      {hasGoalData ? (
        <div className="mt-8">
          <div className="relative h-4 rounded-full bg-muted/70">
            <div
              className="h-full rounded-full bg-foreground/85"
              style={{ width: markerPosition }}
            />
            <span
              className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-foreground shadow-sm"
              style={{ left: markerPosition }}
            />
          </div>

          <div
            className="mt-3 inline-flex -translate-x-1/2 rounded-full border border-border/80 bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm"
            style={{ marginLeft: markerPosition }}
          >
            Current {formatWeight(currentWeight)}
          </div>

          <div className="mt-5 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em]">Start</p>
              <p className="mt-1 font-medium text-foreground">{formatWeight(startWeight)}</p>
            </div>
            <div className="sm:text-center">
              <p className="text-xs uppercase tracking-[0.18em]">Current</p>
              <p className="mt-1 font-medium text-foreground">{formatWeight(currentWeight)}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-[0.18em]">Goal</p>
              <p className="mt-1 font-medium text-foreground">{formatWeight(goalWeight)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
          Add your start weight, goal weight, and at least one current weigh-in to
          unlock the goal progress bar.
        </div>
      )}
    </section>
  )
}

function DashboardSection({
  metrics,
  chartSeries,
  settings,
  calorieDelta,
  stepDelta,
  goalDistance,
  targetsConfigured,
  onOpenSettings,
}) {
  const calorieTarget = toNumber(settings.dailyCalorieTarget)
  const stepTarget = toNumber(settings.dailyStepTarget)
  const startWeight = toNumber(settings.startWeight)
  const goalWeight = toNumber(settings.goalWeight)

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

      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
        <div className="border-b border-border/80 pb-5">
          <SectionHeading
            eyebrow="Section 1"
            title="KPI Cards"
            description="Five clear dashboard signals to keep the day-to-day system readable at a glance."
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
            label="7-Day Moving Average"
            value={formatWeight(metrics.latestWeight7dma)}
            detail={
              metrics.latestWeight7dma === null
                ? '7-day moving average appears after saved weight entries. Missed days are ignored, not punished.'
                : 'Smoothed weight trend across the trailing 7 days.'
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
      </section>

      <WeightTrendChart
        points={chartSeries.weightTrend}
        eyebrow="Section 2"
        title="Main Weight Trend Graph"
        description="The emotional centerpiece: one honest daily line and one calmer trend line, so the signal stays readable without hiding reality."
      />

      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
        <div className="border-b border-border/80 pb-5">
          <SectionHeading
            eyebrow="Section 3"
            title="Consistency Tracking"
            description="Mini comparisons between your recent averages and the targets you set, so consistency is visible without turning the dashboard into accounting software."
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ConsistencyMetric
            label="Calories"
            average={metrics.calorieAverage}
            target={calorieTarget}
            suffix="kcal"
            delta={calorieDelta}
            prefersLower={true}
          />
          <ConsistencyMetric
            label="Steps"
            average={metrics.stepAverage}
            target={stepTarget}
            suffix="steps"
            delta={stepDelta}
            prefersLower={false}
          />
        </div>
      </section>

      <GoalProgressBar
        startWeight={startWeight}
        goalWeight={goalWeight}
        currentWeight={metrics.latestWeight}
        progressPercent={metrics.goalProgressPercent}
      />
    </section>
  )
}

export { DashboardSection }
import { Activity, Flame, Footprints, Scale, Target } from 'lucide-react'

import { SectionHeading } from '@/components/app/SectionHeading'
import { Button } from '@/components/ui/button'
import {
  formatAverage,
  formatPercent,
  formatWeight,
  numberFormatter,
} from '@/lib/display-formatters'
import { getNumericSettings } from '@/lib/metrics'

import { ConsistencyTrackingChart } from './ConsistencyTrackingChart'
import { GoalProgressChart } from './GoalProgressChart'
import { WeightTrendChart } from './WeightTrendChart'

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-[2rem] border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground sm:mt-6">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </article>
  )
}

const formatSignedWeight = (value) => {
  if (value === null) {
    return null
  }

  const absoluteValue = formatWeight(Math.abs(value)).replace(' kg', '')
  const direction = value <= 0 ? 'down' : 'up'
  return `${absoluteValue} kg ${direction} from your baseline`
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
  const { startWeight, goalWeight, dailyCalorieTarget, dailyStepTarget } =
    getNumericSettings(settings)

  return (
    <section className="space-y-5 sm:space-y-6">
      {!targetsConfigured ? (
        <section className="rounded-[2rem] border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Setup
              </p>
              <h2 className="mt-1.5 text-xl font-medium tracking-[-0.04em] sm:mt-2 sm:text-2xl">
                Add your targets to make the dashboard more useful.
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-7">
                Start weight, goal weight, calorie target, and step target help the
                summaries explain your daily trend instead of only showing raw numbers.
              </p>
            </div>
            <Button type="button" size="sm" className="self-start sm:self-auto" onClick={onOpenSettings}>
              Open settings
            </Button>
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur sm:p-6">
        <div className="border-b border-border/80 pb-4 sm:pb-5">
          <SectionHeading
            eyebrow="Section 1"
            title="Today's Snapshot"
            description="A quick view of your current trend, consistency, and progress toward your goal."
          />
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 md:grid-cols-2 xl:grid-cols-5">
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
        title="Weight Trend"
        description="Daily fluctuations stay visible while the long-term direction remains clear."
      />

      <ConsistencyTrackingChart
        calorieAverage={metrics.calorieAverage}
        calorieTarget={dailyCalorieTarget}
        calorieDelta={calorieDelta}
        stepAverage={metrics.stepAverage}
        stepTarget={dailyStepTarget}
        stepDelta={stepDelta}
      />

      <GoalProgressChart
        startWeight={startWeight}
        goalWeight={goalWeight}
        currentWeight={metrics.latestWeight}
        progressPercent={metrics.goalProgressPercent}
      />
    </section>
  )
}

export { DashboardSection }
import { EmptyStatePanel } from '@/components/app/EmptyStatePanel'
import { SectionHeading } from '@/components/app/SectionHeading'
import { formatPercent, formatWeight } from '@/lib/display-formatters'

function GoalProgressChart({ startWeight, goalWeight, currentWeight, progressPercent }) {
  const hasGoalData =
    startWeight !== null &&
    goalWeight !== null &&
    currentWeight !== null &&
    progressPercent !== null
  const markerPosition = hasGoalData
    ? `${Math.max(0, Math.min(100, progressPercent))}%`
    : '0%'

  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Section 4"
          title="Progress Toward Your Goal"
          description="Your starting point, current trend, and target weight shown together in one clear view."
        />
        <div className="text-sm text-muted-foreground">
          {hasGoalData
            ? `${formatPercent(progressPercent)} complete`
            : 'Add start, goal, and current weight to visualize progress.'}
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
        <EmptyStatePanel className="mt-6">
          Add your start weight, goal weight, and at least one current weigh-in to
          unlock the goal progress bar.
        </EmptyStatePanel>
      )}
    </section>
  )
}

export { GoalProgressChart }
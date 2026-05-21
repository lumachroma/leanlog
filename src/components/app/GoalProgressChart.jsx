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
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-3 border-b border-border/80 pb-4 sm:gap-4 sm:pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Section 4"
          title="Progress Toward Your Goal"
          description="Your starting point, current trend, and target weight shown together in one clear view."
        />
        <div className="text-xs text-muted-foreground sm:text-sm">
          {hasGoalData
            ? `${formatPercent(progressPercent)} complete`
            : 'Add start, goal, and current weight to visualize progress.'}
        </div>
      </div>

      {hasGoalData ? (
        <div className="mt-6 sm:mt-8">
          <div className="relative h-3 rounded-full bg-muted/70 sm:h-4">
            <div
              className="h-full rounded-full bg-foreground/85"
              style={{ width: markerPosition }}
            />
            <span
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-background bg-foreground shadow-sm sm:h-6 sm:w-6 sm:border-4"
              style={{ left: markerPosition }}
            />
          </div>

          <div
            className="mt-2.5 inline-flex -translate-x-1/2 rounded-full border border-border/80 bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm sm:mt-3 sm:px-3 sm:py-1 sm:text-sm"
            style={{ marginLeft: markerPosition }}
          >
            Current {formatWeight(currentWeight)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[0.72rem] text-muted-foreground sm:mt-5 sm:gap-4 sm:text-sm">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]">Start</p>
              <p className="mt-1 font-medium text-foreground">{formatWeight(startWeight)}</p>
            </div>
            <div className="text-center">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]">Current</p>
              <p className="mt-1 font-medium text-foreground">{formatWeight(currentWeight)}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]">Goal</p>
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
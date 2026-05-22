import { AppSurface } from '@/components/app/AppSurface'
import { EmptyStatePanel } from '@/components/app/EmptyStatePanel'
import { SectionHeading } from '@/components/app/SectionHeading'
import { ViewportAnimationGroup } from '@/components/app/ViewportAnimationGroup'
import { formatPercent, formatWeight } from '@/lib/display-formatters'
import { getGoalProgressDetails } from '@/lib/goal-progress-metrics'

import {
  GOAL_PROGRESS_EMPTY_STATE_COPY,
  getGoalProgressStatusText,
} from './GoalProgressChart.helpers'

const GOAL_PROGRESS_FILL_DELAY_MS = 80
const GOAL_PROGRESS_MARKER_DELAY_MS = 360
const GOAL_PROGRESS_LABEL_DELAY_MS = 440

function GoalProgressChart({ startWeight, goalWeight, currentWeight, progressPercent }) {
  const { hasGoalData, markerPosition } = getGoalProgressDetails({
    startWeight,
    goalWeight,
    currentWeight,
    progressPercent,
  })
  const progressPercentText = formatPercent(progressPercent)

  return (
    <AppSurface className="p-5 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-border/80 pb-4 sm:gap-4 sm:pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Section 4"
          title="Progress Toward Your Goal"
          description="Your starting point, current trend, and target weight shown together in one clear view."
        />
        <div className="text-xs text-muted-foreground sm:text-sm">
          {getGoalProgressStatusText({ hasGoalData, progressPercentText })}
        </div>
      </div>

      {hasGoalData ? (
        <ViewportAnimationGroup disabled={!hasGoalData} className="mt-6 sm:mt-8">
          {(animationCycle) => (
            <>
              <div key={animationCycle}>
                <div className="relative h-3 rounded-full bg-muted/70 sm:h-4">
                  <div
                    className="chart-grow-x h-full rounded-full bg-foreground/85"
                    style={{
                      width: markerPosition,
                      '--chart-enter-delay': `${GOAL_PROGRESS_FILL_DELAY_MS}ms`,
                    }}
                  />
                  <span
                    className="chart-marker-pop absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-background bg-foreground shadow-sm sm:h-6 sm:w-6 sm:border-4"
                    style={{
                      left: markerPosition,
                      '--chart-enter-delay': `${GOAL_PROGRESS_MARKER_DELAY_MS}ms`,
                    }}
                  />
                </div>

                <div
                  className="chart-label-slide mt-2.5 inline-flex -translate-x-1/2 rounded-full border border-border/80 bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm sm:mt-3 sm:px-3 sm:py-1 sm:text-sm"
                  style={{
                    marginLeft: markerPosition,
                    '--chart-enter-delay': `${GOAL_PROGRESS_LABEL_DELAY_MS}ms`,
                  }}
                >
                  Current {formatWeight(currentWeight)}
                </div>
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
            </>
          )}
        </ViewportAnimationGroup>
      ) : (
        <EmptyStatePanel className="mt-6">
          {GOAL_PROGRESS_EMPTY_STATE_COPY}
        </EmptyStatePanel>
      )}
    </AppSurface>
  )
}

export { GoalProgressChart }
import { formatMonthDayLabel } from '@/lib/date-utils'

import { CONSISTENCY_DAY_WINDOW } from '@/lib/consistency-metrics'

const formatDayCount = (count) => `${count} ${count === 1 ? 'day' : 'days'}`

export const formatConsistencyDateLabel = formatMonthDayLabel

export const getConsistencyStateClassName = (state) => {
  switch (state) {
    case 'hit':
      return 'bg-emerald-500/90 ring-1 ring-emerald-500/20'
    case 'close':
      return 'bg-amber-400/95 ring-1 ring-amber-400/20'
    case 'off':
      return 'bg-foreground/24 ring-1 ring-foreground/8'
    case 'logged':
      return 'bg-sky-400/75 ring-1 ring-sky-400/20'
    default:
      return 'border border-dashed border-border/80 bg-background/70'
  }
}

export const getConsistencyStateLabel = (state) => {
  switch (state) {
    case 'hit':
      return 'On target'
    case 'close':
      return 'Near target'
    case 'off':
      return 'Off target'
    case 'logged':
      return 'Logged without target'
    default:
      return 'No entry'
  }
}

export const getConsistencySummaryText = ({
  label,
  summary,
  hasTarget,
  prefersLower,
  dayWindow = CONSISTENCY_DAY_WINDOW,
}) => {
  if (!summary.loggedDays) {
    return `Log a few days to reveal your consistency pattern across the last ${dayWindow} days.`
  }

  if (!hasTarget) {
    return `${summary.loggedDays} of the last ${dayWindow} days have logged ${label.toLowerCase()}. Add a target to unlock hit rates and streaks.`
  }

  if (prefersLower) {
    return `${summary.hitDays} of ${summary.loggedDays} logged days stayed at or below target${summary.closeDays ? `, with ${formatDayCount(summary.closeDays)} slightly over.` : '.'}`
  }

  return `${summary.hitDays} of ${summary.loggedDays} logged days met or exceeded target${summary.closeDays ? `, with ${formatDayCount(summary.closeDays)} just below.` : '.'}`
}
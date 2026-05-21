import { Activity, Flame, Footprints, Scale, Target } from 'lucide-react'

import {
  formatAverage,
  formatPercent,
  formatWeight,
  numberFormatter,
} from '@/lib/display-formatters'

export const DASHBOARD_SETUP_CALLOUT = {
  eyebrow: 'Setup',
  title: 'Add your targets to make the dashboard more useful.',
  description:
    'Start weight, goal weight, calorie target, and step target help the summaries explain your daily trend instead of only showing raw numbers.',
  actionLabel: 'Open settings',
}

const formatSignedWeight = (value) => {
  if (value === null) {
    return null
  }

  const absoluteValue = formatWeight(Math.abs(value)).replace(' kg', '')
  const direction = value <= 0 ? 'down' : 'up'
  return `${absoluteValue} kg ${direction} from your baseline`
}

export const getDashboardSnapshotCards = (snapshot) => [
  {
    icon: Scale,
    label: 'Weight trend',
    value: formatWeight(snapshot.latestWeight),
    detail:
      formatSignedWeight(snapshot.weightDelta) ??
      'Set your baseline weight and log a few days to reveal direction.',
  },
  {
    icon: Activity,
    label: '7-Day Moving Average',
    value: formatWeight(snapshot.latestWeight7dma),
    detail:
      snapshot.latestWeight7dma === null
        ? '7-day moving average appears after saved weight entries. Missed days are ignored, not punished.'
        : 'Smoothed weight trend across the trailing 7 days.',
  },
  {
    icon: Flame,
    label: 'Avg Calories',
    value: formatAverage(snapshot.calorieAverage, 'kcal'),
    detail:
      snapshot.calorieDelta === null
        ? 'Your average updates automatically from saved daily entries.'
        : `${Math.abs(snapshot.calorieDelta)} kcal ${snapshot.calorieDelta <= 0 ? 'under' : 'over'} target`,
  },
  {
    icon: Footprints,
    label: 'Avg Steps',
    value: formatAverage(snapshot.stepAverage, 'steps'),
    detail:
      snapshot.stepDelta === null
        ? 'Once you save steps, this card becomes your movement baseline.'
        : `${numberFormatter.format(Math.abs(snapshot.stepDelta))} steps ${snapshot.stepDelta >= 0 ? 'above' : 'below'} target`,
  },
  {
    icon: Target,
    label: 'Goal Progress %',
    value: formatPercent(snapshot.goalProgressPercent),
    detail:
      snapshot.goalProgressPercent === null
        ? 'Add a start weight, goal weight, and current weight to track progress.'
        : snapshot.goalDistance === 0
          ? 'Goal reached based on your latest logged weight.'
          : `${formatWeight(snapshot.goalDistance)} remaining to your goal`,
  },
]
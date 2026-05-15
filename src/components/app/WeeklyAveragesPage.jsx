import { AverageSummaryPage } from './AverageSummaryPage'

function WeeklyAveragesPage({ weeklyAverageCards, onPageChange }) {
  return (
    <AverageSummaryPage
      eyebrow="Weekly averages"
      title="Weekly calories, steps, and weight averages"
      description="Averages are grouped by week so missed days do not drag the trend down. Only saved values are counted."
      summaries={weeklyAverageCards}
      emptyState="Save a few daily entries to unlock weekly averages."
      activePeriod="weekly-averages"
      onPeriodChange={onPageChange}
    />
  )
}

export { WeeklyAveragesPage }
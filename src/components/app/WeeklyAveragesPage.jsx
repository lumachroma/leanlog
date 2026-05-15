import { AverageSummaryPage } from './AverageSummaryPage'

function WeeklyAveragesPage({ weeklyAverageCards, onPageChange }) {
  return (
    <AverageSummaryPage
      eyebrow="Weekly averages"
      title="Weekly Trends"
      description="A steady weekly view of your weight, calories, steps, and exercise consistency over time."
      summaries={weeklyAverageCards}
      emptyState="Save a few daily entries to unlock weekly averages."
      activePeriod="weekly-averages"
      onPeriodChange={onPageChange}
    />
  )
}

export { WeeklyAveragesPage }
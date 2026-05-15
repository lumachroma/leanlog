import { AverageSummaryPage } from './AverageSummaryPage'

function MonthlyAveragesPage({ monthlyAverageCards, onPageChange }) {
  return (
    <AverageSummaryPage
      eyebrow="Monthly averages"
      title="Monthly Trends"
      description="A broader view of your long-term progress, consistency, and overall direction month by month."
      summaries={monthlyAverageCards}
      emptyState="Save a few daily entries to unlock monthly averages."
      activePeriod="monthly-averages"
      onPeriodChange={onPageChange}
    />
  )
}

export { MonthlyAveragesPage }
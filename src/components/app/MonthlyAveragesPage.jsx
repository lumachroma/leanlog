import { AverageSummaryPage } from './AverageSummaryPage'

function MonthlyAveragesPage({ monthlyAverageCards }) {
  return (
    <AverageSummaryPage
      eyebrow="Monthly averages"
      title="Monthly calories, steps, and weight averages"
      description="Monthly rollups keep the long view visible without cluttering the dashboard. Only saved values are counted."
      summaries={monthlyAverageCards}
      emptyState="Save a few daily entries to unlock monthly averages."
    />
  )
}

export { MonthlyAveragesPage }
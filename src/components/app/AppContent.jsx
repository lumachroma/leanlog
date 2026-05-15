import { Suspense, lazy } from 'react'

import { MonthlyAveragesPage } from '@/components/app/MonthlyAveragesPage'
import { DailyHistoryPage } from '@/components/app/DailyHistoryPage'
import { SettingsPage } from '@/components/app/SettingsPage'
import { WeeklyAveragesPage } from '@/components/app/WeeklyAveragesPage'

const DashboardSection = lazy(() =>
  import('@/components/app/DashboardSection').then((module) => ({
    default: module.DashboardSection,
  }))
)

function DashboardLoadingState() {
  return (
    <div className="mt-6 rounded-[1.75rem] border border-border/80 bg-background/90 px-5 py-8 text-sm leading-7 text-muted-foreground shadow-sm backdrop-blur">
      Loading dashboard panels...
    </div>
  )
}

function AppContent({
  activePage,
  averagesView,
  dashboardView,
  historyView,
  onOpenSettings,
  settingsView,
}) {
  if (activePage === 'history') {
    return (
      <DailyHistoryPage
        entries={historyView.entries}
        selectedDate={historyView.selectedDate}
        entryDraft={historyView.entryDraft}
        isSavingEntry={historyView.isSavingEntry}
        setSelectedDate={historyView.setSelectedDate}
        updateEntryDraftField={historyView.updateEntryDraftField}
        saveEntry={historyView.saveEntry}
        deleteEntry={historyView.deleteEntry}
      />
    )
  }

  if (activePage === 'weekly-averages') {
    return <WeeklyAveragesPage weeklyAverageCards={averagesView.weeklyAverageCards} />
  }

  if (activePage === 'monthly-averages') {
    return <MonthlyAveragesPage monthlyAverageCards={averagesView.monthlyAverageCards} />
  }

  if (activePage === 'settings') {
    return (
      <SettingsPage
        settings={settingsView.settings}
        isSavingSettings={settingsView.isSavingSettings}
        updateSettingsField={settingsView.updateSettingsField}
        saveSettings={settingsView.saveSettings}
      />
    )
  }

  return (
    <main className="py-8 xl:py-10">
      <Suspense fallback={<DashboardLoadingState />}>
        <DashboardSection
          metrics={dashboardView.metrics}
          chartSeries={dashboardView.chartSeries}
          settings={dashboardView.settings}
          calorieDelta={dashboardView.calorieDelta}
          stepDelta={dashboardView.stepDelta}
          goalDistance={dashboardView.goalDistance}
          targetsConfigured={dashboardView.targetsConfigured}
          onOpenSettings={onOpenSettings}
        />
      </Suspense>
    </main>
  )
}

export { AppContent }
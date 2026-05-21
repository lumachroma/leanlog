import { Suspense, lazy } from 'react'

import { AboutPage } from '@/components/app/AboutPage'
import { AppSectionLoadingState } from '@/components/app/AppSectionLoadingState'
import { MonthlyAveragesPage } from '@/components/app/MonthlyAveragesPage'
import { DailyHistoryPage } from '@/components/app/DailyHistoryPage'
import { SettingsPage } from '@/components/app/SettingsPage'
import { WeeklyAveragesPage } from '@/components/app/WeeklyAveragesPage'

const DashboardSection = lazy(() =>
  import('@/components/app/DashboardSection').then((module) => ({
    default: module.DashboardSection,
  }))
)

function AppContent({
  activePage,
  averagesView,
  dashboardView,
  historyView,
  onOpenSettings,
  onPageChange,
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
    return (
      <WeeklyAveragesPage
        weeklyAverageCards={averagesView.weeklyAverageCards}
        onPageChange={onPageChange}
      />
    )
  }

  if (activePage === 'monthly-averages') {
    return (
      <MonthlyAveragesPage
        monthlyAverageCards={averagesView.monthlyAverageCards}
        onPageChange={onPageChange}
      />
    )
  }

  if (activePage === 'settings') {
    return (
      <SettingsPage
        entries={historyView.entries}
        isImportingEntries={historyView.isSavingEntry}
        importEntriesFromCsv={historyView.importEntriesFromCsv}
        settings={settingsView.settings}
        isSavingSettings={settingsView.isSavingSettings}
        updateSettingsField={settingsView.updateSettingsField}
        saveSettings={settingsView.saveSettings}
      />
    )
  }

  if (activePage === 'about') {
    return <AboutPage onPageChange={onPageChange} />
  }

  return (
    <main className="py-8 xl:py-10">
      <Suspense fallback={<AppSectionLoadingState message="Loading dashboard panels..." />}>
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
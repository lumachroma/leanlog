import { Suspense, lazy } from 'react'

import { AppSectionLoadingState } from '@/components/app/AppSectionLoadingState'

const DashboardSection = lazy(() =>
  import('@/components/app/DashboardSection').then((module) => ({
    default: module.DashboardSection,
  }))
)

const DailyHistoryPage = lazy(() =>
  import('@/components/app/DailyHistoryPage').then((module) => ({
    default: module.DailyHistoryPage,
  }))
)

const WeeklyAveragesPage = lazy(() =>
  import('@/components/app/WeeklyAveragesPage').then((module) => ({
    default: module.WeeklyAveragesPage,
  }))
)

const MonthlyAveragesPage = lazy(() =>
  import('@/components/app/MonthlyAveragesPage').then((module) => ({
    default: module.MonthlyAveragesPage,
  }))
)

const SettingsPage = lazy(() =>
  import('@/components/app/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  }))
)

const AboutPage = lazy(() =>
  import('@/components/app/AboutPage').then((module) => ({
    default: module.AboutPage,
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
  const renderActivePage = () => {
    if (activePage === 'history') {
      return {
        content: (
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
        ),
        loadingMessage: 'Loading history...',
      }
    }

    if (activePage === 'weekly-averages') {
      return {
        content: (
          <WeeklyAveragesPage
            weeklyAverageCards={averagesView.weeklyAverageCards}
            onPageChange={onPageChange}
          />
        ),
        loadingMessage: 'Loading weekly averages...',
      }
    }

    if (activePage === 'monthly-averages') {
      return {
        content: (
          <MonthlyAveragesPage
            monthlyAverageCards={averagesView.monthlyAverageCards}
            onPageChange={onPageChange}
          />
        ),
        loadingMessage: 'Loading monthly averages...',
      }
    }

    if (activePage === 'settings') {
      return {
        content: (
          <SettingsPage
            entries={historyView.entries}
            isImportingEntries={historyView.isSavingEntry}
            importEntriesFromCsv={historyView.importEntriesFromCsv}
            settings={settingsView.settings}
            isSavingSettings={settingsView.isSavingSettings}
            updateSettingsField={settingsView.updateSettingsField}
            saveSettings={settingsView.saveSettings}
          />
        ),
        loadingMessage: 'Loading settings...',
      }
    }

    if (activePage === 'about') {
      return {
        content: <AboutPage onPageChange={onPageChange} />,
        loadingMessage: 'Loading about page...',
      }
    }

    return {
      content: (
        <main className="pb-8 pt-4 sm:pt-6 xl:py-10">
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
        </main>
      ),
      loadingMessage: 'Loading dashboard panels...',
    }
  }

  const { content, loadingMessage } = renderActivePage()

  return (
    <Suspense fallback={<AppSectionLoadingState message={loadingMessage} />}>
      {content}
    </Suspense>
  )
}

export { AppContent }
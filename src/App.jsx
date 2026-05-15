import { Suspense, lazy } from 'react'

import { AppLoadingState } from '@/components/app/AppLoadingState'
import { MonthlyAveragesPage } from '@/components/app/MonthlyAveragesPage'
import { AppHeader } from '@/components/app/AppHeader'
import { DailyHistoryPage } from '@/components/app/DailyHistoryPage'
import { AppShell } from '@/components/app/AppShell'
import { SettingsPage } from '@/components/app/SettingsPage'
import { WeeklyAveragesPage } from '@/components/app/WeeklyAveragesPage'
import { useAppShellState } from '@/hooks/useAppShellState'
import { useAppViewModel } from '@/hooks/useAppViewModel'

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

function App() {
  const { activePage, openSettings, setActivePage } = useAppShellState()

  const {
    lifecycle,
    settingsView,
    historyView,
    averagesView,
    dashboardView,
  } = useAppViewModel()

  const renderActivePage = () => {
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
            onOpenSettings={openSettings}
          />
        </Suspense>
      </main>
    )
  }

  if (!lifecycle.isHydrated) {
    return <AppLoadingState />
  }

  return (
    <AppShell>
      <AppHeader activePage={activePage} onPageChange={setActivePage} />

      {lifecycle.errorMessage ? (
        <div className="mt-6 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {lifecycle.errorMessage}
        </div>
      ) : null}

      {renderActivePage()}
    </AppShell>
  )
}

export default App

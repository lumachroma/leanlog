import { Suspense, lazy, useEffect, useState } from 'react'

import { AppLoadingState } from '@/components/app/AppLoadingState'
import { MonthlyAveragesPage } from '@/components/app/MonthlyAveragesPage'
import { AppHeader } from '@/components/app/AppHeader'
import { DailyHistoryPage } from '@/components/app/DailyHistoryPage'
import { AppShell } from '@/components/app/AppShell'
import { SettingsPage } from '@/components/app/SettingsPage'
import { WeeklyAveragesPage } from '@/components/app/WeeklyAveragesPage'
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

const PAGE_STORAGE_KEY = 'leanlog.active-page'
const VALID_PAGES = new Set([
  'dashboard',
  'weekly-averages',
  'monthly-averages',
  'history',
  'settings',
])

const readPersistedPage = () => {
  if (typeof window === 'undefined') {
    return 'dashboard'
  }

  const persistedPage = window.localStorage.getItem(PAGE_STORAGE_KEY)

  return VALID_PAGES.has(persistedPage) ? persistedPage : 'dashboard'
}

function App() {
  const [activePage, setActivePage] = useState(readPersistedPage)

  const {
    lifecycle,
    settingsView,
    historyView,
    averagesView,
    dashboardView,
  } = useAppViewModel()

  useEffect(() => {
    window.localStorage.setItem(PAGE_STORAGE_KEY, activePage)
  }, [activePage])

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

      {activePage === 'history' ? (
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
      ) : activePage === 'weekly-averages' ? (
        <WeeklyAveragesPage weeklyAverageCards={averagesView.weeklyAverageCards} />
      ) : activePage === 'monthly-averages' ? (
        <MonthlyAveragesPage monthlyAverageCards={averagesView.monthlyAverageCards} />
      ) : activePage === 'settings' ? (
        <SettingsPage
          settings={settingsView.settings}
          isSavingSettings={settingsView.isSavingSettings}
          updateSettingsField={settingsView.updateSettingsField}
          saveSettings={settingsView.saveSettings}
        />
      ) : (
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
              onOpenSettings={() => setActivePage('settings')}
            />
          </Suspense>
        </main>
      )}
    </AppShell>
  )
}

export default App

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

const hasValue = (value) => String(value ?? '').trim().length > 0

function App() {
  const [activePage, setActivePage] = useState(readPersistedPage)

  const {
    settings,
    entries,
    selectedDate,
    entryDraft,
    isHydrated,
    isSavingSettings,
    isSavingEntry,
    errorMessage,
    metrics,
    weeklyAverageCards,
    monthlyAverageCards,
    chartSeries,
    calorieDelta,
    stepDelta,
    goalDistance,
    updateSettingsField,
    saveSettings,
    setSelectedDate,
    updateEntryDraftField,
    saveEntry,
    deleteEntry,
  } = useAppViewModel()

  useEffect(() => {
    window.localStorage.setItem(PAGE_STORAGE_KEY, activePage)
  }, [activePage])

  const targetsConfigured = [
    settings.startWeight,
    settings.goalWeight,
    settings.dailyCalorieTarget,
    settings.dailyStepTarget,
  ].every(hasValue)

  if (!isHydrated) {
    return <AppLoadingState />
  }

  return (
    <AppShell>
      <AppHeader activePage={activePage} onPageChange={setActivePage} />

      {errorMessage ? (
        <div className="mt-6 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {activePage === 'history' ? (
        <DailyHistoryPage
          entries={entries}
          selectedDate={selectedDate}
          entryDraft={entryDraft}
          isSavingEntry={isSavingEntry}
          setSelectedDate={setSelectedDate}
          updateEntryDraftField={updateEntryDraftField}
          saveEntry={saveEntry}
          deleteEntry={deleteEntry}
        />
      ) : activePage === 'weekly-averages' ? (
        <WeeklyAveragesPage weeklyAverageCards={weeklyAverageCards} />
      ) : activePage === 'monthly-averages' ? (
        <MonthlyAveragesPage monthlyAverageCards={monthlyAverageCards} />
      ) : activePage === 'settings' ? (
        <SettingsPage
          settings={settings}
          isSavingSettings={isSavingSettings}
          updateSettingsField={updateSettingsField}
          saveSettings={saveSettings}
        />
      ) : (
        <main className="py-8 xl:py-10">
          <Suspense fallback={<DashboardLoadingState />}>
            <DashboardSection
              metrics={metrics}
              chartSeries={chartSeries}
              settings={settings}
              calorieDelta={calorieDelta}
              stepDelta={stepDelta}
              goalDistance={goalDistance}
              targetsConfigured={targetsConfigured}
              onOpenSettings={() => setActivePage('settings')}
            />
          </Suspense>
        </main>
      )}
    </AppShell>
  )
}

export default App

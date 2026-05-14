import { useState } from 'react'

import { AppLoadingState } from '@/components/app/AppLoadingState'
import { AppHeader } from '@/components/app/AppHeader'
import { DailyHistoryPage } from '@/components/app/DailyHistoryPage'
import { AppShell } from '@/components/app/AppShell'
import { DashboardSection } from '@/components/app/DashboardSection'
import { SettingsPage } from '@/components/app/SettingsPage'
import { useAppViewModel } from '@/hooks/useAppViewModel'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

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
    monthlyCards,
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
      ) : activePage === 'settings' ? (
        <SettingsPage
          settings={settings}
          isSavingSettings={isSavingSettings}
          updateSettingsField={updateSettingsField}
          saveSettings={saveSettings}
        />
      ) : (
        <main className="py-8 xl:py-10">
          <DashboardSection
            metrics={metrics}
            monthlyCards={monthlyCards}
            calorieDelta={calorieDelta}
            stepDelta={stepDelta}
            goalDistance={goalDistance}
          />
        </main>
      )}
    </AppShell>
  )
}

export default App

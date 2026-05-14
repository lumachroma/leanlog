import { AppLoadingState } from '@/components/app/AppLoadingState'
import { AppHeader } from '@/components/app/AppHeader'
import { AppShell } from '@/components/app/AppShell'
import { DailyLogPanel } from '@/components/app/DailyLogPanel'
import { DashboardSection } from '@/components/app/DashboardSection'
import { SettingsPanel } from '@/components/app/SettingsPanel'
import { useAppViewModel } from '@/hooks/useAppViewModel'

function App() {
  const {
    settings,
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
  } = useAppViewModel()

  if (!isHydrated) {
    return <AppLoadingState />
  }

  return (
    <AppShell>
      <AppHeader />

      <main className="grid flex-1 gap-6 py-8 xl:grid-cols-[1.25fr_0.75fr] xl:py-10">
        <section className="space-y-6">
          {errorMessage ? (
            <div className="rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <DashboardSection
            metrics={metrics}
            monthlyCards={monthlyCards}
            calorieDelta={calorieDelta}
            stepDelta={stepDelta}
            goalDistance={goalDistance}
          />
        </section>

        <aside className="space-y-6">
          <SettingsPanel
            settings={settings}
            isSavingSettings={isSavingSettings}
            updateSettingsField={updateSettingsField}
            saveSettings={saveSettings}
          />

          <DailyLogPanel
            selectedDate={selectedDate}
            entryDraft={entryDraft}
            isSavingEntry={isSavingEntry}
            activeDays={metrics.activeDays}
            exerciseDays={metrics.exerciseDays}
            setSelectedDate={setSelectedDate}
            updateEntryDraftField={updateEntryDraftField}
            saveEntry={saveEntry}
          />
        </aside>
      </main>
    </AppShell>
  )
}

export default App

import { AppLoadingState } from '@/components/app/AppLoadingState'
import { AppShell } from '@/components/app/AppShell'
import { Button } from '@/components/ui/button'
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
        <header className="flex flex-col gap-5 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Leanlog
            </p>
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-balance sm:text-4xl">
              Calm daily tracking, stored locally first.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Track weight, calories, steps, and exercise. Configure your targets once,
              log one day at a time, and keep iteration 2 open for charts, sync, and mobile.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
              Iteration 1
            </span>
            <Button variant="outline" size="sm">
              IndexedDB ready
            </Button>
          </div>
        </header>

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

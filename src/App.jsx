import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { DailyLogPanel } from '@/components/app/DailyLogPanel'
import { DashboardSection } from '@/components/app/DashboardSection'
import { SettingsPanel } from '@/components/app/SettingsPanel'
import { getDashboardMetrics, getMonthlyCards, toNumber } from '@/lib/metrics'
import { useAppStore } from '@/store/useAppStore'

function App() {
  const hydrateApp = useAppStore((state) => state.hydrateApp)
  const settings = useAppStore((state) => state.settings)
  const entries = useAppStore((state) => state.entries)
  const selectedDate = useAppStore((state) => state.selectedDate)
  const entryDraft = useAppStore((state) => state.entryDraft)
  const isHydrated = useAppStore((state) => state.isHydrated)
  const isSavingSettings = useAppStore((state) => state.isSavingSettings)
  const isSavingEntry = useAppStore((state) => state.isSavingEntry)
  const errorMessage = useAppStore((state) => state.errorMessage)
  const updateSettingsField = useAppStore((state) => state.updateSettingsField)
  const saveSettings = useAppStore((state) => state.saveSettings)
  const setSelectedDate = useAppStore((state) => state.setSelectedDate)
  const updateEntryDraftField = useAppStore((state) => state.updateEntryDraftField)
  const saveEntry = useAppStore((state) => state.saveEntry)

  useEffect(() => {
    void hydrateApp()
  }, [hydrateApp])

  const metrics = getDashboardMetrics(entries, settings)
  const monthlyCards = getMonthlyCards(entries)
  const goalWeight = toNumber(settings.goalWeight)
  const dailyCalorieTarget = toNumber(settings.dailyCalorieTarget)
  const dailyStepTarget = toNumber(settings.dailyStepTarget)
  const calorieDelta =
    metrics.calorieAverage !== null && dailyCalorieTarget !== null
      ? Math.round(metrics.calorieAverage - dailyCalorieTarget)
      : null
  const stepDelta =
    metrics.stepAverage !== null && dailyStepTarget !== null
      ? Math.round(metrics.stepAverage - dailyStepTarget)
      : null
  const goalDistance =
    metrics.latestWeight !== null && goalWeight !== null
      ? Math.abs(metrics.latestWeight - goalWeight)
      : null

  if (!isHydrated) {
    return (
      <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_100%)] px-6 py-8 text-foreground sm:px-10 lg:px-12">
        <div className="mx-auto flex min-h-[80svh] max-w-6xl items-center justify-center rounded-[2rem] border border-border/80 bg-background/80 px-6 py-10 text-sm text-muted-foreground shadow-sm backdrop-blur">
          Loading your local dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_100%)] text-foreground">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
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
      </div>
    </div>
  )
}

export default App

import { useEffect } from 'react'
import {
  CalendarDays,
  Flame,
  Footprints,
  Scale,
  Settings2,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getDashboardMetrics, getMonthlyCards, toNumber } from '@/lib/metrics'
import { useAppStore } from '@/store/useAppStore'

const inputClassName =
  'mt-2 w-full rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-6 text-3xl font-medium tracking-[-0.04em] text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </article>
  )
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const weightFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const formatAverage = (value, suffix) =>
  value === null ? `-- ${suffix}` : `${numberFormatter.format(Math.round(value))} ${suffix}`

const formatWeight = (value) =>
  value === null ? '-- kg' : `${weightFormatter.format(value)} kg`

const formatSignedWeight = (value) => {
  if (value === null) {
    return null
  }

  const absoluteValue = weightFormatter.format(Math.abs(value))
  const direction = value <= 0 ? 'down' : 'up'
  return `${absoluteValue} kg ${direction} from your baseline`
}

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

  const handleSettingsSubmit = (event) => {
    event.preventDefault()
    void saveSettings()
  }

  const handleEntrySubmit = (event) => {
    event.preventDefault()
    void saveEntry()
  }

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

            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                icon={Scale}
                label="Weight trend"
                value={formatWeight(metrics.latestWeight)}
                detail={
                  formatSignedWeight(metrics.weightDelta) ??
                  'Set your baseline weight and log a few days to reveal direction.'
                }
              />
              <MetricCard
                icon={Flame}
                label="Calorie average"
                value={formatAverage(metrics.calorieAverage, 'kcal')}
                detail={
                  calorieDelta === null
                    ? 'Your average updates automatically from saved daily entries.'
                    : `${Math.abs(calorieDelta)} kcal ${calorieDelta <= 0 ? 'under' : 'over'} target`
                }
              />
              <MetricCard
                icon={Footprints}
                label="Step average"
                value={formatAverage(metrics.stepAverage, 'steps')}
                detail={
                  stepDelta === null
                    ? 'Once you save steps, this card becomes your movement baseline.'
                    : `${numberFormatter.format(Math.abs(stepDelta))} steps ${stepDelta >= 0 ? 'above' : 'below'} target`
                }
              />
            </div>

            <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Monthly cards
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                    One month at a glance.
                  </h2>
                </div>
                <div className="text-sm text-muted-foreground">
                  {metrics.activeDays} logged days
                  {goalDistance !== null ? ` • ${weightFormatter.format(goalDistance)} kg to goal` : ''}
                </div>
              </div>

              {monthlyCards.length ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {monthlyCards.map((card) => (
                    <article
                      key={card.monthKey}
                      className="rounded-[1.75rem] border border-border/80 bg-muted/30 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium tracking-[-0.03em]">{card.label}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {card.daysLogged} days logged • {card.exerciseDays} exercise notes
                          </p>
                        </div>
                        <CalendarDays className="size-4 text-muted-foreground" />
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Weight</p>
                          <p className="mt-1 font-medium text-foreground">
                            {formatWeight(card.latestWeight)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Calories</p>
                          <p className="mt-1 font-medium text-foreground">
                            {formatAverage(card.calorieAverage, 'kcal')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Steps</p>
                          <p className="mt-1 font-medium text-foreground">
                            {formatAverage(card.stepAverage, '')}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
                  Save your first daily entry to generate monthly cards automatically.
                </div>
              )}
            </section>
          </section>

          <aside className="space-y-6">
            <form
              onSubmit={handleSettingsSubmit}
              className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-5">
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Settings
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                    Initial targets
                  </h2>
                </div>
                <Settings2 className="mt-1 size-4 text-muted-foreground" />
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="Start weight">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    className={inputClassName}
                    value={settings.startWeight}
                    onChange={(event) =>
                      updateSettingsField('startWeight', event.target.value)
                    }
                    placeholder="85.0"
                  />
                </Field>

                <Field label="Goal weight">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    className={inputClassName}
                    value={settings.goalWeight}
                    onChange={(event) => updateSettingsField('goalWeight', event.target.value)}
                    placeholder="72.0"
                  />
                </Field>

                <Field label="Daily calorie target">
                  <input
                    type="number"
                    inputMode="numeric"
                    className={inputClassName}
                    value={settings.dailyCalorieTarget}
                    onChange={(event) =>
                      updateSettingsField('dailyCalorieTarget', event.target.value)
                    }
                    placeholder="2000"
                  />
                </Field>

                <Field label="Daily step target" hint="These settings are stored locally in IndexedDB.">
                  <input
                    type="number"
                    inputMode="numeric"
                    className={inputClassName}
                    value={settings.dailyStepTarget}
                    onChange={(event) =>
                      updateSettingsField('dailyStepTarget', event.target.value)
                    }
                    placeholder="8000"
                  />
                </Field>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <p className="text-xs leading-6 text-muted-foreground">
                  Future iteration support: charts, cloud sync, and mobile can reuse this model.
                </p>
                <Button type="submit" disabled={isSavingSettings}>
                  {isSavingSettings ? 'Saving...' : 'Save settings'}
                </Button>
              </div>
            </form>

            <form
              onSubmit={handleEntrySubmit}
              className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-5">
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                    Daily log
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                    One focused entry per day
                  </h2>
                </div>
                <Sparkles className="mt-1 size-4 text-muted-foreground" />
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="Date">
                  <input
                    type="date"
                    className={inputClassName}
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </Field>

                <Field label="Weight">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    className={inputClassName}
                    value={entryDraft.weight}
                    onChange={(event) => updateEntryDraftField('weight', event.target.value)}
                    placeholder="72.4"
                  />
                </Field>

                <Field label="Calories">
                  <input
                    type="number"
                    inputMode="numeric"
                    className={inputClassName}
                    value={entryDraft.calories}
                    onChange={(event) => updateEntryDraftField('calories', event.target.value)}
                    placeholder="1980"
                  />
                </Field>

                <Field label="Steps">
                  <input
                    type="number"
                    inputMode="numeric"
                    className={inputClassName}
                    value={entryDraft.steps}
                    onChange={(event) => updateEntryDraftField('steps', event.target.value)}
                    placeholder="8412"
                  />
                </Field>

                <Field
                  label="Exercise"
                  hint="Leave all fields blank for a date if you want the saved entry removed."
                >
                  <textarea
                    rows="4"
                    className={`${inputClassName} resize-none`}
                    value={entryDraft.exercise}
                    onChange={(event) => updateEntryDraftField('exercise', event.target.value)}
                    placeholder="40 min incline walk"
                  />
                </Field>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <p className="text-xs leading-6 text-muted-foreground">
                  {metrics.exerciseDays} exercise notes saved across {metrics.activeDays} logged days.
                </p>
                <Button type="submit" disabled={isSavingEntry}>
                  {isSavingEntry ? 'Saving...' : 'Save day'}
                </Button>
              </div>
            </form>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App

import { SlidersHorizontal } from 'lucide-react'

import { SettingsPanel } from './SettingsPanel'

function SettingsPage({
  entries,
  isImportingEntries,
  importEntriesFromCsv,
  settings,
  isSavingSettings,
  updateSettingsField,
  saveSettings,
}) {
  return (
    <main className="flex flex-1 py-8 xl:py-10">
      <section className="grid w-full gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Settings
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                Personal targets and defaults
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                Keep your dashboard focused by managing weight, calorie, and step
                targets here. These values stay local-first and drive the summaries
                across the app.
              </p>
            </div>
            <SlidersHorizontal className="mt-1 size-4 text-muted-foreground" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Start weight</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {settings.startWeight ? `${settings.startWeight} kg` : '-- kg'}
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Goal weight</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {settings.goalWeight ? `${settings.goalWeight} kg` : '-- kg'}
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Daily calorie targets</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {settings.dailyCalorieTarget || '--'} kcal
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Daily step targets</p>
              <p className="mt-2 text-xl font-medium text-foreground">
                {settings.dailyStepTarget || '--'} steps
              </p>
            </article>
          </div>
        </div>

        <aside>
          <SettingsPanel
            entries={entries}
            isImportingEntries={isImportingEntries}
            importEntriesFromCsv={importEntriesFromCsv}
            settings={settings}
            isSavingSettings={isSavingSettings}
            updateSettingsField={updateSettingsField}
            saveSettings={saveSettings}
          />
        </aside>
      </section>
    </main>
  )
}

export { SettingsPage }
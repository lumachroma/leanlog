import { SlidersHorizontal } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { SectionHeading } from '@/components/app/SectionHeading'

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
    <main className="flex flex-1 pb-8 pt-4 sm:pt-6 xl:py-10">
      <section className="grid w-full gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AppSurface as="div" className="p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
            <SectionHeading
              eyebrow="Settings"
              title="Personal Targets"
              description="Manage your weight, calorie, and step targets to keep your daily progress grounded and consistent."
            />
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
        </AppSurface>

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
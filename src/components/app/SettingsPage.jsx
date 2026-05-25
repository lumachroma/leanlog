import { useState } from 'react'

import { ArchiveRestore, SlidersHorizontal } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { SectionHeading } from '@/components/app/SectionHeading'
import { Button } from '@/components/ui/button'

import { SettingsBackupRestoreDrawer } from './SettingsBackupRestoreDrawer'
import { SettingsPanel } from './SettingsPanel'
import { SettingsTrackingDefaultsDrawer } from './SettingsTrackingDefaultsDrawer'

const TRACKING_DEFAULTS_DRAWER = 'tracking-defaults'
const BACKUP_RESTORE_DRAWER = 'backup-restore'

function SettingsPage({
  entries,
  isImportingEntries,
  importEntriesFromCsv,
  settings,
  isSavingSettings,
  updateSettingsField,
  saveSettings,
}) {
  const [activeDrawer, setActiveDrawer] = useState(null)

  const isTrackingDefaultsDrawerOpen = activeDrawer === TRACKING_DEFAULTS_DRAWER
  const isBackupRestoreDrawerOpen = activeDrawer === BACKUP_RESTORE_DRAWER

  const openDrawer = (drawerName) => {
    setActiveDrawer(drawerName)
  }

  const createOpenChangeHandler = (drawerName) => (isOpen) => {
    setActiveDrawer(isOpen ? drawerName : null)
  }

  return (
    <>
      <main className="flex flex-1 pb-8 pt-4 sm:pt-6 xl:py-10">
        <section className="grid w-full gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <AppSurface as="div" className="p-6">
            <div className="flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <SectionHeading
                eyebrow="Settings"
                title="Personal Targets"
                description="Manage your weight, calorie, and step targets to keep your daily progress grounded and consistent."
              />
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="gap-2"
                  onClick={() => openDrawer(TRACKING_DEFAULTS_DRAWER)}
                >
                  <SlidersHorizontal className="size-3.5" />
                  Tracking defaults
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => openDrawer(BACKUP_RESTORE_DRAWER)}
                >
                  <ArchiveRestore className="size-3.5" />
                  Backup & restore
                </Button>
              </div>
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
              entryCount={entries.length}
              onOpenBackupRestore={() => openDrawer(BACKUP_RESTORE_DRAWER)}
              onOpenTrackingDefaults={() => openDrawer(TRACKING_DEFAULTS_DRAWER)}
              settings={settings}
            />
          </aside>
        </section>
      </main>

      <SettingsTrackingDefaultsDrawer
        open={isTrackingDefaultsDrawerOpen}
        onOpenChange={createOpenChangeHandler(TRACKING_DEFAULTS_DRAWER)}
        settings={settings}
        isSavingSettings={isSavingSettings}
        updateSettingsField={updateSettingsField}
        saveSettings={saveSettings}
      />

      <SettingsBackupRestoreDrawer
        open={isBackupRestoreDrawerOpen}
        onOpenChange={createOpenChangeHandler(BACKUP_RESTORE_DRAWER)}
        entries={entries}
        isImportingEntries={isImportingEntries}
        importEntriesFromCsv={importEntriesFromCsv}
      />
    </>
  )
}

export { SettingsPage }
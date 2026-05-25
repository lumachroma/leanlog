import { ArchiveRestore, Settings2 } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { SectionHeading } from '@/components/app/SectionHeading'
import { Button } from '@/components/ui/button'

function SettingsPanel({
  entryCount,
  onOpenBackupRestore,
  onOpenTrackingDefaults,
  settings,
}) {
  return (
    <AppSurface as="section" className="p-6">
      <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-5">
        <SectionHeading
          eyebrow="Settings"
          title="Manage Your Setup"
          description="Keep the page readable at a glance, then open focused drawers when you need to update targets or move data in and out of LeanLog."
        />
        <Settings2 className="mt-1 size-4 text-muted-foreground" />
      </div>

      <div className="mt-6 grid gap-4">
        <article className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Defaults
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.03em] text-foreground">
                Tracking Defaults
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Review your starting weight, goal, calories, and steps without opening a form until you need to adjust them.
              </p>
            </div>
            <Settings2 className="mt-1 size-4 text-muted-foreground" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Start to goal
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {settings.startWeight ? `${settings.startWeight} kg` : '-- kg'} to{' '}
                {settings.goalWeight ? `${settings.goalWeight} kg` : '-- kg'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Daily targets
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {settings.dailyCalorieTarget || '--'} kcal and{' '}
                {settings.dailyStepTarget || '--'} steps
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
            <p className="text-sm text-muted-foreground">
              Stored locally and used across the dashboard, history, and averages.
            </p>
            <Button type="button" size="sm" onClick={onOpenTrackingDefaults}>
              Edit defaults
            </Button>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Daily logs
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.03em] text-foreground">
                Data Backup & Restore
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Export a portable CSV, restore saved entries later, or start from the template with the expected column order.
              </p>
            </div>
            <ArchiveRestore className="mt-1 size-4 text-muted-foreground" />
          </div>

          <div className="mt-4 rounded-2xl border border-border/70 bg-background/80 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Saved history
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {entryCount} saved {entryCount === 1 ? 'day' : 'days'} ready for export or merge-by-date import.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
            <p className="text-sm text-muted-foreground">
              Imports overwrite matching dates and leave missing days untouched.
            </p>
            <Button type="button" size="sm" variant="outline" onClick={onOpenBackupRestore}>
              Open data tools
            </Button>
          </div>
        </article>
      </div>
    </AppSurface>
  )
}

export { SettingsPanel }
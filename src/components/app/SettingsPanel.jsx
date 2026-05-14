import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Field } from './Field'

const inputClassName =
  'mt-2 w-full rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'

function SettingsPanel({
  settings,
  isSavingSettings,
  updateSettingsField,
  saveSettings,
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    void saveSettings()
  }

  return (
    <form
      onSubmit={handleSubmit}
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
            onChange={(event) => updateSettingsField('startWeight', event.target.value)}
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

        <Field
          label="Daily step target"
          hint="These settings are stored locally in IndexedDB."
        >
          <input
            type="number"
            inputMode="numeric"
            className={inputClassName}
            value={settings.dailyStepTarget}
            onChange={(event) => updateSettingsField('dailyStepTarget', event.target.value)}
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
  )
}

export { SettingsPanel }
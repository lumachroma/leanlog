import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Field } from './Field'
import { SettingsDrawerFrame } from './SettingsDrawerFrame'

const inputClassName =
  'mt-1.5 w-full rounded-[1.15rem] border border-border/80 bg-background/90 px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'
const settingsGridLabelClassName = 'flex min-h-10 items-end sm:min-h-0'

function SettingsTrackingDefaultsDrawer({
  open,
  onOpenChange,
  settings,
  isSavingSettings,
  updateSettingsField,
  saveSettings,
}) {
  const handleSubmit = async (event) => {
    event.preventDefault()

    const savedSettings = await saveSettings()

    if (savedSettings) {
      onOpenChange(false)
    }
  }

  return (
    <SettingsDrawerFrame
      open={open}
      onOpenChange={onOpenChange}
      as="form"
      onSubmit={handleSubmit}
      closeLabel="Close tracking defaults"
      eyebrow="Settings"
      Icon={Settings2}
      title="Tracking Defaults"
      footer={
        <Button type="submit" disabled={isSavingSettings}>
          {isSavingSettings ? 'Saving...' : 'Save settings'}
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2">
        <Field label="Start weight (kg)" labelClassName={settingsGridLabelClassName}>
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

        <Field label="Goal weight (kg)" labelClassName={settingsGridLabelClassName}>
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

        <Field
          label="Daily calorie target (kcal)"
          labelClassName={settingsGridLabelClassName}
        >
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
          label="Daily step target (steps)"
          labelClassName={settingsGridLabelClassName}
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
    </SettingsDrawerFrame>
  )
}

export { SettingsTrackingDefaultsDrawer }
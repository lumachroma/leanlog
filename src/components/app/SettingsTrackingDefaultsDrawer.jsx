import { Settings2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Field } from './Field'
import { SettingsDrawerFrame } from './SettingsDrawerFrame'
import { TouchNumberInput } from './TouchNumberInput'
import {
  calorieTouchInputConfig,
  stepTouchInputConfig,
  weightTouchInputConfig,
} from './touch-number-input-config'

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
      compactMobile={true}
      closeLabel="Close tracking defaults"
      eyebrow="Settings"
      Icon={Settings2}
      title="Tracking Defaults"
      footer={
        <Button type="submit" className="w-full sm:w-auto" disabled={isSavingSettings}>
          {isSavingSettings ? 'Saving...' : 'Save settings'}
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2">
        <Field
          label="Start weight (kg)"
          labelClassName={settingsGridLabelClassName}
          htmlFor="settings-start-weight"
        >
          <TouchNumberInput
            id="settings-start-weight"
            ariaLabel="Start weight"
            {...weightTouchInputConfig}
            value={settings.startWeight}
            onValueChange={(nextValue) => updateSettingsField('startWeight', nextValue)}
            placeholder="85.0"
          />
        </Field>

        <Field
          label="Goal weight (kg)"
          labelClassName={settingsGridLabelClassName}
          htmlFor="settings-goal-weight"
        >
          <TouchNumberInput
            id="settings-goal-weight"
            ariaLabel="Goal weight"
            {...weightTouchInputConfig}
            value={settings.goalWeight}
            onValueChange={(nextValue) => updateSettingsField('goalWeight', nextValue)}
            placeholder="72.0"
          />
        </Field>

        <Field
          label="Daily calorie target (kcal)"
          labelClassName={settingsGridLabelClassName}
          htmlFor="settings-daily-calorie-target"
        >
          <TouchNumberInput
            id="settings-daily-calorie-target"
            ariaLabel="Daily calorie target"
            {...calorieTouchInputConfig}
            value={settings.dailyCalorieTarget}
            onValueChange={(nextValue) =>
              updateSettingsField('dailyCalorieTarget', nextValue)
            }
            placeholder="2000"
          />
        </Field>

        <Field
          label="Daily step target (steps)"
          labelClassName={settingsGridLabelClassName}
          htmlFor="settings-daily-step-target"
        >
          <TouchNumberInput
            id="settings-daily-step-target"
            ariaLabel="Daily step target"
            {...stepTouchInputConfig}
            value={settings.dailyStepTarget}
            onValueChange={(nextValue) => updateSettingsField('dailyStepTarget', nextValue)}
            placeholder="8000"
          />
        </Field>
      </div>
    </SettingsDrawerFrame>
  )
}

export { SettingsTrackingDefaultsDrawer }
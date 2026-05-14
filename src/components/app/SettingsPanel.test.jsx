import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  it('updates fields and submits the form', async () => {
    const user = userEvent.setup()
    const updateSettingsField = vi.fn()
    const saveSettings = vi.fn()

    render(
      <SettingsPanel
        settings={{
          startWeight: '',
          goalWeight: '',
          dailyCalorieTarget: '',
          dailyStepTarget: '',
        }}
        isSavingSettings={false}
        updateSettingsField={updateSettingsField}
        saveSettings={saveSettings}
      />
    )

    fireEvent.change(screen.getByLabelText(/^Goal weight$/i), {
      target: { value: '72.5' },
    })
    fireEvent.change(screen.getByLabelText(/^Daily calorie target$/i), {
      target: { value: '2000' },
    })
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(updateSettingsField).toHaveBeenCalledWith('goalWeight', '72.5')
    expect(updateSettingsField).toHaveBeenCalledWith('dailyCalorieTarget', '2000')
    expect(saveSettings).toHaveBeenCalledTimes(1)
  })

  it('shows the saving state on submit button', () => {
    render(
      <SettingsPanel
        settings={{
          startWeight: '',
          goalWeight: '',
          dailyCalorieTarget: '',
          dailyStepTarget: '',
        }}
        isSavingSettings={true}
        updateSettingsField={vi.fn()}
        saveSettings={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})
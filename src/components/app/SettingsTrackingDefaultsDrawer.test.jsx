import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createBlankSettings } from '@/test/leanlog-test-fixtures'

import { SettingsTrackingDefaultsDrawer } from './SettingsTrackingDefaultsDrawer'

describe('SettingsTrackingDefaultsDrawer', () => {
  const createProps = (overrides = {}) => ({
    open: true,
    onOpenChange: vi.fn(),
    settings: createBlankSettings(),
    isSavingSettings: false,
    updateSettingsField: vi.fn(),
    saveSettings: vi.fn().mockResolvedValue(createBlankSettings()),
    ...overrides,
  })

  it('updates fields and submits the form', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsTrackingDefaultsDrawer {...props} />)

    fireEvent.change(screen.getByRole('spinbutton', { name: /^Goal weight/i }), {
      target: { value: '72.5' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: /^Daily calorie target/i }), {
      target: { value: '2000' },
    })
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(props.updateSettingsField).toHaveBeenCalledWith('goalWeight', '72.5')
    expect(props.updateSettingsField).toHaveBeenCalledWith('dailyCalorieTarget', '2000')
    expect(props.saveSettings).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(props.onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('shows the saving state on submit button', () => {
    render(
      <SettingsTrackingDefaultsDrawer
        {...createProps({ isSavingSettings: true })}
      />
    )

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    expect(screen.getByText(/set this below your maintenance calories/i)).toBeInTheDocument()
    expect(screen.getByText(/set a strong daily movement baseline/i)).toBeInTheDocument()
  })

  it('supports touch-first quick adjustments for tracking defaults', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsTrackingDefaultsDrawer {...props} />)

    const startWeightInput = screen.getByRole('spinbutton', {
      name: /^start weight/i,
    })
    const startWeightField = startWeightInput.parentElement?.parentElement

    expect(startWeightField).not.toBeNull()

    const startWeightControls = screen.getByRole('group', {
      name: /start weight controls/i,
    })

    await user.click(
      within(startWeightControls).getByRole('button', { name: /^increase$/i })
    )
    await user.click(within(startWeightField).getByRole('button', { name: /^80$/i }))
    await user.click(screen.getByRole('button', { name: /^2200$/i }))
    await user.click(screen.getByRole('button', { name: /^10k$/i }))

    expect(props.updateSettingsField).toHaveBeenCalledWith('startWeight', '20.0')
    expect(props.updateSettingsField).toHaveBeenCalledWith('startWeight', '80.0')
    expect(props.updateSettingsField).toHaveBeenCalledWith('dailyCalorieTarget', '2200')
    expect(props.updateSettingsField).toHaveBeenCalledWith('dailyStepTarget', '10000')
  })

  it('supports slider adjustments for tracking defaults', () => {
    const props = createProps()

    render(<SettingsTrackingDefaultsDrawer {...props} />)

    fireEvent.change(screen.getByRole('slider', { name: /^Start weight slider$/i }), {
      target: { value: '79' },
    })
    fireEvent.change(
      screen.getByRole('slider', { name: /^Daily step target slider$/i }),
      {
        target: { value: '9001' },
      }
    )

    expect(props.updateSettingsField).toHaveBeenCalledWith('startWeight', '79.0')
    expect(props.updateSettingsField).toHaveBeenCalledWith('dailyStepTarget', '9001')
  })

  it('closes the drawer from the close action', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsTrackingDefaultsDrawer {...props} />)

    expect(screen.queryByRole('button', { name: /^close$/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close tracking defaults/i }))

    expect(props.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('keeps the drawer open when saving fails', async () => {
    const user = userEvent.setup()
    const props = createProps({
      saveSettings: vi.fn().mockResolvedValue(null),
    })

    render(<SettingsTrackingDefaultsDrawer {...props} />)

    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(props.saveSettings).toHaveBeenCalledTimes(1)
    expect(props.onOpenChange).not.toHaveBeenCalled()
  })
})
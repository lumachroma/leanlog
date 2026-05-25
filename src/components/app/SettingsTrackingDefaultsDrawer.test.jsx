import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

    fireEvent.change(screen.getByLabelText(/^Goal weight/i), {
      target: { value: '72.5' },
    })
    fireEvent.change(screen.getByLabelText(/^Daily calorie target/i), {
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
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  createSampleSettings,
} from '@/test/leanlog-test-fixtures'

import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  const createProps = (overrides = {}) => ({
    entryCount: 12,
    onOpenBackupRestore: vi.fn(),
    onOpenTrackingDefaults: vi.fn(),
    settings: createSampleSettings(),
    ...overrides,
  })

  it('shows the current settings summary inline', () => {
    render(<SettingsPanel {...createProps()} />)

    expect(screen.getByText(/85 kg to 72 kg/i)).toBeInTheDocument()
    expect(screen.getByText(/2000 kcal ceiling and 8000 step baseline/i)).toBeInTheDocument()
    expect(screen.getByText(/calories stay under a limit\. steps are treated as a meet-or-beat baseline/i)).toBeInTheDocument()
    expect(screen.getByText(/12 saved days ready for export or merge-by-date import/i)).toBeInTheDocument()
  })

  it('opens the tracking defaults drawer from the summary card', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsPanel {...props} />)

    await user.click(screen.getByRole('button', { name: /edit defaults/i }))

    expect(props.onOpenTrackingDefaults).toHaveBeenCalledTimes(1)
  })

  it('opens the backup drawer from the summary card', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsPanel {...props} />)

    await user.click(screen.getByRole('button', { name: /open data tools/i }))

    expect(props.onOpenBackupRestore).toHaveBeenCalledTimes(1)
  })
})
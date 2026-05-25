import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import {
  createBlankSettings,
  createSampleEntries,
} from '@/test/leanlog-test-fixtures'

import { SettingsPage } from './SettingsPage'

describe('SettingsPage', () => {
  const createProps = (overrides = {}) => ({
    entries: createSampleEntries(),
    isImportingEntries: false,
    importEntriesFromCsv: async () => ({ importedCount: 0, errorMessage: null }),
    settings: createBlankSettings(),
    isSavingSettings: false,
    updateSettingsField: () => {},
    saveSettings: async () => {},
    ...overrides,
  })

  it('opens the tracking defaults drawer from the header action', async () => {
    const user = userEvent.setup()

    render(<SettingsPage {...createProps()} />)

    await user.click(screen.getByRole('button', { name: /tracking defaults/i }))

    expect(screen.getByRole('heading', { name: /tracking defaults/i })).toBeInTheDocument()
  })

  it('opens the backup and restore drawer from the header action', async () => {
    const user = userEvent.setup()

    render(<SettingsPage {...createProps()} />)

    await user.click(screen.getByRole('button', { name: /backup & restore/i }))

    expect(screen.getByRole('heading', { name: /data backup & restore/i })).toBeInTheDocument()
  })
})
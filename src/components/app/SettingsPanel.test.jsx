import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createBlankSettings,
  createInvalidDailyLogCsv,
  createSampleEntries,
  createSingleEntryDailyLogCsv,
} from '@/test/leanlog-test-fixtures'

import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const createProps = (overrides = {}) => ({
    entries: createSampleEntries(),
    isImportingEntries: false,
    importEntriesFromCsv: vi.fn(),
    settings: createBlankSettings(),
    isSavingSettings: false,
    updateSettingsField: vi.fn(),
    saveSettings: vi.fn(),
    ...overrides,
  })

  it('updates fields and submits the form', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsPanel {...props} />)

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
  })

  it('shows the saving state on submit button', () => {
    render(<SettingsPanel {...createProps({ isSavingSettings: true })} />)

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('imports daily logs from a selected csv file', async () => {
    const user = userEvent.setup()
    const props = createProps({
      importEntriesFromCsv: vi.fn().mockResolvedValue({
        importedCount: 1,
        errorMessage: null,
      }),
    })

    render(<SettingsPanel {...props} />)

    const csvFile = new File([createSingleEntryDailyLogCsv()], 'leanlog.csv', {
      type: 'text/csv',
    })

    await user.upload(screen.getByLabelText(/import daily logs csv/i), csvFile)

    await waitFor(() => {
      expect(props.importEntriesFromCsv).toHaveBeenCalledWith(
        expect.stringContaining('date,weight')
      )
    })

    expect(screen.getByText(/imported 1 daily log from csv/i)).toBeInTheDocument()
  })

  it('shows an inline error when csv import fails', async () => {
    const user = userEvent.setup()
    const props = createProps({
      importEntriesFromCsv: vi.fn().mockResolvedValue({
        importedCount: 0,
        errorMessage: 'Row 2 has an invalid date.',
      }),
    })

    render(<SettingsPanel {...props} />)

    const csvFile = new File([createInvalidDailyLogCsv()], 'leanlog-invalid.csv', {
      type: 'text/csv',
    })

    await user.upload(screen.getByLabelText(/import daily logs csv/i), csvFile)

    expect(await screen.findByText(/row 2 has an invalid date/i)).toBeInTheDocument()
  })

  it('downloads a csv template from the settings panel', async () => {
    const user = userEvent.setup()
    const createObjectUrl = vi.fn(() => 'blob:template')
    const revokeObjectUrl = vi.fn()
    const downloadLink = {
      href: '',
      download: '',
      click: vi.fn(),
    }
    const originalCreateElement = document.createElement.bind(document)

    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: createObjectUrl,
      revokeObjectURL: revokeObjectUrl,
    })
    vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      if (tagName === 'a') {
        return downloadLink
      }

      return originalCreateElement(tagName, options)
    })

    render(<SettingsPanel {...createProps()} />)

    await user.click(screen.getByRole('button', { name: /download csv template/i }))

    expect(createObjectUrl).toHaveBeenCalledTimes(1)
    expect(downloadLink.download).toBe('leanlog-daily-logs-template.csv')
    expect(downloadLink.click).toHaveBeenCalledTimes(1)
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:template')
  })
})
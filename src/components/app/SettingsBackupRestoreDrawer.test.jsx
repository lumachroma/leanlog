import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createInvalidDailyLogCsv,
  createSampleEntries,
  createSingleEntryDailyLogCsv,
} from '@/test/leanlog-test-fixtures'

import { SettingsBackupRestoreDrawer } from './SettingsBackupRestoreDrawer'

describe('SettingsBackupRestoreDrawer', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const createProps = (overrides = {}) => ({
    open: true,
    onOpenChange: vi.fn(),
    entries: createSampleEntries(),
    isImportingEntries: false,
    importEntriesFromCsv: vi.fn(),
    ...overrides,
  })

  it('imports daily logs from a selected csv file', async () => {
    const user = userEvent.setup()
    const props = createProps({
      importEntriesFromCsv: vi.fn().mockResolvedValue({
        importedCount: 1,
        errorMessage: null,
      }),
    })

    render(<SettingsBackupRestoreDrawer {...props} />)

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

    render(<SettingsBackupRestoreDrawer {...props} />)

    const csvFile = new File([createInvalidDailyLogCsv()], 'leanlog-invalid.csv', {
      type: 'text/csv',
    })

    await user.upload(screen.getByLabelText(/import daily logs csv/i), csvFile)

    expect(await screen.findByText(/row 2 has an invalid date/i)).toBeInTheDocument()
  })

  it('rejects non-csv uploads before import starts', async () => {
    const user = userEvent.setup({ applyAccept: false })
    const props = createProps()

    render(<SettingsBackupRestoreDrawer {...props} />)

    const textFile = new File(['not,csv'], 'leanlog.txt', {
      type: 'text/plain',
    })

    await user.upload(screen.getByLabelText(/import daily logs csv/i), textFile)

    expect(props.importEntriesFromCsv).not.toHaveBeenCalled()
    expect(
      await screen.findByText(/choose a csv file before importing daily logs/i)
    ).toBeInTheDocument()
  })

  it('rejects oversized csv uploads before reading them', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<SettingsBackupRestoreDrawer {...props} />)

    const csvFile = new File(['date,weight\n2026-05-14,80'], 'leanlog.csv', {
      type: 'text/csv',
    })

    Object.defineProperty(csvFile, 'size', {
      configurable: true,
      value: 1024 * 1024 + 1,
    })

    await user.upload(screen.getByLabelText(/import daily logs csv/i), csvFile)

    expect(props.importEntriesFromCsv).not.toHaveBeenCalled()
    expect(await screen.findByText(/csv files must be 1 mb or smaller/i)).toBeInTheDocument()
  })

  it('downloads a csv template from the drawer', async () => {
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

    render(<SettingsBackupRestoreDrawer {...createProps()} />)

    await user.click(screen.getByRole('button', { name: /download csv template/i }))

    expect(createObjectUrl).toHaveBeenCalledTimes(1)
    expect(downloadLink.download).toBe('leanlog-daily-logs-template.csv')
    expect(downloadLink.click).toHaveBeenCalledTimes(1)
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:template')
  })
})
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createBlankStoreData,
  createInvalidDailyLogCsv,
  createParsedSampleDailyLogEntries,
  createSampleDailyLogCsv,
  createSampleEntries,
  createSampleEntry,
  createSampleEntryDraft,
  createSampleSettings,
} from '@/test/leanlog-test-fixtures'

const mockLoadAppSnapshot = vi.fn()
const mockSaveSettingsSnapshot = vi.fn()
const mockUpsertEntryRecord = vi.fn()
const mockDeleteEntryRecord = vi.fn()
const mockImportEntryRecords = vi.fn()

vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual('@/lib/db')

  return {
    ...actual,
    loadAppSnapshot: mockLoadAppSnapshot,
    saveSettingsSnapshot: mockSaveSettingsSnapshot,
    upsertEntryRecord: mockUpsertEntryRecord,
    deleteEntryRecord: mockDeleteEntryRecord,
    importEntryRecords: mockImportEntryRecords,
  }
})

describe('useAppStore', () => {
  let selectEntriesState
  let selectLifecycleState
  let selectSettingsState
  let useAppStore

  beforeEach(async () => {
    vi.resetModules()

    ;({
      selectEntriesState,
      selectLifecycleState,
      selectSettingsState,
      useAppStore,
    } = await import('./useAppStore'))

    useAppStore.setState((state) => ({
      ...state,
      ...createBlankStoreData(),
    }))

    mockLoadAppSnapshot.mockReset()
    mockSaveSettingsSnapshot.mockReset()
    mockUpsertEntryRecord.mockReset()
    mockDeleteEntryRecord.mockReset()
    mockImportEntryRecords.mockReset()
  })

  afterEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      ...createBlankStoreData({
        selectedDate: state.selectedDate,
      }),
    }))
  })

  it('refreshes the selected draft from recalculated entries after deleting another day', async () => {
    useAppStore.setState((state) => ({
      ...state,
      entries: createSampleEntries().map((entry, index) =>
        index === 1 ? { ...entry, weight7dma: 80.5 } : entry
      ),
      entryDraft: createSampleEntryDraft(),
    }))

    mockDeleteEntryRecord.mockResolvedValue([createSampleEntry({ weight7dma: 80 })])

    await useAppStore.getState().deleteEntry('2026-05-13')

    expect(useAppStore.getState().entries).toEqual([createSampleEntry({ weight7dma: 80 })])
    expect(useAppStore.getState().entryDraft).toEqual(
      createSampleEntry({ weight7dma: 80 })
    )
  })

  it('returns saved settings on success so the UI can react after saving', async () => {
    const savedSettings = createSampleSettings({ goalWeight: '70' })

    useAppStore.setState((state) => ({
      ...state,
      settings: savedSettings,
    }))

    mockSaveSettingsSnapshot.mockResolvedValue(savedSettings)

    const result = await useAppStore.getState().saveSettings()

    expect(result).toEqual(savedSettings)
    expect(useAppStore.getState().settings).toEqual(savedSettings)
    expect(useAppStore.getState().errorMessage).toBeNull()
  })

  it('returns null when saving settings fails', async () => {
    mockSaveSettingsSnapshot.mockRejectedValue(new Error('save failed'))

    const result = await useAppStore.getState().saveSettings()

    expect(result).toBeNull()
    expect(useAppStore.getState().errorMessage).toBe('Unable to save your settings.')
  })

  it('imports csv daily logs and refreshes the selected draft from imported entries', async () => {
    useAppStore.setState((state) => ({
      ...state,
      ...createBlankStoreData({ selectedDate: state.selectedDate }),
    }))

    mockImportEntryRecords.mockResolvedValue(createSampleEntries())

    const result = await useAppStore.getState().importEntriesFromCsv(
      createSampleDailyLogCsv()
    )

    expect(result).toEqual({ importedCount: 2, errorMessage: null })
    expect(mockImportEntryRecords).toHaveBeenCalledWith(createParsedSampleDailyLogEntries())
    expect(useAppStore.getState().entries).toEqual(createSampleEntries())
    expect(useAppStore.getState().entryDraft).toEqual(createSampleEntryDraft())
  })

  it('returns a local csv parsing error while keeping the global import error state', async () => {
    const result = await useAppStore.getState().importEntriesFromCsv(createInvalidDailyLogCsv())

    expect(mockImportEntryRecords).not.toHaveBeenCalled()
    expect(result).toEqual({
      importedCount: 0,
      errorMessage: 'Row 2 has an invalid date.',
    })
    expect(useAppStore.getState().errorMessage).toBe(
      'Unable to import daily logs from CSV.'
    )
  })

  it('exposes stable domain selectors for settings, entries, and lifecycle state', () => {
    const state = useAppStore.getState()

    expect(selectSettingsState(state)).toEqual({
      settings: state.settings,
      isSavingSettings: false,
      updateSettingsField: state.updateSettingsField,
      saveSettings: state.saveSettings,
    })

    expect(selectEntriesState(state)).toEqual({
      entries: state.entries,
      selectedDate: state.selectedDate,
      entryDraft: state.entryDraft,
      isSavingEntry: false,
      setSelectedDate: state.setSelectedDate,
      updateEntryDraftField: state.updateEntryDraftField,
      replaceEntryDraft: state.replaceEntryDraft,
      saveEntry: state.saveEntry,
      deleteEntry: state.deleteEntry,
      importEntriesFromCsv: state.importEntriesFromCsv,
    })

    expect(selectLifecycleState(state)).toEqual({
      isHydrated: true,
      errorMessage: null,
      hydrateApp: state.hydrateApp,
    })
  })
})
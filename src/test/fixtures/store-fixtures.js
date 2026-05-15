import { vi } from 'vitest'

import {
  createBlankEntryDraft,
  createSampleEntries,
  createSampleEntryDraft,
} from '@/test/fixtures/entry-fixtures'
import { createSampleSettings } from '@/test/fixtures/settings-fixtures'

export function createSampleStoreActions() {
  return {
    hydrateApp: vi.fn(),
    updateSettingsField: vi.fn(),
    saveSettings: vi.fn(),
    setSelectedDate: vi.fn(),
    updateEntryDraftField: vi.fn(),
    saveEntry: vi.fn(),
    deleteEntry: vi.fn(),
    importEntriesFromCsv: vi.fn(),
  }
}

export function createSampleStoreState(overrides = {}) {
  return {
    ...createSampleStoreData(),
    ...createSampleStoreActions(),
    ...overrides,
  }
}

export function createSampleStoreData(overrides = {}) {
  return {
    settings: createSampleSettings(),
    entries: createSampleEntries(),
    selectedDate: '2026-05-14',
    entryDraft: createSampleEntryDraft(),
    isHydrated: true,
    isSavingSettings: false,
    isSavingEntry: false,
    errorMessage: null,
    ...overrides,
  }
}

export function createBlankStoreData(overrides = {}) {
  return createSampleStoreData({
    entries: [],
    entryDraft: createBlankEntryDraft(),
    ...overrides,
  })
}
import {
  DEFAULT_SETTINGS,
  createEmptyEntryDraft,
  deleteEntryRecord,
  importEntryRecords,
  loadAppSnapshot,
  saveSettingsSnapshot,
  todayDate,
  upsertEntryRecord,
} from '@/lib/db'
import { parseEntriesCsv } from '@/lib/daily-log-csv'

const STORE_ERROR_MESSAGES = {
  hydrate: 'Unable to load your local data.',
  saveSettings: 'Unable to save your settings.',
  saveEntry: 'Unable to save this daily entry.',
  deleteEntry: 'Unable to delete this daily entry.',
  importEntries: 'Unable to import daily logs from CSV.',
}

const createDefaultSettings = () => ({ ...DEFAULT_SETTINGS })

const draftForDate = (entries, date) => {
  const matchingEntry = entries.find((entry) => entry.date === date)

  return matchingEntry ? { ...matchingEntry } : createEmptyEntryDraft(date)
}

const createDraftSelectionState = (entries, selectedDate) => ({
  selectedDate,
  entryDraft: draftForDate(entries, selectedDate),
})

const createEntriesState = (entries, selectedDate) => ({
  entries,
  ...createDraftSelectionState(entries, selectedDate),
})

const createFieldUpdater = (key, set) => (field, value) => {
  set((state) => ({
    [key]: {
      ...state[key],
      [field]: value,
    },
  }))
}

const runStoreAction = async ({ set, startState, task, onSuccess, onFailure }) => {
  set(startState)

  try {
    const result = await task()

    set((state) => onSuccess(result, state))

    return result
  } catch {
    set((state) => onFailure(state))

    return null
  }
}

export const createAppStoreState = () => {
  const selectedDate = todayDate()

  return {
    settings: createDefaultSettings(),
    entries: [],
    selectedDate,
    entryDraft: createEmptyEntryDraft(selectedDate),
    isHydrated: false,
    isSavingSettings: false,
    isSavingEntry: false,
    errorMessage: null,
  }
}

export const createSettingsSlice = (set, get) => ({
  updateSettingsField: createFieldUpdater('settings', set),

  saveSettings: async () => {
    await runStoreAction({
      set,
      startState: { isSavingSettings: true, errorMessage: null },
      task: () => saveSettingsSnapshot(get().settings),
      onSuccess: (settings) => ({
        settings,
        isSavingSettings: false,
        errorMessage: null,
      }),
      onFailure: () => ({
        isSavingSettings: false,
        errorMessage: STORE_ERROR_MESSAGES.saveSettings,
      }),
    })
  },
})

export const createEntriesSlice = (set, get) => ({
  setSelectedDate: (date) => {
    set((state) => createDraftSelectionState(state.entries, date))
  },

  updateEntryDraftField: createFieldUpdater('entryDraft', set),

  saveEntry: async () => {
    const draft = {
      ...get().entryDraft,
      date: get().selectedDate,
    }

    await runStoreAction({
      set,
      startState: { isSavingEntry: true, errorMessage: null },
      task: () => upsertEntryRecord(draft),
      onSuccess: (entries, state) => ({
        ...createEntriesState(entries, state.selectedDate),
        isSavingEntry: false,
        errorMessage: null,
      }),
      onFailure: () => ({
        isSavingEntry: false,
        errorMessage: STORE_ERROR_MESSAGES.saveEntry,
      }),
    })
  },

  deleteEntry: async (date) => {
    await runStoreAction({
      set,
      startState: { isSavingEntry: true, errorMessage: null },
      task: () => deleteEntryRecord(date),
      onSuccess: (entries, state) => ({
        ...createEntriesState(entries, state.selectedDate),
        isSavingEntry: false,
        errorMessage: null,
      }),
      onFailure: () => ({
        isSavingEntry: false,
        errorMessage: STORE_ERROR_MESSAGES.deleteEntry,
      }),
    })
  },

  importEntriesFromCsv: async (csvText) => {
    set({ isSavingEntry: true, errorMessage: null })

    try {
      const importedEntries = parseEntriesCsv(csvText)
      const entries = await importEntryRecords(importedEntries)

      set((state) => ({
        ...createEntriesState(entries, state.selectedDate),
        isSavingEntry: false,
        errorMessage: null,
      }))

      return {
        importedCount: importedEntries.length,
        errorMessage: null,
      }
    } catch (error) {
      set({
        isSavingEntry: false,
        errorMessage: STORE_ERROR_MESSAGES.importEntries,
      })

      return {
        importedCount: 0,
        errorMessage:
          error instanceof Error ? error.message : STORE_ERROR_MESSAGES.importEntries,
      }
    }
  },
})

export const createLifecycleSlice = (set) => ({
  hydrateApp: async () => {
    await runStoreAction({
      set,
      startState: { errorMessage: null },
      task: loadAppSnapshot,
      onSuccess: (snapshot, state) => ({
        settings: snapshot.settings,
        ...createEntriesState(snapshot.entries, state.selectedDate),
        isHydrated: true,
        errorMessage: null,
      }),
      onFailure: () => ({
        isHydrated: true,
        errorMessage: STORE_ERROR_MESSAGES.hydrate,
      }),
    })
  },
})

export const selectSettingsState = (state) => ({
  settings: state.settings,
  isSavingSettings: state.isSavingSettings,
  updateSettingsField: state.updateSettingsField,
  saveSettings: state.saveSettings,
})

export const selectEntriesState = (state) => ({
  entries: state.entries,
  selectedDate: state.selectedDate,
  entryDraft: state.entryDraft,
  isSavingEntry: state.isSavingEntry,
  setSelectedDate: state.setSelectedDate,
  updateEntryDraftField: state.updateEntryDraftField,
  saveEntry: state.saveEntry,
  deleteEntry: state.deleteEntry,
  importEntriesFromCsv: state.importEntriesFromCsv,
})

export const selectLifecycleState = (state) => ({
  isHydrated: state.isHydrated,
  errorMessage: state.errorMessage,
  hydrateApp: state.hydrateApp,
})

export const selectAppViewModelState = (state) => ({
  ...selectSettingsState(state),
  ...selectEntriesState(state),
  ...selectLifecycleState(state),
})
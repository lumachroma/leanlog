import { create } from 'zustand'

import {
  DEFAULT_SETTINGS,
  createEmptyEntryDraft,
  deleteEntryRecord,
  loadAppSnapshot,
  saveSettingsSnapshot,
  todayDate,
  upsertEntryRecord,
} from '@/lib/db'

const STORE_ERROR_MESSAGES = {
  hydrate: 'Unable to load your local data.',
  saveSettings: 'Unable to save your settings.',
  saveEntry: 'Unable to save this daily entry.',
  deleteEntry: 'Unable to delete this daily entry.',
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

const createEntryState = (entries, selectedDate) => ({
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

const createInitialState = () => {
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

export const selectAppViewModelState = (state) => ({
  settings: state.settings,
  entries: state.entries,
  selectedDate: state.selectedDate,
  entryDraft: state.entryDraft,
  isHydrated: state.isHydrated,
  isSavingSettings: state.isSavingSettings,
  isSavingEntry: state.isSavingEntry,
  errorMessage: state.errorMessage,
  hydrateApp: state.hydrateApp,
  updateSettingsField: state.updateSettingsField,
  saveSettings: state.saveSettings,
  setSelectedDate: state.setSelectedDate,
  updateEntryDraftField: state.updateEntryDraftField,
  saveEntry: state.saveEntry,
  deleteEntry: state.deleteEntry,
})

export const useAppStore = create((set, get) => ({
  ...createInitialState(),

  hydrateApp: async () => {
    await runStoreAction({
      set,
      startState: { errorMessage: null },
      task: loadAppSnapshot,
      onSuccess: (snapshot, state) => ({
        settings: snapshot.settings,
        ...createEntryState(snapshot.entries, state.selectedDate),
        isHydrated: true,
        errorMessage: null,
      }),
      onFailure: () => ({
        isHydrated: true,
        errorMessage: STORE_ERROR_MESSAGES.hydrate,
      }),
    })
  },

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
        ...createEntryState(entries, state.selectedDate),
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
        ...createEntryState(entries, state.selectedDate),
        isSavingEntry: false,
        errorMessage: null,
      }),
      onFailure: () => ({
        isSavingEntry: false,
        errorMessage: STORE_ERROR_MESSAGES.deleteEntry,
      }),
    })
  },
}))
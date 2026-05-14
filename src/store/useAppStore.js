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

const createDefaultSettings = () => ({ ...DEFAULT_SETTINGS })

const draftForDate = (entries, date) => {
  const matchingEntry = entries.find((entry) => entry.date === date)

  return matchingEntry ? { ...matchingEntry } : createEmptyEntryDraft(date)
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

export const useAppStore = create((set, get) => ({
  ...createInitialState(),

  hydrateApp: async () => {
    try {
      const snapshot = await loadAppSnapshot()
      const selectedDate = get().selectedDate

      set({
        settings: snapshot.settings,
        entries: snapshot.entries,
        entryDraft: draftForDate(snapshot.entries, selectedDate),
        isHydrated: true,
        errorMessage: null,
      })
    } catch {
      set({
        isHydrated: true,
        errorMessage: 'Unable to load your local data.',
      })
    }
  },

  updateSettingsField: (field, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [field]: value,
      },
    }))
  },

  saveSettings: async () => {
    set({ isSavingSettings: true, errorMessage: null })

    try {
      const savedSettings = await saveSettingsSnapshot(get().settings)

      set({
        settings: savedSettings,
        isSavingSettings: false,
      })
    } catch {
      set({
        isSavingSettings: false,
        errorMessage: 'Unable to save your settings.',
      })
    }
  },

  setSelectedDate: (date) => {
    set((state) => ({
      selectedDate: date,
      entryDraft: draftForDate(state.entries, date),
    }))
  },

  updateEntryDraftField: (field, value) => {
    set((state) => ({
      entryDraft: {
        ...state.entryDraft,
        [field]: value,
      },
    }))
  },

  saveEntry: async () => {
    const selectedDate = get().selectedDate
    const draft = {
      ...get().entryDraft,
      date: selectedDate,
    }

    set({ isSavingEntry: true, errorMessage: null })

    try {
      const entries = await upsertEntryRecord(draft)

      set(() => ({
        entries,
        entryDraft: draftForDate(entries, selectedDate),
        isSavingEntry: false,
      }))
    } catch {
      set({
        isSavingEntry: false,
        errorMessage: 'Unable to save this daily entry.',
      })
    }
  },

  deleteEntry: async (date) => {
    set({ isSavingEntry: true, errorMessage: null })

    try {
      const entries = await deleteEntryRecord(date)

      set((state) => ({
        entries,
        entryDraft:
          state.selectedDate === date
            ? createEmptyEntryDraft(state.selectedDate)
            : state.entryDraft,
        isSavingEntry: false,
      }))
    } catch {
      set({
        isSavingEntry: false,
        errorMessage: 'Unable to delete this daily entry.',
      })
    }
  },
}))
import { create } from 'zustand'

import {
  createAppStoreState,
  createEntriesSlice,
  createLifecycleSlice,
  createSettingsSlice,
} from './app-store-slices'

export {
  selectAppViewModelState,
  selectEntriesState,
  selectLifecycleState,
  selectSettingsState,
} from './app-store-slices'

export const useAppStore = create((set, get) => ({
  ...createAppStoreState(),
  ...createSettingsSlice(set, get),
  ...createEntriesSlice(set, get),
  ...createLifecycleSlice(set, get),
}))
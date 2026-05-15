import { vi } from 'vitest'

import {
  createSampleChartSeries,
  createSampleMetrics,
  createSampleMonthlyAverageCards,
  createSampleWeeklyAverageCards,
} from '@/test/fixtures/derived-fixtures'
import {
  createSampleEntries,
  createSampleEntryDraft,
} from '@/test/fixtures/entry-fixtures'
import { createSampleSettings } from '@/test/fixtures/settings-fixtures'

export function createSampleAppViewModel(overrides = {}) {
  return {
    lifecycle: {
      isHydrated: true,
      errorMessage: null,
      hydrateApp: vi.fn(),
      ...overrides.lifecycle,
    },
    settingsView: {
      settings: createSampleSettings(),
      isSavingSettings: false,
      updateSettingsField: vi.fn(),
      saveSettings: vi.fn(),
      ...overrides.settingsView,
    },
    historyView: {
      entries: createSampleEntries(),
      selectedDate: '2026-05-14',
      entryDraft: createSampleEntryDraft(),
      isSavingEntry: false,
      setSelectedDate: vi.fn(),
      updateEntryDraftField: vi.fn(),
      saveEntry: vi.fn(),
      deleteEntry: vi.fn(),
      ...overrides.historyView,
    },
    averagesView: {
      weeklyAverageCards: createSampleWeeklyAverageCards(),
      monthlyAverageCards: createSampleMonthlyAverageCards(),
      ...overrides.averagesView,
    },
    dashboardView: {
      settings: createSampleSettings(),
      metrics: createSampleMetrics(),
      chartSeries: createSampleChartSeries(),
      calorieDelta: 0,
      stepDelta: 0,
      goalDistance: 8,
      targetsConfigured: true,
      ...overrides.dashboardView,
    },
  }
}
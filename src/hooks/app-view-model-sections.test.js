import { describe, expect, it } from 'vitest'

import {
  createSampleChartSeries,
  createSampleMetrics,
  createSampleMonthlyAverageCards,
  createSampleSettings,
  createSampleStoreState,
  createSampleWeeklyAverageCards,
} from '@/test/leanlog-test-fixtures'

import {
  createAppViewModel,
  createAveragesViewModel,
  createDashboardViewModel,
  createHistoryViewModel,
  createLifecycleViewModel,
  createSettingsViewModel,
} from './app-view-model-sections'

describe('app view-model sections', () => {
  it('builds lifecycle, settings, and history sections as direct passthrough views', () => {
    const state = createSampleStoreState()

    expect(createLifecycleViewModel(state)).toEqual({
      isHydrated: true,
      errorMessage: null,
      hydrateApp: state.hydrateApp,
    })

    expect(createSettingsViewModel(state)).toEqual({
      settings: state.settings,
      isSavingSettings: false,
      updateSettingsField: state.updateSettingsField,
      saveSettings: state.saveSettings,
    })

    expect(createHistoryViewModel(state)).toEqual({
      entries: state.entries,
      selectedDate: '2026-05-14',
      entryDraft: state.entryDraft,
      isSavingEntry: false,
      setSelectedDate: state.setSelectedDate,
      updateEntryDraftField: state.updateEntryDraftField,
      saveEntry: state.saveEntry,
      deleteEntry: state.deleteEntry,
    })
  })

  it('builds average and dashboard sections from the current entries and settings', () => {
    const state = createSampleStoreState()

    expect(createAveragesViewModel(state)).toEqual({
      weeklyAverageCards: createSampleWeeklyAverageCards(),
      monthlyAverageCards: createSampleMonthlyAverageCards(),
    })

    expect(createDashboardViewModel(state)).toEqual({
      settings: state.settings,
      metrics: createSampleMetrics(),
      chartSeries: createSampleChartSeries(),
      calorieDelta: 0,
      stepDelta: 0,
      goalDistance: 8,
      targetsConfigured: true,
    })
  })

  it('composes all grouped sections and marks targets as incomplete when settings are blank', () => {
    const state = createSampleStoreState({ settings: createSampleSettings({
      startWeight: '',
      goalWeight: '',
      dailyCalorieTarget: '',
      dailyStepTarget: '',
    }) })

    const viewModel = createAppViewModel(state)

    expect(viewModel.lifecycle.isHydrated).toBe(true)
    expect(viewModel.settingsView.settings).toEqual(state.settings)
    expect(viewModel.historyView.entryDraft).toEqual(state.entryDraft)
    expect(viewModel.averagesView.weeklyAverageCards).toHaveLength(1)
    expect(viewModel.dashboardView.targetsConfigured).toBe(false)
    expect(viewModel.dashboardView.calorieDelta).toBeNull()
    expect(viewModel.dashboardView.stepDelta).toBeNull()
    expect(viewModel.dashboardView.goalDistance).toBeNull()
  })
})
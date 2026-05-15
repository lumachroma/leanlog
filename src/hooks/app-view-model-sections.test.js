import { describe, expect, it, vi } from 'vitest'

import {
  createAppViewModel,
  createAveragesViewModel,
  createDashboardViewModel,
  createHistoryViewModel,
  createLifecycleViewModel,
  createSettingsViewModel,
} from './app-view-model-sections'

const createState = () => ({
  settings: {
    startWeight: '85',
    goalWeight: '72',
    dailyCalorieTarget: '2000',
    dailyStepTarget: '8000',
  },
  entries: [
    {
      date: '2026-05-14',
      weight: '80',
      weight7dma: 79.5,
      calories: '1900',
      steps: '9000',
      exerciseType: 'Walking',
      exerciseMinutes: '40',
    },
    {
      date: '2026-05-13',
      weight: '81',
      weight7dma: 81,
      calories: '2100',
      steps: '7000',
      exerciseType: '',
      exerciseMinutes: '',
    },
  ],
  selectedDate: '2026-05-14',
  entryDraft: {
    date: '2026-05-14',
    weight: '80',
    weight7dma: 79.5,
    calories: '1900',
    steps: '9000',
    exerciseType: 'Walking',
    exerciseMinutes: '40',
  },
  isHydrated: true,
  isSavingSettings: false,
  isSavingEntry: false,
  errorMessage: null,
  hydrateApp: vi.fn(),
  updateSettingsField: vi.fn(),
  saveSettings: vi.fn(),
  setSelectedDate: vi.fn(),
  updateEntryDraftField: vi.fn(),
  saveEntry: vi.fn(),
  deleteEntry: vi.fn(),
})

describe('app view-model sections', () => {
  it('builds lifecycle, settings, and history sections as direct passthrough views', () => {
    const state = createState()

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
    const state = createState()

    expect(createAveragesViewModel(state)).toEqual({
      weeklyAverageCards: [
        {
          periodKey: '2026-05-11',
          label: 'Week of May 11, 2026',
          daysLogged: 2,
          exerciseDays: 1,
          weightAverage: 80.5,
          calorieAverage: 2000,
          stepAverage: 8000,
        },
      ],
      monthlyAverageCards: [
        {
          periodKey: '2026-05',
          label: 'May 2026',
          daysLogged: 2,
          exerciseDays: 1,
          weightAverage: 80.5,
          calorieAverage: 2000,
          stepAverage: 8000,
        },
      ],
    })

    expect(createDashboardViewModel(state)).toEqual({
      settings: state.settings,
      metrics: {
        latestWeight: 80,
        latestWeight7dma: 79.5,
        weightDelta: -5,
        goalProgressPercent: 38,
        calorieAverage: 2000,
        stepAverage: 8000,
        activeDays: 2,
        exerciseDays: 1,
      },
      chartSeries: {
        weightTrend: [
          {
            date: '2026-05-13',
            weight: 81,
            weight7dma: 81,
            calories: 2100,
            steps: 7000,
            exerciseType: null,
            exerciseMinutes: null,
          },
          {
            date: '2026-05-14',
            weight: 80,
            weight7dma: 79.5,
            calories: 1900,
            steps: 9000,
            exerciseType: 'Walking',
            exerciseMinutes: 40,
          },
        ],
        calorieTrend: [
          {
            date: '2026-05-13',
            weight: 81,
            weight7dma: 81,
            calories: 2100,
            steps: 7000,
            exerciseType: null,
            exerciseMinutes: null,
          },
          {
            date: '2026-05-14',
            weight: 80,
            weight7dma: 79.5,
            calories: 1900,
            steps: 9000,
            exerciseType: 'Walking',
            exerciseMinutes: 40,
          },
        ],
        stepTrend: [
          {
            date: '2026-05-13',
            weight: 81,
            weight7dma: 81,
            calories: 2100,
            steps: 7000,
            exerciseType: null,
            exerciseMinutes: null,
          },
          {
            date: '2026-05-14',
            weight: 80,
            weight7dma: 79.5,
            calories: 1900,
            steps: 9000,
            exerciseType: 'Walking',
            exerciseMinutes: 40,
          },
        ],
      },
      calorieDelta: 0,
      stepDelta: 0,
      goalDistance: 8,
      targetsConfigured: true,
    })
  })

  it('composes all grouped sections and marks targets as incomplete when settings are blank', () => {
    const state = createState()
    state.settings = {
      startWeight: '',
      goalWeight: '',
      dailyCalorieTarget: '',
      dailyStepTarget: '',
    }

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
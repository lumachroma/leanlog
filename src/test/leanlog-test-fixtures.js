import { vi } from 'vitest'

export function createSampleSettings(overrides = {}) {
  return {
    startWeight: '85',
    goalWeight: '72',
    dailyCalorieTarget: '2000',
    dailyStepTarget: '8000',
    ...overrides,
  }
}

export function createSampleEntry(overrides = {}) {
  return {
    date: '2026-05-14',
    weight: '80',
    weight7dma: 79.5,
    calories: '1900',
    steps: '9000',
    exerciseType: 'Walking',
    exerciseMinutes: '40',
    ...overrides,
  }
}

export function createSecondarySampleEntry(overrides = {}) {
  return {
    date: '2026-05-13',
    weight: '81',
    weight7dma: 81,
    calories: '2100',
    steps: '7000',
    exerciseType: '',
    exerciseMinutes: '',
    ...overrides,
  }
}

export function createSampleEntries() {
  return [createSampleEntry(), createSecondarySampleEntry()]
}

export function createSampleEntryDraft(overrides = {}) {
  return {
    date: '2026-05-14',
    weight: '80',
    weight7dma: 79.5,
    calories: '1900',
    steps: '9000',
    exerciseType: 'Walking',
    exerciseMinutes: '40',
    ...overrides,
  }
}

export function createBlankEntryDraft(overrides = {}) {
  return createSampleEntryDraft({
    weight: '',
    weight7dma: null,
    calories: '',
    steps: '',
    exerciseType: '',
    exerciseMinutes: '',
    ...overrides,
  })
}

export function createSampleMetrics(overrides = {}) {
  return {
    latestWeight: 80,
    latestWeight7dma: 79.5,
    weightDelta: -5,
    goalProgressPercent: 38,
    calorieAverage: 2000,
    stepAverage: 8000,
    activeDays: 2,
    exerciseDays: 1,
    ...overrides,
  }
}

export function createSampleChartSeries() {
  return {
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
  }
}

export function createSampleWeeklyAverageCards() {
  return [
    {
      periodKey: '2026-05-11',
      label: 'Week of May 11, 2026',
      daysLogged: 2,
      exerciseDays: 1,
      weightAverage: 80.5,
      calorieAverage: 2000,
      stepAverage: 8000,
    },
  ]
}

export function createSampleMonthlyAverageCards() {
  return [
    {
      periodKey: '2026-05',
      label: 'May 2026',
      daysLogged: 2,
      exerciseDays: 1,
      weightAverage: 80.5,
      calorieAverage: 2000,
      stepAverage: 8000,
    },
  ]
}

export function createSampleStoreActions() {
  return {
    hydrateApp: vi.fn(),
    updateSettingsField: vi.fn(),
    saveSettings: vi.fn(),
    setSelectedDate: vi.fn(),
    updateEntryDraftField: vi.fn(),
    saveEntry: vi.fn(),
    deleteEntry: vi.fn(),
  }
}

export function createSampleStoreState(overrides = {}) {
  return {
    settings: createSampleSettings(),
    entries: createSampleEntries(),
    selectedDate: '2026-05-14',
    entryDraft: createSampleEntryDraft(),
    isHydrated: true,
    isSavingSettings: false,
    isSavingEntry: false,
    errorMessage: null,
    ...createSampleStoreActions(),
    ...overrides,
  }
}

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
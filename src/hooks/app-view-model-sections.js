import {
  getChartSeries,
  getDashboardMetrics,
  getGoalDistance,
  getMonthlyAverageCards,
  getNumericSettings,
  getTargetDelta,
  getWeeklyAverageCards,
} from '@/lib/metrics'

const hasValue = (value) => String(value ?? '').trim().length > 0

export function createLifecycleViewModel(state) {
  return {
    isHydrated: state.isHydrated,
    errorMessage: state.errorMessage,
    hydrateApp: state.hydrateApp,
  }
}

export function createSettingsViewModel(state) {
  return {
    settings: state.settings,
    isSavingSettings: state.isSavingSettings,
    updateSettingsField: state.updateSettingsField,
    saveSettings: state.saveSettings,
  }
}

export function createHistoryViewModel(state) {
  return {
    entries: state.entries,
    selectedDate: state.selectedDate,
    entryDraft: state.entryDraft,
    isSavingEntry: state.isSavingEntry,
    setSelectedDate: state.setSelectedDate,
    updateEntryDraftField: state.updateEntryDraftField,
    replaceEntryDraft: state.replaceEntryDraft,
    saveEntry: state.saveEntry,
    deleteEntry: state.deleteEntry,
    importEntriesFromCsv: state.importEntriesFromCsv,
  }
}

export function createAveragesViewModel(state) {
  return {
    weeklyAverageCards: getWeeklyAverageCards(state.entries),
    monthlyAverageCards: getMonthlyAverageCards(state.entries),
  }
}

export function createDashboardViewModel(state) {
  const metrics = getDashboardMetrics(state.entries, state.settings)
  const chartSeries = getChartSeries(state.entries)
  const { goalWeight, dailyCalorieTarget, dailyStepTarget } = getNumericSettings(
    state.settings
  )

  return {
    settings: state.settings,
    metrics,
    chartSeries,
    calorieDelta: getTargetDelta(metrics.calorieAverage, dailyCalorieTarget),
    stepDelta: getTargetDelta(metrics.stepAverage, dailyStepTarget),
    goalDistance: getGoalDistance(metrics.latestWeight, goalWeight),
    targetsConfigured: [
      state.settings.startWeight,
      state.settings.goalWeight,
      state.settings.dailyCalorieTarget,
      state.settings.dailyStepTarget,
    ].every(hasValue),
  }
}

export function createAppViewModel(state) {
  return {
    lifecycle: createLifecycleViewModel(state),
    settingsView: createSettingsViewModel(state),
    historyView: createHistoryViewModel(state),
    averagesView: createAveragesViewModel(state),
    dashboardView: createDashboardViewModel(state),
  }
}
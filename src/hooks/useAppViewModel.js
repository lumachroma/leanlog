import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import {
  getChartSeries,
  getDashboardMetrics,
  getGoalDistance,
  getMonthlyAverageCards,
  getNumericSettings,
  getTargetDelta,
  getWeeklyAverageCards,
} from '@/lib/metrics'
import { selectAppViewModelState, useAppStore } from '@/store/useAppStore'

export function useAppViewModel() {
  const {
    hydrateApp,
    settings,
    entries,
    selectedDate,
    entryDraft,
    isHydrated,
    isSavingSettings,
    isSavingEntry,
    errorMessage,
    updateSettingsField,
    saveSettings,
    setSelectedDate,
    updateEntryDraftField,
    saveEntry,
    deleteEntry,
  } = useAppStore(useShallow(selectAppViewModelState))

  useEffect(() => {
    void hydrateApp()
  }, [hydrateApp])

  const metrics = getDashboardMetrics(entries, settings)
  const weeklyAverageCards = getWeeklyAverageCards(entries)
  const monthlyAverageCards = getMonthlyAverageCards(entries)
  const chartSeries = getChartSeries(entries)
  const { goalWeight, dailyCalorieTarget, dailyStepTarget } = getNumericSettings(settings)
  const calorieDelta = getTargetDelta(metrics.calorieAverage, dailyCalorieTarget)
  const stepDelta = getTargetDelta(metrics.stepAverage, dailyStepTarget)
  const goalDistance = getGoalDistance(metrics.latestWeight, goalWeight)

  return {
    settings,
    entries,
    selectedDate,
    entryDraft,
    isHydrated,
    isSavingSettings,
    isSavingEntry,
    errorMessage,
    metrics,
    weeklyAverageCards,
    monthlyAverageCards,
    chartSeries,
    calorieDelta,
    stepDelta,
    goalDistance,
    updateSettingsField,
    saveSettings,
    setSelectedDate,
    updateEntryDraftField,
    saveEntry,
    deleteEntry,
  }
}
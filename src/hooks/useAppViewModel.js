import { useEffect } from 'react'

import {
  getChartSeries,
  getDashboardMetrics,
  getMonthlyAverageCards,
  getWeeklyAverageCards,
  toNumber,
} from '@/lib/metrics'
import { useAppStore } from '@/store/useAppStore'

export function useAppViewModel() {
  const hydrateApp = useAppStore((state) => state.hydrateApp)
  const settings = useAppStore((state) => state.settings)
  const entries = useAppStore((state) => state.entries)
  const selectedDate = useAppStore((state) => state.selectedDate)
  const entryDraft = useAppStore((state) => state.entryDraft)
  const isHydrated = useAppStore((state) => state.isHydrated)
  const isSavingSettings = useAppStore((state) => state.isSavingSettings)
  const isSavingEntry = useAppStore((state) => state.isSavingEntry)
  const errorMessage = useAppStore((state) => state.errorMessage)
  const updateSettingsField = useAppStore((state) => state.updateSettingsField)
  const saveSettings = useAppStore((state) => state.saveSettings)
  const setSelectedDate = useAppStore((state) => state.setSelectedDate)
  const updateEntryDraftField = useAppStore((state) => state.updateEntryDraftField)
  const saveEntry = useAppStore((state) => state.saveEntry)
  const deleteEntry = useAppStore((state) => state.deleteEntry)

  useEffect(() => {
    void hydrateApp()
  }, [hydrateApp])

  const metrics = getDashboardMetrics(entries, settings)
  const weeklyAverageCards = getWeeklyAverageCards(entries)
  const monthlyAverageCards = getMonthlyAverageCards(entries)
  const chartSeries = getChartSeries(entries)
  const goalWeight = toNumber(settings.goalWeight)

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
    goalDistance:
      metrics.latestWeight !== null && goalWeight !== null
        ? Math.abs(metrics.latestWeight - goalWeight)
        : null,
    updateSettingsField,
    saveSettings,
    setSelectedDate,
    updateEntryDraftField,
    saveEntry,
    deleteEntry,
  }
}
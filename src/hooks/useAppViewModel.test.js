import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createSampleStoreState } from '@/test/leanlog-test-fixtures'

const mockUseAppStore = vi.fn()

vi.mock('@/store/useAppStore', () => ({
  useAppStore: (selector) => mockUseAppStore(selector),
  selectAppViewModelState: (state) => state,
}))

describe('useAppViewModel', () => {
  let storeState

  beforeEach(() => {
    storeState = createSampleStoreState()

    mockUseAppStore.mockImplementation((selector) => selector(storeState))
  })

  it('hydrates on mount and exposes derived dashboard values', async () => {
    const { useAppViewModel } = await import('./useAppViewModel')
    const { result } = renderHook(() => useAppViewModel())

    await waitFor(() => {
      expect(storeState.hydrateApp).toHaveBeenCalledTimes(1)
    })

    expect(result.current.dashboardView.metrics.latestWeight).toBe(80)
    expect(result.current.dashboardView.metrics.latestWeight7dma).toBe(79.5)
    expect(result.current.dashboardView.metrics.weightDelta).toBe(-5)
    expect(result.current.dashboardView.metrics.goalProgressPercent).toBe(38)
    expect(result.current.dashboardView.goalDistance).toBe(8)
    expect(result.current.averagesView.weeklyAverageCards).toHaveLength(1)
    expect(result.current.averagesView.weeklyAverageCards[0].daysLogged).toBe(2)
    expect(result.current.averagesView.monthlyAverageCards).toHaveLength(1)
    expect(result.current.averagesView.monthlyAverageCards[0].daysLogged).toBe(2)
    expect(result.current.dashboardView.chartSeries.weightTrend).toEqual([
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
    ])
    expect(result.current.dashboardView.chartSeries.calorieTrend).toHaveLength(2)
    expect(result.current.dashboardView.chartSeries.stepTrend).toHaveLength(2)
  })

  it('passes through the store actions and current drafts', async () => {
    const { useAppViewModel } = await import('./useAppViewModel')
    const { result } = renderHook(() => useAppViewModel())

    expect(result.current.settingsView.settings).toEqual(storeState.settings)
    expect(result.current.historyView.selectedDate).toBe('2026-05-14')
    expect(result.current.historyView.entryDraft).toEqual(storeState.entryDraft)
    expect(result.current.settingsView.saveSettings).toBe(storeState.saveSettings)
    expect(result.current.settingsView.updateSettingsField).toBe(
      storeState.updateSettingsField
    )
    expect(result.current.historyView.entries).toEqual(storeState.entries)
    expect(result.current.historyView.saveEntry).toBe(storeState.saveEntry)
    expect(result.current.historyView.deleteEntry).toBe(storeState.deleteEntry)
    expect(result.current.historyView.importEntriesFromCsv).toBe(
      storeState.importEntriesFromCsv
    )
    expect(result.current.historyView.updateEntryDraftField).toBe(
      storeState.updateEntryDraftField
    )
  })
})
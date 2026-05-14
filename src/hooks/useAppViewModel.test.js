import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAppStore = vi.fn()

vi.mock('@/store/useAppStore', () => ({
  useAppStore: (selector) => mockUseAppStore(selector),
}))

describe('useAppViewModel', () => {
  let storeState

  beforeEach(() => {
    storeState = {
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
          calories: '1900',
          steps: '9000',
          exerciseType: 'Walking',
          exerciseMinutes: '40',
        },
        {
          date: '2026-05-13',
          weight: '81',
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
    }

    mockUseAppStore.mockImplementation((selector) => selector(storeState))
  })

  it('hydrates on mount and exposes derived dashboard values', async () => {
    const { useAppViewModel } = await import('./useAppViewModel')
    const { result } = renderHook(() => useAppViewModel())

    await waitFor(() => {
      expect(storeState.hydrateApp).toHaveBeenCalledTimes(1)
    })

    expect(result.current.metrics.latestWeight).toBe(80)
    expect(result.current.metrics.weightDelta).toBe(-5)
    expect(result.current.metrics.goalProgressPercent).toBe(38)
    expect(result.current.calorieDelta).toBe(0)
    expect(result.current.stepDelta).toBe(0)
    expect(result.current.goalDistance).toBe(8)
    expect(result.current.monthlyCards).toHaveLength(1)
    expect(result.current.monthlyCards[0].daysLogged).toBe(2)
    expect(result.current.chartSeries.weightTrend).toEqual([
      {
        date: '2026-05-13',
        weight: 81,
        calories: 2100,
        steps: 7000,
        exerciseType: null,
        exerciseMinutes: null,
      },
      {
        date: '2026-05-14',
        weight: 80,
        calories: 1900,
        steps: 9000,
        exerciseType: 'Walking',
        exerciseMinutes: 40,
      },
    ])
    expect(result.current.chartSeries.calorieTrend).toHaveLength(2)
    expect(result.current.chartSeries.stepTrend).toHaveLength(2)
  })

  it('passes through the store actions and current drafts', async () => {
    const { useAppViewModel } = await import('./useAppViewModel')
    const { result } = renderHook(() => useAppViewModel())

    expect(result.current.settings).toEqual(storeState.settings)
    expect(result.current.selectedDate).toBe('2026-05-14')
    expect(result.current.entryDraft).toEqual(storeState.entryDraft)
    expect(result.current.saveSettings).toBe(storeState.saveSettings)
    expect(result.current.updateSettingsField).toBe(storeState.updateSettingsField)
    expect(result.current.entries).toEqual(storeState.entries)
    expect(result.current.saveEntry).toBe(storeState.saveEntry)
    expect(result.current.deleteEntry).toBe(storeState.deleteEntry)
    expect(result.current.updateEntryDraftField).toBe(storeState.updateEntryDraftField)
  })
})
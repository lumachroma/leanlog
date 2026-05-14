import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUseAppViewModel = vi.fn()

vi.mock('@/hooks/useAppViewModel', () => ({
  useAppViewModel: () => mockUseAppViewModel(),
}))

import App from './App'

describe('App', () => {
  const baseViewModel = {
    settings: {
      startWeight: '85',
      goalWeight: '72',
      dailyCalorieTarget: '2000',
      dailyStepTarget: '8000',
    },
    selectedDate: '2026-05-14',
    entryDraft: {
      date: '2026-05-14',
      weight: '80',
      calories: '1900',
      steps: '9000',
      exercise: 'Incline walk',
    },
    isHydrated: true,
    isSavingSettings: false,
    isSavingEntry: false,
    errorMessage: null,
    metrics: {
      latestWeight: 80,
      weightDelta: -5,
      calorieAverage: 2000,
      stepAverage: 8000,
      activeDays: 2,
      exerciseDays: 1,
    },
    monthlyCards: [
      {
        monthKey: '2026-05',
        label: 'May 2026',
        daysLogged: 2,
        exerciseDays: 1,
        latestWeight: 80,
        calorieAverage: 2000,
        stepAverage: 8000,
      },
    ],
    chartSeries: {
      weightTrend: [{ date: '2026-05-14', weight: 80 }],
      calorieTrend: [{ date: '2026-05-14', calories: 1900 }],
      stepTrend: [{ date: '2026-05-14', steps: 9000 }],
    },
    calorieDelta: 0,
    stepDelta: 0,
    goalDistance: 8,
    updateSettingsField: vi.fn(),
    saveSettings: vi.fn(),
    setSelectedDate: vi.fn(),
    updateEntryDraftField: vi.fn(),
    saveEntry: vi.fn(),
  }

  beforeEach(() => {
    mockUseAppViewModel.mockReturnValue(baseViewModel)
  })

  it('shows the loading state before hydration completes', () => {
    mockUseAppViewModel.mockReturnValue({
      ...baseViewModel,
      isHydrated: false,
    })

    render(<App />)

    expect(screen.getByText(/loading your local dashboard/i)).toBeInTheDocument()
  })

  it('renders the header, error state, and primary panels when hydrated', () => {
    mockUseAppViewModel.mockReturnValue({
      ...baseViewModel,
      errorMessage: 'Unable to load your local data.',
    })

    render(<App />)

    expect(screen.getByText(/calm daily tracking, stored locally first/i)).toBeInTheDocument()
    expect(screen.getByText(/unable to load your local data/i)).toBeInTheDocument()
    expect(screen.getByText(/one month at a glance/i)).toBeInTheDocument()
    expect(screen.getByText(/initial targets/i)).toBeInTheDocument()
    expect(screen.getByText(/one focused entry per day/i)).toBeInTheDocument()
  })
})
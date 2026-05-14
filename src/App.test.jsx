import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    entries: [
      {
        date: '2026-05-14',
        weight: '80',
        calories: '1900',
        steps: '9000',
        exercise: 'Incline walk',
      },
    ],
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
    deleteEntry: vi.fn(),
  }

  beforeEach(() => {
    window.localStorage.clear()
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
    expect(screen.queryByText(/initial targets/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/one focused entry per day/i)).not.toBeInTheDocument()
  })

  it('switches to the history page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /history/i }))

    expect(screen.getByText(/review and edit saved days/i)).toBeInTheDocument()
    expect(screen.getByText(/^edit saved day$/i)).toBeInTheDocument()
    expect(screen.getByText(/thu, may 14, 2026/i)).toBeInTheDocument()
  })

  it('switches to the settings page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /settings/i }))

    expect(screen.getByText(/personal targets and defaults/i)).toBeInTheDocument()
    expect(screen.getByText(/initial targets/i)).toBeInTheDocument()
    expect(screen.queryByText(/one month at a glance/i)).not.toBeInTheDocument()
  })

  it('restores the last active page from local storage', () => {
    window.localStorage.setItem('leanlog.active-page', 'settings')

    render(<App />)

    expect(screen.getByText(/personal targets and defaults/i)).toBeInTheDocument()
    expect(screen.queryByText(/one month at a glance/i)).not.toBeInTheDocument()
  })

  it('shows a dashboard CTA when targets are missing and opens settings from it', async () => {
    const user = userEvent.setup()

    mockUseAppViewModel.mockReturnValue({
      ...baseViewModel,
      settings: {
        startWeight: '',
        goalWeight: '',
        dailyCalorieTarget: '',
        dailyStepTarget: '',
      },
    })

    render(<App />)

    expect(screen.getByText(/add your targets to make the dashboard more useful/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open settings/i }))

    expect(screen.getByText(/personal targets and defaults/i)).toBeInTheDocument()
  })
})
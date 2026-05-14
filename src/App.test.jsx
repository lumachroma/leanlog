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
        weight7dma: 79.5,
        calories: '1900',
        steps: '9000',
        exerciseType: 'Walking',
        exerciseMinutes: '40',
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
    weeklyAverageCards: [
      {
        periodKey: '2026-05-11',
        label: 'Week of May 11, 2026',
        daysLogged: 2,
        exerciseDays: 1,
        weightAverage: 80,
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
        weightAverage: 80,
        calorieAverage: 2000,
        stepAverage: 8000,
      },
    ],
    chartSeries: {
      weightTrend: [{ date: '2026-05-14', weight: 80, weight7dma: 79.5 }],
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
      chartSeries: {
        ...baseViewModel.chartSeries,
        weightTrend: [
          { date: '2026-05-13', weight: 81, weight7dma: 81 },
          { date: '2026-05-14', weight: 80, weight7dma: 79.5 },
        ],
      },
    })

    render(<App />)

    expect(screen.getByText(/a calm fat-loss system built for real life/i)).toBeInTheDocument()
    expect(
      screen.getByText(/leanlog is a calm, local-first weight loss tracker built for fast daily logging and lightweight progress review/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/unable to load your local data/i)).toBeInTheDocument()
    expect(screen.getByText(/avg calories/i)).toBeInTheDocument()
    expect(screen.getByText(/avg steps/i)).toBeInTheDocument()
    expect(screen.getByText(/^7dma$/i)).toBeInTheDocument()
    expect(screen.getByText(/goal progress %/i)).toBeInTheDocument()
    expect(screen.getByText(/weight trend chart/i)).toBeInTheDocument()
    expect(screen.getByText(/real-life weight, with calm built in/i)).toBeInTheDocument()
    expect(screen.queryByText(/initial targets/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/one focused entry per day/i)).not.toBeInTheDocument()
  })

  it('switches to the weekly averages page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /weekly avg/i }))

    expect(screen.getByText(/weekly calories, steps, and weight averages/i)).toBeInTheDocument()
    expect(screen.getByText(/week of may 11, 2026/i)).toBeInTheDocument()
  })

  it('switches to the monthly averages page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /monthly avg/i }))

    expect(screen.getByText(/monthly calories, steps, and weight averages/i)).toBeInTheDocument()
    expect(screen.getByText(/^may 2026$/i)).toBeInTheDocument()
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
    expect(screen.queryByText(/weekly calories, steps, and weight averages/i)).not.toBeInTheDocument()
  })

  it('restores the last active page from local storage', () => {
    window.localStorage.setItem('leanlog.active-page', 'monthly-averages')

    render(<App />)

    expect(screen.getByText(/monthly calories, steps, and weight averages/i)).toBeInTheDocument()
    expect(screen.queryByText(/^7dma$/i)).not.toBeInTheDocument()
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
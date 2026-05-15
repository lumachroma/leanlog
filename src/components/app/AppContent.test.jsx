import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/app/DashboardSection', () => ({
  DashboardSection: ({ onOpenSettings, targetsConfigured }) => (
    <div>
      <p>Dashboard section</p>
      <p>{targetsConfigured ? 'Targets configured' : 'Targets missing'}</p>
      <button type="button" onClick={onOpenSettings}>
        Open dashboard settings
      </button>
    </div>
  ),
}))

import { AppContent } from './AppContent'

const createProps = () => ({
  averagesView: {
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
  },
  dashboardView: {
    settings: {
      startWeight: '85',
      goalWeight: '72',
      dailyCalorieTarget: '2000',
      dailyStepTarget: '8000',
    },
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
      weightTrend: [{ date: '2026-05-14', weight: 80, weight7dma: 79.5 }],
      calorieTrend: [{ date: '2026-05-14', calories: 1900 }],
      stepTrend: [{ date: '2026-05-14', steps: 9000 }],
    },
    calorieDelta: 0,
    stepDelta: 0,
    goalDistance: 8,
    targetsConfigured: true,
  },
  historyView: {
    entries: [
      {
        date: '2026-05-14',
        weight: '80',
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
      calories: '1900',
      steps: '9000',
      exerciseType: 'Walking',
      exerciseMinutes: '40',
    },
    isSavingEntry: false,
    setSelectedDate: vi.fn(),
    updateEntryDraftField: vi.fn(),
    saveEntry: vi.fn(),
    deleteEntry: vi.fn(),
  },
  onOpenSettings: vi.fn(),
  settingsView: {
    settings: {
      startWeight: '85',
      goalWeight: '72',
      dailyCalorieTarget: '2000',
      dailyStepTarget: '8000',
    },
    isSavingSettings: false,
    updateSettingsField: vi.fn(),
    saveSettings: vi.fn(),
  },
})

describe('AppContent', () => {
  it('renders the dashboard branch and routes the settings callback', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<AppContent {...props} activePage="dashboard" />)

    expect(await screen.findByText(/dashboard section/i)).toBeInTheDocument()
    expect(screen.getByText(/targets configured/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open dashboard settings/i }))

    expect(props.onOpenSettings).toHaveBeenCalledTimes(1)
  })

  it('renders the history branch', () => {
    render(<AppContent {...createProps()} activePage="history" />)

    expect(screen.getByText(/review and edit saved days/i)).toBeInTheDocument()
  })

  it('renders the weekly averages branch', () => {
    render(<AppContent {...createProps()} activePage="weekly-averages" />)

    expect(screen.getByText(/weekly calories, steps, and weight averages/i)).toBeInTheDocument()
  })

  it('renders the monthly averages branch', () => {
    render(<AppContent {...createProps()} activePage="monthly-averages" />)

    expect(screen.getByText(/monthly calories, steps, and weight averages/i)).toBeInTheDocument()
  })

  it('renders the settings branch', () => {
    render(<AppContent {...createProps()} activePage="settings" />)

    expect(screen.getByText(/personal targets and defaults/i)).toBeInTheDocument()
  })
})
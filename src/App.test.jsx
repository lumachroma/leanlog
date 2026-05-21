import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createSampleAppViewModel } from '@/test/leanlog-test-fixtures'

const mockUseAppViewModel = vi.fn()
const mockUpdateServiceWorker = vi.fn()
const mockRegisterSW = vi.fn()
let registerSwOptions

vi.mock('@/hooks/useAppViewModel', () => ({
  useAppViewModel: () => mockUseAppViewModel(),
}))

vi.mock('virtual:pwa-register', () => ({
  registerSW: (options) => mockRegisterSW(options),
}))

import App from './App'

describe('App', () => {
  const baseViewModel = createSampleAppViewModel()

  beforeEach(() => {
    window.localStorage.clear()
    registerSwOptions = undefined
    mockUpdateServiceWorker.mockReset()
    mockRegisterSW.mockReset()
    mockRegisterSW.mockImplementation((options) => {
      registerSwOptions = options
      return mockUpdateServiceWorker
    })
    mockUseAppViewModel.mockReturnValue(baseViewModel)
  })

  it('shows the loading state before hydration completes', () => {
    mockUseAppViewModel.mockReturnValue({
      ...baseViewModel,
      lifecycle: {
        ...baseViewModel.lifecycle,
        isHydrated: false,
      },
    })

    render(<App />)

    expect(screen.getByText(/loading your local dashboard/i)).toBeInTheDocument()
  })

  it('renders the header, error state, and primary panels when hydrated', async () => {
    mockUseAppViewModel.mockReturnValue({
      ...baseViewModel,
      lifecycle: {
        ...baseViewModel.lifecycle,
        errorMessage: 'Unable to load your local data.',
      },
      dashboardView: {
        ...baseViewModel.dashboardView,
        chartSeries: {
          ...baseViewModel.dashboardView.chartSeries,
          weightTrend: [
            { date: '2026-05-13', weight: 81, weight7dma: 81 },
            { date: '2026-05-14', weight: 80, weight7dma: 79.5 },
          ],
        },
      },
    })

    render(<App />)

    expect(screen.getByRole('img', { name: /leanlog logo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByText(/^leanlog$/i)).toBeInTheDocument()
    expect(screen.getByText(/calm local-first weight-loss tracking/i)).toBeInTheDocument()
    expect(screen.getByText(/unable to load your local data/i)).toBeInTheDocument()
    expect(await screen.findByText(/avg calories/i)).toBeInTheDocument()
    expect(await screen.findByText(/avg steps/i)).toBeInTheDocument()
    expect(await screen.findByText(/7-day moving average/i)).toBeInTheDocument()
    expect(await screen.findByText(/goal progress %/i)).toBeInTheDocument()
    expect(await screen.findByText(/today's snapshot/i)).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /^weight trend$/i })).toBeInTheDocument()
    expect(await screen.findByText(/daily consistency/i)).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /progress toward your goal/i })
    ).toBeInTheDocument()
    expect(screen.queryByText(/tracking defaults/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/one focused entry per day/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/a personal weight-loss operating system built for real life/i)
    ).not.toBeInTheDocument()
  })

  it('switches to the averages page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /averages/i }))

    expect(screen.getByText(/weekly trends/i)).toBeInTheDocument()
    expect(screen.getByText(/week of may 11, 2026/i)).toBeInTheDocument()
  })

  it('switches to the monthly averages page from the averages page controls', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /averages/i }))
    await user.click(screen.getByRole('button', { name: /monthly/i }))

    expect(screen.getByText(/monthly trends/i)).toBeInTheDocument()
    expect(screen.getByText(/^may 2026$/i)).toBeInTheDocument()
  })

  it('switches to the history page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /history/i }))

    expect(screen.getByText(/daily timeline/i)).toBeInTheDocument()
    expect(screen.getByText(/^edit entry$/i)).toBeInTheDocument()
    expect(screen.getByText(/thu, may 14, 2026/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )

    await user.click(screen.getByRole('button', { name: /go to dashboard/i }))

    expect(await screen.findByText(/today's snapshot/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('switches to the settings page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /settings/i }))

    expect(screen.getByText(/personal targets/i)).toBeInTheDocument()
    expect(screen.getByText(/tracking defaults/i)).toBeInTheDocument()
    expect(screen.queryByText(/weekly trends/i)).not.toBeInTheDocument()
  })

  it('switches to the about page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /about/i }))

    expect(
      screen.getByRole('heading', {
        name: /a personal weight-loss operating system built for real life/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /review targets/i })).toBeInTheDocument()
    expect(screen.queryByText(/today's snapshot/i)).not.toBeInTheDocument()
  })

  it('restores the last active page from local storage', () => {
    window.localStorage.setItem('leanlog.active-page', 'about')

    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /a personal weight-loss operating system built for real life/i,
      })
    ).toBeInTheDocument()
    expect(screen.queryByText(/7-day moving average/i)).not.toBeInTheDocument()
  })

  it('shows a dashboard CTA when targets are missing and opens settings from it', async () => {
    const user = userEvent.setup()

    mockUseAppViewModel.mockReturnValue({
      ...baseViewModel,
      settingsView: {
        ...baseViewModel.settingsView,
        settings: {
          startWeight: '',
          goalWeight: '',
          dailyCalorieTarget: '',
          dailyStepTarget: '',
        },
      },
      dashboardView: {
        ...baseViewModel.dashboardView,
        settings: {
          startWeight: '',
          goalWeight: '',
          dailyCalorieTarget: '',
          dailyStepTarget: '',
        },
        targetsConfigured: false,
      },
    })

    render(<App />)

    expect(
      await screen.findByText(/add your targets to make the dashboard more useful/i)
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open settings/i }))

    expect(screen.getByText(/personal targets/i)).toBeInTheDocument()
  })

  it('shows an update prompt when a new service worker is ready', async () => {
    const user = userEvent.setup()

    render(<App />)

    await act(async () => {
      registerSwOptions.onNeedRefresh()
    })

    expect(screen.getByText(/app update ready/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /refresh now/i }))

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true)
  })

  it('shows an offline-ready toast when the app shell has been cached', async () => {
    const user = userEvent.setup()

    render(<App />)

    await act(async () => {
      registerSwOptions.onOfflineReady()
    })

    expect(screen.getByText(/offline ready/i)).toBeInTheDocument()
    expect(
      screen.getByText(/leanlog is cached and ready for faster repeat loads and basic offline use/i)
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /dismiss/i }))

    expect(screen.queryByText(/offline ready/i)).not.toBeInTheDocument()
  })
})
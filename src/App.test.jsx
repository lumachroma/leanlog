import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
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

vi.mock('@/components/app/DashboardSection', async () => {
  const { DashboardSectionTestDouble } = await import('@/test/dashboard-section-test-double')

  return {
    DashboardSection: DashboardSectionTestDouble,
  }
})

import App from './App'

async function waitForDashboardPanelsToLoad() {
  const loadingState = screen.queryByText(/loading dashboard panels/i)

  if (!loadingState) {
    return
  }

  await waitForElementToBeRemoved(loadingState)
}

function mockMatchMedia(matcher) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: matcher(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function mockNavigatorStandalone(value) {
  Object.defineProperty(window.navigator, 'standalone', {
    configurable: true,
    writable: true,
    value,
  })
}

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
    mockMatchMedia(() => false)
    mockNavigatorStandalone(false)
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

    await waitForDashboardPanelsToLoad()

    expect(screen.getByRole('img', { name: /^LeanLog logo$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByText(/^LeanLog$/)).toBeInTheDocument()
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
    expect(screen.queryByRole('button', { name: /review targets/i })).not.toBeInTheDocument()
  })

  it('switches to the averages page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /averages/i }))

    expect(await screen.findByText(/weekly trends/i)).toBeInTheDocument()
    expect(await screen.findByText(/week of may 11, 2026/i)).toBeInTheDocument()
  })

  it('switches to the monthly averages page from the averages page controls', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /averages/i }))
    await user.click(await screen.findByRole('button', { name: /monthly/i }))

    expect(await screen.findByText(/monthly trends/i)).toBeInTheDocument()
    expect(await screen.findByText(/^may 2026$/i)).toBeInTheDocument()
  })

  it('switches to the history page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /history/i }))

    expect(await screen.findByText(/daily timeline/i)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /new entry/i })).toBeInTheDocument()
    expect(await screen.findByText(/thu, may 14, 2026/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )

    await user.click(screen.getByRole('button', { name: /go to dashboard/i }))

    await waitForDashboardPanelsToLoad()

    expect(await screen.findByText(/today's snapshot/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to dashboard/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('switches to the settings page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /^settings$/i }))

    expect(await screen.findByText(/personal targets/i)).toBeInTheDocument()
    expect(await screen.findByText(/manage your setup/i)).toBeInTheDocument()
    expect(screen.queryByText(/weekly trends/i)).not.toBeInTheDocument()
  })

  it('switches to the about page from the header navigation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /about/i }))

    expect(
      await screen.findByRole('heading', {
        name: /calm local-first weight-loss tracking/i,
      })
    ).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /review targets/i })).toBeInTheDocument()
    expect(screen.queryByText(/today's snapshot/i)).not.toBeInTheDocument()
  })

  it('restores the last active page from local storage', async () => {
    window.localStorage.setItem('leanlog.active-page', 'about')

    render(<App />)

    expect(
      await screen.findByRole('heading', {
        name: /calm local-first weight-loss tracking/i,
      })
    ).toBeInTheDocument()
    expect(screen.queryByText(/today's snapshot/i)).not.toBeInTheDocument()
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

    await waitForDashboardPanelsToLoad()

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

  it('auto-applies a ready update in Android standalone display mode', async () => {
    mockMatchMedia((query) => query === '(display-mode: standalone)')

    render(<App />)

    await act(async () => {
      registerSwOptions.onNeedRefresh()
    })

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true)
    expect(screen.queryByText(/app update ready/i)).not.toBeInTheDocument()
  })

  it('auto-applies a ready update in iOS home-screen standalone mode', async () => {
    mockNavigatorStandalone(true)

    render(<App />)

    await act(async () => {
      registerSwOptions.onNeedRefresh()
    })

    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true)
    expect(screen.queryByText(/app update ready/i)).not.toBeInTheDocument()
  })

  it('shows an offline-ready toast when the app shell has been cached', async () => {
    const user = userEvent.setup()

    render(<App />)

    await act(async () => {
      registerSwOptions.onOfflineReady()
    })

    expect(screen.getByText(/offline ready/i)).toBeInTheDocument()
    expect(
      screen.getByText(/LeanLog is cached and ready for faster repeat loads and basic offline use/i)
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /dismiss/i }))

    expect(screen.queryByText(/offline ready/i)).not.toBeInTheDocument()
  })
})
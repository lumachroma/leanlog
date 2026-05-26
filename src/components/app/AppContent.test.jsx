import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createSampleAppViewModel } from '@/test/leanlog-test-fixtures'

const LAZY_PAGE_TIMEOUT_MS = 4000

vi.mock('@/components/app/DashboardSection', async () => {
  const { DashboardSectionTestDouble } = await import('@/test/dashboard-section-test-double')

  return {
    DashboardSection: DashboardSectionTestDouble,
  }
})

import { AppContent } from './AppContent'

const createProps = () => ({
  averagesView: createSampleAppViewModel().averagesView,
  dashboardView: createSampleAppViewModel().dashboardView,
  historyView: createSampleAppViewModel().historyView,
  onOpenSettings: vi.fn(),
  onPageChange: vi.fn(),
  settingsView: createSampleAppViewModel().settingsView,
})

describe('AppContent', () => {
  it('renders the dashboard branch and routes the settings callback', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<AppContent {...props} activePage="dashboard" />)

    expect(
      await screen.findByText(/dashboard section/i, {}, { timeout: LAZY_PAGE_TIMEOUT_MS })
    ).toBeInTheDocument()
    expect(screen.getByText(/targets configured/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open dashboard settings/i }))

    expect(props.onOpenSettings).toHaveBeenCalledTimes(1)
  })

  it('renders the history branch', async () => {
    render(<AppContent {...createProps()} activePage="history" />)

    expect(
      await screen.findByText(/daily timeline/i, {}, { timeout: LAZY_PAGE_TIMEOUT_MS })
    ).toBeInTheDocument()
  })

  it('renders the weekly averages branch', async () => {
    render(<AppContent {...createProps()} activePage="weekly-averages" />)

    expect(
      await screen.findByText(/weekly trends/i, {}, { timeout: LAZY_PAGE_TIMEOUT_MS })
    ).toBeInTheDocument()
  })

  it('renders the monthly averages branch', async () => {
    render(<AppContent {...createProps()} activePage="monthly-averages" />)

    expect(
      await screen.findByText(/monthly trends/i, {}, { timeout: LAZY_PAGE_TIMEOUT_MS })
    ).toBeInTheDocument()
  })

  it('switches average periods from the averages page controls', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<AppContent {...props} activePage="weekly-averages" />)

    await user.click(
      await screen.findByRole('button', { name: /monthly/i }, { timeout: LAZY_PAGE_TIMEOUT_MS })
    )

    expect(props.onPageChange).toHaveBeenCalledWith('monthly-averages')
  })

  it('renders the settings branch', async () => {
    render(<AppContent {...createProps()} activePage="settings" />)

    expect(
      await screen.findByText(/personal targets/i, {}, { timeout: LAZY_PAGE_TIMEOUT_MS })
    ).toBeInTheDocument()
  })

  it('renders the about branch', async () => {
    render(<AppContent {...createProps()} activePage="about" />)

    expect(
      await screen.findByRole('heading', {
        name: /calm local-first weight-loss tracking/i,
      }, { timeout: LAZY_PAGE_TIMEOUT_MS })
    ).toBeInTheDocument()
  })
})
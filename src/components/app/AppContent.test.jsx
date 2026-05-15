import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createSampleAppViewModel } from '@/test/leanlog-test-fixtures'

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

  it('switches average periods from the averages page controls', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<AppContent {...props} activePage="weekly-averages" />)

    await user.click(screen.getByRole('button', { name: /monthly/i }))

    expect(props.onPageChange).toHaveBeenCalledWith('monthly-averages')
  })

  it('renders the settings branch', () => {
    render(<AppContent {...createProps()} activePage="settings" />)

    expect(screen.getByText(/personal targets and defaults/i)).toBeInTheDocument()
  })
})
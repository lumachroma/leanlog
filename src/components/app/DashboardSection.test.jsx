import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createSampleAppViewModel, createSampleSettings } from '@/test/leanlog-test-fixtures'

import { DashboardSection } from './DashboardSection'

describe('DashboardSection', () => {
  it('renders the setup callout when targets are incomplete and routes the settings action', async () => {
    const user = userEvent.setup()
    const onOpenSettings = vi.fn()
    const { dashboardView } = createSampleAppViewModel({
      dashboardView: {
        settings: createSampleSettings({
          startWeight: '',
          goalWeight: '',
          dailyCalorieTarget: '',
          dailyStepTarget: '',
        }),
        targetsConfigured: false,
      },
    })

    render(<DashboardSection {...dashboardView} onOpenSettings={onOpenSettings} />)

    expect(screen.getByText(/add your targets to make the dashboard more useful/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /today's snapshot/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open settings/i }))

    expect(onOpenSettings).toHaveBeenCalledTimes(1)
  })
})
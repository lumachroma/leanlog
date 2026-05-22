import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createSampleChartSeries } from '@/test/fixtures/derived-fixtures'
import { stubIntersectionObserver } from '@/test/viewport-animation-test-utils'

import { ConsistencyTrackingChart } from './ConsistencyTrackingChart'

describe('ConsistencyTrackingChart', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-21T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders 30-day consistency summaries from daily chart series', () => {
    const intersectionObserver = stubIntersectionObserver()
    const chartSeries = createSampleChartSeries()

    render(
      <ConsistencyTrackingChart
        calorieAverage={2000}
        calorieTarget={2200}
        calorieDelta={-200}
        caloriePoints={chartSeries.calorieTrend}
        stepAverage={8000}
        stepTarget={7500}
        stepDelta={500}
        stepPoints={chartSeries.stepTrend}
      />
    )

    const caloriesCard = screen.getByRole('heading', { name: /calories/i }).closest('article')
    const stepsCard = screen.getByRole('heading', { name: /steps/i }).closest('article')

    expect(caloriesCard).not.toBeNull()
    expect(stepsCard).not.toBeNull()

    expect(within(caloriesCard).getByText('100%')).toBeInTheDocument()
    expect(within(caloriesCard).getByText('2 of 2 logged days hit target.')).toBeInTheDocument()
    expect(within(stepsCard).getByText('50%')).toBeInTheDocument()
    const calorieCells = within(caloriesCard).getAllByLabelText(/calories on/i)

    expect(calorieCells[0]).toHaveClass('chart-reveal')
    expect(calorieCells[0]).toHaveStyle('--chart-enter-delay: 0ms')
    expect(calorieCells[1]).toHaveStyle('--chart-enter-delay: 24ms')

    const firstCellBeforeReentry = calorieCells[0]

    act(() => {
      intersectionObserver.trigger(false)
    })

    act(() => {
      intersectionObserver.trigger(true)
    })

    expect(within(caloriesCard).getAllByLabelText(/calories on/i)[0]).not.toBe(
      firstCellBeforeReentry
    )

    expect(
      within(stepsCard).getByText('1 of 2 logged days hit target, with 1 day close.')
    ).toBeInTheDocument()
    expect(screen.getByText(/on target/i)).toBeInTheDocument()
    expect(screen.getByText(/near target/i)).toBeInTheDocument()
    expect(screen.getByText(/missing/i)).toBeInTheDocument()
  })
})
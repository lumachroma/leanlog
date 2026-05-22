import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { createSampleChartSeries } from '@/test/fixtures/derived-fixtures'
import { stubIntersectionObserver } from '@/test/viewport-animation-test-utils'

vi.mock('recharts', () => {
  let lineChartMountCount = 0

  return {
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children, data }) => {
      const mountIdRef = useRef(++lineChartMountCount)

      return (
        <div
          data-testid="line-chart"
          data-mount-id={String(mountIdRef.current)}
          data-point-count={String(data.length)}
        >
          {children}
        </div>
      )
    },
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Line: ({ dataKey }) => <div data-testid={`line-${dataKey}`} />,
  }
})

import { WeightTrendChart } from './WeightTrendChart'

describe('WeightTrendChart', () => {
  it('recreates the chart surface when it re-enters the viewport', () => {
    const intersectionObserver = stubIntersectionObserver()

    render(<WeightTrendChart points={createSampleChartSeries().weightTrend} />)

    const chartSurface = screen.getByRole('img', {
      name: /weight trend chart with daily weight and seven day moving average/i,
    })
    const lineChart = screen.getByTestId('line-chart')
    const initialMountId = lineChart.getAttribute('data-mount-id')

    expect(screen.getByText('Latest Daily')).toBeInTheDocument()
    expect(screen.getByText('80.0 kg')).toBeInTheDocument()
    expect(lineChart).toHaveAttribute('data-point-count', '2')

    act(() => {
      intersectionObserver.trigger({ isIntersecting: true, intersectionRatio: 0.2 })
    })

    act(() => {
      intersectionObserver.trigger({ isIntersecting: true, intersectionRatio: 0.7 })
    })

    const nextChartSurface = screen.getByRole('img', {
      name: /weight trend chart with daily weight and seven day moving average/i,
    })
    const nextLineChart = screen.getByTestId('line-chart')

    expect(nextChartSurface).not.toBe(chartSurface)
    expect(nextLineChart).not.toBe(lineChart)
    expect(nextLineChart.getAttribute('data-mount-id')).not.toBe(initialMountId)
  })
})
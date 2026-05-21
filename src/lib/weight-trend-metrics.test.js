import { describe, expect, it } from 'vitest'

import { createSampleChartSeries } from '@/test/leanlog-test-fixtures'

import { getWeightTrendChartDetails } from './weight-trend-metrics'

describe('weight trend metrics', () => {
  it('derives latest weight values and padded domain from chart points', () => {
    const details = getWeightTrendChartDetails(createSampleChartSeries().weightTrend)

    expect(details.hasPoints).toBe(true)
    expect(details.hasDomain).toBe(true)
    expect(details.latestDailyWeight).toBe(80)
    expect(details.latestMovingAverageWeight).toBe(79.5)
    expect(details.domain).toEqual({
      min: 78.9,
      max: 81.6,
    })
  })

  it('keeps the chart in an empty state when all weight values are blank', () => {
    const details = getWeightTrendChartDetails([
      { date: '2026-05-13', weight: null, weight7dma: null },
      { date: '2026-05-14', weight: null, weight7dma: null },
    ])

    expect(details.hasPoints).toBe(true)
    expect(details.hasDomain).toBe(false)
    expect(details.domain).toBeNull()
    expect(details.latestDailyWeight).toBeNull()
    expect(details.latestMovingAverageWeight).toBeNull()
  })
})
import { describe, expect, it } from 'vitest'

import {
  createSampleChartSeries,
  createSampleMetrics,
  createSampleSettings,
} from '@/test/leanlog-test-fixtures'

import { getDashboardSectionDetails } from './dashboard-section-metrics'

describe('dashboard section metrics', () => {
  it('builds thin component props from dashboard view data', () => {
    const details = getDashboardSectionDetails({
      metrics: createSampleMetrics(),
      chartSeries: createSampleChartSeries(),
      settings: createSampleSettings({
        startWeight: '92',
        goalWeight: '75',
        dailyCalorieTarget: '2200',
        dailyStepTarget: '7500',
      }),
      calorieDelta: -200,
      stepDelta: 500,
      goalDistance: 5,
      targetsConfigured: true,
    })

    expect(details.showSetupCallout).toBe(false)
    expect(details.snapshot).toEqual({
      latestWeight: 80,
      weightDelta: -5,
      latestWeight7dma: 79.5,
      calorieAverage: 2000,
      calorieDelta: -200,
      stepAverage: 8000,
      stepDelta: 500,
      goalProgressPercent: 38,
      goalDistance: 5,
    })
    expect(details.consistencyChart.calorieTarget).toBe(2200)
    expect(details.consistencyChart.stepTarget).toBe(7500)
    expect(details.goalProgressChart).toEqual({
      startWeight: 92,
      goalWeight: 75,
      currentWeight: 80,
      progressPercent: 38,
    })
  })
})
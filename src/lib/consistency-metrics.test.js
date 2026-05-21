import { describe, expect, it } from 'vitest'

import { createSampleChartSeries } from '@/test/fixtures/derived-fixtures'

import {
  CONSISTENCY_DAY_WINDOW,
  getConsistencyMetricDetails,
} from './consistency-metrics'

describe('consistency metrics', () => {
  it('builds a 30-day target-aware summary from chart points', () => {
    const chartSeries = createSampleChartSeries()
    const metric = getConsistencyMetricDetails({
      points: chartSeries.stepTrend,
      field: 'steps',
      target: 7500,
      prefersLower: false,
      now: new Date('2026-05-21T12:00:00'),
    })

    expect(metric.windowStartDate).toBe('2026-04-22')
    expect(metric.windowEndDate).toBe('2026-05-21')
    expect(metric.days).toHaveLength(CONSISTENCY_DAY_WINDOW)
    expect(metric.days.find((day) => day.date === '2026-05-13')).toEqual({
      date: '2026-05-13',
      value: 7000,
      state: 'close',
    })
    expect(metric.days.find((day) => day.date === '2026-05-14')).toEqual({
      date: '2026-05-14',
      value: 9000,
      state: 'hit',
    })
    expect(metric.summary).toEqual({
      loggedDays: 2,
      hitDays: 1,
      closeDays: 1,
      hitRate: 50,
      currentStreak: 0,
      bestStreak: 1,
    })
  })

  it('keeps logged-day coverage without target-dependent streaks', () => {
    const chartSeries = createSampleChartSeries()
    const metric = getConsistencyMetricDetails({
      points: chartSeries.calorieTrend,
      field: 'calories',
      target: null,
      prefersLower: true,
      now: new Date('2026-05-21T12:00:00'),
    })

    expect(metric.hasTarget).toBe(false)
    expect(metric.days.find((day) => day.date === '2026-05-13')).toEqual({
      date: '2026-05-13',
      value: 2100,
      state: 'logged',
    })
    expect(metric.summary).toEqual({
      loggedDays: 2,
      hitDays: 0,
      closeDays: 0,
      hitRate: null,
      currentStreak: null,
      bestStreak: null,
    })
  })
})
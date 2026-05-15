import { describe, expect, it } from 'vitest'

import {
  createBlankEntry,
  createSampleEntry,
  createSampleSettings,
} from '@/test/leanlog-test-fixtures'

import {
  getChartSeries,
  getDashboardMetrics,
  getMonthlyAverageCards,
  getWeeklyAverageCards,
} from './metrics'

describe('metrics blank tolerance', () => {
  it('keeps dashboard formulas stable when values are blank', () => {
    const metrics = getDashboardMetrics(
      [
        createBlankEntry({ date: '2026-05-15' }),
        createSampleEntry({
          weight7dma: '79.5',
          calories: '',
          steps: '9000',
          exerciseType: '',
          exerciseMinutes: '',
        }),
      ],
      createSampleSettings({
        startWeight: '',
        goalWeight: '72',
        dailyCalorieTarget: '',
        dailyStepTarget: '',
      })
    )

    expect(metrics).toEqual({
      latestWeight: 80,
      latestWeight7dma: 79.5,
      weightDelta: 0,
      goalProgressPercent: null,
      calorieAverage: null,
      stepAverage: 9000,
      activeDays: 2,
      exerciseDays: 0,
    })
  })

  it('ignores blanks in weekly and monthly average formulas', () => {
    const entries = [
      createBlankEntry({ date: '2026-05-15' }),
      createSampleEntry({ calories: '', steps: '9000', exerciseMinutes: '' }),
      createBlankEntry({ date: '2026-05-01', calories: '1800' }),
    ]

    expect(getWeeklyAverageCards(entries)).toEqual([
      {
        periodKey: '2026-05-11',
        label: 'Week of May 11, 2026',
        daysLogged: 2,
        exerciseDays: 1,
        weightAverage: 80,
        calorieAverage: null,
        stepAverage: 9000,
      },
      {
        periodKey: '2026-04-27',
        label: 'Week of Apr 27, 2026',
        daysLogged: 1,
        exerciseDays: 0,
        weightAverage: null,
        calorieAverage: 1800,
        stepAverage: null,
      },
    ])

    expect(getMonthlyAverageCards(entries)).toEqual([
      {
        periodKey: '2026-05',
        label: 'May 2026',
        daysLogged: 3,
        exerciseDays: 1,
        weightAverage: 80,
        calorieAverage: 1800,
        stepAverage: 9000,
      },
    ])
  })

  it('filters blank values out of chart series so missing logs do not ruin charts', () => {
    const series = getChartSeries([
      createBlankEntry({ date: '2026-05-13', weight7dma: '79.8' }),
      createSampleEntry({
        weight7dma: '79.5',
        calories: '',
        steps: '9000',
        exerciseType: '',
        exerciseMinutes: '',
      }),
      createBlankEntry({ date: '2026-05-15', calories: '1900' }),
    ])

    expect(series.weightTrend).toEqual([
      {
        date: '2026-05-13',
        weight: null,
        weight7dma: 79.8,
        calories: null,
        steps: null,
        exerciseType: null,
        exerciseMinutes: null,
      },
      {
        date: '2026-05-14',
        weight: 80,
        weight7dma: 79.5,
        calories: null,
        steps: 9000,
        exerciseType: null,
        exerciseMinutes: null,
      },
    ])
    expect(series.calorieTrend).toEqual([
      {
        date: '2026-05-15',
        weight: null,
        weight7dma: null,
        calories: 1900,
        steps: null,
        exerciseType: null,
        exerciseMinutes: null,
      },
    ])
    expect(series.stepTrend).toEqual([
      {
        date: '2026-05-14',
        weight: 80,
        weight7dma: 79.5,
        calories: null,
        steps: 9000,
        exerciseType: null,
        exerciseMinutes: null,
      },
    ])
  })
})
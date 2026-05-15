export function createSampleMetrics(overrides = {}) {
  return {
    latestWeight: 80,
    latestWeight7dma: 79.5,
    weightDelta: -5,
    goalProgressPercent: 38,
    calorieAverage: 2000,
    stepAverage: 8000,
    activeDays: 2,
    exerciseDays: 1,
    ...overrides,
  }
}

export function createSampleChartSeries() {
  return {
    weightTrend: [
      {
        date: '2026-05-13',
        weight: 81,
        weight7dma: 81,
        calories: 2100,
        steps: 7000,
        exerciseType: null,
        exerciseMinutes: null,
      },
      {
        date: '2026-05-14',
        weight: 80,
        weight7dma: 79.5,
        calories: 1900,
        steps: 9000,
        exerciseType: 'Walking',
        exerciseMinutes: 40,
      },
    ],
    calorieTrend: [
      {
        date: '2026-05-13',
        weight: 81,
        weight7dma: 81,
        calories: 2100,
        steps: 7000,
        exerciseType: null,
        exerciseMinutes: null,
      },
      {
        date: '2026-05-14',
        weight: 80,
        weight7dma: 79.5,
        calories: 1900,
        steps: 9000,
        exerciseType: 'Walking',
        exerciseMinutes: 40,
      },
    ],
    stepTrend: [
      {
        date: '2026-05-13',
        weight: 81,
        weight7dma: 81,
        calories: 2100,
        steps: 7000,
        exerciseType: null,
        exerciseMinutes: null,
      },
      {
        date: '2026-05-14',
        weight: 80,
        weight7dma: 79.5,
        calories: 1900,
        steps: 9000,
        exerciseType: 'Walking',
        exerciseMinutes: 40,
      },
    ],
  }
}

export function createSampleWeeklyAverageCards() {
  return [
    {
      periodKey: '2026-05-11',
      label: 'Week of May 11, 2026',
      daysLogged: 2,
      exerciseDays: 1,
      weightAverage: 80.5,
      calorieAverage: 2000,
      stepAverage: 8000,
    },
  ]
}

export function createSampleMonthlyAverageCards() {
  return [
    {
      periodKey: '2026-05',
      label: 'May 2026',
      daysLogged: 2,
      exerciseDays: 1,
      weightAverage: 80.5,
      calorieAverage: 2000,
      stepAverage: 8000,
    },
  ]
}
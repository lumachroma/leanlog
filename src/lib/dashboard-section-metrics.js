import { getNumericSettings } from '@/lib/metrics'

export function getDashboardSectionDetails({
  metrics,
  chartSeries,
  settings,
  calorieDelta,
  stepDelta,
  goalDistance,
  targetsConfigured,
}) {
  const { startWeight, goalWeight, dailyCalorieTarget, dailyStepTarget } =
    getNumericSettings(settings)

  return {
    showSetupCallout: !targetsConfigured,
    snapshot: {
      latestWeight: metrics.latestWeight,
      weightDelta: metrics.weightDelta,
      latestWeight7dma: metrics.latestWeight7dma,
      calorieAverage: metrics.calorieAverage,
      calorieDelta,
      stepAverage: metrics.stepAverage,
      stepDelta,
      goalProgressPercent: metrics.goalProgressPercent,
      goalDistance,
    },
    weightTrendChart: {
      points: chartSeries.weightTrend,
      eyebrow: 'Section 2',
      title: 'Weight Trend',
      description:
        'Daily fluctuations stay visible while the long-term direction remains clear.',
    },
    consistencyChart: {
      calorieAverage: metrics.calorieAverage,
      calorieTarget: dailyCalorieTarget,
      calorieDelta,
      caloriePoints: chartSeries.calorieTrend,
      stepAverage: metrics.stepAverage,
      stepTarget: dailyStepTarget,
      stepDelta,
      stepPoints: chartSeries.stepTrend,
    },
    goalProgressChart: {
      startWeight,
      goalWeight,
      currentWeight: metrics.latestWeight,
      progressPercent: metrics.goalProgressPercent,
    },
  }
}
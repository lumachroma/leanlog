const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

export const WEIGHT_TREND_EMPTY_STATE_COPY = {
  noPoints:
    'Save a few weight entries to unlock the trend chart. Missed days are fine. The 7DMA will stay calm and continue once data returns.',
  noDomain:
    'Weight entries are still blank. Log your first weigh-in and the chart will render both daily weight and 7DMA without punishing skipped days.',
}

export const formatWeightTrendDate = (date) =>
  dateFormatter.format(new Date(`${date}T00:00:00`))

export const getWeightTrendChartHeight = () => {
  if (typeof window === 'undefined') {
    return 288
  }

  return window.innerWidth < 640 ? 208 : 288
}

export const getWeightTrendAxisConfig = () => {
  if (typeof window === 'undefined') {
    return {
      minTickGap: 44,
      tickFontSize: 12,
      yAxisWidth: 60,
    }
  }

  return window.innerWidth < 640
    ? {
        minTickGap: 56,
        tickFontSize: 11,
        yAxisWidth: 58,
      }
    : {
        minTickGap: 44,
        tickFontSize: 12,
        yAxisWidth: 60,
      }
}
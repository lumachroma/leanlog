const getChartDomain = (points) => {
  const values = points
    .flatMap((point) => [point.weight, point.weight7dma])
    .filter((value) => value !== null)

  if (!values.length) {
    return null
  }

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  if (minValue === maxValue) {
    return {
      min: minValue - 1,
      max: maxValue + 1,
    }
  }

  const padding = Math.max((maxValue - minValue) * 0.12, 0.6)

  return {
    min: minValue - padding,
    max: maxValue + padding,
  }
}

const getLatestPointValue = (points, field) =>
  [...points].reverse().find((point) => point[field] !== null)?.[field] ?? null

export function getWeightTrendChartDetails(points = []) {
  const domain = getChartDomain(points)

  return {
    hasPoints: points.length > 0,
    hasDomain: domain !== null,
    domain,
    latestDailyWeight: getLatestPointValue(points, 'weight'),
    latestMovingAverageWeight: getLatestPointValue(points, 'weight7dma'),
  }
}
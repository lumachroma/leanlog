const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

const average = (values) => {
  if (!values.length) {
    return null
  }

  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

const formatMonthLabel = (monthKey) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${monthKey}-01T00:00:00`))

const hasExercise = (entry) =>
  Boolean(entry.exerciseType?.trim() || entry.exerciseMinutes?.trim())

const getGoalProgressPercent = (startWeight, goalWeight, latestWeight) => {
  if (startWeight === null || goalWeight === null || latestWeight === null) {
    return null
  }

  const totalDistance = Math.abs(startWeight - goalWeight)

  if (totalDistance === 0) {
    return latestWeight === goalWeight ? 100 : 0
  }

  const remainingDistance = Math.abs(latestWeight - goalWeight)
  const progress = ((totalDistance - remainingDistance) / totalDistance) * 100

  return Math.max(0, Math.min(100, Math.round(progress)))
}

const asChartPoint = (entry) => ({
  date: entry.date,
  weight: parseNumber(entry.weight),
  calories: parseNumber(entry.calories),
  steps: parseNumber(entry.steps),
  exerciseType: entry.exerciseType?.trim() || null,
  exerciseMinutes: parseNumber(entry.exerciseMinutes),
})

export const toNumber = parseNumber

export function getDashboardMetrics(entries, settings) {
  const latestWeightEntry = entries.find((entry) => parseNumber(entry.weight) !== null)
  const latestWeight = parseNumber(latestWeightEntry?.weight)
  const baselineWeight =
    parseNumber(settings.startWeight) ??
    parseNumber(entries.findLast((entry) => parseNumber(entry.weight) !== null)?.weight)
  const goalWeight = parseNumber(settings.goalWeight)

  return {
    latestWeight,
    weightDelta:
      latestWeight !== null && baselineWeight !== null
        ? latestWeight - baselineWeight
        : null,
    goalProgressPercent: getGoalProgressPercent(
      parseNumber(settings.startWeight),
      goalWeight,
      latestWeight
    ),
    calorieAverage: average(
      entries
        .map((entry) => parseNumber(entry.calories))
        .filter((value) => value !== null)
    ),
    stepAverage: average(
      entries.map((entry) => parseNumber(entry.steps)).filter((value) => value !== null)
    ),
    activeDays: entries.length,
    exerciseDays: entries.filter(hasExercise).length,
  }
}

export function getMonthlyCards(entries) {
  const monthlyMap = new Map()

  entries.forEach((entry) => {
    const monthKey = entry.date.slice(0, 7)
    const summary = monthlyMap.get(monthKey) ?? {
      monthKey,
      daysLogged: 0,
      exerciseDays: 0,
      latestWeight: null,
      calorieValues: [],
      stepValues: [],
    }

    const weight = parseNumber(entry.weight)
    const calories = parseNumber(entry.calories)
    const steps = parseNumber(entry.steps)

    summary.daysLogged += 1

    if (hasExercise(entry)) {
      summary.exerciseDays += 1
    }

    if (summary.latestWeight === null && weight !== null) {
      summary.latestWeight = weight
    }

    if (calories !== null) {
      summary.calorieValues.push(calories)
    }

    if (steps !== null) {
      summary.stepValues.push(steps)
    }

    monthlyMap.set(monthKey, summary)
  })

  return [...monthlyMap.values()]
    .sort((left, right) => right.monthKey.localeCompare(left.monthKey))
    .map((summary) => ({
      monthKey: summary.monthKey,
      label: formatMonthLabel(summary.monthKey),
      daysLogged: summary.daysLogged,
      exerciseDays: summary.exerciseDays,
      latestWeight: summary.latestWeight,
      calorieAverage: average(summary.calorieValues),
      stepAverage: average(summary.stepValues),
    }))
}

export function getChartSeries(entries) {
  const orderedEntries = [...entries].sort((left, right) =>
    left.date.localeCompare(right.date)
  )

  return {
    weightTrend: orderedEntries
      .filter((entry) => parseNumber(entry.weight) !== null)
      .map(asChartPoint),
    calorieTrend: orderedEntries
      .filter((entry) => parseNumber(entry.calories) !== null)
      .map(asChartPoint),
    stepTrend: orderedEntries
      .filter((entry) => parseNumber(entry.steps) !== null)
      .map(asChartPoint),
  }
}
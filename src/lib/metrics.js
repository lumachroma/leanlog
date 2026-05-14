const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

const hasText = (value) => String(value ?? '').trim().length > 0

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

const formatWeekLabel = (weekStart) =>
  `Week of ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${weekStart}T00:00:00`))}`

const getWeekStart = (date) => {
  const nextDate = new Date(`${date}T00:00:00`)
  const dayOfWeek = nextDate.getDay()
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  nextDate.setDate(nextDate.getDate() + offset)

  const timezoneOffsetInMs = nextDate.getTimezoneOffset() * 60_000
  return new Date(nextDate.getTime() - timezoneOffsetInMs).toISOString().slice(0, 10)
}

const hasExercise = (entry) => hasText(entry.exerciseType) || hasText(entry.exerciseMinutes)

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
  weight7dma: parseNumber(entry.weight7dma),
  calories: parseNumber(entry.calories),
  steps: parseNumber(entry.steps),
  exerciseType: hasText(entry.exerciseType) ? String(entry.exerciseType).trim() : null,
  exerciseMinutes: parseNumber(entry.exerciseMinutes),
})

const createPeriodSummary = (periodKey) => ({
  periodKey,
  daysLogged: 0,
  exerciseDays: 0,
  weightValues: [],
  calorieValues: [],
  stepValues: [],
})

const toAverageCard = (summary, label) => ({
  periodKey: summary.periodKey,
  label,
  daysLogged: summary.daysLogged,
  exerciseDays: summary.exerciseDays,
  weightAverage: average(summary.weightValues),
  calorieAverage: average(summary.calorieValues),
  stepAverage: average(summary.stepValues),
})

export const toNumber = parseNumber

export function getDashboardMetrics(entries, settings) {
  const latestWeightEntry = entries.find((entry) => parseNumber(entry.weight) !== null)
  const latestWeight = parseNumber(latestWeightEntry?.weight)
  const latestMovingAverageEntry = entries.find(
    (entry) => parseNumber(entry.weight7dma) !== null
  )
  const baselineWeight =
    parseNumber(settings.startWeight) ??
    parseNumber(entries.findLast((entry) => parseNumber(entry.weight) !== null)?.weight)
  const goalWeight = parseNumber(settings.goalWeight)

  return {
    latestWeight,
    latestWeight7dma: parseNumber(latestMovingAverageEntry?.weight7dma),
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

export function getWeeklyAverageCards(entries) {
  const weeklyMap = new Map()

  entries.forEach((entry) => {
    const periodKey = getWeekStart(entry.date)
    const summary = weeklyMap.get(periodKey) ?? createPeriodSummary(periodKey)
    const weight = parseNumber(entry.weight)
    const calories = parseNumber(entry.calories)
    const steps = parseNumber(entry.steps)

    summary.daysLogged += 1

    if (hasExercise(entry)) {
      summary.exerciseDays += 1
    }

    if (weight !== null) {
      summary.weightValues.push(weight)
    }

    if (calories !== null) {
      summary.calorieValues.push(calories)
    }

    if (steps !== null) {
      summary.stepValues.push(steps)
    }

    weeklyMap.set(periodKey, summary)
  })

  return [...weeklyMap.values()]
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey))
    .map((summary) => toAverageCard(summary, formatWeekLabel(summary.periodKey)))
}

export function getMonthlyAverageCards(entries) {
  const monthlyMap = new Map()

  entries.forEach((entry) => {
    const periodKey = entry.date.slice(0, 7)
    const summary = monthlyMap.get(periodKey) ?? createPeriodSummary(periodKey)

    const weight = parseNumber(entry.weight)
    const calories = parseNumber(entry.calories)
    const steps = parseNumber(entry.steps)

    summary.daysLogged += 1

    if (hasExercise(entry)) {
      summary.exerciseDays += 1
    }

    if (weight !== null) {
      summary.weightValues.push(weight)
    }

    if (calories !== null) {
      summary.calorieValues.push(calories)
    }

    if (steps !== null) {
      summary.stepValues.push(steps)
    }

    monthlyMap.set(periodKey, summary)
  })

  return [...monthlyMap.values()]
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey))
    .map((summary) => toAverageCard(summary, formatMonthLabel(summary.periodKey)))
}

export function getChartSeries(entries) {
  const orderedEntries = [...entries].sort((left, right) =>
    left.date.localeCompare(right.date)
  )

  return {
    weightTrend: orderedEntries
      .filter(
        (entry) =>
          parseNumber(entry.weight) !== null || parseNumber(entry.weight7dma) !== null
      )
      .map(asChartPoint),
    calorieTrend: orderedEntries
      .filter((entry) => parseNumber(entry.calories) !== null)
      .map(asChartPoint),
    stepTrend: orderedEntries
      .filter((entry) => parseNumber(entry.steps) !== null)
      .map(asChartPoint),
  }
}
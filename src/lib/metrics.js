import { average, toNumber as parseNumber } from '@/lib/number-utils'

const hasText = (value) => String(value ?? '').trim().length > 0

const isPresentNumber = (value) => value !== null

const getEntryNumber = (entry, field) => parseNumber(entry?.[field])

const hasEntryNumber = (entry, field) => getEntryNumber(entry, field) !== null

const getNumericValues = (entries, field) =>
  entries.map((entry) => getEntryNumber(entry, field)).filter(isPresentNumber)

const getAverageForField = (entries, field) => average(getNumericValues(entries, field))

const getFirstNumericFieldValue = (entries, field) =>
  getEntryNumber(entries.find((entry) => hasEntryNumber(entry, field)), field)

const getLastNumericFieldValue = (entries, field) =>
  getEntryNumber(entries.findLast((entry) => hasEntryNumber(entry, field)), field)

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

const getDelta = (value, baseline) =>
  value !== null && baseline !== null ? Math.round(value - baseline) : null

const getAbsoluteDistance = (left, right) =>
  left !== null && right !== null ? Math.abs(left - right) : null

const asChartPoint = (entry) => ({
  date: entry.date,
  weight: getEntryNumber(entry, 'weight'),
  weight7dma: getEntryNumber(entry, 'weight7dma'),
  calories: getEntryNumber(entry, 'calories'),
  steps: getEntryNumber(entry, 'steps'),
  exerciseType: hasText(entry.exerciseType) ? String(entry.exerciseType).trim() : null,
  exerciseMinutes: getEntryNumber(entry, 'exerciseMinutes'),
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

const addEntryToPeriodSummary = (summary, entry) => {
  summary.daysLogged += 1

  if (hasExercise(entry)) {
    summary.exerciseDays += 1
  }

  const weight = getEntryNumber(entry, 'weight')
  const calories = getEntryNumber(entry, 'calories')
  const steps = getEntryNumber(entry, 'steps')

  if (weight !== null) {
    summary.weightValues.push(weight)
  }

  if (calories !== null) {
    summary.calorieValues.push(calories)
  }

  if (steps !== null) {
    summary.stepValues.push(steps)
  }

  return summary
}

const buildAverageCards = (entries, getPeriodKey, formatLabel) => {
  const summaries = new Map()

  entries.forEach((entry) => {
    const periodKey = getPeriodKey(entry)
    const summary = addEntryToPeriodSummary(
      summaries.get(periodKey) ?? createPeriodSummary(periodKey),
      entry
    )

    summaries.set(periodKey, summary)
  })

  return [...summaries.values()]
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey))
    .map((summary) => toAverageCard(summary, formatLabel(summary.periodKey)))
}

const createTrendSeries = (entries, fields) =>
  entries.filter((entry) => fields.some((field) => hasEntryNumber(entry, field))).map(asChartPoint)

export const toNumber = parseNumber

export const getTargetDelta = getDelta

export const getGoalDistance = getAbsoluteDistance

export function getNumericSettings(settings = {}) {
  return {
    startWeight: parseNumber(settings.startWeight),
    goalWeight: parseNumber(settings.goalWeight),
    dailyCalorieTarget: parseNumber(settings.dailyCalorieTarget),
    dailyStepTarget: parseNumber(settings.dailyStepTarget),
  }
}

export function getDashboardMetrics(entries, settings) {
  const { startWeight, goalWeight } = getNumericSettings(settings)
  const latestWeight = getFirstNumericFieldValue(entries, 'weight')
  const latestWeight7dma = getFirstNumericFieldValue(entries, 'weight7dma')
  const baselineWeight = startWeight ?? getLastNumericFieldValue(entries, 'weight')

  return {
    latestWeight,
    latestWeight7dma,
    weightDelta: getDelta(latestWeight, baselineWeight),
    goalProgressPercent: getGoalProgressPercent(startWeight, goalWeight, latestWeight),
    calorieAverage: getAverageForField(entries, 'calories'),
    stepAverage: getAverageForField(entries, 'steps'),
    activeDays: entries.length,
    exerciseDays: entries.filter(hasExercise).length,
  }
}

export function getWeeklyAverageCards(entries) {
  return buildAverageCards(entries, (entry) => getWeekStart(entry.date), formatWeekLabel)
}

export function getMonthlyAverageCards(entries) {
  return buildAverageCards(entries, (entry) => entry.date.slice(0, 7), formatMonthLabel)
}

export function getChartSeries(entries) {
  const orderedEntries = [...entries].sort((left, right) =>
    left.date.localeCompare(right.date)
  )

  return {
    weightTrend: createTrendSeries(orderedEntries, ['weight', 'weight7dma']),
    calorieTrend: createTrendSeries(orderedEntries, ['calories']),
    stepTrend: createTrendSeries(orderedEntries, ['steps']),
  }
}
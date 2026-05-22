import { toDateAtMidnight } from '@/lib/date-utils'

export const CONSISTENCY_DAY_WINDOW = 30

const CLOSE_ENOUGH_RATIO = 0.08

const toDateKey = (date) => {
  const timezoneOffsetInMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - timezoneOffsetInMs).toISOString().slice(0, 10)
}

const buildDayWindow = (endDate) => {
  const end = toDateAtMidnight(endDate)

  return Array.from({ length: CONSISTENCY_DAY_WINDOW }, (_, index) => {
    const nextDate = new Date(end)
    nextDate.setDate(end.getDate() - (CONSISTENCY_DAY_WINDOW - 1 - index))
    return toDateKey(nextDate)
  })
}

const getWindowEndDate = (points, now) => {
  const latestLoggedDate = points.map((point) => point.date).sort().at(-1)
  const today = toDateKey(now)

  if (!latestLoggedDate) {
    return today
  }

  return latestLoggedDate > today ? latestLoggedDate : today
}

const getPointLookup = (points, field) => {
  const lookup = new Map()

  points.forEach((point) => {
    lookup.set(point.date, typeof point[field] === 'number' ? point[field] : null)
  })

  return lookup
}

const getConsistencyState = (value, target, prefersLower) => {
  if (value === null) {
    return 'missing'
  }

  if (target === null || target <= 0) {
    return 'logged'
  }

  if (prefersLower) {
    if (value <= target) {
      return 'hit'
    }

    return value <= target * (1 + CLOSE_ENOUGH_RATIO) ? 'close' : 'off'
  }

  if (value >= target) {
    return 'hit'
  }

  return value >= target * (1 - CLOSE_ENOUGH_RATIO) ? 'close' : 'off'
}

const buildConsistencyDays = ({ dates, points, field, target, prefersLower }) => {
  const lookup = getPointLookup(points, field)

  return dates.map((date) => {
    const value = lookup.has(date) ? lookup.get(date) : null

    return {
      date,
      value,
      state: getConsistencyState(value, target, prefersLower),
    }
  })
}

const getLongestHitStreak = (days) => {
  let longest = 0
  let current = 0

  days.forEach((day) => {
    if (day.state === 'hit') {
      current += 1
      longest = Math.max(longest, current)
      return
    }

    current = 0
  })

  return longest
}

const getCurrentHitStreak = (days) => {
  let streak = 0

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].state !== 'hit') {
      break
    }

    streak += 1
  }

  return streak
}

const getConsistencySummary = (days, hasTarget) => {
  const loggedDays = days.filter((day) => day.value !== null).length

  if (!hasTarget) {
    return {
      loggedDays,
      hitDays: 0,
      closeDays: 0,
      hitRate: null,
      currentStreak: null,
      bestStreak: null,
    }
  }

  const hitDays = days.filter((day) => day.state === 'hit').length
  const closeDays = days.filter((day) => day.state === 'close').length

  return {
    loggedDays,
    hitDays,
    closeDays,
    hitRate: loggedDays ? Math.round((hitDays / loggedDays) * 100) : 0,
    currentStreak: getCurrentHitStreak(days),
    bestStreak: getLongestHitStreak(days),
  }
}

export function getConsistencyMetricDetails({
  points = [],
  field,
  target,
  prefersLower,
  now = new Date(),
}) {
  const hasTarget = target !== null && target > 0
  const windowEndDate = getWindowEndDate(points, now)
  const dates = buildDayWindow(windowEndDate)
  const days = buildConsistencyDays({
    dates,
    points,
    field,
    target,
    prefersLower,
  })

  return {
    days,
    hasTarget,
    summary: getConsistencySummary(days, hasTarget),
    windowStartDate: dates[0],
    windowEndDate: dates.at(-1),
  }
}
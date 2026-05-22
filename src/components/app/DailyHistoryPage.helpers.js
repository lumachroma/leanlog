import { toDateAtMidnight } from '@/lib/date-utils'
import { todayDate } from '@/lib/db'

export const formatHistoryValue = (value, suffix) => {
  if (!value) {
    return `--${suffix ? ` ${suffix}` : ''}`
  }

  return `${value}${suffix ? ` ${suffix}` : ''}`
}

export const formatExerciseSummary = (entry) => {
  const exerciseType = entry.exerciseType?.trim()
  const exerciseMinutes = entry.exerciseMinutes?.trim()

  if (!exerciseType && !exerciseMinutes) {
    return 'No exercise saved.'
  }

  if (exerciseType && exerciseMinutes) {
    return `${exerciseType} • ${exerciseMinutes} min`
  }

  if (exerciseType) {
    return exerciseType
  }

  return `${exerciseMinutes} min`
}

export const hasExercise = (entry) =>
  Boolean(entry.exerciseType?.trim() || entry.exerciseMinutes?.trim())

export const getNextAvailableDate = (entries) => {
  const occupiedDates = new Set(entries.map((entry) => entry.date))
  const nextDate = toDateAtMidnight(todayDate())

  while (occupiedDates.has(nextDate.toISOString().slice(0, 10))) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  return nextDate.toISOString().slice(0, 10)
}
import Dexie from 'dexie'

import { toDateAtMidnight } from '@/lib/date-utils'
import { average, toNumber as parseNumber } from '@/lib/number-utils'

export const SETTINGS_RECORD_ID = 'profile'
export const EXERCISE_TYPE_OPTIONS = [
  'Walking',
  'Cycling',
  'Strength',
  'Running',
  'Sports',
  'Mobility',
  'Other',
]

export const DEFAULT_SETTINGS = {
  startWeight: '',
  goalWeight: '',
  dailyCalorieTarget: '',
  dailyStepTarget: '',
}

export const toDateInputValue = (date = new Date()) => {
  const timezoneOffsetInMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - timezoneOffsetInMs).toISOString().slice(0, 10)
}

export const todayDate = () => toDateInputValue()

export const createEmptyEntryDraft = (date = todayDate()) => ({
  date,
  weight: '',
  calories: '',
  steps: '',
  exerciseType: '',
  exerciseMinutes: '',
  weight7dma: null,
})

const hasText = (value) => String(value ?? '').trim().length > 0

const addDays = (date, days) => {
  const nextDate = new Date(toDateAtMidnight(date))
  nextDate.setDate(nextDate.getDate() + days)
  return toDateInputValue(nextDate)
}

const sanitizeSettings = (settings = DEFAULT_SETTINGS) => ({
  startWeight: settings.startWeight ?? '',
  goalWeight: settings.goalWeight ?? '',
  dailyCalorieTarget: settings.dailyCalorieTarget ?? '',
  dailyStepTarget: settings.dailyStepTarget ?? '',
})

const sanitizeEntry = (entry) => ({
  date: entry.date,
  weight: entry.weight ?? '',
  calories: entry.calories ?? '',
  steps: entry.steps ?? '',
  exerciseType: entry.exerciseType ?? '',
  exerciseMinutes: entry.exerciseMinutes ?? '',
  weight7dma: parseNumber(entry.weight7dma),
})

const normalizeEntryRecord = (entry) => ({
  ...sanitizeEntry(entry),
  monthKey: entry.date.slice(0, 7),
  updatedAt: new Date().toISOString(),
})

export const isEntryEmpty = (entry) =>
  !hasText(entry.weight) &&
  !hasText(entry.calories) &&
  !hasText(entry.steps) &&
  !hasText(entry.exerciseType) &&
  !hasText(entry.exerciseMinutes)

export const recalculateMovingAverageEntries = (entries) => {
  const sortedEntries = [...entries]
    .map(sanitizeEntry)
    .sort((left, right) => left.date.localeCompare(right.date))

  return sortedEntries.map((entry) => {
    const windowStart = addDays(entry.date, -6)
    const trailingWeights = sortedEntries
      .filter((candidate) => candidate.date >= windowStart && candidate.date <= entry.date)
      .map((candidate) => parseNumber(candidate.weight))
      .filter((value) => value !== null)

    return normalizeEntryRecord({
      ...entry,
      weight7dma: average(trailingWeights, { precision: 2 }),
    })
  })
}

class LeanlogDatabase extends Dexie {
  constructor() {
    super('leanlog')

    this.version(1).stores({
      settings: '&id, updatedAt',
      entries: '&date, monthKey, updatedAt',
    })
  }
}

export const db = new LeanlogDatabase()

const settingsTable = db.table('settings')
const entriesTable = db.table('entries')

export async function loadAppSnapshot() {
  const [settingsRecord, entries] = await Promise.all([
    settingsTable.get(SETTINGS_RECORD_ID),
    entriesTable.orderBy('date').reverse().toArray(),
  ])

  return {
    settings: sanitizeSettings(settingsRecord?.values),
    entries: entries.map(sanitizeEntry),
  }
}

export async function saveSettingsSnapshot(settings) {
  const values = sanitizeSettings(settings)

  await settingsTable.put({
    id: SETTINGS_RECORD_ID,
    values,
    updatedAt: new Date().toISOString(),
  })

  return values
}

async function persistEntries(entries) {
  const recalculatedEntries = recalculateMovingAverageEntries(entries)

  await db.transaction('rw', entriesTable, async () => {
    await entriesTable.clear()

    if (recalculatedEntries.length) {
      await entriesTable.bulkPut(recalculatedEntries)
    }
  })

  return recalculatedEntries
    .map(sanitizeEntry)
    .sort((left, right) => right.date.localeCompare(left.date))
}

export async function upsertEntryRecord(entry) {
  const normalizedEntry = sanitizeEntry(entry)
  const currentEntries = await entriesTable.toArray()
  const nextEntries = isEntryEmpty(normalizedEntry)
    ? currentEntries.filter((currentEntry) => currentEntry.date !== normalizedEntry.date)
    : [
        ...currentEntries.filter((currentEntry) => currentEntry.date !== normalizedEntry.date),
        normalizedEntry,
      ]

  return persistEntries(nextEntries)
}

export async function deleteEntryRecord(date) {
  const currentEntries = await entriesTable.toArray()
  const nextEntries = currentEntries.filter((entry) => entry.date !== date)

  return persistEntries(nextEntries)
}

export async function importEntryRecords(entries) {
  const sanitizedImportedEntries = entries
    .map(sanitizeEntry)
    .filter((entry) => hasText(entry.date) && !isEntryEmpty(entry))

  const importedEntriesByDate = new Map(
    sanitizedImportedEntries.map((entry) => [entry.date, entry])
  )

  const currentEntries = await entriesTable.toArray()
  const nextEntries = [
    ...currentEntries.filter((entry) => !importedEntriesByDate.has(entry.date)),
    ...importedEntriesByDate.values(),
  ]

  return persistEntries(nextEntries)
}
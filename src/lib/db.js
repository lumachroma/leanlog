import Dexie from 'dexie'

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
})

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
})

const normalizeEntryRecord = (entry) => ({
  ...sanitizeEntry(entry),
  monthKey: entry.date.slice(0, 7),
  updatedAt: new Date().toISOString(),
})

export const isEntryEmpty = (entry) =>
  !entry.weight?.trim() &&
  !entry.calories?.trim() &&
  !entry.steps?.trim() &&
  !entry.exerciseType?.trim() &&
  !entry.exerciseMinutes?.trim()

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

export async function upsertEntryRecord(entry) {
  const normalizedEntry = sanitizeEntry(entry)

  if (isEntryEmpty(normalizedEntry)) {
    await entriesTable.delete(normalizedEntry.date)
    return null
  }

  await entriesTable.put(normalizeEntryRecord(normalizedEntry))
  return normalizedEntry
}

export async function deleteEntryRecord(date) {
  await entriesTable.delete(date)
}
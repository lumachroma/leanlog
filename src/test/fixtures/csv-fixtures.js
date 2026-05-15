import {
  createSampleEntry,
  createSecondarySampleEntry,
} from '@/test/fixtures/entry-fixtures'

export const DAILY_LOG_CSV_HEADER =
  'date,weight,calories,steps,exerciseType,exerciseMinutes'

const toDailyLogCsvRow = (entry) =>
  [
    entry.date ?? '',
    entry.weight ?? '',
    entry.calories ?? '',
    entry.steps ?? '',
    entry.exerciseType ?? '',
    entry.exerciseMinutes ?? '',
  ].join(',')

export function createDailyLogCsv(entries) {
  return [DAILY_LOG_CSV_HEADER, ...entries.map(toDailyLogCsvRow)].join('\n')
}

export function createSingleEntryDailyLogCsv(overrides = {}) {
  return createDailyLogCsv([createSampleEntry(overrides)])
}

export function createSampleDailyLogCsv() {
  return createDailyLogCsv([
    createSecondarySampleEntry(),
    createSampleEntry(),
  ])
}

export function createInvalidDailyLogCsv() {
  return createSingleEntryDailyLogCsv({ date: '2026-14-99' })
}

export function createParsedSampleDailyLogEntries() {
  return [
    createSecondarySampleEntry({ weight7dma: null }),
    createSampleEntry({ weight7dma: null }),
  ]
}
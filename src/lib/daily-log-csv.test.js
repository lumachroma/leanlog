import { describe, expect, it } from 'vitest'

import {
  createInvalidDailyLogCsv,
  createSampleDailyLogCsv,
  createSampleEntries,
  createSampleEntry,
} from '@/test/leanlog-test-fixtures'

import {
  createDailyLogCsvTemplate,
  parseEntriesCsv,
  serializeEntriesToCsv,
} from './daily-log-csv'

describe('daily log csv helpers', () => {
  it('creates a simple csv template with headers and one sample row', () => {
    expect(createDailyLogCsvTemplate()).toBe(
      [
        'date,weight,calories,steps,exerciseType,exerciseMinutes',
        '2026-05-15,78.4,2100,8450,Walking,45',
      ].join('\n')
    )
  })

  it('serializes daily logs into a simple csv format', () => {
    expect(serializeEntriesToCsv(createSampleEntries())).toBe(createSampleDailyLogCsv())
  })

  it('parses csv rows into daily log entries and ignores blank lines', () => {
    expect(parseEntriesCsv(`Date,Weight,Calories,Steps,Exercise Type,Exercise Minutes\n${createSampleDailyLogCsv().split('\n').slice(1).join('\n\n')}`)).toEqual([
      createSampleEntry({
        date: '2026-05-13',
        weight: '81',
        calories: '2100',
        steps: '7000',
        exerciseType: '',
        exerciseMinutes: '',
        weight7dma: null,
      }),
      createSampleEntry({
        date: '2026-05-14',
        weight: '80',
        calories: '1900',
        steps: '9000',
        exerciseType: 'Walking',
        exerciseMinutes: '40',
        weight7dma: null,
      }),
    ])
  })

  it('rejects rows with invalid dates', () => {
    expect(() => parseEntriesCsv(createInvalidDailyLogCsv())).toThrow(
      /row 2 has an invalid date/i
    )
  })
})
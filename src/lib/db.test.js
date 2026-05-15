import { describe, expect, it } from 'vitest'

import { createBlankEntry, createSampleEntry } from '@/test/leanlog-test-fixtures'

import { recalculateMovingAverageEntries } from './db'

describe('recalculateMovingAverageEntries', () => {
  it('ignores missing dates and blank weights when calculating 7DMA', () => {
    const entries = recalculateMovingAverageEntries([
      createSampleEntry({
        date: '2026-05-10',
        weight: '80',
        weight7dma: null,
        calories: '',
        steps: '',
        exerciseType: '',
        exerciseMinutes: '',
      }),
      createBlankEntry({ date: '2026-05-12', calories: '1900', weight7dma: null }),
      createSampleEntry({
        date: '2026-05-15',
        weight: '78',
        weight7dma: null,
        calories: '',
        steps: '',
        exerciseType: '',
        exerciseMinutes: '',
      }),
    ])

    expect(entries).toEqual([
      expect.objectContaining({ date: '2026-05-10', weight7dma: 80 }),
      expect.objectContaining({ date: '2026-05-12', weight7dma: 80 }),
      expect.objectContaining({ date: '2026-05-15', weight7dma: 79 }),
    ])
  })
})
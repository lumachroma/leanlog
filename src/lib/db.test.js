import { describe, expect, it } from 'vitest'

import { recalculateMovingAverageEntries } from './db'

describe('recalculateMovingAverageEntries', () => {
  it('ignores missing dates and blank weights when calculating 7DMA', () => {
    const entries = recalculateMovingAverageEntries([
      {
        date: '2026-05-10',
        weight: '80',
        calories: '',
        steps: '',
        exerciseType: '',
        exerciseMinutes: '',
      },
      {
        date: '2026-05-12',
        weight: '',
        calories: '1900',
        steps: '',
        exerciseType: '',
        exerciseMinutes: '',
      },
      {
        date: '2026-05-15',
        weight: '78',
        calories: '',
        steps: '',
        exerciseType: '',
        exerciseMinutes: '',
      },
    ])

    expect(entries).toEqual([
      expect.objectContaining({ date: '2026-05-10', weight7dma: 80 }),
      expect.objectContaining({ date: '2026-05-12', weight7dma: 80 }),
      expect.objectContaining({ date: '2026-05-15', weight7dma: 79 }),
    ])
  })
})
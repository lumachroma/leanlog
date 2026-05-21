import { describe, expect, it } from 'vitest'

import { getGoalProgressDetails } from './goal-progress-metrics'

describe('goal progress metrics', () => {
  it('builds marker positioning when goal inputs are complete', () => {
    expect(
      getGoalProgressDetails({
        startWeight: 92,
        goalWeight: 75,
        currentWeight: 80,
        progressPercent: 71,
      })
    ).toEqual({
      hasGoalData: true,
      markerPercent: 71,
      markerPosition: '71%',
    })
  })

  it('falls back to the empty state when goal inputs are incomplete', () => {
    expect(
      getGoalProgressDetails({
        startWeight: 92,
        goalWeight: null,
        currentWeight: 80,
        progressPercent: null,
      })
    ).toEqual({
      hasGoalData: false,
      markerPercent: 0,
      markerPosition: '0%',
    })
  })
})
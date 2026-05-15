export function createSampleSettings(overrides = {}) {
  return {
    startWeight: '85',
    goalWeight: '72',
    dailyCalorieTarget: '2000',
    dailyStepTarget: '8000',
    ...overrides,
  }
}

export function createBlankSettings(overrides = {}) {
  return createSampleSettings({
    startWeight: '',
    goalWeight: '',
    dailyCalorieTarget: '',
    dailyStepTarget: '',
    ...overrides,
  })
}
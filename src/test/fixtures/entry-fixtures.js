export function createSampleEntry(overrides = {}) {
  return {
    date: '2026-05-14',
    weight: '80',
    weight7dma: 79.5,
    calories: '1900',
    steps: '9000',
    exerciseType: 'Walking',
    exerciseMinutes: '40',
    ...overrides,
  }
}

export function createSecondarySampleEntry(overrides = {}) {
  return {
    date: '2026-05-13',
    weight: '81',
    weight7dma: 81,
    calories: '2100',
    steps: '7000',
    exerciseType: '',
    exerciseMinutes: '',
    ...overrides,
  }
}

export function createSampleEntries() {
  return [createSampleEntry(), createSecondarySampleEntry()]
}

export function createSampleEntryDraft(overrides = {}) {
  return {
    date: '2026-05-14',
    weight: '80',
    weight7dma: 79.5,
    calories: '1900',
    steps: '9000',
    exerciseType: 'Walking',
    exerciseMinutes: '40',
    ...overrides,
  }
}

export function createBlankEntry(overrides = {}) {
  return createSampleEntry({
    weight: '',
    weight7dma: '',
    calories: '',
    steps: '',
    exerciseType: '',
    exerciseMinutes: '',
    ...overrides,
  })
}

export function createBlankEntryDraft(overrides = {}) {
  return createSampleEntryDraft({
    weight: '',
    weight7dma: null,
    calories: '',
    steps: '',
    exerciseType: '',
    exerciseMinutes: '',
    ...overrides,
  })
}
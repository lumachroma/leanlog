import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockLoadAppSnapshot = vi.fn()
const mockSaveSettingsSnapshot = vi.fn()
const mockUpsertEntryRecord = vi.fn()
const mockDeleteEntryRecord = vi.fn()

vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual('@/lib/db')

  return {
    ...actual,
    loadAppSnapshot: mockLoadAppSnapshot,
    saveSettingsSnapshot: mockSaveSettingsSnapshot,
    upsertEntryRecord: mockUpsertEntryRecord,
    deleteEntryRecord: mockDeleteEntryRecord,
  }
})

describe('useAppStore', () => {
  let useAppStore

  beforeEach(async () => {
    vi.resetModules()

    ;({ useAppStore } = await import('./useAppStore'))

    useAppStore.setState({
      settings: {
        startWeight: '85',
        goalWeight: '72',
        dailyCalorieTarget: '2000',
        dailyStepTarget: '8000',
      },
      entries: [],
      selectedDate: '2026-05-14',
      entryDraft: {
        date: '2026-05-14',
        weight: '',
        weight7dma: null,
        calories: '',
        steps: '',
        exerciseType: '',
        exerciseMinutes: '',
      },
      isHydrated: true,
      isSavingSettings: false,
      isSavingEntry: false,
      errorMessage: null,
    })

    mockLoadAppSnapshot.mockReset()
    mockSaveSettingsSnapshot.mockReset()
    mockUpsertEntryRecord.mockReset()
    mockDeleteEntryRecord.mockReset()
  })

  afterEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      entries: [],
      errorMessage: null,
      isSavingSettings: false,
      isSavingEntry: false,
    }))
  })

  it('refreshes the selected draft from recalculated entries after deleting another day', async () => {
    useAppStore.setState((state) => ({
      ...state,
      entries: [
        {
          date: '2026-05-14',
          weight: '80',
          weight7dma: 79.5,
          calories: '1900',
          steps: '9000',
          exerciseType: 'Walking',
          exerciseMinutes: '40',
        },
        {
          date: '2026-05-13',
          weight: '81',
          weight7dma: 80.5,
          calories: '2100',
          steps: '7000',
          exerciseType: '',
          exerciseMinutes: '',
        },
      ],
      entryDraft: {
        date: '2026-05-14',
        weight: '80',
        weight7dma: 79.5,
        calories: '1900',
        steps: '9000',
        exerciseType: 'Walking',
        exerciseMinutes: '40',
      },
    }))

    mockDeleteEntryRecord.mockResolvedValue([
      {
        date: '2026-05-14',
        weight: '80',
        weight7dma: 80,
        calories: '1900',
        steps: '9000',
        exerciseType: 'Walking',
        exerciseMinutes: '40',
      },
    ])

    await useAppStore.getState().deleteEntry('2026-05-13')

    expect(useAppStore.getState().entries).toEqual([
      {
        date: '2026-05-14',
        weight: '80',
        weight7dma: 80,
        calories: '1900',
        steps: '9000',
        exerciseType: 'Walking',
        exerciseMinutes: '40',
      },
    ])
    expect(useAppStore.getState().entryDraft).toEqual({
      date: '2026-05-14',
      weight: '80',
      weight7dma: 80,
      calories: '1900',
      steps: '9000',
      exerciseType: 'Walking',
      exerciseMinutes: '40',
    })
  })
})
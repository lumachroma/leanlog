import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  createBlankEntryDraft,
  createSampleEntry,
  createSampleEntryDraft,
  createSecondarySampleEntry,
} from '@/test/leanlog-test-fixtures'

import { getNextAvailableDate } from './DailyHistoryPage.helpers'
import { DailyHistoryPage } from './DailyHistoryPage'

const stubMobileViewport = () => {
  const matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMedia,
  })

  return matchMedia
}

const stubImmediateAnimationFrame = () => {
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    configurable: true,
    value: vi.fn((callback) => {
      callback(0)
      return 0
    }),
  })
}

const stubIntersectionObserver = () => {
  let latestCallback = null
  const observe = vi.fn()
  const disconnect = vi.fn()

  class MockIntersectionObserver {
    constructor(callback) {
      latestCallback = callback
    }

    observe = observe
    disconnect = disconnect
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })

  return {
    observe,
    disconnect,
    trigger(isIntersecting) {
      latestCallback?.([{ isIntersecting }])
    },
  }
}

describe('DailyHistoryPage', () => {
  it('shows the sticky quick add card only after the top launcher scrolls out of a longer history', async () => {
    const user = userEvent.setup()
    const intersectionObserver = stubIntersectionObserver()

    stubImmediateAnimationFrame()

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 700,
    })

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1400,
    })

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    render(
      <DailyHistoryPage
        entries={[
          createSampleEntry(),
          createSecondarySampleEntry(),
          createSecondarySampleEntry({ date: '2026-05-12' }),
          createSecondarySampleEntry({ date: '2026-05-11' }),
          createSecondarySampleEntry({ date: '2026-05-10' }),
        ]}
        selectedDate="2026-05-14"
        entryDraft={createSampleEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /add entry/i })).not.toBeInTheDocument()

    intersectionObserver.trigger(false)

    await waitFor(() => {
      expect(screen.getByText(/quick add/i)).toBeInTheDocument()
      expect(screen.getByText(/next open day:/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add entry/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /add entry/i }))

    expect(screen.getByRole('dialog', { name: /daily log/i })).toBeInTheDocument()
  })

  it('renders saved entries and routes edit/delete actions', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()
    const updateEntryDraftField = vi.fn()
    const saveEntry = vi.fn()
    const deleteEntry = vi.fn()

    render(
      <DailyHistoryPage
        entries={[createSampleEntry()]}
        selectedDate="2026-05-14"
        entryDraft={createSampleEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={setSelectedDate}
        updateEntryDraftField={updateEntryDraftField}
        saveEntry={saveEntry}
        deleteEntry={deleteEntry}
      />
    )

    expect(screen.getByText(/daily timeline/i)).toBeInTheDocument()
    expect(screen.getByText(/1 exercise day across 1 logged day/i)).toBeInTheDocument()
    expect(screen.getByText(/thu, may 14, 2026/i)).toBeInTheDocument()
  expect(screen.queryByRole('dialog', { name: /daily log/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('dialog', { name: /daily log/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close daily log/i }))
    await user.click(screen.getByRole('button', { name: /delete entry/i }))
    expect(screen.getByText(/permanently delete this entry/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirm delete/i }))

    expect(setSelectedDate).toHaveBeenCalledWith('2026-05-14')
    expect(deleteEntry).toHaveBeenCalledWith('2026-05-14')
  })

  it('groups entries by month and supports month filtering', async () => {
    const user = userEvent.setup()

    render(
      <DailyHistoryPage
        entries={[
          createSampleEntry(),
          createSecondarySampleEntry({ date: '2026-04-14', weight: '81' }),
        ]}
        selectedDate="2026-05-14"
        entryDraft={createSampleEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /all months/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^May 2026$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^April 2026$/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^April 2026$/i }))

    expect(screen.getByText(/apr 14, 2026/i)).toBeInTheDocument()
    expect(screen.queryByText(/thu, may 14, 2026/i)).not.toBeInTheDocument()
  })

  it('keeps the drawer collapsed until a new day is explicitly opened', async () => {
    const user = userEvent.setup()

    render(
      <DailyHistoryPage
        entries={[createSampleEntry()]}
        selectedDate="2026-05-15"
        entryDraft={createBlankEntryDraft({ date: '2026-05-15' })}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    expect(screen.queryByRole('dialog', { name: /daily log/i })).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /new entry/i }))

    expect(screen.getByRole('heading', { name: /new daily log/i })).toBeInTheDocument()
    expect(screen.getByText(/new day/i)).toBeInTheDocument()
    expect(
      screen.queryByText(
        /capture a day quickly, then return to the timeline with everything in sync/i
      )
    ).not.toBeInTheDocument()
  })

  it('creates a new entry using the next available date', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()
    const entries = [createSampleEntry()]

    render(
      <DailyHistoryPage
        entries={entries}
        selectedDate="2026-05-14"
        entryDraft={createSampleEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={setSelectedDate}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /new entry/i }))

    expect(setSelectedDate).toHaveBeenCalledWith(getNextAvailableDate(entries))
  })

  it('opens the drawer on mobile after quick actions', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()
    const entries = [createSampleEntry()]

    stubMobileViewport()
    stubImmediateAnimationFrame()

    render(
      <DailyHistoryPage
        entries={entries}
        selectedDate="2026-05-14"
        entryDraft={createSampleEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={setSelectedDate}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /new entry/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /new entry/i }))

    expect(setSelectedDate).toHaveBeenCalledWith(getNextAvailableDate(entries))
    expect(screen.getByRole('dialog', { name: /daily log/i })).toHaveClass('h-[85dvh]')
  })

  it('asks before discarding unsaved changes when switching days', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()
    const entries = [createSampleEntry()]

    render(
      <DailyHistoryPage
        entries={entries}
        selectedDate="2026-05-14"
        entryDraft={createSampleEntryDraft({ weight: '81.2' })}
        isSavingEntry={false}
        setSelectedDate={setSelectedDate}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /new entry/i }))

    expect(
      screen.getByText(/discard your unsaved changes before switching days or closing the drawer/i)
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /discard changes/i }))

    expect(setSelectedDate).toHaveBeenCalledWith(getNextAvailableDate(entries))
  })

  it('shows the empty state when no history exists', () => {
    render(
      <DailyHistoryPage
        entries={[]}
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
        deleteEntry={vi.fn()}
      />
    )

    expect(screen.getByText(/no saved history yet/i)).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: /daily log/i })).not.toBeInTheDocument()
  })
})
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { todayDate } from '@/lib/db'
import {
  createBlankEntryDraft,
  createSampleEntry,
  createSampleEntryDraft,
  createSecondarySampleEntry,
} from '@/test/leanlog-test-fixtures'

import { DailyHistoryPage } from './DailyHistoryPage'

const getNextAvailableDate = (entries) => {
  const occupiedDates = new Set(entries.map((entry) => entry.date))
  const nextDate = new Date(`${todayDate()}T00:00:00`)

  while (occupiedDates.has(nextDate.toISOString().slice(0, 10))) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  return nextDate.toISOString().slice(0, 10)
}

describe('DailyHistoryPage', () => {
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

    expect(screen.getByText(/review and edit saved days/i)).toBeInTheDocument()
    expect(screen.getByText(/thu, may 14, 2026/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(screen.getByText(/delete this saved day permanently/i)).toBeInTheDocument()
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

    expect(screen.getByText(/no exercise saved/i)).toBeInTheDocument()
    expect(screen.queryByText(/thu, may 14, 2026/i)).not.toBeInTheDocument()
  })

  it('surfaces create mode in the editor when the selected date is new', () => {
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

    expect(screen.getByText(/create a new day/i)).toBeInTheDocument()
    expect(screen.getByText(/create mode/i)).toBeInTheDocument()
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
  })
})
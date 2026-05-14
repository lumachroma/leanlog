import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DailyHistoryPage } from './DailyHistoryPage'

describe('DailyHistoryPage', () => {
  it('renders saved entries and routes edit/delete actions', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()
    const updateEntryDraftField = vi.fn()
    const saveEntry = vi.fn()
    const deleteEntry = vi.fn()

    render(
      <DailyHistoryPage
        entries={[
          {
            date: '2026-05-14',
            weight: '80',
            calories: '1900',
            steps: '9000',
            exercise: 'Incline walk',
          },
        ]}
        selectedDate="2026-05-14"
        entryDraft={{
          date: '2026-05-14',
          weight: '80',
          calories: '1900',
          steps: '9000',
          exercise: 'Incline walk',
        }}
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
    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(setSelectedDate).toHaveBeenCalledWith('2026-05-14')
    expect(deleteEntry).toHaveBeenCalledWith('2026-05-14')
  })

  it('shows the empty state when no history exists', () => {
    render(
      <DailyHistoryPage
        entries={[]}
        selectedDate="2026-05-14"
        entryDraft={{
          date: '2026-05-14',
          weight: '',
          calories: '',
          steps: '',
          exercise: '',
        }}
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
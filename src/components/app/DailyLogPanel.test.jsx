import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createBlankEntryDraft } from '@/test/leanlog-test-fixtures'

import { DailyLogPanel } from './DailyLogPanel'

describe('DailyLogPanel', () => {
  it('updates entry fields and submits the daily log', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()
    const updateEntryDraftField = vi.fn()
    const saveEntry = vi.fn()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        activeDays={3}
        exerciseDays={2}
        setSelectedDate={setSelectedDate}
        updateEntryDraftField={updateEntryDraftField}
        saveEntry={saveEntry}
      />
    )

    fireEvent.change(screen.getByLabelText(/^Date$/i), {
      target: { value: '2026-05-12' },
    })
    fireEvent.change(screen.getByLabelText(/^Weight$/i), {
      target: { value: '72.4' },
    })
    fireEvent.change(screen.getByLabelText(/Exercise Type/i), {
      target: { value: 'Walking' },
    })
    fireEvent.change(screen.getByLabelText(/Exercise Minutes/i), {
      target: { value: '40' },
    })
    await user.click(screen.getByRole('button', { name: /save day/i }))

    expect(setSelectedDate).toHaveBeenCalledWith('2026-05-12')
    expect(updateEntryDraftField).toHaveBeenCalledWith('weight', '72.4')
    expect(updateEntryDraftField).toHaveBeenCalledWith('exerciseType', 'Walking')
    expect(updateEntryDraftField).toHaveBeenCalledWith('exerciseMinutes', '40')
    expect(saveEntry).toHaveBeenCalledTimes(1)
  })

  it('shows the saving state on submit button', () => {
    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={true}
        activeDays={0}
        exerciseDays={0}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})
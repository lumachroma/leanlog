import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { todayDate } from '@/lib/db'
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
    await user.click(screen.getByRole('button', { name: /^Walking$/i }))
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

  it('toggles a selected exercise type chip off', async () => {
    const user = userEvent.setup()
    const updateEntryDraftField = vi.fn()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft({ exerciseType: 'Walking' })}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={updateEntryDraftField}
        saveEntry={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /^Walking$/i }))

    expect(updateEntryDraftField).toHaveBeenCalledWith('exerciseType', '')
  })

  it('shows the saving state on submit button', () => {
    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={true}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('routes close actions through the drawer close control', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        onClose={onClose}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /close daily log/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('offers a one-tap shortcut for today', async () => {
    const user = userEvent.setup()
    const setSelectedDate = vi.fn()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={setSelectedDate}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /^today$/i }))

    expect(setSelectedDate).toHaveBeenCalledWith(todayDate())
  })
})
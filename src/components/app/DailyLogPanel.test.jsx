import { fireEvent, render, screen, within } from '@testing-library/react'
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
    fireEvent.change(screen.getByRole('spinbutton', { name: /^Weight$/i }), {
      target: { value: '72.4' },
    })
    await user.click(screen.getByRole('button', { name: /^Walking$/i }))
    fireEvent.change(screen.getByRole('spinbutton', { name: /Exercise Minutes/i }), {
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

  it('supports touch-first quick adjustments for numeric fields', async () => {
    const user = userEvent.setup()
    const updateEntryDraftField = vi.fn()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={updateEntryDraftField}
        saveEntry={vi.fn()}
      />
    )

    await user.click(
      within(screen.getByRole('group', { name: /weight controls/i })).getByRole(
        'button',
        { name: /^increase$/i }
      )
    )
    await user.click(screen.getByRole('button', { name: /^80$/i }))
    await user.click(screen.getByRole('button', { name: /^2000$/i }))
    await user.click(screen.getByRole('button', { name: /^10k$/i }))
    await user.click(screen.getByRole('button', { name: /^45 min$/i }))

    expect(updateEntryDraftField).toHaveBeenCalledWith('weight', '40.0')
    expect(updateEntryDraftField).toHaveBeenCalledWith('weight', '80.0')
    expect(updateEntryDraftField).toHaveBeenCalledWith('calories', '2000')
    expect(updateEntryDraftField).toHaveBeenCalledWith('steps', '10000')
    expect(updateEntryDraftField).toHaveBeenCalledWith('exerciseMinutes', '45')
  })

  it('supports slider adjustments for touch-first numeric fields', () => {
    const updateEntryDraftField = vi.fn()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={updateEntryDraftField}
        saveEntry={vi.fn()}
      />
    )

    fireEvent.change(screen.getByRole('slider', { name: /^Weight slider$/i }), {
      target: { value: '69' },
    })
    fireEvent.change(screen.getByRole('slider', { name: /^Calories slider$/i }), {
      target: { value: '2301' },
    })

    expect(updateEntryDraftField).toHaveBeenCalledWith('weight', '69.0')
    expect(updateEntryDraftField).toHaveBeenCalledWith('calories', '2301')
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

  it('opens the native date picker from the desktop date action when available', async () => {
    const user = userEvent.setup()

    render(
      <DailyLogPanel
        selectedDate="2026-05-14"
        entryDraft={createBlankEntryDraft()}
        isSavingEntry={false}
        setSelectedDate={vi.fn()}
        updateEntryDraftField={vi.fn()}
        saveEntry={vi.fn()}
      />
    )

    const dateInput = screen.getByLabelText(/^Date$/i)
    dateInput.showPicker = vi.fn()

    await user.click(screen.getByRole('button', { name: /open date picker/i }))

    expect(dateInput.showPicker).toHaveBeenCalledTimes(1)
  })
})
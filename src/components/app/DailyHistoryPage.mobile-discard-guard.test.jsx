import { useState } from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/ui/drawer', async () => {
  const React = await import('react')

  function Drawer({ open, onOpenChange, children }) {
    React.useEffect(() => {
      if (!open) {
        return undefined
      }

      const handleTestClose = () => {
        onOpenChange(false)
      }

      window.addEventListener('test-drawer-close', handleTestClose)

      return () => {
        window.removeEventListener('test-drawer-close', handleTestClose)
      }
    }, [open, onOpenChange])

    return <div data-testid="mock-drawer-root">{children}</div>
  }

  function DrawerContent({ children, className, ...props }) {
    return (
      <div role="dialog" aria-label="Daily log" className={className} {...props}>
        {children}
      </div>
    )
  }

  function DrawerTitle({ children }) {
    return <span>{children}</span>
  }

  return {
    Drawer,
    DrawerContent,
    DrawerTitle,
  }
})

import {
  createSampleEntry,
} from '@/test/leanlog-test-fixtures'

import { DailyHistoryPage } from './DailyHistoryPage'

function DailyHistoryPageStateHarness() {
  const [selectedDate, setSelectedDate] = useState('2026-05-14')
  const [entryDraft, setEntryDraft] = useState(createSampleEntry())

  return (
    <DailyHistoryPage
      entries={[createSampleEntry()]}
      selectedDate={selectedDate}
      entryDraft={entryDraft}
      isSavingEntry={false}
      setSelectedDate={(date) => {
        setSelectedDate(date)
      }}
      updateEntryDraftField={(field, value) => {
        setEntryDraft((currentDraft) => ({
          ...currentDraft,
          [field]: value,
        }))
      }}
      saveEntry={vi.fn()}
      deleteEntry={vi.fn()}
    />
  )
}

describe('DailyHistoryPage mobile discard guard', () => {
  it('ignores drawer close events while a form field remains focused', async () => {
    const user = userEvent.setup()

    render(<DailyHistoryPageStateHarness />)

    await user.click(screen.getByRole('button', { name: /edit/i }))

    const weightInput = screen.getByLabelText(/^weight$/i)

    await user.clear(weightInput)
    await user.type(weightInput, '81.2')
    expect(weightInput).toHaveFocus()

    window.dispatchEvent(new Event('test-drawer-close'))

    await waitFor(() => {
      expect(
        screen.queryByText(
          /discard your unsaved changes before switching days or closing the drawer/i
        )
      ).not.toBeInTheDocument()
    })

    expect(screen.getByRole('dialog', { name: /daily log/i })).toBeInTheDocument()
  })
})
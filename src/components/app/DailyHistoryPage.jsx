import { useMemo, useRef, useState } from 'react'

import { Clock3, PencilLine, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { todayDate } from '@/lib/db'

import { DailyLogPanel } from './DailyLogPanel'
import { EmptyStatePanel } from './EmptyStatePanel'

const formatValue = (value, suffix) => {
  if (!value) {
    return `--${suffix ? ` ${suffix}` : ''}`
  }

  return `${value}${suffix ? ` ${suffix}` : ''}`
}

const formatDateLabel = (date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

const formatMonthLabel = (monthKey) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${monthKey}-01T00:00:00`))

const formatShortDateLabel = (date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

const formatExerciseSummary = (entry) => {
  const exerciseType = entry.exerciseType?.trim()
  const exerciseMinutes = entry.exerciseMinutes?.trim()

  if (!exerciseType && !exerciseMinutes) {
    return 'No exercise saved.'
  }

  if (exerciseType && exerciseMinutes) {
    return `${exerciseType} • ${exerciseMinutes} min`
  }

  if (exerciseType) {
    return exerciseType
  }

  return `${exerciseMinutes} min`
}

const hasExercise = (entry) =>
  Boolean(entry.exerciseType?.trim() || entry.exerciseMinutes?.trim())

const getNextAvailableDate = (entries) => {
  const occupiedDates = new Set(entries.map((entry) => entry.date))
  const nextDate = new Date(`${todayDate()}T00:00:00`)

  while (occupiedDates.has(nextDate.toISOString().slice(0, 10))) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  return nextDate.toISOString().slice(0, 10)
}

function DailyHistoryPage({
  entries,
  selectedDate,
  entryDraft,
  isSavingEntry,
  setSelectedDate,
  updateEntryDraftField,
  saveEntry,
  deleteEntry,
}) {
  const [pendingDeleteDate, setPendingDeleteDate] = useState(null)
  const [activeMonthKey, setActiveMonthKey] = useState('all')
  const editorPanelRef = useRef(null)

  const availableMonthKeys = useMemo(
    () => [...new Set(entries.map((entry) => entry.date.slice(0, 7)))],
    [entries]
  )
  const nextEntryDate = useMemo(() => getNextAvailableDate(entries), [entries])
  const visibleMonthKey = availableMonthKeys.includes(activeMonthKey)
    ? activeMonthKey
    : 'all'
  const visibleEntries =
    visibleMonthKey === 'all'
      ? entries
      : entries.filter((entry) => entry.date.startsWith(visibleMonthKey))
  const groupedEntries = useMemo(() => {
    const groups = new Map()

    visibleEntries.forEach((entry) => {
      const monthKey = entry.date.slice(0, 7)
      const group = groups.get(monthKey) ?? []
      group.push(entry)
      groups.set(monthKey, group)
    })

    return [...groups.entries()]
  }, [visibleEntries])
  const isEditingExistingEntry = entries.some((entry) => entry.date === selectedDate)

  const revealEditorPanel = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    if (window.matchMedia('(min-width: 1280px)').matches) {
      return
    }

    const reveal = () => {
      const editorPanel = editorPanelRef.current

      if (!editorPanel) {
        return
      }

      if (typeof editorPanel.scrollIntoView === 'function') {
        editorPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      if (typeof editorPanel.focus === 'function') {
        editorPanel.focus()
      }
    }

    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(reveal)
      return
    }

    reveal()
  }

  const handleCreateEntry = () => {
    setSelectedDate(nextEntryDate)
    revealEditorPanel()
  }

  const handleSelectEntry = (date) => {
    setSelectedDate(date)
    revealEditorPanel()
  }

  const handleDeleteRequest = (date) => {
    setPendingDeleteDate(date)
  }

  const handleDeleteCancel = () => {
    setPendingDeleteDate(null)
  }

  const handleDeleteConfirm = async (date) => {
    await deleteEntry(date)
    setPendingDeleteDate(null)
  }

  return (
    <main className="grid flex-1 items-start gap-6 pb-28 pt-4 sm:pb-8 sm:pt-6 xl:grid-cols-[0.9fr_1.1fr] xl:py-10">
      <aside
        ref={editorPanelRef}
        tabIndex={-1}
        className="order-first outline-none xl:order-last xl:sticky xl:top-6"
      >
        <DailyLogPanel
          selectedDate={selectedDate}
          entryDraft={entryDraft}
          isSavingEntry={isSavingEntry}
          activeDays={entries.length}
          exerciseDays={entries.filter(hasExercise).length}
          title={isEditingExistingEntry ? 'Edit Entry' : 'New Entry'}
          modeLabel={isEditingExistingEntry ? 'Editing saved day' : 'Ready for a new day'}
          description={
            isEditingExistingEntry
              ? 'Update or remove a saved day while keeping your long-term trends and summaries intact.'
              : 'Capture a new day first, then use the history below to review or fine-tune older entries.'
          }
          setSelectedDate={setSelectedDate}
          updateEntryDraftField={updateEntryDraftField}
          saveEntry={saveEntry}
        />
      </aside>

      <section className="order-last rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur xl:order-first">
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Daily history
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
              Daily Timeline
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              Browse, review, and update your saved entries through a clear
              day-by-day history of your progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={handleCreateEntry}>
              New entry
            </Button>
            <Clock3 className="size-4 text-muted-foreground" />
          </div>
        </div>

        {availableMonthKeys.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={visibleMonthKey === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveMonthKey('all')}
            >
              All months
            </Button>
            {availableMonthKeys.map((monthKey) => (
              <Button
                key={monthKey}
                type="button"
                size="sm"
                variant={visibleMonthKey === monthKey ? 'default' : 'outline'}
                onClick={() => setActiveMonthKey(monthKey)}
              >
                {formatMonthLabel(monthKey)}
              </Button>
            ))}
          </div>
        ) : null}

        {entries.length ? (
          <div className="mt-6 space-y-6">
            {groupedEntries.length ? (
              groupedEntries.map(([monthKey, monthEntries]) => (
                <section key={monthKey} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {formatMonthLabel(monthKey)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {monthEntries.length} {monthEntries.length === 1 ? 'day' : 'days'}
                    </p>
                  </div>

                  {monthEntries.map((entry) => {
                    const isSelected = entry.date === selectedDate
                    const isPendingDelete = pendingDeleteDate === entry.date

                    return (
                      <article
                        key={entry.date}
                        className={`rounded-[1.5rem] border px-4 py-3 transition sm:p-4 ${
                          isSelected
                            ? 'border-foreground/15 bg-muted/50 shadow-sm'
                            : 'border-border/80 bg-muted/30'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {formatDateLabel(entry.date)}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {formatExerciseSummary(entry)}
                              </p>
                            </div>

                            <div className="flex shrink-0 gap-2">
                              <Button
                                type="button"
                                variant={isSelected ? 'default' : 'outline'}
                                size="sm"
                                className="gap-2"
                                onClick={() => handleSelectEntry(entry.date)}
                              >
                                <PencilLine className="size-4" />
                                Edit
                              </Button>
                              {isPendingDelete ? (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDeleteCancel}
                                    disabled={isSavingEntry}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => void handleDeleteConfirm(entry.date)}
                                    disabled={isSavingEntry}
                                  >
                                    <Trash2 className="size-4" />
                                    Confirm delete
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleDeleteRequest(entry.date)}
                                  disabled={isSavingEntry}
                                >
                                  <Trash2 className="size-4" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] bg-background/70 p-3 text-sm">
                            <div className="min-w-0">
                              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                                Weight
                              </p>
                              <p className="mt-1 truncate font-medium text-foreground">
                                {formatValue(entry.weight, 'kg')}
                              </p>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                                Calories
                              </p>
                              <p className="mt-1 truncate font-medium text-foreground">
                                {formatValue(entry.calories, 'kcal')}
                              </p>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                                Steps
                              </p>
                              <p className="mt-1 truncate font-medium text-foreground">
                                {formatValue(entry.steps, '')}
                              </p>
                            </div>
                          </div>
                        </div>
                        {isPendingDelete ? (
                          <p className="mt-4 text-xs leading-6 text-destructive">
                            Delete this saved day permanently from local history?
                          </p>
                        ) : null}
                      </article>
                    )
                  })}
                </section>
              ))
            ) : (
              <EmptyStatePanel>No saved days match this month filter.</EmptyStatePanel>
            )}
          </div>
        ) : (
          <EmptyStatePanel className="mt-6">
            No saved history yet. Create your first daily entry from the editor above.
          </EmptyStatePanel>
        )}
      </section>

      <div className="fixed inset-x-4 bottom-4 z-20 xl:hidden">
        <div className="rounded-[1.5rem] border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Quick add
              </p>
              <p className="mt-1 truncate text-sm font-medium text-foreground">
                Next open day: {formatShortDateLabel(nextEntryDate)}
              </p>
            </div>
            <Button type="button" size="sm" className="gap-2" onClick={handleCreateEntry}>
              <Plus className="size-4" />
              Add entry
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export { DailyHistoryPage }
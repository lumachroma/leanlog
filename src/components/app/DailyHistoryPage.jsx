import { useMemo, useState } from 'react'

import { Clock3, PencilLine, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { todayDate } from '@/lib/db'

import { DailyLogPanel } from './DailyLogPanel'

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

  const availableMonthKeys = useMemo(
    () => [...new Set(entries.map((entry) => entry.date.slice(0, 7)))],
    [entries]
  )
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

  const handleCreateEntry = () => {
    setSelectedDate(getNextAvailableDate(entries))
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
    <main className="grid flex-1 gap-6 py-8 xl:grid-cols-[0.9fr_1.1fr] xl:py-10">
      <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Daily history
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
              Review and edit saved days
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              Select a saved day to edit it, or create a fresh entry without manually
              hunting for an unused date.
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
                        className={`rounded-[1.5rem] border p-4 transition ${
                          isSelected
                            ? 'border-foreground/15 bg-muted/50 shadow-sm'
                            : 'border-border/80 bg-background/70'
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {formatDateLabel(entry.date)}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {entry.exercise?.trim()
                                  ? entry.exercise
                                  : 'No exercise note saved.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">Weight</p>
                                <p className="mt-1 font-medium text-foreground">
                                  {formatValue(entry.weight, 'kg')}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Calories</p>
                                <p className="mt-1 font-medium text-foreground">
                                  {formatValue(entry.calories, 'kcal')}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Steps</p>
                                <p className="mt-1 font-medium text-foreground">
                                  {formatValue(entry.steps, '')}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              className="gap-2"
                              onClick={() => setSelectedDate(entry.date)}
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
              <div className="rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
                No saved days match this month filter.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
            No saved history yet. Create your first daily entry from the editor on the
            right.
          </div>
        )}
      </section>

      <aside>
        <DailyLogPanel
          selectedDate={selectedDate}
          entryDraft={entryDraft}
          isSavingEntry={isSavingEntry}
          activeDays={entries.length}
          exerciseDays={entries.filter((entry) => entry.exercise.trim()).length}
          title={isEditingExistingEntry ? 'Edit saved day' : 'Create a new day'}
          modeLabel={isEditingExistingEntry ? 'Editing mode' : 'Create mode'}
          description={
            isEditingExistingEntry
              ? 'You are editing a saved daily record. Update the fields and save to overwrite it.'
              : 'You are creating a fresh daily record for a date that is not saved yet.'
          }
          setSelectedDate={setSelectedDate}
          updateEntryDraftField={updateEntryDraftField}
          saveEntry={saveEntry}
        />
      </aside>
    </main>
  )
}

export { DailyHistoryPage }
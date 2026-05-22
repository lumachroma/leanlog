import { useEffect, useMemo, useRef, useState } from 'react'

import { Check, Clock3, Flame, Footprints, PencilLine, Plus, Scale, Trash2, X } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { Button } from '@/components/ui/button'
import {
  formatFullDateLabel,
  formatMonthLabel,
  formatShortDateLabel,
} from '@/lib/date-utils'

import { SectionHeading } from './SectionHeading'
import { DailyLogPanel } from './DailyLogPanel'
import {
  formatExerciseSummary,
  formatHistoryValue,
  getNextAvailableDate,
  hasExercise,
} from './DailyHistoryPage.helpers'
import { EmptyStatePanel } from './EmptyStatePanel'

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
  const [isEditorVisible, setIsEditorVisible] = useState(true)
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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return undefined
    }

    const editorPanel = editorPanelRef.current

    if (!editorPanel) {
      return undefined
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsEditorVisible(entry?.isIntersecting ?? true)
      },
      { threshold: 0.2 }
    )

    observer.observe(editorPanel)

    return () => {
      observer.disconnect()
    }
  }, [])

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

  const handleSelectEntryClick = (event) => {
    handleSelectEntry(event.currentTarget.dataset.entryDate)
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

      <AppSurface className="order-last p-6 xl:order-first">
        <div className="border-b border-border/80 pb-5">
          <div className="flex items-start justify-between gap-4">
            <SectionHeading eyebrow="Daily history" title="Daily Timeline" />
            <div className="flex shrink-0 items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={handleCreateEntry}>
                New entry
              </Button>
              <Clock3 className="size-4 text-muted-foreground" />
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Browse, review, and update your saved entries through a clear
            day-by-day history of your progress.
          </p>
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
                        className={`rounded-2xl border px-4 py-3 transition ${
                          isSelected
                            ? 'border-foreground/15 bg-muted/50 shadow-sm'
                            : 'border-border/80 bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-snug text-foreground">
                              {formatFullDateLabel(entry.date)}
                            </p>
                            {hasExercise(entry) ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {formatExerciseSummary(entry)}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5">
                            {isPendingDelete ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  title="Cancel"
                                  onClick={handleDeleteCancel}
                                  disabled={isSavingEntry}
                                >
                                  <X className="size-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  title="Confirm delete"
                                  onClick={() => void handleDeleteConfirm(entry.date)}
                                  disabled={isSavingEntry}
                                >
                                  <Check className="size-3.5" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="icon"
                                  className="size-8 rounded-full"
                                  title="Edit entry"
                                  data-entry-date={entry.date}
                                  onClick={handleSelectEntryClick}
                                >
                                  <PencilLine className="size-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                  title="Delete entry"
                                  onClick={() => handleDeleteRequest(entry.date)}
                                  disabled={isSavingEntry}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* mobile: compact inline row */}
                        <div className="mt-2 flex items-center gap-3 text-xs sm:hidden">
                          <span className="flex items-center gap-1">
                            <Scale className="size-3 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {formatHistoryValue(entry.weight, 'kg')}
                            </span>
                          </span>
                          <span className="text-border/60">·</span>
                          <span className="flex items-center gap-1">
                            <Flame className="size-3 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {formatHistoryValue(entry.calories, 'kcal')}
                            </span>
                          </span>
                          <span className="text-border/60">·</span>
                          <span className="flex items-center gap-1">
                            <Footprints className="size-3 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {formatHistoryValue(entry.steps, 'steps')}
                            </span>
                          </span>
                        </div>

                        {/* desktop: stacked label + value grid, matching weekly averages style */}
                        <div className="mt-3 hidden grid-cols-3 gap-3 text-sm sm:grid">
                          <div>
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Scale className="size-3.5" />
                              Weight
                            </p>
                            <p className="mt-1 font-medium text-foreground">
                              {formatHistoryValue(entry.weight, 'kg')}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Flame className="size-3.5" />
                              Calories
                            </p>
                            <p className="mt-1 font-medium text-foreground">
                              {formatHistoryValue(entry.calories, 'kcal')}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center gap-1.5 text-muted-foreground">
                              <Footprints className="size-3.5" />
                              Steps
                            </p>
                            <p className="mt-1 font-medium text-foreground">
                              {formatHistoryValue(entry.steps, 'steps')}
                            </p>
                          </div>
                        </div>

                        {isPendingDelete ? (
                          <p className="mt-2 text-xs leading-5 text-destructive">
                            Permanently delete this entry? Tap ✓ to confirm.
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
      </AppSurface>

      {!isEditorVisible ? (
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
      ) : null}
    </main>
  )
}

export { DailyHistoryPage }
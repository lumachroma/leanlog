import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Footprints,
  PencilLine,
  Plus,
  Scale,
  Trash2,
  X,
} from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'
import { createEmptyEntryDraft } from '@/lib/db'
import {
  formatFullDateLabel,
  formatMonthLabel,
  formatShortDateLabel,
} from '@/lib/date-utils'

import { DailyLogPanel } from './DailyLogPanel'
import {
  formatExerciseSummary,
  formatHistoryValue,
  getNextAvailableDate,
  hasExercise,
} from './DailyHistoryPage.helpers'
import { EmptyStatePanel } from './EmptyStatePanel'
import { SectionHeading } from './SectionHeading'

const EDITABLE_DRAFT_FIELDS = [
  'weight',
  'calories',
  'steps',
  'exerciseType',
  'exerciseMinutes',
]

const normalizeDraftValue = (value) => String(value ?? '').trim()

const createPendingAction = (type, payload = {}) => ({ type, ...payload })
const STICKY_DRAWER_HISTORY_OVERFLOW = 160
const FIELD_SELECTOR = 'input, textarea, select, [contenteditable="true"]'
const COLLAPSED_MONTH_FILTER_COUNT = 2

const isFieldFocusedWithinElement = (element) => {
  if (!element || typeof document === 'undefined') {
    return false
  }

  const activeElement = document.activeElement

  if (!(activeElement instanceof Element) || !element.contains(activeElement)) {
    return false
  }

  return activeElement.matches(FIELD_SELECTOR)
}

const deferCloseCheck = (callback) => {
  if (typeof window === 'undefined') {
    callback()
    return
  }

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      callback()
    })
    return
  }

  window.setTimeout(callback, 0)
}

const hasOverflowingHistory = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }

  const viewportHeight = window.innerHeight || 0
  const documentHeight = document.documentElement?.scrollHeight || 0

  return documentHeight > viewportHeight + STICKY_DRAWER_HISTORY_OVERFLOW
}

const HISTORY_METRICS = [
  {
    key: 'weight',
    label: 'Weight',
    Icon: Scale,
    suffix: 'kg',
  },
  {
    key: 'calories',
    label: 'Calories',
    Icon: Flame,
    suffix: 'kcal',
  },
  {
    key: 'steps',
    label: 'Steps',
    Icon: Footprints,
    suffix: 'steps',
  },
]

const isNoOpProtectedAction = ({ action, selectedDate, nextEntryDate }) => {
  switch (action?.type) {
    case 'create':
      return selectedDate === nextEntryDate
    case 'select-date':
      return action.date === selectedDate
    default:
      return false
  }
}

function DailyHistoryPage({
  entries,
  selectedDate,
  entryDraft,
  isSavingEntry,
  setSelectedDate,
  updateEntryDraftField,
  replaceEntryDraft,
  saveEntry,
  deleteEntry,
}) {
  const [pendingDeleteDate, setPendingDeleteDate] = useState(null)
  const [activeMonthKey, setActiveMonthKey] = useState('all')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [hasLongHistory, setHasLongHistory] = useState(false)
  const [isLauncherVisible, setIsLauncherVisible] = useState(true)
  const [areMonthFiltersExpanded, setAreMonthFiltersExpanded] = useState(false)
  const launcherSectionRef = useRef(null)
  const dailyLogPanelRef = useRef(null)

  const availableMonthKeys = useMemo(
    () => [...new Set(entries.map((entry) => entry.date.slice(0, 7)))].sort((left, right) =>
      right.localeCompare(left)
    ),
    [entries]
  )
  const collapsedMonthKeys = useMemo(() => {
    const latestMonthKeys = availableMonthKeys.slice(0, COLLAPSED_MONTH_FILTER_COUNT)

    if (
      activeMonthKey !== 'all' &&
      availableMonthKeys.includes(activeMonthKey) &&
      !latestMonthKeys.includes(activeMonthKey)
    ) {
      return [...latestMonthKeys, activeMonthKey]
    }

    return latestMonthKeys
  }, [activeMonthKey, availableMonthKeys])
  const monthKeysToRender =
    areMonthFiltersExpanded || availableMonthKeys.length <= COLLAPSED_MONTH_FILTER_COUNT
      ? availableMonthKeys
      : collapsedMonthKeys
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
  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.date === selectedDate) ?? null,
    [entries, selectedDate]
  )
  const isEditingExistingEntry = Boolean(selectedEntry)
  const activeDays = entries.length
  const exerciseDays = entries.filter(hasExercise).length
  const exerciseHistorySummary = `${exerciseDays} exercise ${exerciseDays === 1 ? 'day' : 'days'} across ${activeDays} logged ${activeDays === 1 ? 'day' : 'days'}.`
  const selectedBaselineEntry = selectedEntry ?? createEmptyEntryDraft(selectedDate)
  const isDraftDirty = EDITABLE_DRAFT_FIELDS.some(
    (field) =>
      normalizeDraftValue(entryDraft[field]) !==
      normalizeDraftValue(selectedBaselineEntry[field])
  )
  const drawerStatusLabel = isSavingEntry
    ? 'Saving'
    : isDraftDirty
      ? 'Unsaved changes'
      : isEditingExistingEntry
        ? 'Saved day'
        : 'New day'
  const drawerStatusTone = isSavingEntry
    ? 'saving'
    : isDraftDirty
      ? 'attention'
      : 'muted'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleResize = () => {
      setHasLongHistory(hasOverflowingHistory())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    if (typeof window.requestAnimationFrame === 'function') {
      const frameId = window.requestAnimationFrame(() => {
        setHasLongHistory(hasOverflowingHistory())
      })

      return () => {
        if (typeof window.cancelAnimationFrame === 'function') {
          window.cancelAnimationFrame(frameId)
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      setHasLongHistory(hasOverflowingHistory())
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [entries, visibleMonthKey, pendingDeleteDate])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return undefined
    }

    const launcherSection = launcherSectionRef.current

    if (!launcherSection) {
      return undefined
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsLauncherVisible(entry?.isIntersecting ?? true)
      },
      { threshold: 0.2 }
    )

    observer.observe(launcherSection)

    return () => {
      observer.disconnect()
    }
  }, [])

  const clearPendingAction = () => {
    setPendingAction(null)
  }

  const performPendingAction = (action) => {
    switch (action?.type) {
      case 'close':
        setIsDrawerOpen(false)
        return
      case 'create':
        setSelectedDate(nextEntryDate)
        setIsDrawerOpen(true)
        return
      case 'select-date':
        if (!action.date) {
          setIsDrawerOpen(true)
          return
        }

        setSelectedDate(action.date)
        setIsDrawerOpen(true)
        return
      default:
    }
  }

  const requestProtectedAction = (action) => {
    if (isSavingEntry) {
      return
    }

    if (isNoOpProtectedAction({ action, selectedDate, nextEntryDate })) {
      clearPendingAction()
      setIsDrawerOpen(true)
      return
    }

    if (isDraftDirty) {
      setPendingAction(action)
      setIsDrawerOpen(true)
      return
    }

    clearPendingAction()
    performPendingAction(action)
  }

  const requestDrawerClose = () => {
    requestProtectedAction(createPendingAction('close'))
  }

  const handleDrawerOpenChange = (nextOpen) => {
    if (nextOpen) {
      clearPendingAction()
      setIsDrawerOpen(true)
      return
    }

    deferCloseCheck(() => {
      if (isFieldFocusedWithinElement(dailyLogPanelRef.current)) {
        return
      }

      requestDrawerClose()
    })
  }

  const handleCreateEntry = () => {
    requestProtectedAction(createPendingAction('create'))
  }

  const handleSelectEntry = (date) => {
    requestProtectedAction(createPendingAction('select-date', { date }))
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

  const handleDateChange = (date) => {
    requestProtectedAction(createPendingAction('select-date', { date }))
  }

  const handleUpdateDraftField = (field, value) => {
    clearPendingAction()
    updateEntryDraftField(field, value)
  }

  const handleSaveEntry = async () => {
    clearPendingAction()
    await saveEntry()
  }

  const resetDraftToBaseline = () => {
    if (typeof replaceEntryDraft === 'function') {
      replaceEntryDraft(selectedBaselineEntry)
      return
    }

    EDITABLE_DRAFT_FIELDS.forEach((field) => {
      const nextValue = normalizeDraftValue(selectedBaselineEntry[field])

      if (normalizeDraftValue(entryDraft[field]) !== nextValue) {
        updateEntryDraftField(field, nextValue)
      }
    })
  }

  const handleConfirmDiscard = () => {
    const action = pendingAction

    resetDraftToBaseline()
    clearPendingAction()
    performPendingAction(action)
  }

  return (
    <main className="relative flex flex-1 flex-col pb-28 pt-4 sm:pb-32 sm:pt-6 xl:pb-36 xl:pt-10">
      <AppSurface className="p-6">
        <div className="border-b border-border/80 pb-5">
          <div ref={launcherSectionRef} className="flex items-start justify-between gap-4">
            <SectionHeading eyebrow="Daily history" title="Daily Timeline" />
            <div className="flex shrink-0 items-center gap-3">
              <Button type="button" size="sm" className="gap-2" onClick={handleCreateEntry}>
                <Plus className="size-4" />
                New entry
              </Button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Browse, review, and update your saved entries through a clear
            day-by-day history of your progress.
          </p>
          <p className="mt-2">
            <span className="inline-flex max-w-full rounded-full border border-border/70 bg-muted/35 px-2.5 py-1 text-[0.7rem] font-medium leading-5 text-muted-foreground sm:px-3 sm:text-xs">
              {exerciseHistorySummary}
            </span>
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
              All
            </Button>
            {monthKeysToRender.map((monthKey) => (
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
            {availableMonthKeys.length > COLLAPSED_MONTH_FILTER_COUNT ? (
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="h-8 rounded-full px-2.5 text-xs text-muted-foreground"
                aria-label={areMonthFiltersExpanded ? 'Collapse month filters' : 'Expand month filters'}
                onClick={() => setAreMonthFiltersExpanded((currentValue) => !currentValue)}
              >
                {areMonthFiltersExpanded ? (
                  <>
                    <ChevronUp className="size-3.5" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3.5" />
                    More
                  </>
                )}
              </Button>
            ) : null}
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
                    const historyMetrics = HISTORY_METRICS.map(
                      ({ key, label, Icon, suffix }) => ({
                        key,
                        label,
                        Icon,
                        value: formatHistoryValue(entry[key], suffix),
                      })
                    )

                    return (
                      <article
                        key={entry.date}
                        className={`rounded-2xl border px-4 py-3 transition ${
                          isSelected
                            ? 'border-foreground/15 bg-muted/50 shadow-sm'
                            : 'border-border/80 bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left"
                            onClick={() => handleSelectEntry(entry.date)}
                          >
                            <p className="text-sm font-medium leading-snug text-foreground">
                              {formatFullDateLabel(entry.date)}
                            </p>
                            {hasExercise(entry) ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {formatExerciseSummary(entry)}
                              </p>
                            ) : null}
                          </button>

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
                                  onClick={() => handleSelectEntry(entry.date)}
                                >
                                  <PencilLine className="size-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
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

                        <div className="mt-2 flex items-center gap-3 text-xs sm:hidden">
                          {historyMetrics.map(({ key, Icon, value }, index) => (
                            <div key={key} className="contents">
                              {index > 0 ? <span className="text-border/60">·</span> : null}
                              <span className="flex items-center gap-1">
                                <Icon className="size-3 text-muted-foreground" />
                                <span className="font-medium text-foreground">{value}</span>
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 hidden grid-cols-3 gap-3 text-sm sm:grid">
                          {historyMetrics.map(({ key, label, Icon, value }) => (
                            <div key={key}>
                              <p className="flex items-center gap-1.5 text-muted-foreground">
                                <Icon className="size-3.5" />
                                {label}
                              </p>
                              <p className="mt-1 font-medium text-foreground">{value}</p>
                            </div>
                          ))}
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
            No saved history yet. Create your first daily entry from the drawer below.
          </EmptyStatePanel>
        )}
      </AppSurface>

      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        {isDrawerOpen ? (
          <DrawerContent
            aria-describedby={undefined}
            className="mx-auto max-h-[85dvh] w-full max-w-4xl border-0 bg-transparent p-0 shadow-none"
          >
            <div className="sr-only">
              <DrawerTitle>Daily log</DrawerTitle>
            </div>
            <DailyLogPanel
              panelRef={dailyLogPanelRef}
              selectedDate={selectedDate}
              entryDraft={entryDraft}
              isSavingEntry={isSavingEntry}
              title={isEditingExistingEntry ? 'Edit daily log' : 'New daily log'}
              statusLabel={drawerStatusLabel}
              statusTone={drawerStatusTone}
              discardPrompt={
                pendingAction ? 'Discard unsaved changes?' : null
              }
              onConfirmDiscard={handleConfirmDiscard}
              onCancelDiscard={clearPendingAction}
              onClose={requestDrawerClose}
              setSelectedDate={handleDateChange}
              updateEntryDraftField={handleUpdateDraftField}
              saveEntry={handleSaveEntry}
            />
          </DrawerContent>
        ) : null}

        {hasLongHistory && !isLauncherVisible && !isDrawerOpen ? (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="pointer-events-auto w-full max-w-4xl rounded-[1.5rem] border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Quick Add
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    Next open day: {formatShortDateLabel(nextEntryDate)}
                  </p>
                </div>
                <Button type="button" size="sm" className="gap-2" onClick={handleCreateEntry}>
                  <Plus className="size-4" />
                  Add Entry
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </main>
  )
}

export { DailyHistoryPage }
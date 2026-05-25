import { useRef } from 'react'

import { CalendarDays, Check, Sparkles, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EXERCISE_TYPE_OPTIONS, todayDate } from '@/lib/db'

import { Field } from './Field'
import { TouchNumberInput } from './TouchNumberInput'
import {
  calorieTouchInputConfig,
  exerciseMinuteTouchInputConfig,
  stepTouchInputConfig,
  weightTouchInputConfig,
} from './touch-number-input-config'

const fieldLabelClassName = 'text-sm font-medium text-foreground'

const statusToneClassNames = {
  attention: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100',
  muted: 'border-border/80 bg-muted/40 text-muted-foreground',
  saving: 'border-foreground/15 bg-foreground/10 text-foreground',
}

function DailyLogPanel({
  panelRef,
  selectedDate,
  entryDraft,
  isSavingEntry,
  title = 'One focused entry per day',
  statusLabel,
  statusTone = 'muted',
  discardPrompt,
  onConfirmDiscard,
  onCancelDiscard,
  onClose,
  setSelectedDate,
  updateEntryDraftField,
  saveEntry,
}) {
  const dateInputRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    void saveEntry()
  }

  const handleSetToday = () => {
    setSelectedDate(todayDate())
  }

  const handleExerciseTypeSelect = (option) => {
    updateEntryDraftField(
      'exerciseType',
      entryDraft.exerciseType === option ? '' : option
    )
  }

  const handleOpenDatePicker = () => {
    const dateInput = dateInputRef.current

    if (!dateInput) {
      return
    }

    if (typeof dateInput.showPicker === 'function') {
      dateInput.showPicker()
      return
    }

    dateInput.focus()
    dateInput.click()
  }

  return (
    <form
      ref={panelRef}
      onSubmit={handleSubmit}
      className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[1.9rem] border border-border/80 bg-background/95 p-3 shadow-[0_-20px_70px_-34px_rgba(15,23,42,0.5)] backdrop-blur sm:max-h-[75dvh] sm:p-5"
    >
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border/80 sm:mb-4" />

      <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-3 sm:pb-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Daily log
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 sm:mt-2">
            <h2 className="text-xl font-medium tracking-[-0.04em] sm:text-2xl">{title}</h2>
            {statusLabel ? (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] ${statusToneClassNames[statusTone] ?? statusToneClassNames.muted}`}
              >
                {statusLabel}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          <Sparkles className="mt-0.5 size-4 text-muted-foreground" />
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close daily log"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="scrollbar-hidden mt-3 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1 sm:mt-4">
        <div className="space-y-3 pb-2 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="daily-log-date" className={fieldLabelClassName}>
                Date
              </label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  aria-label="Open date picker"
                  onClick={handleOpenDatePicker}
                >
                  <CalendarDays className="size-3.5" />
                  Pick
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={selectedDate === todayDate() ? 'default' : 'outline'}
                  onClick={handleSetToday}
                >
                  Today
                </Button>
              </div>
            </div>
            <input
              ref={dateInputRef}
              id="daily-log-date"
              aria-label="Date"
              type="date"
              className="mt-1 w-full rounded-[1rem] border border-border/80 bg-background/90 px-3.5 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 sm:mt-1.5 sm:py-2.5"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Weight" htmlFor="daily-log-weight">
              <TouchNumberInput
                id="daily-log-weight"
                ariaLabel="Weight"
                {...weightTouchInputConfig}
                value={entryDraft.weight}
                onValueChange={(nextValue) => updateEntryDraftField('weight', nextValue)}
                placeholder="72.4"
              />
            </Field>

            <Field label="Calories" htmlFor="daily-log-calories">
              <TouchNumberInput
                id="daily-log-calories"
                ariaLabel="Calories"
                {...calorieTouchInputConfig}
                value={entryDraft.calories}
                onValueChange={(nextValue) => updateEntryDraftField('calories', nextValue)}
                placeholder="1980"
              />
            </Field>

            <Field label="Steps" htmlFor="daily-log-steps">
              <TouchNumberInput
                id="daily-log-steps"
                ariaLabel="Steps"
                {...stepTouchInputConfig}
                value={entryDraft.steps}
                onValueChange={(nextValue) => updateEntryDraftField('steps', nextValue)}
                placeholder="8412"
              />
            </Field>

            <Field label="Exercise Minutes" htmlFor="exercise-minutes">
              <TouchNumberInput
                id="exercise-minutes"
                ariaLabel="Exercise Minutes"
                {...exerciseMinuteTouchInputConfig}
                value={entryDraft.exerciseMinutes}
                onValueChange={(nextValue) =>
                  updateEntryDraftField('exerciseMinutes', nextValue)
                }
                placeholder="40"
              />
            </Field>
          </div>

          <div>
            <label id="exercise-type-label" className={fieldLabelClassName}>
              Exercise Type
            </label>
            <div
              role="group"
              aria-labelledby="exercise-type-label"
              className="mt-1.5 flex flex-wrap gap-2 rounded-[1.15rem] border border-border/80 bg-background/90 p-2 shadow-sm"
            >
              {EXERCISE_TYPE_OPTIONS.map((option) => {
                const isSelected = entryDraft.exerciseType === option

                return (
                  <Button
                    key={option}
                    type="button"
                    size="xs"
                    variant={isSelected ? 'default' : 'outline'}
                    aria-pressed={isSelected}
                    onClick={() => handleExerciseTypeSelect(option)}
                  >
                    {option}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2.5 border-t border-border/70 bg-background/98 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-xs leading-5 text-muted-foreground backdrop-blur sm:mt-4 sm:space-y-3 sm:pt-4 sm:pb-0">
        {discardPrompt ? (
          <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-900 dark:text-amber-100 sm:rounded-[1.1rem] sm:px-3.5 sm:py-3">
            <p className="min-w-0 text-xs font-medium leading-5">{discardPrompt}</p>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 rounded-full border-amber-500/30 bg-background/80 text-amber-900 hover:bg-background dark:text-amber-100"
                aria-label="Keep editing"
                title="Keep editing"
                onClick={onCancelDiscard}
              >
                <X className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="default"
                size="icon"
                className="size-8 rounded-full"
                aria-label="Discard changes"
                title="Discard changes"
                onClick={onConfirmDiscard}
              >
                <Check className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>If every field is blank, saving removes this day.</p>
          <Button
            type="submit"
            size="sm"
            className="w-full sm:w-auto"
            disabled={isSavingEntry}
          >
            {isSavingEntry ? 'Saving...' : 'Save day'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export { DailyLogPanel }
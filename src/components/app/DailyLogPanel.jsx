import { Sparkles, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EXERCISE_TYPE_OPTIONS, todayDate } from '@/lib/db'

import { Field } from './Field'

const inputClassName =
  'mt-1.5 w-full rounded-[1rem] border border-border/80 bg-background/90 px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'
const fieldLabelClassName = 'text-sm font-medium text-foreground'

const statusToneClassNames = {
  attention: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100',
  muted: 'border-border/80 bg-muted/40 text-muted-foreground',
  saving: 'border-foreground/15 bg-foreground/10 text-foreground',
}

function DailyLogPanel({
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[1.9rem] border border-border/80 bg-background/95 p-4 shadow-[0_-20px_70px_-34px_rgba(15,23,42,0.5)] backdrop-blur sm:max-h-[75dvh] sm:p-5"
    >
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border/80" />

      <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Daily log
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
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

      <div className="scrollbar-hidden mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
        <div className="space-y-4 pb-2">
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="daily-log-date" className={fieldLabelClassName}>
                Date
              </label>
              <Button
                type="button"
                size="xs"
                variant={selectedDate === todayDate() ? 'default' : 'outline'}
                onClick={handleSetToday}
              >
                Today
              </Button>
            </div>
            <input
              id="daily-log-date"
              aria-label="Date"
              type="date"
              className={`${inputClassName} appearance-none`}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Field label="Weight">
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                className={inputClassName}
                value={entryDraft.weight}
                onChange={(event) => updateEntryDraftField('weight', event.target.value)}
                placeholder="72.4"
              />
            </Field>

            <Field label="Calories">
              <input
                type="number"
                inputMode="numeric"
                className={inputClassName}
                value={entryDraft.calories}
                onChange={(event) => updateEntryDraftField('calories', event.target.value)}
                placeholder="1980"
              />
            </Field>

            <Field label="Steps">
              <input
                type="number"
                inputMode="numeric"
                className={inputClassName}
                value={entryDraft.steps}
                onChange={(event) => updateEntryDraftField('steps', event.target.value)}
                placeholder="8412"
              />
            </Field>

            <Field label="Exercise Minutes">
              <input
                id="exercise-minutes"
                aria-label="Exercise Minutes"
                type="number"
                inputMode="numeric"
                min="0"
                className={inputClassName}
                value={entryDraft.exerciseMinutes}
                onChange={(event) =>
                  updateEntryDraftField('exerciseMinutes', event.target.value)
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

      <div className="mt-4 space-y-3 border-t border-border/70 pt-4 text-xs leading-5 text-muted-foreground">
        {discardPrompt ? (
          <div className="flex flex-col gap-3 rounded-[1.1rem] border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-amber-900 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between">
            <p>{discardPrompt}</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onCancelDiscard}>
                Keep editing
              </Button>
              <Button type="button" variant="default" size="sm" onClick={onConfirmDiscard}>
                Discard changes
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
import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EXERCISE_TYPE_OPTIONS, todayDate } from '@/lib/db'

import { Field } from './Field'

const inputClassName =
  'mt-1.5 w-full rounded-[1.15rem] border border-border/80 bg-background/90 px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'
const fieldLabelClassName =
  'text-sm font-medium text-foreground'

function DailyLogPanel({
  selectedDate,
  entryDraft,
  isSavingEntry,
  activeDays,
  exerciseDays,
  title = 'One focused entry per day',
  description,
  modeLabel,
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
      className="rounded-[1.8rem] border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur sm:p-5"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Daily log
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-medium tracking-[-0.04em] sm:text-2xl">{title}</h2>
            {modeLabel ? (
              <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {modeLabel}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-2 hidden max-w-lg text-sm leading-6 text-muted-foreground xl:block">
              {description}
            </p>
          ) : null}
        </div>
        <Sparkles className="mt-0.5 shrink-0 size-4 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-3">
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

        <div className="grid grid-cols-3 gap-3">
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              id="exercise-type-label"
              className={fieldLabelClassName}
            >
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

          <div>
            <label
              htmlFor="exercise-minutes"
              className={`${fieldLabelClassName} whitespace-nowrap`}
            >
              Exercise Minutes
            </label>
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
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs leading-5 text-muted-foreground">
        <div className="space-y-1">
          <p>{exerciseDays} exercise days across {activeDays} logged days.</p>
          <p>If every field is blank, saving removes this day.</p>
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isSavingEntry}
        >
          {isSavingEntry ? 'Saving...' : 'Save day'}
        </Button>
      </div>
    </form>
  )
}

export { DailyLogPanel }
import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EXERCISE_TYPE_OPTIONS } from '@/lib/db'

import { Field } from './Field'

const inputClassName =
  'mt-2 w-full rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'

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

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-5">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Daily log
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-medium tracking-[-0.04em]">{title}</h2>
            {modeLabel ? (
              <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {modeLabel}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <Sparkles className="mt-1 size-4 text-muted-foreground" />
      </div>

      <div className="mt-6 grid gap-4">
        <Field label="Date">
          <input
            type="date"
            className={inputClassName}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </Field>

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

        <div className="block">
          <div className="text-sm font-medium text-foreground">Exercise</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="exercise-type"
                className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                Exercise Type
              </label>
              <select
                id="exercise-type"
                aria-label="Exercise Type"
                className={inputClassName}
                value={entryDraft.exerciseType}
                onChange={(event) =>
                  updateEntryDraftField('exerciseType', event.target.value)
                }
              >
                <option value="">Select a type</option>
                {EXERCISE_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="exercise-minutes"
                className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
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
          <div className="mt-2 block text-xs text-muted-foreground">
            Leave all fields blank for a date if you want the saved entry removed.
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs leading-6 text-muted-foreground">
          {exerciseDays} exercise days saved across {activeDays} logged days.
        </p>
        <Button type="submit" disabled={isSavingEntry}>
          {isSavingEntry ? 'Saving...' : 'Save day'}
        </Button>
      </div>
    </form>
  )
}

export { DailyLogPanel }
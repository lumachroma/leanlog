import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Field } from './Field'

const inputClassName =
  'mt-2 w-full rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'

function DailyLogPanel({
  selectedDate,
  entryDraft,
  isSavingEntry,
  activeDays,
  exerciseDays,
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
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
            One focused entry per day
          </h2>
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

        <Field
          label="Exercise"
          hint="Leave all fields blank for a date if you want the saved entry removed."
        >
          <textarea
            rows="4"
            className={`${inputClassName} resize-none`}
            value={entryDraft.exercise}
            onChange={(event) => updateEntryDraftField('exercise', event.target.value)}
            placeholder="40 min incline walk"
          />
        </Field>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs leading-6 text-muted-foreground">
          {exerciseDays} exercise notes saved across {activeDays} logged days.
        </p>
        <Button type="submit" disabled={isSavingEntry}>
          {isSavingEntry ? 'Saving...' : 'Save day'}
        </Button>
      </div>
    </form>
  )
}

export { DailyLogPanel }
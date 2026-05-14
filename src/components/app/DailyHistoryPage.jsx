import { Clock3, PencilLine, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

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
              Select a saved day to edit it. To create a new record, change the date
              in the editor to a day that does not exist yet and save it.
            </p>
          </div>
          <Clock3 className="mt-1 size-4 text-muted-foreground" />
        </div>

        {entries.length ? (
          <div className="mt-6 space-y-3">
            {entries.map((entry) => {
              const isSelected = entry.date === selectedDate

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
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => void deleteEntry(entry.date)}
                        disabled={isSavingEntry}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
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
          setSelectedDate={setSelectedDate}
          updateEntryDraftField={updateEntryDraftField}
          saveEntry={saveEntry}
        />
      </aside>
    </main>
  )
}

export { DailyHistoryPage }
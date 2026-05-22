import { useRef, useState } from 'react'

import { Settings2 } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { SectionHeading } from '@/components/app/SectionHeading'
import { Button } from '@/components/ui/button'
import {
  createDailyLogCsvTemplate,
  serializeEntriesToCsv,
} from '@/lib/daily-log-csv'

import { Field } from './Field'

const inputClassName =
  'mt-1.5 w-full rounded-[1.15rem] border border-border/80 bg-background/90 px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5'
const settingsGridLabelClassName = 'flex min-h-10 items-end sm:min-h-0'
const DAILY_LOG_CSV_IMPORT_MAX_BYTES = 1024 * 1024
const CSV_MIME_TYPES = new Set(['text/csv', 'application/csv', 'application/vnd.ms-excel'])

const createImportFeedback = (tone, message) => ({ tone, message })

const getImportFileError = (file) => {
  const fileName = String(file?.name ?? '').toLowerCase()
  const fileType = String(file?.type ?? '').toLowerCase()
  const hasCsvExtension = fileName.endsWith('.csv')
  const hasCsvMimeType = CSV_MIME_TYPES.has(fileType)

  if (!hasCsvExtension && !hasCsvMimeType) {
    return 'Choose a CSV file before importing daily logs.'
  }

  if (file.size === 0) {
    return 'The selected CSV file is empty.'
  }

  if (file.size > DAILY_LOG_CSV_IMPORT_MAX_BYTES) {
    return 'CSV files must be 1 MB or smaller.'
  }

  return null
}

function SettingsPanel({
  entries,
  isImportingEntries,
  importEntriesFromCsv,
  settings,
  isSavingSettings,
  updateSettingsField,
  saveSettings,
}) {
  const fileInputRef = useRef(null)
  const [importFeedback, setImportFeedback] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    void saveSettings()
  }

  const handleExport = () => {
    downloadCsvFile(
      serializeEntriesToCsv(entries),
      `leanlog-daily-logs-${new Date().toISOString().slice(0, 10)}.csv`
    )
  }

  const handleDownloadTemplate = () => {
    downloadCsvFile(createDailyLogCsvTemplate(), 'leanlog-daily-logs-template.csv')
  }

  const downloadCsvFile = (csv, filename) => {
    const downloadUrl = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    )
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = filename
    link.click()

    URL.revokeObjectURL(downloadUrl)
  }

  const handleImportChange = async (event) => {
    const [file] = event.target.files ?? []

    if (!file) {
      return
    }

    const fileError = getImportFileError(file)

    if (fileError) {
      setImportFeedback(createImportFeedback('error', fileError))
      event.target.value = ''
      return
    }

    setImportFeedback(null)

    try {
      const csvText = await file.text()
      const result = await importEntriesFromCsv(csvText)

      if (result?.errorMessage) {
        setImportFeedback(createImportFeedback('error', result.errorMessage))
      } else if (result?.importedCount) {
        setImportFeedback(
          createImportFeedback(
            'success',
            `Imported ${result.importedCount} daily ${
              result.importedCount === 1 ? 'log' : 'logs'
            } from CSV.`
          )
        )
      } else {
        setImportFeedback(
          createImportFeedback('neutral', 'No importable daily logs were found in that CSV.')
        )
      }
    } catch {
      setImportFeedback(
        createImportFeedback('error', 'Unable to read that CSV file right now.')
      )
    }

    event.target.value = ''
  }

  return (
    <AppSurface as="form" onSubmit={handleSubmit} className="p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        aria-label="Import daily logs CSV"
        className="sr-only"
        onChange={(event) => {
          void handleImportChange(event)
        }}
      />

      <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-5">
        <SectionHeading
          eyebrow="Settings"
          title="Tracking Defaults"
          description="These starting values power your dashboard, summaries, and future progress calculations."
        />
        <Settings2 className="mt-1 size-4 text-muted-foreground" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Start weight (kg)" labelClassName={settingsGridLabelClassName}>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            className={inputClassName}
            value={settings.startWeight}
            onChange={(event) => updateSettingsField('startWeight', event.target.value)}
            placeholder="85.0"
          />
        </Field>

        <Field label="Goal weight (kg)" labelClassName={settingsGridLabelClassName}>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            className={inputClassName}
            value={settings.goalWeight}
            onChange={(event) => updateSettingsField('goalWeight', event.target.value)}
            placeholder="72.0"
          />
        </Field>

        <Field
          label="Daily calorie target (kcal)"
          labelClassName={settingsGridLabelClassName}
        >
          <input
            type="number"
            inputMode="numeric"
            className={inputClassName}
            value={settings.dailyCalorieTarget}
            onChange={(event) =>
              updateSettingsField('dailyCalorieTarget', event.target.value)
            }
            placeholder="2000"
          />
        </Field>

        <Field
          label="Daily step target (steps)"
          labelClassName={settingsGridLabelClassName}
        >
          <input
            type="number"
            inputMode="numeric"
            className={inputClassName}
            value={settings.dailyStepTarget}
            onChange={(event) => updateSettingsField('dailyStepTarget', event.target.value)}
            placeholder="8000"
          />
        </Field>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        These settings are stored locally in IndexedDB.
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs leading-6 text-muted-foreground">
          Future iteration support: charts, cloud sync, and mobile can reuse this model.
        </p>
        <Button type="submit" disabled={isSavingSettings}>
          {isSavingSettings ? 'Saving...' : 'Save settings'}
        </Button>
      </div>

      <section className="mt-6 border-t border-border/80 pt-6">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Daily logs
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.03em]">
            Data Backup & Restore
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Keep a portable copy of your daily logs or restore saved entries
            anytime using simple CSV files.
          </p>
          <p className="mt-2 text-sm italic leading-7 text-muted-foreground">
            Imports are merged by date and overwrite matching saved days, while
            missing days stay untouched.
          </p>
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            CSV columns: date, weight, calories, steps, exerciseType, exerciseMinutes.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Download the template first if you want a clean starter file with the
            expected column order.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
            >
              Download CSV template
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!entries.length}
              onClick={handleExport}
            >
              Export daily logs
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isImportingEntries}
              onClick={() => fileInputRef.current?.click()}
            >
              {isImportingEntries ? 'Importing...' : 'Import daily logs'}
            </Button>
          </div>

          {importFeedback ? (
            <p
              aria-live="polite"
              className={[
                'mt-4 rounded-2xl px-4 py-3 text-sm',
                importFeedback.tone === 'error'
                  ? 'border border-destructive/20 bg-destructive/5 text-destructive'
                  : importFeedback.tone === 'success'
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border border-border/80 bg-background/80 text-muted-foreground',
              ].join(' ')}
            >
              {importFeedback.message}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end border-t border-border/70 pt-4">
            <p className="text-sm text-muted-foreground">
              {entries.length} saved {entries.length === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
      </section>
    </AppSurface>
  )
}

export { SettingsPanel }
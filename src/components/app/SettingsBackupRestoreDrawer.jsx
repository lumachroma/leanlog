import { useRef, useState } from 'react'

import { ArchiveRestore } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  createDailyLogCsvTemplate,
  serializeEntriesToCsv,
} from '@/lib/daily-log-csv'

import { SettingsDrawerFrame } from './SettingsDrawerFrame'

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

function SettingsBackupRestoreDrawer({
  open,
  onOpenChange,
  entries,
  isImportingEntries,
  importEntriesFromCsv,
}) {
  const fileInputRef = useRef(null)
  const [importFeedback, setImportFeedback] = useState(null)

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

  const handleExport = () => {
    downloadCsvFile(
      serializeEntriesToCsv(entries),
      `leanlog-daily-logs-${new Date().toISOString().slice(0, 10)}.csv`
    )
  }

  const handleDownloadTemplate = () => {
    downloadCsvFile(createDailyLogCsvTemplate(), 'leanlog-daily-logs-template.csv')
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
    <SettingsDrawerFrame
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close backup and restore"
      eyebrow="Daily logs"
      Icon={ArchiveRestore}
      title="Data Backup & Restore"
      leadingContent={
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
      }
      headerContent={
        <p className="mt-3 text-sm italic leading-7 text-muted-foreground">
          Imports are merged by date and overwrite matching saved days, while
          missing days stay untouched.
        </p>
      }
    >
      <div className="rounded-[1.5rem] border border-border/80 bg-muted/30 p-4">
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

        <div className="pb-2" />
      </div>
    </SettingsDrawerFrame>
  )
}

export { SettingsBackupRestoreDrawer }
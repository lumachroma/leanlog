const CSV_COLUMN_ORDER = [
  'date',
  'weight',
  'calories',
  'steps',
  'exerciseType',
  'exerciseMinutes',
]

const HEADER_ALIASES = {
  date: 'date',
  weight: 'weight',
  calories: 'calories',
  steps: 'steps',
  exercisetype: 'exerciseType',
  exerciseminutes: 'exerciseMinutes',
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const normalizeHeader = (value) =>
  String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')

const escapeCsvCell = (value) => {
  const text = String(value ?? '')

  if (!/[",\n\r]/.test(text)) {
    return text
  }

  return `"${text.replace(/"/g, '""')}"`
}

const parseCsvRows = (csvText) => {
  const rows = []
  let currentRow = []
  let currentCell = ''
  let inQuotes = false

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index]

    if (inQuotes) {
      if (character === '"') {
        if (csvText[index + 1] === '"') {
          currentCell += '"'
          index += 1
        } else {
          inQuotes = false
        }

        continue
      }

      currentCell += character
      continue
    }

    if (character === '"') {
      inQuotes = true
      continue
    }

    if (character === ',') {
      currentRow.push(currentCell)
      currentCell = ''
      continue
    }

    if (character === '\n' || character === '\r') {
      if (character === '\r' && csvText[index + 1] === '\n') {
        index += 1
      }

      currentRow.push(currentCell)
      rows.push(currentRow)
      currentRow = []
      currentCell = ''
      continue
    }

    currentCell += character
  }

  if (inQuotes) {
    throw new Error('Malformed CSV input.')
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell)
    rows.push(currentRow)
  }

  return rows
}

const isValidDateValue = (value) => {
  if (!DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(year, month - 1, day)

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  )
}

const getCsvCell = (row, headerIndex, headerName) => {
  const index = headerIndex.get(headerName)

  return index === undefined ? '' : String(row[index] ?? '').trim()
}

export function createDailyLogCsvTemplate() {
  return [
    CSV_COLUMN_ORDER.join(','),
    '2026-05-15,78.4,2100,8450,Walking,45',
  ].join('\n')
}

export function serializeEntriesToCsv(entries) {
  const sortedEntries = [...entries].sort((left, right) => left.date.localeCompare(right.date))

  return [
    CSV_COLUMN_ORDER.join(','),
    ...sortedEntries.map((entry) =>
      CSV_COLUMN_ORDER.map((column) => escapeCsvCell(entry[column] ?? '')).join(',')
    ),
  ].join('\n')
}

export function parseEntriesCsv(csvText) {
  const trimmedCsv = String(csvText ?? '').trim()

  if (!trimmedCsv) {
    throw new Error('CSV input is empty.')
  }

  const [headerRow = [], ...dataRows] = parseCsvRows(trimmedCsv)
  const headerIndex = new Map(
    headerRow
      .map((header, index) => [HEADER_ALIASES[normalizeHeader(header)], index])
      .filter(([headerName]) => Boolean(headerName))
  )

  if (!headerIndex.has('date')) {
    throw new Error('CSV input must include a date column.')
  }

  return dataRows.reduce((entries, row, rowIndex) => {
    const entry = {
      date: getCsvCell(row, headerIndex, 'date'),
      weight: getCsvCell(row, headerIndex, 'weight'),
      calories: getCsvCell(row, headerIndex, 'calories'),
      steps: getCsvCell(row, headerIndex, 'steps'),
      exerciseType: getCsvCell(row, headerIndex, 'exerciseType'),
      exerciseMinutes: getCsvCell(row, headerIndex, 'exerciseMinutes'),
      weight7dma: null,
    }

    const hasAnyValue = CSV_COLUMN_ORDER.some((column) => String(entry[column] ?? '').trim())

    if (!hasAnyValue) {
      return entries
    }

    if (!isValidDateValue(entry.date)) {
      throw new Error(`Row ${rowIndex + 2} has an invalid date.`)
    }

    entries.push(entry)
    return entries
  }, [])
}
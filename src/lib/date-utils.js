const DATE_LOCALE = 'en-US'

const createDateFormatter = (options) => new Intl.DateTimeFormat(DATE_LOCALE, options)

const monthDayFormatter = createDateFormatter({
  month: 'short',
  day: 'numeric',
})

const monthDayYearFormatter = createDateFormatter({
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const monthYearFormatter = createDateFormatter({
  month: 'long',
  year: 'numeric',
})

const weekdayMonthDayFormatter = createDateFormatter({
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const weekdayMonthDayYearFormatter = createDateFormatter({
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export const toDateAtMidnight = (date) => new Date(`${date}T00:00:00`)

export const toMonthStartDate = (monthKey) => new Date(`${monthKey}-01T00:00:00`)

export const formatMonthDayLabel = (date) => monthDayFormatter.format(toDateAtMidnight(date))

export const formatMonthDayYearLabel = (date) =>
  monthDayYearFormatter.format(toDateAtMidnight(date))

export const formatMonthLabel = (monthKey) => monthYearFormatter.format(toMonthStartDate(monthKey))

export const formatShortDateLabel = (date) =>
  weekdayMonthDayFormatter.format(toDateAtMidnight(date))

export const formatFullDateLabel = (date) =>
  weekdayMonthDayYearFormatter.format(toDateAtMidnight(date))

export const formatWeekLabel = (weekStart) => `Week of ${formatMonthDayYearLabel(weekStart)}`
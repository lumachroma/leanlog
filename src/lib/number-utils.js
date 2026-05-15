export const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

export const average = (values, options = {}) => {
  if (!values.length) {
    return null
  }

  const total = values.reduce((sum, value) => sum + value, 0)
  const result = total / values.length

  return Number.isInteger(options.precision)
    ? Number(result.toFixed(options.precision))
    : result
}
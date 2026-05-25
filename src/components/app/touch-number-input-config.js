const createPresetOptions = (values, labelFormatter = (value) => `${value}`) =>
  values.map((value) => ({
    value: String(value),
    label: labelFormatter(value),
  }))

const createWeightPresetOptions = (values) =>
  values.map((value) => ({
    value: value.toFixed(1),
    label: `${value}`,
  }))

export const weightTouchInputConfig = {
  step: '0.1',
  min: 0,
  max: 250,
  emptyStepValue: 40,
  inputMode: 'decimal',
  presets: createWeightPresetOptions([40, 60, 80, 100]),
  sliderRange: { min: 0, max: 250 },
  sliderStep: 1,
}

export const calorieTouchInputConfig = {
  step: 100,
  min: 0,
  inputMode: 'numeric',
  presets: createPresetOptions([1600, 1800, 2000, 2200]),
  sliderRange: { min: 0, max: 5000 },
  sliderStep: 1,
}

export const stepTouchInputConfig = {
  step: 500,
  min: 0,
  inputMode: 'numeric',
  presets: createPresetOptions([5000, 8000, 10000, 12000], (value) =>
    value >= 1000 ? `${value / 1000}k` : `${value}`
  ),
  sliderRange: { min: 0, max: 20000 },
  sliderStep: 1,
}

export const exerciseMinuteTouchInputConfig = {
  step: 5,
  min: 0,
  inputMode: 'numeric',
  presets: createPresetOptions([15, 30, 45, 60], (value) => `${value} min`),
  sliderRange: { min: 0, max: 180 },
  sliderStep: 1,
}
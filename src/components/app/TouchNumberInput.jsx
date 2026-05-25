import { useEffect, useState } from 'react'

import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toNumber as parseNumber } from '@/lib/number-utils'
import { cn } from '@/lib/utils'

const getStepPrecision = (step) => {
  const normalizedStep = String(step ?? '')
  const decimalIndex = normalizedStep.indexOf('.')

  if (decimalIndex === -1) {
    return 0
  }

  return normalizedStep.length - decimalIndex - 1
}

const formatValue = (value, precision) => {
  if (!Number.isFinite(value)) {
    return ''
  }

  return precision > 0 ? value.toFixed(precision) : String(Math.round(value))
}

const clampValue = (value, min, max) =>
  Math.max(min ?? Number.NEGATIVE_INFINITY, Math.min(max ?? Number.POSITIVE_INFINITY, value))

const getRoundedStepValue = (value, step, min) => {
  const normalizedStep = Number(step)

  if (!Number.isFinite(normalizedStep) || normalizedStep <= 0) {
    return value
  }

  const baseValue = Number.isFinite(min) ? min : 0
  const precision = getStepPrecision(normalizedStep)
  const steppedValue =
    Math.round((value - baseValue) / normalizedStep) * normalizedStep + baseValue

  return Number(steppedValue.toFixed(precision))
}

const getCoarsePointerMatch = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(pointer: coarse)').matches
}

function TouchNumberInput({
  id,
  ariaLabel,
  value,
  onValueChange,
  step = 1,
  min,
  max,
  emptyStepValue,
  placeholder,
  inputMode = 'numeric',
  presets = [],
  sliderRange,
  sliderStep = 1,
  className,
}) {
  const precision = getStepPrecision(step)
  const currentValue = parseNumber(value)
  const [isCoarsePointer, setIsCoarsePointer] = useState(getCoarsePointerMatch)
  const hasSliderRange =
    Number.isFinite(sliderRange?.min) && Number.isFinite(sliderRange?.max)
  const sliderMin = hasSliderRange ? Number(sliderRange.min) : undefined
  const sliderMax = hasSliderRange ? Number(sliderRange.max) : undefined
  const sliderBaseValue = currentValue ?? sliderMin
  const sliderValue = hasSliderRange
    ? clampValue(
        getRoundedStepValue(sliderBaseValue, sliderStep, sliderMin),
        sliderMin,
        sliderMax
      )
    : undefined

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(pointer: coarse)')
    const handleChange = (event) => setIsCoarsePointer(event.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)

      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)

    return () => mediaQuery.removeListener(handleChange)
  }, [])

  const updateSteppedValue = (direction) => {
    const nextValue =
      currentValue === null
        ? emptyStepValue ?? min ?? 0
        : currentValue + step * direction
    const clampedValue = clampValue(nextValue, min, max)

    onValueChange(formatValue(clampedValue, precision))
  }

  const hasValue = String(value ?? '').trim().length > 0

  return (
    <div className={cn('space-y-2 sm:space-y-2.5', className)}>
      <div
        role="group"
        aria-label={`${ariaLabel} controls`}
        className="flex items-center gap-1.5 rounded-[1rem] border border-border/80 bg-background/90 p-1.5 shadow-sm sm:gap-2 sm:rounded-[1.15rem] sm:p-2"
      >
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          aria-label="Decrease"
          onClick={() => updateSteppedValue(-1)}
        >
          <Minus className="size-4" />
        </Button>

        <input
          id={id}
          aria-label={ariaLabel}
          type="number"
          step={step}
          min={min}
          max={max}
          inputMode={isCoarsePointer ? 'none' : inputMode}
          readOnly={isCoarsePointer}
          className="min-w-0 flex-1 appearance-none rounded-[0.9rem] border border-border/70 bg-background px-3 py-2 text-center text-sm font-medium text-foreground outline-none transition focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 sm:rounded-[0.95rem] sm:px-3.5 sm:py-2.5 sm:text-base"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
        />

        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          aria-label="Increase"
          onClick={() => updateSteppedValue(1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {hasSliderRange ? (
        <div className="space-y-0.5 px-0.5 sm:hidden">
          <div className="flex items-center justify-between text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span>{formatValue(sliderMin, precision)}</span>
            <span>{formatValue(sliderMax, precision)}</span>
          </div>
          <input
            aria-label={`${ariaLabel} slider`}
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={sliderValue}
            onChange={(event) =>
              onValueChange(formatValue(Number(event.target.value), precision))
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
          />
        </div>
      ) : null}

      {presets.length ? (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {presets.map((preset) => {
            const presetLabel = preset.label ?? String(preset.value)
            const presetValue = String(preset.value)

            return (
              <Button
                key={`${ariaLabel}-${presetValue}`}
                type="button"
                size="xs"
                variant={String(value) === presetValue ? 'default' : 'outline'}
                onClick={() => onValueChange(presetValue)}
              >
                {presetLabel}
              </Button>
            )
          })}

          {hasValue ? (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => onValueChange('')}
            >
              Clear
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { TouchNumberInput }
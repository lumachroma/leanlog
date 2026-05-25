import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TouchNumberInput } from './TouchNumberInput'

function mockMatchMedia(matcher) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: matcher(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('TouchNumberInput', () => {
  beforeEach(() => {
    mockMatchMedia(() => false)
  })

  it('keeps typing enabled on non-coarse pointers and uses a 1-step slider', () => {
    render(
      <TouchNumberInput
        id="weight"
        ariaLabel="Weight"
        value="72.4"
        onValueChange={vi.fn()}
        step="0.1"
        min={0}
        max={250}
        inputMode="decimal"
        sliderRange={{ min: 0, max: 250 }}
        sliderStep={1}
      />
    )

    expect(screen.getByRole('spinbutton', { name: /^weight$/i })).toHaveProperty(
      'readOnly',
      false
    )
    expect(screen.getByRole('slider', { name: /^weight slider$/i })).toHaveAttribute(
      'step',
      '1'
    )
  })

  it('makes the numeric field read-only on coarse-pointer devices', () => {
    mockMatchMedia((query) => query === '(pointer: coarse)')

    render(
      <TouchNumberInput
        id="weight"
        ariaLabel="Weight"
        value="72.4"
        onValueChange={vi.fn()}
        step="0.1"
        min={0}
        max={250}
        inputMode="decimal"
        sliderRange={{ min: 0, max: 250 }}
        sliderStep={1}
      />
    )

    expect(screen.getByRole('spinbutton', { name: /^weight$/i })).toHaveProperty(
      'readOnly',
      true
    )
  })

  it('resets the slider thumb to the range minimum when cleared', async () => {
    const user = userEvent.setup()

    function TestHarness() {
      const [value, setValue] = useState('72.4')

      return (
        <TouchNumberInput
          id="weight"
          ariaLabel="Weight"
          value={value}
          onValueChange={setValue}
          step="0.1"
          min={0}
          max={250}
          emptyStepValue={40}
          inputMode="decimal"
          presets={[{ value: '40.0', label: '40' }]}
          sliderRange={{ min: 0, max: 250 }}
          sliderStep={1}
        />
      )
    }

    render(<TestHarness />)

    await user.click(screen.getByRole('button', { name: /^clear$/i }))

    expect(screen.getByRole('spinbutton', { name: /^weight$/i })).toHaveValue(null)
    expect(screen.getByRole('slider', { name: /^weight slider$/i })).toHaveValue('0')
  })
})
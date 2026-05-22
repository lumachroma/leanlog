import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { stubIntersectionObserver } from '@/test/viewport-animation-test-utils'

import { GoalProgressChart } from './GoalProgressChart'

describe('GoalProgressChart', () => {
  it('adds animation hooks to the goal progress visuals when data is available', () => {
    const intersectionObserver = stubIntersectionObserver()
    const { container } = render(
      <GoalProgressChart
        startWeight={92}
        goalWeight={72}
        currentWeight={82}
        progressPercent={50}
      />
    )

    const progressFill = container.querySelector('.chart-grow-x')
    const marker = container.querySelector('.chart-marker-pop')
    const currentLabel = screen.getByText('Current 82.0 kg')

    expect(screen.getByText('50% complete')).toBeInTheDocument()
    expect(progressFill).not.toBeNull()
    expect(progressFill).toHaveStyle('width: 50%')
    expect(progressFill).toHaveStyle('--chart-enter-delay: 80ms')
    expect(marker).not.toBeNull()
    expect(marker).toHaveStyle('left: 50%')
    expect(marker).toHaveStyle('--chart-enter-delay: 360ms')
    expect(currentLabel).toHaveClass('chart-label-slide')
    expect(currentLabel).toHaveStyle('margin-left: 50%')
    expect(currentLabel).toHaveStyle('--chart-enter-delay: 440ms')

    act(() => {
      intersectionObserver.trigger({ isIntersecting: true, intersectionRatio: 0.2 })
    })

    act(() => {
      intersectionObserver.trigger({ isIntersecting: true, intersectionRatio: 0.7 })
    })

    expect(screen.getByText('Current 82.0 kg')).not.toBe(currentLabel)
  })
})
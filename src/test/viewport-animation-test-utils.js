import { vi } from 'vitest'

const createIntersectionEntry = (nextIntersectionState) =>
  typeof nextIntersectionState === 'boolean'
    ? {
        isIntersecting: nextIntersectionState,
        intersectionRatio: nextIntersectionState ? 1 : 0,
      }
    : nextIntersectionState

export const stubIntersectionObserver = ({ isIntersecting = true } = {}) => {
  let observerInstance = null

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: class {
      constructor(callback) {
        this.callback = callback
        observerInstance = this
      }

      observe = vi.fn((target) => {
        this.target = target
        this.callback([
          {
            ...createIntersectionEntry(isIntersecting),
            target,
          },
        ])
      })

      disconnect = vi.fn()
      unobserve = vi.fn()
      takeRecords = vi.fn(() => [])
    },
  })

  return {
    trigger(nextIntersectionState) {
      observerInstance?.callback([
        {
          ...createIntersectionEntry(nextIntersectionState),
          target: observerInstance.target,
        },
      ])
    },
  }
}
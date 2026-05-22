import { useEffect, useRef, useState } from 'react'

const DEFAULT_VIEWPORT_THRESHOLD = 0.35

function useViewportAnimationCycle({ disabled = false, threshold = DEFAULT_VIEWPORT_THRESHOLD } = {}) {
  const targetRef = useRef(null)
  const [animationCycle, setAnimationCycle] = useState(0)
  const hasObservedViewportRef = useRef(false)
  const isIntersectingRef = useRef(false)

  useEffect(() => {
    if (disabled) {
      return undefined
    }

    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return undefined
    }

    const target = targetRef.current

    if (!target) {
      return undefined
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const intersectionRatio = entry?.intersectionRatio ?? (entry?.isIntersecting ? 1 : 0)
        const nextIsIntersecting = intersectionRatio >= threshold

        if (!hasObservedViewportRef.current) {
          hasObservedViewportRef.current = true
          isIntersectingRef.current = nextIsIntersecting
          return
        }

        if (nextIsIntersecting && !isIntersectingRef.current) {
          setAnimationCycle((currentCycle) => currentCycle + 1)
        }

        isIntersectingRef.current = nextIsIntersecting
      },
      { threshold }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [disabled, threshold])

  return { animationCycle, targetRef }
}

export { useViewportAnimationCycle }
import { useViewportAnimationCycle } from '@/hooks/useViewportAnimationCycle'

function ViewportAnimationGroup({
  as: Component = 'div',
  children,
  className,
  disabled = false,
  threshold,
}) {
  const { animationCycle, targetRef } = useViewportAnimationCycle({
    disabled,
    threshold,
  })

  return (
    <Component ref={targetRef} className={className}>
      {children(animationCycle)}
    </Component>
  )
}

export { ViewportAnimationGroup }
import { cn } from '@/lib/utils'

const appSurfaceClassName =
  'rounded-[2rem] border border-border/80 bg-background/90 shadow-sm backdrop-blur'

function AppSurface({ as: Component = 'section', className, children, ...props }) {
  return (
    <Component className={cn(appSurfaceClassName, className)} {...props}>
      {children}
    </Component>
  )
}

export { AppSurface }
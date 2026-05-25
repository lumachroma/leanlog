import { X } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'

function SettingsDrawerFrame({
  open,
  onOpenChange,
  as = 'section',
  onSubmit,
  closeLabel,
  eyebrow,
  Icon,
  title,
  headerContent,
  leadingContent,
  children,
  footer,
}) {
  const Surface = as

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {open ? (
        <DrawerContent
          aria-describedby={undefined}
          className="mx-auto max-h-[88dvh] w-full max-w-3xl border-0 bg-transparent p-0 shadow-none"
        >
          <AppSurface
            as={Surface}
            onSubmit={onSubmit}
            className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[1.9rem] bg-background/95 p-4 shadow-[0_-20px_70px_-34px_rgba(15,23,42,0.5)] sm:max-h-[75dvh] sm:p-5"
          >
            {leadingContent}

            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border/80" />

            <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  {Icon ? <Icon className="size-3.5" /> : null}
                  {eyebrow}
                </div>
                <DrawerTitle className="mt-2 text-2xl font-medium tracking-[-0.03em] text-foreground">
                  {title}
                </DrawerTitle>
                {headerContent}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={closeLabel}
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="scrollbar-hidden mt-4 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
              {children}
            </div>

            {footer ? (
              <div className="mt-4 flex justify-end border-t border-border/70 pt-4">
                {footer}
              </div>
            ) : null}
          </AppSurface>
        </DrawerContent>
      ) : null}
    </Drawer>
  )
}

export { SettingsDrawerFrame }
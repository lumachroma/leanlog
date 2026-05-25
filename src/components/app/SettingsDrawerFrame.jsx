import { X } from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer'

function SettingsDrawerFrame({
  open,
  onOpenChange,
  as = 'section',
  onSubmit,
  compactMobile = false,
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
            className={`flex max-h-[85dvh] flex-col overflow-hidden rounded-[1.9rem] bg-background/95 shadow-[0_-20px_70px_-34px_rgba(15,23,42,0.5)] sm:max-h-[75dvh] sm:p-5 ${compactMobile ? 'p-3' : 'p-4'}`}
          >
            {leadingContent}

            <div
              className={`mx-auto h-1.5 w-12 rounded-full bg-border/80 ${compactMobile ? 'mb-3 sm:mb-4' : 'mb-4'}`}
            />

            <div
              className={`flex items-start justify-between gap-3 border-b border-border/80 ${compactMobile ? 'pb-3 sm:pb-4' : 'pb-4'}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  {Icon ? <Icon className="size-3.5" /> : null}
                  {eyebrow}
                </div>
                <DrawerTitle
                  className={`text-2xl font-medium tracking-[-0.03em] text-foreground ${compactMobile ? 'mt-1.5 sm:mt-2' : 'mt-2'}`}
                >
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

            <div
              className={`scrollbar-hidden min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1 ${compactMobile ? 'mt-3 sm:mt-4' : 'mt-4'}`}
            >
              {children}
            </div>

            {footer ? (
              <div
                className={`flex justify-end border-t border-border/70 bg-background/98 backdrop-blur pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-0 ${compactMobile ? 'mt-3 pt-3 sm:mt-4 sm:pt-4' : 'mt-4 pt-4'}`}
              >
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
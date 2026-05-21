import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { registerSW } from 'virtual:pwa-register'

function isStandalonePwa() {
  if (typeof window === 'undefined') {
    return false
  }

  const matchesDisplayMode =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches

  return matchesDisplayMode || window.navigator.standalone === true
}

function PwaUpdateBanner({ onDismiss, onRefresh }) {
  return (
    <div className="mt-4 flex flex-col gap-4 rounded-[1.5rem] border border-border/80 bg-background/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">App update ready</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          A newer version of Leanlog is available. Refresh to apply the update.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onDismiss}>
          Later
        </Button>
        <Button type="button" size="sm" onClick={onRefresh}>
          Refresh now
        </Button>
      </div>
    </div>
  )
}

function PwaOfflineReadyToast({ onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-[1.5rem] border border-border/80 bg-background/95 p-4 shadow-lg backdrop-blur sm:bottom-6 sm:right-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Offline ready</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Leanlog is cached and ready for faster repeat loads and basic offline use.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

function AppPwaManager() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [showOfflineReadyToast, setShowOfflineReadyToast] = useState(false)
  const updateServiceWorkerRef = useRef(() => {})
  const hasRegisteredServiceWorker = useRef(false)

  useEffect(() => {
    if (hasRegisteredServiceWorker.current) {
      return
    }

    hasRegisteredServiceWorker.current = true
    updateServiceWorkerRef.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        if (isStandalonePwa()) {
          void updateServiceWorkerRef.current(true)
          return
        }

        setShowUpdatePrompt(true)
      },
      onOfflineReady() {
        setShowOfflineReadyToast(true)
      },
    })
  }, [])

  return (
    <>
      {showUpdatePrompt ? (
        <PwaUpdateBanner
          onDismiss={() => setShowUpdatePrompt(false)}
          onRefresh={() => updateServiceWorkerRef.current(true)}
        />
      ) : null}

      {showOfflineReadyToast ? (
        <PwaOfflineReadyToast onDismiss={() => setShowOfflineReadyToast(false)} />
      ) : null}
    </>
  )
}

export { AppPwaManager }
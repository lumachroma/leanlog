import { AppLoadingState } from '@/components/app/AppLoadingState'
import { AppContent } from '@/components/app/AppContent'
import { AppErrorBanner } from '@/components/app/AppErrorBanner'
import { AppHeader } from '@/components/app/AppHeader'
import { AppShell } from '@/components/app/AppShell'
import { useAppShellState } from '@/hooks/useAppShellState'
import { useAppViewModel } from '@/hooks/useAppViewModel'

function App() {
  const { activePage, openSettings, setActivePage } = useAppShellState()

  const {
    lifecycle,
    settingsView,
    historyView,
    averagesView,
    dashboardView,
  } = useAppViewModel()

  if (!lifecycle.isHydrated) {
    return <AppLoadingState />
  }

  return (
    <AppShell>
      <AppHeader activePage={activePage} onPageChange={setActivePage} />

      <AppErrorBanner message={lifecycle.errorMessage} />

      <AppContent
        activePage={activePage}
        averagesView={averagesView}
        dashboardView={dashboardView}
        historyView={historyView}
        onOpenSettings={openSettings}
        onPageChange={setActivePage}
        settingsView={settingsView}
      />
    </AppShell>
  )
}

export default App

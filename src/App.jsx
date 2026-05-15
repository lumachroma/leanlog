import { AppLoadingState } from '@/components/app/AppLoadingState'
import { AppContent } from '@/components/app/AppContent'
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

      {lifecycle.errorMessage ? (
        <div className="mt-6 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {lifecycle.errorMessage}
        </div>
      ) : null}

      <AppContent
        activePage={activePage}
        averagesView={averagesView}
        dashboardView={dashboardView}
        historyView={historyView}
        onOpenSettings={openSettings}
        settingsView={settingsView}
      />
    </AppShell>
  )
}

export default App

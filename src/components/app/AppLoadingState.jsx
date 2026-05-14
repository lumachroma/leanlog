import { AppShell } from './AppShell'

function AppLoadingState() {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex min-h-[80svh] w-full items-center justify-center rounded-[2rem] border border-border/80 bg-background/80 px-6 py-10 text-sm text-muted-foreground shadow-sm backdrop-blur">
          Loading your local dashboard...
        </div>
      </div>
    </AppShell>
  )
}

export { AppLoadingState }
function AppShell({ children }) {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_100%)] text-foreground">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col px-4 py-6 sm:px-10 sm:py-8 lg:px-12">
        {children}
      </div>
    </div>
  )
}

export { AppShell }
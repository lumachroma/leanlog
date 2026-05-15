function AppSectionLoadingState({ message = 'Loading...' }) {
  return (
    <div className="mt-6 rounded-[1.75rem] border border-border/80 bg-background/90 px-5 py-8 text-sm leading-7 text-muted-foreground shadow-sm backdrop-blur">
      {message}
    </div>
  )
}

export { AppSectionLoadingState }
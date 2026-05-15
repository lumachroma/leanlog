function AppErrorBanner({ message }) {
  if (!message) {
    return null
  }

  return (
    <div className="mt-6 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  )
}

export { AppErrorBanner }
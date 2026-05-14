function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

export { Field }
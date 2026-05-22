function Field({ label, children, hint, labelClassName }) {
  return (
    <label className="block">
      <span
        className={['text-sm font-medium text-foreground', labelClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

export { Field }
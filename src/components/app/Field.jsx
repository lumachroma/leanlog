function Field({ label, children, hint, labelClassName, htmlFor }) {
  if (htmlFor) {
    return (
      <div className="block">
        <label
          htmlFor={htmlFor}
          className={['text-sm font-medium text-foreground', labelClassName]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </label>
        {children}
        {hint ? <span className="mt-2 block text-xs text-muted-foreground">{hint}</span> : null}
      </div>
    )
  }

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
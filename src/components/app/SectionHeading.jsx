function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { SectionHeading }
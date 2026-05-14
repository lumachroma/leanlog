const CHART_WIDTH = 720
const CHART_HEIGHT = 320
const CHART_PADDING = {
  top: 20,
  right: 20,
  bottom: 36,
  left: 20,
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const weightFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const formatWeight = (value) =>
  value === null ? '-- kg' : `${weightFormatter.format(value)} kg`

const formatDate = (date) => dateFormatter.format(new Date(`${date}T00:00:00`))

const getChartDomain = (points) => {
  const values = points.flatMap((point) => [point.weight, point.weight7dma]).filter((value) => value !== null)

  if (!values.length) {
    return null
  }

  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)

  if (minValue === maxValue) {
    return {
      min: minValue - 1,
      max: maxValue + 1,
    }
  }

  const padding = Math.max((maxValue - minValue) * 0.12, 0.6)

  return {
    min: minValue - padding,
    max: maxValue + padding,
  }
}

const toChartPoints = (points, domain) => {
  const innerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom

  return points.map((point, index) => {
    const x =
      points.length === 1
        ? CHART_PADDING.left + innerWidth / 2
        : CHART_PADDING.left + (index / (points.length - 1)) * innerWidth

    const mapY = (value) => {
      if (value === null) {
        return null
      }

      return (
        CHART_PADDING.top +
        ((domain.max - value) / (domain.max - domain.min)) * innerHeight
      )
    }

    return {
      ...point,
      x,
      dailyY: mapY(point.weight),
      movingAverageY: mapY(point.weight7dma),
    }
  })
}

const buildLinePath = (points, yKey) => {
  let path = ''
  let hasOpenSegment = false

  points.forEach((point) => {
    const y = point[yKey]

    if (y === null) {
      hasOpenSegment = false
      return
    }

    path += `${hasOpenSegment ? 'L' : 'M'} ${point.x} ${y} `
    hasOpenSegment = true
  })

  return path.trim()
}

function WeightTrendChart({ points }) {
  if (!points.length) {
    return (
      <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
        Save a few weight entries to unlock the trend chart. Missed days are fine.
        The 7DMA will stay calm and continue once data returns.
      </div>
    )
  }

  const domain = getChartDomain(points)

  if (!domain) {
    return (
      <div className="mt-6 rounded-[1.75rem] border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-sm leading-7 text-muted-foreground">
        Weight entries are still blank. Log your first weigh-in and the chart will
        render both daily weight and 7DMA without punishing skipped days.
      </div>
    )
  }

  const chartPoints = toChartPoints(points, domain)
  const dailyPath = buildLinePath(chartPoints, 'dailyY')
  const movingAveragePath = buildLinePath(chartPoints, 'movingAverageY')
  const latestDailyPoint = [...points].reverse().find((point) => point.weight !== null)
  const latestMovingAveragePoint = [...points]
    .reverse()
    .find((point) => point.weight7dma !== null)
  const firstPoint = points[0]
  const middlePoint = points[Math.floor((points.length - 1) / 2)]
  const lastPoint = points[points.length - 1]

  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Weight trend chart
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
            Real-life weight, with calm built in.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Daily weight shows the honest day-to-day signal. The 7DMA carries the
            trend forward so missed weigh-ins do not break the story.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em]">Latest Daily</p>
            <p className="mt-1 font-medium text-foreground">
              {formatWeight(latestDailyPoint?.weight ?? null)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em]">Latest 7DMA</p>
            <p className="mt-1 font-medium text-foreground">
              {formatWeight(latestMovingAveragePoint?.weight7dma ?? null)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-border/80 bg-muted/20 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-foreground/35" />
            Daily weight
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-0.5 w-8 bg-foreground" />
            7DMA weight
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80 p-3 sm:p-4">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-[18rem] w-full"
            role="img"
            aria-label="Weight trend chart with daily weight and seven day moving average"
          >
            {[0.2, 0.5, 0.8].map((ratio) => {
              const y =
                CHART_PADDING.top +
                ratio * (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom)

              return (
                <line
                  key={ratio}
                  x1={CHART_PADDING.left}
                  y1={y}
                  x2={CHART_WIDTH - CHART_PADDING.right}
                  y2={y}
                  className="stroke-border/70"
                  strokeDasharray="6 8"
                />
              )
            })}

            {movingAveragePath ? (
              <path
                d={movingAveragePath}
                fill="none"
                className="stroke-foreground"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {dailyPath ? (
              <path
                d={dailyPath}
                fill="none"
                className="stroke-foreground/35"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {chartPoints
              .filter((point) => point.weight !== null && point.dailyY !== null)
              .map((point) => (
                <circle
                  key={`daily-${point.date}`}
                  cx={point.x}
                  cy={point.dailyY}
                  r="3.5"
                  className="fill-background stroke-foreground/45"
                  strokeWidth="2"
                />
              ))}

            {chartPoints
              .filter((point) => point.weight7dma !== null && point.movingAverageY !== null)
              .map((point) => (
                <circle
                  key={`dma-${point.date}`}
                  cx={point.x}
                  cy={point.movingAverageY}
                  r="2.5"
                  className="fill-foreground"
                />
              ))}
          </svg>

          <div className="mt-3 grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>{formatDate(firstPoint.date)}</span>
            <span className="text-center">{formatDate(middlePoint.date)}</span>
            <span className="text-right">{formatDate(lastPoint.date)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export { WeightTrendChart }
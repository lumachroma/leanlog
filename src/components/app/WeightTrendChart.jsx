import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { EmptyStatePanel } from '@/components/app/EmptyStatePanel'
import { SectionHeading } from '@/components/app/SectionHeading'
import { formatWeight, weightFormatter } from '@/lib/display-formatters'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const dailyWeight = payload.find((item) => item.dataKey === 'weight')?.value ?? null
  const movingAverageWeight =
    payload.find((item) => item.dataKey === 'weight7dma')?.value ?? null

  return (
    <div className="rounded-2xl border border-border/80 bg-background/95 px-4 py-3 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {formatDate(label)}
      </p>
      <div className="mt-2 space-y-1.5 text-sm">
        <p className="text-foreground/70">Daily: <span className="font-medium text-foreground">{formatWeight(dailyWeight)}</span></p>
        <p className="text-foreground/70">7DMA: <span className="font-medium text-foreground">{formatWeight(movingAverageWeight)}</span></p>
      </div>
    </div>
  )
}

function WeightTrendChart({
  points,
  eyebrow = 'Weight trend chart',
  title = 'Real-life weight, with calm built in.',
  description =
    'Daily weight shows the honest day-to-day signal. The 7DMA carries the trend forward so missed weigh-ins do not break the story.',
}) {
  if (!points.length) {
    return (
      <EmptyStatePanel className="mt-6">
        Save a few weight entries to unlock the trend chart. Missed days are fine.
        The 7DMA will stay calm and continue once data returns.
      </EmptyStatePanel>
    )
  }

  const domain = getChartDomain(points)

  if (!domain) {
    return (
      <EmptyStatePanel className="mt-6">
        Weight entries are still blank. Log your first weigh-in and the chart will
        render both daily weight and 7DMA without punishing skipped days.
      </EmptyStatePanel>
    )
  }

  const latestDailyPoint = [...points].reverse().find((point) => point.weight !== null)
  const latestMovingAveragePoint = [...points]
    .reverse()
    .find((point) => point.weight7dma !== null)

  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
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
          <div
            className="w-full"
            role="img"
            aria-label="Weight trend chart with daily weight and seven day moving average"
          >
            <ResponsiveContainer width="100%" height={288} minWidth={0}>
              <LineChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: -18 }}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.28)" strokeDasharray="6 8" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                  tick={{ fill: 'rgba(100, 116, 139, 0.92)', fontSize: 12 }}
                  tickFormatter={formatDate}
                />
                <YAxis
                  domain={[domain.min, domain.max]}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tick={{ fill: 'rgba(100, 116, 139, 0.92)', fontSize: 12 }}
                  tickFormatter={(value) => weightFormatter.format(value)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(15, 23, 42, 0.12)', strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  connectNulls={false}
                  stroke="rgba(15, 23, 42, 0.35)"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2, fill: '#ffffff', stroke: 'rgba(15, 23, 42, 0.45)' }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="weight7dma"
                  connectNulls={true}
                  stroke="rgb(15, 23, 42)"
                  strokeWidth={4}
                  dot={{ r: 2.5, strokeWidth: 0, fill: 'rgb(15, 23, 42)' }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

export { WeightTrendChart }
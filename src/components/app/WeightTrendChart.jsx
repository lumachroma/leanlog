import { useEffect, useState } from 'react'

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
import { ViewportAnimationGroup } from '@/components/app/ViewportAnimationGroup'
import { formatWeight, weightFormatter } from '@/lib/display-formatters'
import { getWeightTrendChartDetails } from '@/lib/weight-trend-metrics'

import {
  formatWeightTrendDate,
  getWeightTrendAxisConfig,
  getWeightTrendChartHeight,
  WEIGHT_TREND_EMPTY_STATE_COPY,
} from './WeightTrendChart.helpers'

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
        {formatWeightTrendDate(label)}
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
  const [chartHeight, setChartHeight] = useState(getWeightTrendChartHeight)
  const [chartAxisConfig, setChartAxisConfig] = useState(getWeightTrendAxisConfig)

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(getWeightTrendChartHeight())
      setChartAxisConfig(getWeightTrendAxisConfig())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const {
    domain,
    hasDomain,
    hasPoints,
    latestDailyWeight,
    latestMovingAverageWeight,
  } = getWeightTrendChartDetails(points)

  if (!hasPoints) {
    return (
      <EmptyStatePanel className="mt-6">
        {WEIGHT_TREND_EMPTY_STATE_COPY.noPoints}
      </EmptyStatePanel>
    )
  }

  if (!hasDomain) {
    return (
      <EmptyStatePanel className="mt-6">
        {WEIGHT_TREND_EMPTY_STATE_COPY.noDomain}
      </EmptyStatePanel>
    )
  }

  const { minTickGap, tickFontSize, yAxisWidth } = chartAxisConfig

  return (
    <section className="rounded-[2rem] border border-border/80 bg-background/90 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-3 border-b border-border/80 pb-4 sm:gap-4 sm:pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div>
            <p className="text-xs uppercase tracking-[0.18em]">Latest Daily</p>
            <p className="mt-1 font-medium text-foreground">
              {formatWeight(latestDailyWeight)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em]">Latest 7DMA</p>
            <p className="mt-1 font-medium text-foreground">
              {formatWeight(latestMovingAverageWeight)}
            </p>
          </div>
        </div>
      </div>

      <ViewportAnimationGroup
        disabled={points.length === 0}
        className="mt-4 rounded-[1.75rem] border border-border/80 bg-muted/20 p-4 sm:mt-6 sm:p-5"
      >
        {(animationCycle) => (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:gap-4">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-6 bg-foreground/35 sm:w-8" />
                Daily weight
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-0.5 w-6 bg-foreground sm:w-8" />
                7DMA weight
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80 p-3 sm:mt-5 sm:p-4">
              <div
                key={animationCycle}
                className="w-full"
                role="img"
                aria-label="Weight trend chart with daily weight and seven day moving average"
              >
                <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
                  <LineChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: 4 }}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.28)" strokeDasharray="6 8" vertical={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                      minTickGap={minTickGap}
                      tick={{ fill: 'rgba(100, 116, 139, 0.92)', fontSize: tickFontSize }}
                      tickFormatter={formatWeightTrendDate}
                    />
                    <YAxis
                      domain={[domain.min, domain.max]}
                      axisLine={false}
                      tickLine={false}
                      width={yAxisWidth}
                      tick={{ fill: 'rgba(100, 116, 139, 0.92)', fontSize: tickFontSize }}
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
          </>
        )}
      </ViewportAnimationGroup>
    </section>
  )
}

export { WeightTrendChart }
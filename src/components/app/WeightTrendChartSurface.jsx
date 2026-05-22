import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatWeight, weightFormatter } from '@/lib/display-formatters'

import { formatWeightTrendDate } from './WeightTrendChart.helpers'

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

function WeightTrendChartSurface({
  animationCycle,
  chartHeight,
  domain,
  minTickGap,
  points,
  tickFontSize,
  yAxisWidth,
}) {
  return (
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
  )
}

export { WeightTrendChartSurface }
import { Suspense, lazy, useEffect, useState } from 'react'

import { AppSurface } from '@/components/app/AppSurface'
import { EmptyStatePanel } from '@/components/app/EmptyStatePanel'
import { SectionHeading } from '@/components/app/SectionHeading'
import { ViewportAnimationGroup } from '@/components/app/ViewportAnimationGroup'
import { formatWeight } from '@/lib/display-formatters'
import { getWeightTrendChartDetails } from '@/lib/weight-trend-metrics'

import {
  getWeightTrendAxisConfig,
  getWeightTrendChartHeight,
  WEIGHT_TREND_EMPTY_STATE_COPY,
} from './WeightTrendChart.helpers'

const WeightTrendChartSurface = lazy(() =>
  import('./WeightTrendChartSurface').then((module) => ({
    default: module.WeightTrendChartSurface,
  }))
)

function WeightTrendChartSurfaceFallback({ chartHeight }) {
  return (
    <div
      className="flex w-full items-center justify-center text-sm text-muted-foreground"
      style={{ minHeight: `${chartHeight}px` }}
    >
      Loading chart...
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
    <AppSurface className="p-5 sm:p-6">
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
              <Suspense fallback={<WeightTrendChartSurfaceFallback chartHeight={chartHeight} />}>
                <WeightTrendChartSurface
                  animationCycle={animationCycle}
                  chartHeight={chartHeight}
                  domain={domain}
                  minTickGap={minTickGap}
                  points={points}
                  tickFontSize={tickFontSize}
                  yAxisWidth={yAxisWidth}
                />
              </Suspense>
            </div>
          </>
        )}
      </ViewportAnimationGroup>
    </AppSurface>
  )
}

export { WeightTrendChart }
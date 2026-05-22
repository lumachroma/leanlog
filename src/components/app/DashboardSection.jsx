import { Suspense, lazy } from 'react'

import { AppSurface } from '@/components/app/AppSurface'
import { AppSectionLoadingState } from '@/components/app/AppSectionLoadingState'
import { SectionHeading } from '@/components/app/SectionHeading'
import { Button } from '@/components/ui/button'
import { getDashboardSectionDetails } from '@/lib/dashboard-section-metrics'

import {
  DASHBOARD_SETUP_CALLOUT,
  getDashboardSnapshotCards,
} from './DashboardSection.helpers'

const WeightTrendChart = lazy(() =>
  import('./WeightTrendChart').then((module) => ({
    default: module.WeightTrendChart,
  }))
)

const ConsistencyTrackingChart = lazy(() =>
  import('./ConsistencyTrackingChart').then((module) => ({
    default: module.ConsistencyTrackingChart,
  }))
)

const GoalProgressChart = lazy(() =>
  import('./GoalProgressChart').then((module) => ({
    default: module.GoalProgressChart,
  }))
)

function DashboardLazySection({ message, children }) {
  return <Suspense fallback={<AppSectionLoadingState message={message} />}>{children}</Suspense>
}

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,249,247,0.9)_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground sm:mt-6">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </article>
  )
}

function DashboardSection({
  metrics,
  chartSeries,
  settings,
  calorieDelta,
  stepDelta,
  goalDistance,
  targetsConfigured,
  onOpenSettings,
}) {
  const sectionDetails = getDashboardSectionDetails({
    metrics,
    chartSeries,
    settings,
    calorieDelta,
    stepDelta,
    goalDistance,
    targetsConfigured,
  })
  const snapshotCards = getDashboardSnapshotCards(sectionDetails.snapshot)

  return (
    <section className="space-y-5 sm:space-y-6">
      {sectionDetails.showSetupCallout ? (
        <AppSurface className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                {DASHBOARD_SETUP_CALLOUT.eyebrow}
              </p>
              <h2 className="mt-1.5 text-xl font-medium tracking-[-0.04em] sm:mt-2 sm:text-2xl">
                {DASHBOARD_SETUP_CALLOUT.title}
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-7">
                {DASHBOARD_SETUP_CALLOUT.description}
              </p>
            </div>
            <Button type="button" size="sm" className="self-start sm:self-auto" onClick={onOpenSettings}>
              {DASHBOARD_SETUP_CALLOUT.actionLabel}
            </Button>
          </div>
        </AppSurface>
      ) : null}

      <AppSurface className="p-5 sm:p-6">
        <div className="border-b border-border/80 pb-4 sm:pb-5">
          <SectionHeading
            eyebrow="Section 1"
            title="Today's Snapshot"
            description="A quick view of your current trend, consistency, and progress toward your goal."
          />
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 md:grid-cols-2 xl:grid-cols-5">
          {snapshotCards.map((card) => (
            <MetricCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
              detail={card.detail}
            />
          ))}
        </div>
      </AppSurface>

      <DashboardLazySection message="Loading weight trend...">
        <WeightTrendChart {...sectionDetails.weightTrendChart} />
      </DashboardLazySection>

      <DashboardLazySection message="Loading consistency tracking...">
        <ConsistencyTrackingChart {...sectionDetails.consistencyChart} />
      </DashboardLazySection>

      <DashboardLazySection message="Loading goal progress...">
        <GoalProgressChart {...sectionDetails.goalProgressChart} />
      </DashboardLazySection>
    </section>
  )
}

export { DashboardSection }
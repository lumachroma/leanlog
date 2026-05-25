import {
  BarChart3,
  Gauge,
  HeartPulse,
  Leaf,
  LineChart,
  Smartphone,
  Target,
} from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { Button } from '@/components/ui/button'

const ABOUT_PILLARS = [
  {
    title: 'Psychologically light',
    description: 'Forgiving tracking that stays useful when real life gets messy.',
    Icon: Leaf,
  },
  {
    title: 'Local-first by default',
    description: 'Fast, private logging with no account setup or cloud dependency.',
    Icon: Smartphone,
  },
  {
    title: 'Built for long-term trends',
    description: 'Smoother trends and clearer signals built for sustainable progress.',
    Icon: HeartPulse,
  },
]

const ABOUT_DASHBOARD_GUIDES = [
  {
    eyebrow: 'KPI cards',
    title: 'Your body, summarized like a clean operator dashboard.',
    description:
      'The top cards are built for the 10-second check-in. Instead of making you decode raw entries, LeanLog turns your latest weight trend, 7-day moving average, average calories, average steps, and goal progress into a quick plain-English snapshot.',
    points: [
      'Weight Trend helps you see direction without overreacting to one random day.',
      '7-Day Moving Average smooths the noise so the real story is easier to trust.',
      'Calories, Steps, and Goal Progress show whether the system is moving with you, not against you.',
    ],
    Icon: Gauge,
  },
  {
    eyebrow: 'Section 2',
    title: 'Weight Trend turns noisy weigh-ins into a calmer signal.',
    description:
      'Daily weight naturally jumps around. LeanLog keeps those real weigh-ins visible, then layers in a smoother 7-day line so you can spot the trend without letting short-term fluctuation hijack your mood.',
    points: [
      'The thin daily line shows what actually happened.',
      'The stronger 7DMA line shows the direction that matters more over time.',
      'Together, they make progress feel measurable without becoming obsessive.',
    ],
    Icon: LineChart,
  },
  {
    eyebrow: 'Section 3',
    title: 'Daily Consistency shows how often you are actually hitting the plan.',
    description:
      'Instead of boiling everything down to one average, LeanLog gives calories and steps a rolling 30-day adherence view. You can instantly see which days were on target, close, off, logged without a target, or missing entirely.',
    points: [
      'Hit rate tells you how often the plan is working in real life.',
      'Current and best streaks make momentum visible without turning the app into a game.',
      'Missing days stay visible, but they do not break the experience or shame the user.',
    ],
    Icon: BarChart3,
  },
  {
    eyebrow: 'Section 4',
    title: 'Progress Toward Your Goal makes the destination feel concrete.',
    description:
      'This chart takes your start weight, current weight, and goal weight and turns them into one simple progress view. It is the fastest way to answer the question every user cares about: am I actually getting closer?',
    points: [
      'Start weight gives the journey a real baseline.',
      'Current weight acts like a live progress marker, not a motivational slogan.',
      'Goal progress turns a long-term target into something visible and actionable.',
    ],
    Icon: Target,
  },
]

function DashboardGuideCard({ eyebrow, title, description, points, Icon }) {
  return (
    <AppSurface as="article" className="rounded-[1.75rem] bg-background/88 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-medium tracking-[-0.04em] text-foreground sm:text-2xl">
            {title}
          </h2>
        </div>
        <div className="rounded-full border border-border/80 bg-muted/35 p-2.5 text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {points.map((point) => (
          <div
            key={point}
            className="rounded-[1.25rem] border border-border/70 bg-background/72 px-4 py-3 text-sm leading-6 text-muted-foreground"
          >
            {point}
          </div>
        ))}
      </div>
    </AppSurface>
  )
}

function AboutPage({ onPageChange }) {
  return (
    <main className="flex flex-1 pb-8 pt-4 sm:pt-6 xl:py-10">
      <section className="w-full space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AppSurface as="div" className="bg-background/92 p-6 sm:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              About LeanLog
            </p>
            <h1 className="mt-3 text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance sm:text-5xl xl:max-w-3xl xl:text-6xl">
              A personal weight-loss operating system built for real life.
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base xl:max-w-2xl">
              LeanLog is a calm weight-loss tracker focused on consistency,
              forgiving trends, and long-term progress without pressure or
              accounting-software noise.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground/90 sm:text-base xl:max-w-2xl">
              Think of it as a startup-style command center for personal fat
              loss: fast to update, easy to read, and designed to turn messy
              daily data into a cleaner signal you can actually use.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="rounded-full bg-muted/45 px-3 py-1.5">Local-first</span>
              <span className="rounded-full bg-muted/45 px-3 py-1.5">IndexedDB</span>
              <span className="rounded-full bg-muted/45 px-3 py-1.5">Dashboard-led</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="button" size="lg" className="rounded-full px-5" onClick={() => onPageChange('dashboard')}>
                Open dashboard
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="rounded-full px-5"
                onClick={() => onPageChange('settings')}
              >
                Review targets
              </Button>
            </div>
          </AppSurface>

          <AppSurface as="article" className="rounded-[1.75rem] bg-background/88 p-4 sm:p-5">
            <div className="grid gap-3 sm:gap-0 lg:h-full lg:grid-cols-1 xl:h-auto xl:grid-cols-1">
              {ABOUT_PILLARS.map(({ title, description, Icon }, index) => (
                <div
                  key={title}
                  className={`flex items-center gap-3 rounded-[1.15rem] px-3 py-3 sm:px-4 ${
                    index > 0 ? 'border-t border-border/70 sm:border-t sm:border-border/70' : ''
                  } xl:min-h-[72px]`}
                >
                  <div className="rounded-full border border-border/80 bg-muted/35 p-2 text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <p className="min-w-0 text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
                    <span className="font-medium text-foreground">{title}:</span>{' '}
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </AppSurface>
        </div>

        <AppSurface className="bg-background/92 p-6 sm:p-8">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Why the dashboard works
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-medium leading-[1.05] tracking-[-0.05em] text-balance sm:text-4xl">
            Clear signal, less guesswork, better daily decisions.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Every section is designed to answer a simple user question in plain
            language. What is happening right now? Is the trend improving? Am I
            staying consistent? Am I actually getting closer to the goal?
          </p>
        </AppSurface>

        <div className="grid gap-4">
          {ABOUT_DASHBOARD_GUIDES.map((guide) => (
            <DashboardGuideCard key={guide.title} {...guide} />
          ))}
        </div>
      </section>
    </main>
  )
}

export { AboutPage }
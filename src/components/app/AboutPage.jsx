import {
  Activity,
  BarChart3,
  Footprints,
  Gauge,
  Leaf,
  LineChart,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Target,
  TrendingUp,
} from 'lucide-react'

import { AppSurface } from '@/components/app/AppSurface'
import { Button } from '@/components/ui/button'

const ABOUT_HERO_PILLS = ['Local-first', 'Private', 'Lightweight']

const ABOUT_PRINCIPLES = [
  {
    title: 'Trends matter more than single days',
    description:
      'Daily weight naturally moves up and down. LeanLog keeps real weigh-ins visible while smoothing the bigger direction using rolling averages.',
    emphasis: 'The trend matters more than one random morning.',
    Icon: TrendingUp,
  },
  {
    title: 'Calories are ceilings, not perfection scores',
    description:
      'LeanLog treats calorie targets as a stay-under boundary rather than a punishment system.',
    emphasis: 'A good plan does not require perfect eating every day. It requires enough reasonable days over time.',
    Icon: Target,
  },
  {
    title: 'Steps are movement baselines',
    description:
      'Movement is treated as a consistent baseline to meet or exceed, not an optimization contest.',
    emphasis: 'Small sustainable movement compounds surprisingly well.',
    Icon: Footprints,
  },
  {
    title: 'Missing days should not destroy momentum',
    description:
      'Missing logs stay visible, but they do not break the experience or shame the user.',
    emphasis: 'The app stays usable even when life becomes messy, because consistency matters more than uninterrupted streaks.',
    Icon: Leaf,
  },
]

const ABOUT_READING_GUIDE = [
  {
    title: 'Snapshot',
    description:
      'A quick operational overview of your current direction, consistency, and progress. Designed for the 10-second check-in.',
    Icon: Gauge,
  },
  {
    title: 'Weight Trend',
    description:
      'Daily fluctuations stay visible while the long-term trend becomes easier to trust through smoothing. The goal is clarity without obsession.',
    Icon: LineChart,
  },
  {
    title: 'Daily Consistency',
    description:
      'Calories and movement are evaluated over rolling periods instead of isolated days. Small repeated habits become a clearer long-term signal.',
    Icon: BarChart3,
  },
  {
    title: 'Goal Progress',
    description:
      'Your starting point, current trend, and goal weight shown together in one simple view. Direction is easier to understand than daily emotion.',
    Icon: Target,
  },
]

const ABOUT_AUDIENCE = [
  'want sustainable fat loss instead of crash dieting',
  'prefer trends over daily emotional swings',
  'want low-friction tracking',
  'are tired of noisy fitness ecosystems',
  'value clarity, simplicity, and consistency',
]

function PrincipleCard({ title, description, emphasis, Icon }) {
  return (
    <AppSurface
      as="article"
      className="rounded-[1.75rem] border-border/70 bg-background/88 p-5 shadow-sm shadow-black/5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-border/75 bg-muted/40 p-3 text-foreground">
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-medium tracking-[-0.04em] text-foreground sm:text-xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
          <p className="mt-4 text-sm leading-7 text-foreground/88 sm:text-base">{emphasis}</p>
        </div>
      </div>
    </AppSurface>
  )
}

function ReadingGuideCard({ title, description, Icon }) {
  return (
    <AppSurface as="article" className="rounded-[1.6rem] bg-background/88 p-5 sm:p-6">
      <div className="rounded-2xl border border-border/70 bg-muted/35 p-3 text-muted-foreground w-fit">
        <Icon className="size-4" />
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-[-0.04em] text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </AppSurface>
  )
}

function AboutPage({ onPageChange }) {
  return (
    <main className="flex flex-1 pb-10 pt-4 sm:pt-6 xl:py-10">
      <section className="w-full space-y-6 sm:space-y-7 xl:space-y-8">
        <AppSurface
          as="section"
          className="overflow-hidden border-border/70 bg-linear-to-br from-background via-background to-muted/45 p-0"
        >
          <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8 xl:p-10">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                About LeanLog
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-[0.98] tracking-[-0.07em] text-balance sm:text-5xl xl:text-6xl">
                Calm local-first weight-loss tracking.
              </h1>
              <p className="mt-4 text-lg leading-8 text-foreground/88 sm:max-w-2xl sm:text-xl">
                Built for real life. Designed for long-term progress.
              </p>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                LeanLog is a personal weight-loss operating system focused on sustainable consistency instead of perfection.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                It helps turn noisy daily data into a calmer signal you can actually trust: weight trends, calorie adherence, movement consistency, and long-term progress.
              </p>
              <p className="mt-5 text-sm leading-7 text-foreground/88 sm:text-base">
                No guilt loops. No engagement tricks. No pressure to be perfect. Just clearer feedback from real-world habits.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {ABOUT_HERO_PILLS.map((pill) => (
                  <span key={pill} className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5">
                    {pill}
                  </span>
                ))}
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
            </div>

            <div className="border-t border-border/70 bg-muted/28 p-4 sm:p-5 xl:border-l xl:border-t-0 xl:p-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <AppSurface as="article" className="rounded-[1.6rem] border-border/70 bg-background/90 p-5">
                  <div className="flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    <Sparkles className="size-3.5" />
                    Sustainable by design
                  </div>
                  <p className="mt-4 text-base leading-7 text-foreground">
                    LeanLog is intentionally quieter than most fitness apps.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    The product stays calm on purpose: less noise, less pressure, and more room for the slow work that actually changes the trend.
                  </p>
                </AppSurface>

                <AppSurface as="article" className="rounded-[1.6rem] border-border/70 bg-background/82 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-border/70 bg-muted/35 p-2.5 text-muted-foreground">
                      <Sunrise className="size-4" />
                    </div>
                    <p className="text-sm font-medium tracking-[-0.02em] text-foreground">
                      Built for enough reasonable days.
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    The app assumes weekends go sideways, routines get interrupted, and people miss logs. It is designed to stay useful anyway.
                  </p>
                </AppSurface>
              </div>
            </div>
          </div>
        </AppSurface>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <AppSurface as="section" className="bg-background/92 p-6 sm:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Why LeanLog exists
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-balance sm:text-4xl">
              Most weight-loss apps quietly assume perfect behavior.
            </h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>Perfect logging. Perfect eating. Perfect motivation. Perfect consistency.</p>
              <p>Real life does not work like that.</p>
              <p>Weight fluctuates. Bad weekends happen. Motivation disappears. Stress affects routines. People miss days.</p>
              <p>LeanLog was designed around that reality instead of pretending it does not exist.</p>
              <p className="text-foreground/88">The goal is not perfection. The goal is staying consistent long enough for the trend to matter.</p>
            </div>
          </AppSurface>

          <AppSurface as="section" className="bg-background/88 p-6 sm:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Local-first by default
            </p>
            <h2 className="mt-3 text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-balance sm:text-4xl">
              Fast. Private. Frictionless.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-border/70 bg-background/72 p-4">
                <div className="flex items-center gap-3 text-foreground">
                  <ShieldCheck className="size-4" />
                  <p className="text-sm font-medium">Your data stays on your device.</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  No account setup. No forced cloud sync. No waiting for servers. No unnecessary complexity.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-background/72 p-4">
                <div className="flex items-center gap-3 text-foreground">
                  <Activity className="size-4" />
                  <p className="text-sm font-medium">Tracking starts immediately.</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Just fast personal tracking that works the moment you open it.
                </p>
              </div>
            </div>
          </AppSurface>
        </div>

        <section className="space-y-4">
          <div className="px-1">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              The core philosophy
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-balance sm:text-4xl">
              Sustainable by design.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {ABOUT_PRINCIPLES.map((principle) => (
              <PrincipleCard key={principle.title} {...principle} />
            ))}
          </div>
        </section>

        <AppSurface as="section" className="bg-background/92 p-6 sm:p-8">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            A calmer view of progress
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-balance sm:text-4xl">
            A calmer dashboard for long-term progress.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Each section is designed to answer a simple question without turning the app into a performance review.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {ABOUT_READING_GUIDE.map((guide) => (
              <ReadingGuideCard key={guide.title} {...guide} />
            ))}
          </div>
        </AppSurface>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <AppSurface as="section" className="bg-background/88 p-6 sm:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Who LeanLog is for
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-balance sm:text-4xl">
              Built for people who want a calmer approach.
            </h2>
            <div className="mt-6 grid gap-3">
              {ABOUT_AUDIENCE.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-border/70 bg-background/72 px-4 py-3 text-sm leading-7 text-muted-foreground"
                >
                  <div className="mt-2 size-2 rounded-full bg-foreground/70" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
              Especially adults trying to build healthier habits without turning their life into a fitness project.
            </p>
          </AppSurface>

          <AppSurface as="section" className="bg-linear-to-br from-background via-background to-muted/38 p-6 sm:p-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Real progress usually looks boring
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-balance sm:text-4xl">
              Real progress usually looks boring.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>And that is okay.</p>
              <p>
                Most sustainable weight loss comes from repeating enough reasonable days for the trend to slowly move in the right direction.
              </p>
              <p>
                LeanLog was built to make that process feel calmer, clearer, and easier to sustain.
              </p>
            </div>
          </AppSurface>
        </div>
      </section>
    </main>
  )
}

export { AboutPage }
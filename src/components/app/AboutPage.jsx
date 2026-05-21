import { HeartPulse, Leaf, Smartphone } from 'lucide-react'

import { Button } from '@/components/ui/button'

const ABOUT_PILLARS = [
  {
    title: 'Psychologically light',
    description:
      'Daily tracking stays forgiving, low-friction, and resilient when life gets messy.',
    Icon: Leaf,
  },
  {
    title: 'Local-first by default',
    description:
      'Your logs stay fast and private with IndexedDB-backed storage that works without setup.',
    Icon: Smartphone,
  },
  {
    title: 'Built for long-term trends',
    description:
      'Leanlog emphasizes smooth weight trends, consistency targets, and progress that compounds.',
    Icon: HeartPulse,
  },
]

function AboutPage({ onPageChange }) {
  return (
    <main className="flex flex-1 py-8 xl:py-10">
      <section className="grid w-full gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border/80 bg-background/92 p-6 shadow-sm backdrop-blur sm:p-8">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            About Leanlog
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance sm:text-5xl xl:text-6xl">
            A personal weight-loss operating system built for real life.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Leanlog is a calm weight-loss tracker focused on consistency,
            forgiving trends, and long-term progress without pressure or
            accounting-software noise.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground/90 sm:text-base">
            Fast daily logging, stable trend tracking, and lightweight reviews
            give you enough signal to stay engaged without turning the process
            into a second job.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="rounded-full bg-muted/45 px-3 py-1.5">Local-first</span>
            <span className="rounded-full bg-muted/45 px-3 py-1.5">IndexedDB</span>
            <span className="rounded-full bg-muted/45 px-3 py-1.5">Iteration 1</span>
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

        <div className="grid gap-4">
          {ABOUT_PILLARS.map(({ title, description, Icon }) => (
            <article
              key={title}
              className="rounded-[1.75rem] border border-border/80 bg-background/85 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-medium tracking-[-0.03em] text-foreground">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="rounded-full border border-border/80 bg-muted/35 p-2.5 text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export { AboutPage }
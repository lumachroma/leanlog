import { ArrowRight, Flame, Footprints, Scale } from 'lucide-react'

import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f7f7f5_100%)] text-foreground">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-border/80 pb-5">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Leanlog
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Calm daily tracking for weight, calories, steps, and exercise.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Iteration 1
          </Button>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <section className="space-y-8">
            <div className="space-y-5">
              <p className="inline-flex rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase shadow-sm backdrop-blur">
                Tailwind CSS + shadcn/ui ready
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.05em] text-balance sm:text-5xl lg:text-6xl">
                  A minimal operating system for steady weight loss.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  The foundation is in place. Next we can wire state with Zustand,
                  persist daily logs in IndexedDB with Dexie, and turn this starter
                  into a focused health dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="gap-2 px-4">
                Start building
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" className="px-4">
                Add first feature
              </Button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <article className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weight trend</span>
                <Scale className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-6 text-3xl font-medium tracking-[-0.04em]">72.4 kg</p>
              <p className="mt-2 text-sm text-muted-foreground">Weekly moving average placeholder</p>
            </article>

            <article className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Calorie average</span>
                <Flame className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-6 text-3xl font-medium tracking-[-0.04em]">1,980</p>
              <p className="mt-2 text-sm text-muted-foreground">Rolling daily intake preview</p>
            </article>

            <article className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Step average</span>
                <Footprints className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-6 text-3xl font-medium tracking-[-0.04em]">8,412</p>
              <p className="mt-2 text-sm text-muted-foreground">Daily movement snapshot placeholder</p>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App

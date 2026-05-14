# Leanlog Copilot Instructions

## Product Intent

- Build a calm, minimal, fast, visual, rewarding personal weight-loss operating system.
- Sustainable, scalable, psychologically lightweight, and powerful enough for serious transformation. Exactly what a long-term fat-loss system needs.
- Avoid accounting-software complexity.
- Keep the aesthetic close to minimal Apple Health + Notion.

## Iteration 1 Scope

- Track only daily weight, calories, steps, and exercise.
- Show a focused dashboard with four sections: KPI cards, a main weight trend graph, consistency tracking, and a goal progress bar.
- Use a dual-line weight trend chart for daily weight and 7-day moving average.
- Visualize calorie and step consistency against targets without turning the product into accounting software.
- Include dedicated weekly and monthly average pages for longer-view summaries.
- Include a settings flow for start weight, goal weight, daily calorie target, and daily step target.
- Prioritize local-first behavior with IndexedDB.

## Iteration 2 Boundary

- Keep the current data model compatible with future Dexie Cloud sync, Capacitor, and broader test coverage.
- Do not add iteration 2 dependencies or UI complexity unless explicitly requested.

## Stack And Conventions

- Use React with Vite in JavaScript only. Do not introduce TypeScript.
- Use Tailwind CSS v4 for styling.
- Use shadcn/ui components and preserve the existing styling direction.
- Use Zustand for app state and Dexie for local persistence.
- Use Recharts for chart rendering.
- Use the `@` import alias for `src` paths.

## Current Architecture

- Dexie schema lives in `src/lib/db.js`.
- Zustand store lives in `src/store/useAppStore.js`.
- App view-model logic lives in `src/hooks/useAppViewModel.js`.
- Dashboard calculations and chart-ready selectors live in `src/lib/metrics.js`.
- Dashboard section composition lives in `src/components/app/DashboardSection.jsx`.
- Recharts-based dashboard chart rendering lives in `src/components/app/WeightTrendChart.jsx`.
- Dashboard consistency visuals live in `src/components/app/ConsistencyTrackingChart.jsx`.
- Dashboard goal progress visuals live in `src/components/app/GoalProgressChart.jsx`.
- App composition is split into focused components under `src/components/app`.

## Implementation Guidance

- Prefer small, local refactors over broad rewrites.
- Preserve the narrow product scope. Do not add extra health metrics, social features, gamification systems, auth, or analytics unless asked.
- Keep forms and dashboard behavior local-first and fast.
- Treat missing logs as normal. Every formula, derived metric, summary, and chart input must tolerate blanks without breaking, throwing errors, or punishing the user for skipped days.
- Favor psychologically lightweight flows: forgiving defaults, low-friction logging, and summaries that continue working even when the user misses entries.
- Preserve the sectioned dashboard structure unless a broader product change is explicitly requested.
- Favor simple data shapes that can evolve without breaking Dexie persistence.
- When adding UI, preserve the existing spacing, tone, and minimal visual language.

## Validation

- Run `npm test`, `npm run lint`, and `npm run build` after meaningful changes when feasible.
- Keep tests focused on view-model logic, form flows, and app composition boundaries.
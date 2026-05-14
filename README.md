# Leanlog

Leanlog is a personal, local-first weight-loss operating system built for real life. It is designed for fast daily logging, lightweight progress review, and sustainable long-term fat-loss work without turning into compliance-heavy software. Iteration 1 focuses on the basics only: daily weight, calories, steps, exercise details, a structured dashboard with clear feedback sections, a Recharts-based dual-line weight trend chart, weekly and monthly averages, and goal settings.

The app is designed to stay minimal. There is no backend, no authentication, and no cloud dependency. Data is stored locally in the browser with IndexedDB.

## Features

- Dashboard with four structured sections: KPI cards, main weight trend graph, consistency tracking, and goal progress bar
- Recharts-based dual-line weight trend chart showing daily weight and 7-day moving average
- Consistency tracking visuals for calorie and step averages versus targets
- Goal progress bar visualizing start weight, current weight, and goal weight
- Daily history page for creating, editing, and deleting log entries
- Weekly and monthly average pages for longer-view summaries
- Settings page for start weight, goal weight, daily calorie target, and daily step target
- Local-first persistence using Dexie on top of IndexedDB
- Lightweight view-model driven app structure with focused component boundaries
- Test coverage for app routing, view-model logic, settings flow, daily log flow, and history CRUD behavior

## Tech Stack

- React 19
- Vite 8
- JavaScript only
- Tailwind CSS v4
- shadcn/ui
- Zustand for app state
- Dexie for IndexedDB persistence
- Recharts for line charts
- Vitest and Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- npm 10 or newer recommended

### Installation

```bash
npm install
```

### Start The Development Server

```bash
npm run dev
```

Vite will print the local development URL in the terminal, typically `http://localhost:5173`.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the production bundle into `dist/`.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

```bash
npm test
```

Runs the Vitest suite once.

```bash
npm run test:watch
```

Runs Vitest in watch mode.

## Product Scope

Current Iteration 1 scope:

- Track daily weight, calories, steps, and exercise
- Show a focused, sectioned dashboard instead of a dense analytics surface
- Use a 7-day moving average and a dual-line weight chart to keep the trend emotionally calm and readable
- Surface consistency and goal progress visually without turning the product into accounting software
- Keep the experience local-first and fast
- Keep formulas and summaries forgiving so missed days do not break trends or punish the user
- Preserve a data model that can evolve later for sync and richer visualizations

Explicit non-goals for the current iteration:

- Authentication
- Cloud sync
- Social features
- Additional health metrics beyond the current four tracked values
- Expanded analytics beyond the existing dashboard summaries

## Project Structure

```text
src/
	components/app/      App shell, header, dashboard, history, and settings UI
	components/ui/       Reusable UI primitives
	hooks/               App view-model hooks
	lib/                 Dexie database helpers and derived metrics
	store/               Zustand store
	test/                Shared test setup
```

Key files:

- `src/lib/db.js`: Dexie schema, local date helpers, and persistence helpers
- `src/store/useAppStore.js`: Zustand store and app actions
- `src/hooks/useAppViewModel.js`: App-facing view-model logic
- `src/lib/metrics.js`: Dashboard calculations and chart-ready selectors
- `src/components/app/WeightTrendChart.jsx`: Recharts-backed dual-line weight chart
- `src/components/app/ConsistencyTrackingChart.jsx`: Calorie and step target comparison visuals
- `src/components/app/GoalProgressChart.jsx`: Start-to-goal progress bar with current weight marker
- `src/App.jsx`: Top-level page composition and local page persistence

## Data Persistence

Leanlog stores data locally in the browser using IndexedDB through Dexie.

- Settings are stored as a single profile record
- Daily entries are stored by date
- Hidden derived cells such as persisted 7DMA values are recalculated after entry changes
- Empty daily entries are not persisted
- Navigation state is also persisted locally so the app can reopen on the last active page

If you clear site data in the browser, Leanlog data will be removed.

## Testing And Validation

The project uses Vitest with Testing Library for UI and view-model coverage.

Recommended validation before merging meaningful changes:

```bash
npm test
npm run lint
npm run build
```

## Development Notes

- Use the `@` alias for imports from `src`
- Keep changes scoped to Iteration 1 unless a broader change is explicitly requested
- Prefer small local refactors over broad rewrites
- Preserve the current local-first data model

## Future Direction

The current app shape is intentionally narrow, but the architecture leaves room for later additions such as:

- sync-friendly persistence evolution
- richer charting
- mobile packaging
- broader automated test coverage

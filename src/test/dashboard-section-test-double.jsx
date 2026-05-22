function DashboardSectionTestDouble({ onOpenSettings, targetsConfigured }) {
  return (
    <section>
      <p>Dashboard section</p>
      <p>{targetsConfigured ? 'Targets configured' : 'Targets missing'}</p>
      <h2>Today's Snapshot</h2>
      <p>Avg Calories</p>
      <p>Avg Steps</p>
      <p>7-Day Moving Average</p>
      <p>Goal Progress %</p>
      <h2>Weight Trend</h2>
      <p>Daily Consistency</p>
      <h2>Progress Toward Your Goal</h2>
      <button type="button" onClick={onOpenSettings}>
        Open dashboard settings
      </button>
      {!targetsConfigured ? (
        <div>
          <p>Add your targets to make the dashboard more useful.</p>
          <button type="button" onClick={onOpenSettings}>
            Open settings
          </button>
        </div>
      ) : null}
    </section>
  )
}

export { DashboardSectionTestDouble }
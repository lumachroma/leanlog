const clampPercent = (value) => Math.max(0, Math.min(100, value))

export function getGoalProgressDetails({
  startWeight,
  goalWeight,
  currentWeight,
  progressPercent,
}) {
  const hasGoalData =
    startWeight !== null &&
    goalWeight !== null &&
    currentWeight !== null &&
    progressPercent !== null

  const markerPercent = hasGoalData ? clampPercent(progressPercent) : 0

  return {
    hasGoalData,
    markerPercent,
    markerPosition: `${markerPercent}%`,
  }
}
export const GOAL_PROGRESS_EMPTY_STATE_COPY =
  'Add your start weight, goal weight, and at least one current weigh-in to unlock the goal progress bar.'

export const getGoalProgressStatusText = ({ hasGoalData, progressPercentText }) =>
  hasGoalData
    ? `${progressPercentText} complete`
    : 'Add start, goal, and current weight to visualize progress.'
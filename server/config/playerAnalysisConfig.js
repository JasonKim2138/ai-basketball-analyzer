const PERFORMANCE_THRESHOLDS = {
  scoring: {
    elite: 30,
    strong: 25,
    moderate: 15
  },

  playmaking: {
    elite: 7,
    strong: 4,
    moderate: 2
  },

  rebounding: {
    elite: 10,
    strong: 7,
    moderate: 4
  }
};

const ANALYSIS_RUBRIC = {
  weights: {
    scoring: 0.4,
    playmaking: 0.3,
    rebounding: 0.3
  },

  grades: {
    S: 3.5,
    A: 3.0,
    B: 2.5,
    C: 2.0
  }
};

const PERFORMANCE_LEVELS = {
  Elite: 4,
  Strong: 3,
  Moderate: 2,
  Low: 1
};

const MILESTONE_THRESHOLD = 10;

module.exports = {
  PERFORMANCE_THRESHOLDS,
  ANALYSIS_RUBRIC,
  PERFORMANCE_LEVELS,
  MILESTONE_THRESHOLD
};
const { analyzeWithAI } = require("./aiService");

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

function analyzePlayer(player) {

  const performance = {
    scoring: getScoringLevel(player.points),
    playmaking: getPlaymakingLevel(player.assists),
    rebounding: getReboundingLevel(player.rebounds)
  };

  const overallScore = getOverallScore(performance);

  const strength = getStrength(performance);

  const weakness = getWeakness(performance);

  const role = getPlayerRole(performance);

  const milestone = getMilestone(player);

  const starter = getStarterStatus(performance);

  const grade = getGrade(overallScore);

  const message = getMessage(performance, grade);

  return ({
    performance,
    overallScore,
    starter,
    grade,
    message,
    strength,
    weakness,
    role,
    milestone
  });
}

function getScoringLevel(points) {

  if (points >= PERFORMANCE_THRESHOLDS.scoring.elite) {
    return "Elite";
  }

  if (points >= PERFORMANCE_THRESHOLDS.scoring.strong) {
    return "Strong";
  }

  if (points >= PERFORMANCE_THRESHOLDS.scoring.moderate) {
    return "Moderate";
  }

  return "Low";
}


function getPlaymakingLevel(assists) {

  if (assists >= PERFORMANCE_THRESHOLDS.playmaking.elite) {
    return "Elite";
  }

  if (assists >= PERFORMANCE_THRESHOLDS.playmaking.strong) {
    return "Strong";
  }

  if (assists >= PERFORMANCE_THRESHOLDS.playmaking.moderate) {
    return "Moderate";
  }

  return "Low";
}


function getReboundingLevel(rebounds) {

  if (rebounds >= PERFORMANCE_THRESHOLDS.rebounding.elite) {
    return "Elite";
  }

  if (rebounds >= PERFORMANCE_THRESHOLDS.rebounding.strong) {
    return "Strong";
  }

  if (rebounds >= PERFORMANCE_THRESHOLDS.rebounding.moderate) {
    return "Moderate";
  }

  return "Low";
}

function getStarterStatus(performance) {

  const eliteCategories = [
    performance.scoring === "Elite",
    performance.playmaking === "Elite",
    performance.rebounding === "Elite"
  ].filter(Boolean).length;

  const strongCategories = [
    performance.scoring === "Strong",
    performance.playmaking === "Strong",
    performance.rebounding === "Strong"
  ].filter(Boolean).length;

  if (eliteCategories >= 2) {
    return "Starter";
  }

  if (eliteCategories === 1 && strongCategories >= 1) {
    return "Starter";
  }

  if (strongCategories >= 2) {
    return "Starter";
  }

  return "Bench player";
}

function getGrade(overallScore) {

if (overallScore >= ANALYSIS_RUBRIC.grades.S) {
  return "S";
}

if (overallScore >= ANALYSIS_RUBRIC.grades.A) {
  return "A";
}

if (overallScore >= ANALYSIS_RUBRIC.grades.B) {
  return "B";
}

if (overallScore >= ANALYSIS_RUBRIC.grades.C) {
  return "C";
}

  return "D";
}

function getMessage(performance, grade) {

  if (grade === "S") {
    return "Elite all-around performance!";
  }

  if (grade === "A") {
    return "Excellent overall performance!";
  }

  if (grade === "B") {

    if (
      performance.scoring === "Elite" ||
      performance.playmaking === "Elite" ||
      performance.rebounding === "Elite"
    ) {
      return "Strong performance with a standout skill.";
    }

    return "Solid overall performance.";
  }

  if (grade === "C") {
    return "Average performance with room to improve.";
  }

  return "Needs significant improvement.";
}

function getStrength(performance) {

  const levels = {
    Elite: 4,
    Strong: 3,
    Solid: 2,
    Moderate: 2,
    Low: 1
  };

  const categories = {
    Scoring: levels[performance.scoring],
    Playmaking: levels[performance.playmaking],
    Rebounding: levels[performance.rebounding]
  };

  const maxLevel = Math.max(...Object.values(categories));

  if (maxLevel <= 1) {
    return "None";
  }

  const strengths = Object.entries(categories)
    .filter(([category, level]) => level === maxLevel)
    .map(([category]) => category);

  return strengths.join(" & ");
}

function getWeakness(performance) {

  const levels = {
    Elite: 4,
    Strong: 3,
    Solid: 2,
    Moderate: 2,
    Low: 1
  };

  const categories = {
    Scoring: levels[performance.scoring],
    Playmaking: levels[performance.playmaking],
    Rebounding: levels[performance.rebounding]
  };

  const minLevel = Math.min(...Object.values(categories));

  if (minLevel >= 3) {
    return "Balanced";
  }

  const weaknesses = Object.entries(categories)
    .filter(([category, level]) => level === minLevel)
    .map(([category]) => category);

  return weaknesses.join(" & ");
}

function getOverallScore(performance) {

  const levels = {
    Elite: 4,
    Strong: 3,
    Moderate: 2,
    Low: 1
  };

  const scoringScore = levels[performance.scoring];
  const playmakingScore = levels[performance.playmaking];
  const reboundingScore = levels[performance.rebounding];

  const weightedScore =
    (scoringScore * ANALYSIS_RUBRIC.weights.scoring) +
    (playmakingScore * ANALYSIS_RUBRIC.weights.playmaking) +
    (reboundingScore * ANALYSIS_RUBRIC.weights.rebounding);

  return weightedScore;
}

function getPlayerRole(performance) {

  if (
    performance.scoring === "Elite" &&
    performance.playmaking === "Elite"
  ) {
    return "All-Around Star";
  }

  if (performance.scoring === "Elite") {
    return "Scoring Specialist";
  }

  if (performance.playmaking === "Elite") {
    return "Playmaking Specialist";
  }

  if (performance.rebounding === "Elite") {
    return "Rebounding Specialist";
  }

  if (
    performance.scoring === "Strong" &&
    performance.playmaking === "Strong"
  ) {
    return "Two-Way Offensive Player";
  }

  if (
    performance.scoring === "Strong" &&
    performance.rebounding === "Strong"
  ) {
    return "Scoring & Rebounding Player";
  }

  if (
    performance.playmaking === "Strong" &&
    performance.rebounding === "Strong"
  ) {
    return "Playmaking & Rebounding Player";
  }

  return "Balanced Player";
}

function getMilestone(player) {

  const categories = [];

  if (player.points >= 10) {
    categories.push("Points");
  }

  if (player.assists >= 10) {
    categories.push("Assists");
  }

  if (player.rebounds >= 10) {
    categories.push("Rebounds");
  }

  if (categories.length >= 3) {
    return {
      type: "Triple-Double",
      categories
    };
  }

  if (categories.length >= 2) {
    return {
      type: "Double-Double",
      categories
    };
  }

  return {
    type: "None",
    categories: []
  };
}

async function analyzePlayerWithAI(player) {

  const analysis = analyzePlayer(player);

  const {
    aiAnalysis,
    aiAvailable
  } = await analyzeWithAI(player, analysis.performance, analysis.strength, analysis.weakness, analysis.overallScore,
  analysis.grade, analysis.role, analysis.milestone);

  return {
    ...analysis,
    aiAnalysis,
    aiAvailable
  };
}

module.exports = {
  analyzePlayer,
  analyzePlayerWithAI,
  getScoringLevel,
  getPlaymakingLevel,
  getReboundingLevel,
  getOverallScore,
  getGrade,
  getPlayerRole,
  getMilestone,
  getStrength,
  getWeakness
};
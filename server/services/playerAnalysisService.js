const { analyzeWithAI } = require("./aiService");

const {
  PERFORMANCE_THRESHOLDS,
  ANALYSIS_RUBRIC,
  PERFORMANCE_LEVELS,
  MILESTONE_THRESHOLD
} = require("../config/playerAnalysisConfig");


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

function getPerformanceLevel(value, thresholds) {

  if (value >= thresholds.elite) {
    return "Elite";
  }

  if (value >= thresholds.strong) {
    return "Strong";
  }

  if (value >= thresholds.moderate) {
    return "Moderate";
  }

  return "Low";
}

function getScoringLevel(points) {

  return getPerformanceLevel(
    points,
    PERFORMANCE_THRESHOLDS.scoring
  );

}


function getPlaymakingLevel(assists) {

  return getPerformanceLevel(
    assists,
    PERFORMANCE_THRESHOLDS.playmaking
  );

}


function getReboundingLevel(rebounds) {

  return getPerformanceLevel(
    rebounds,
    PERFORMANCE_THRESHOLDS.rebounding
  );

}

function getStarterStatus(performance) {

  const categoryLevels = Object.values(performance);

  const eliteCategories = categoryLevels
    .filter(level => level === "Elite")
    .length;

  const strongCategories = categoryLevels
    .filter(level => level === "Strong")
    .length;

  if (eliteCategories + strongCategories >= 2) {
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

function getCategoryScores(performance) {

  return {
    Scoring: PERFORMANCE_LEVELS[performance.scoring],
    Playmaking: PERFORMANCE_LEVELS[performance.playmaking],
    Rebounding: PERFORMANCE_LEVELS[performance.rebounding]
  };

}

function getStrength(performance) {

  const categories = getCategoryScores(performance);

  const maxLevel = Math.max(...Object.values(categories));

  if (maxLevel <= 1) {
    return "None";
  }

  const strengths = Object.entries(categories)
    .filter(([_category, level]) => level === maxLevel)
    .map(([category]) => category);

  return strengths.join(" & ");
}

function getWeakness(performance) {

  const categories = getCategoryScores(performance);

  const minLevel = Math.min(...Object.values(categories));

  if (minLevel >= 3) {
    return "Balanced";
  }

  const weaknesses = Object.entries(categories)
    .filter(([_category, level]) => level === minLevel)
    .map(([category]) => category);

  return weaknesses.join(" & ");
}

function getOverallScore(performance) {

  const categories = getCategoryScores(performance);

  const weightedScore =
    (categories.Scoring * ANALYSIS_RUBRIC.weights.scoring) +
    (categories.Playmaking * ANALYSIS_RUBRIC.weights.playmaking) +
    (categories.Rebounding * ANALYSIS_RUBRIC.weights.rebounding);

  return weightedScore;
}

function getPlayerRole(performance) {

  const {
    scoring,
    playmaking,
    rebounding
  } = performance;

  if (scoring === "Elite" && playmaking === "Elite") {
    return "All-Around Star";
  }

  if (scoring === "Elite") {
    return "Scoring Specialist";
  }

  if (playmaking === "Elite") {
    return "Playmaking Specialist";
  }

  if (rebounding === "Elite") {
    return "Rebounding Specialist";
  }

  if (scoring === "Strong" && playmaking === "Strong") {
    return "Two-Way Offensive Player";
  }

  if (scoring === "Strong" && rebounding === "Strong") {
    return "Scoring & Rebounding Player";
  }

  if (playmaking === "Strong" && rebounding === "Strong") {
    return "Playmaking & Rebounding Player";
  }

  return "Balanced Player";
}

function getMilestone(player) {

  const categories = [];

  if (player.points >= MILESTONE_THRESHOLD) {
    categories.push("Points");
  }

  if (player.assists >= MILESTONE_THRESHOLD) {
    categories.push("Assists");
  }

  if (player.rebounds >= MILESTONE_THRESHOLD) {
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
  } = await analyzeWithAI({
    player,
    performance: analysis.performance,
    strength: analysis.strength,
    weakness: analysis.weakness,
    overallScore: analysis.overallScore,
    grade: analysis.grade,
    role: analysis.role,
    milestone: analysis.milestone
  });

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
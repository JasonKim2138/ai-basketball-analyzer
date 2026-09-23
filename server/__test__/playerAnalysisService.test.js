jest.mock("../services/aiService", () => ({
  analyzeWithAI: jest.fn()
}));

jest.mock("../models/Player", () => {
  return jest.fn().mockImplementation(function (data) {
    this.data = data;
    this.save = jest.fn().mockResolvedValue({
      _id: "player123",
      ...data
    });
  });
});

const {
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

} = require("../services/playerAnalysisService");

const {
  analyzeWithAI
} = require("../services/aiService");

const {
  validatePlayer,
  validatePlayerUpdate
} = require("../validators/playerValidator");

describe("getScoringLevel", () => {

  test("30 points should be Elite", () => {
    expect(getScoringLevel(30)).toBe("Elite");
  });

  test("29 points should be Strong", () => {
    expect(getScoringLevel(29)).toBe("Strong");
  });

  test("25 points should be Strong", () => {
    expect(getScoringLevel(25)).toBe("Strong");
  });

  test("24 points should be Moderate", () => {
    expect(getScoringLevel(24)).toBe("Moderate");
  });

  test("15 points should be Moderate", () => {
    expect(getScoringLevel(15)).toBe("Moderate");
  });

  test("14 points should be Low", () => {
    expect(getScoringLevel(14)).toBe("Low");
  });

});

describe("getPlaymakingLevel", () => {

  test("7 assists should be Elite", () => {
    expect(getPlaymakingLevel(7)).toBe("Elite");
  });

  test("6 assists should be Strong", () => {
    expect(getPlaymakingLevel(6)).toBe("Strong");
  });

  test("4 assists should be Strong", () => {
    expect(getPlaymakingLevel(4)).toBe("Strong");
  });

  test("3 assists should be Moderate", () => {
    expect(getPlaymakingLevel(3)).toBe("Moderate");
  });

  test("2 assists should be Moderate", () => {
    expect(getPlaymakingLevel(2)).toBe("Moderate");
  });

  test("1 assist should be Low", () => {
    expect(getPlaymakingLevel(1)).toBe("Low");
  });

});

describe("getReboundingLevel", () => {

  test("10 rebounds should be Elite", () => {
    expect(getReboundingLevel(10)).toBe("Elite");
  });

  test("9 rebounds should be Strong", () => {
    expect(getReboundingLevel(9)).toBe("Strong");
  });

  test("7 rebounds should be Strong", () => {
    expect(getReboundingLevel(7)).toBe("Strong");
  });

  test("6 rebounds should be Moderate", () => {
    expect(getReboundingLevel(6)).toBe("Moderate");
  });

  test("4 rebounds should be Moderate", () => {
    expect(getReboundingLevel(4)).toBe("Moderate");
  });

  test("3 rebounds should be Low", () => {
    expect(getReboundingLevel(3)).toBe("Low");
  });

});

describe("getOverallScore", () => {

  test("Elite in all categories should score 4", () => {
    expect(
      getOverallScore({
        scoring: "Elite",
        playmaking: "Elite",
        rebounding: "Elite"
      })
    ).toBe(4);
  });

  test("Low in all categories should score 1", () => {
    expect(
      getOverallScore({
        scoring: "Low",
        playmaking: "Low",
        rebounding: "Low"
      })
    ).toBe(1);
  });

  test("Strong in all categories should score 3", () => {
    expect(
      getOverallScore({
        scoring: "Strong",
        playmaking: "Strong",
        rebounding: "Strong"
      })
    ).toBe(3);
  });

  test("Elite scoring with low playmaking and rebounding should score 2.2", () => {
    expect(
      getOverallScore({
        scoring: "Elite",
        playmaking: "Low",
        rebounding: "Low"
      })
    ).toBe(2.2);
  });

});

describe("getGrade", () => {

  test("3.5 should be S", () => {
    expect(getGrade(3.5)).toBe("S");
  });

  test("3.0 should be A", () => {
    expect(getGrade(3.0)).toBe("A");
  });

  test("2.99 should be B", () => {
    expect(getGrade(2.99)).toBe("B");
  });

  test("2.5 should be B", () => {
    expect(getGrade(2.5)).toBe("B");
  });

  test("2.0 should be C", () => {
    expect(getGrade(2.0)).toBe("C");
  });

  test("1.99 should be D", () => {
    expect(getGrade(1.99)).toBe("D");
  });

});

describe("getPlayerRole", () => {

  test("Elite scoring and elite playmaking should be All-Around Star", () => {
    expect(
      getPlayerRole({
        scoring: "Elite",
        playmaking: "Elite",
        rebounding: "Moderate"
      })
    ).toBe("All-Around Star");
  });

  test("Elite scoring should be Scoring Specialist", () => {
    expect(
      getPlayerRole({
        scoring: "Elite",
        playmaking: "Moderate",
        rebounding: "Moderate"
      })
    ).toBe("Scoring Specialist");
  });

  test("Elite playmaking should be Playmaking Specialist", () => {
    expect(
      getPlayerRole({
        scoring: "Moderate",
        playmaking: "Elite",
        rebounding: "Moderate"
      })
    ).toBe("Playmaking Specialist");
  });

  test("Elite rebounding should be Rebounding Specialist", () => {
    expect(
      getPlayerRole({
        scoring: "Moderate",
        playmaking: "Moderate",
        rebounding: "Elite"
      })
    ).toBe("Rebounding Specialist");
  });

  test("Strong scoring and strong playmaking should be Two-Way Offensive Player", () => {
    expect(
      getPlayerRole({
        scoring: "Strong",
        playmaking: "Strong",
        rebounding: "Low"
      })
    ).toBe("Two-Way Offensive Player");
  });

  test("No standout category should be Balanced Player", () => {
    expect(
      getPlayerRole({
        scoring: "Moderate",
        playmaking: "Moderate",
        rebounding: "Moderate"
      })
    ).toBe("Balanced Player");
  });

});

describe("getMilestone", () => {

  test("10 points, 10 assists, and 10 rebounds should be Triple-Double", () => {
    expect(
      getMilestone({
        points: 10,
        assists: 10,
        rebounds: 10
      })
    ).toEqual({
      type: "Triple-Double",
      categories: [
        "Points",
        "Assists",
        "Rebounds"
      ]
    });
  });

  test("10 points and 10 assists should be Double-Double", () => {
    expect(
      getMilestone({
        points: 10,
        assists: 10,
        rebounds: 9
      })
    ).toEqual({
      type: "Double-Double",
      categories: [
        "Points",
        "Assists"
      ]
    });
  });

  test("10 points and 10 rebounds should be Double-Double", () => {
    expect(
      getMilestone({
        points: 10,
        assists: 9,
        rebounds: 10
      })
    ).toEqual({
      type: "Double-Double",
      categories: [
        "Points",
        "Rebounds"
      ]
    });
  });

  test("10 assists and 10 rebounds should be Double-Double", () => {
    expect(
      getMilestone({
        points: 9,
        assists: 10,
        rebounds: 10
      })
    ).toEqual({
      type: "Double-Double",
      categories: [
        "Assists",
        "Rebounds"
      ]
    });
  });

  test("Only one category at 10 should be None", () => {
    expect(
      getMilestone({
        points: 10,
        assists: 9,
        rebounds: 9
      })
    ).toEqual({
      type: "None",
      categories: []
    });
  });

});

describe("getStrength", () => {

  test("Elite scoring should be Scoring", () => {
    expect(
      getStrength({
        scoring: "Elite",
        playmaking: "Moderate",
        rebounding: "Low"
      })
    ).toBe("Scoring");
  });

  test("Elite scoring and playmaking should show both strengths", () => {
    expect(
      getStrength({
        scoring: "Elite",
        playmaking: "Elite",
        rebounding: "Moderate"
      })
    ).toBe("Scoring & Playmaking");
  });

  test("All low categories should return None", () => {
    expect(
      getStrength({
        scoring: "Low",
        playmaking: "Low",
        rebounding: "Low"
      })
    ).toBe("None");
  });

});


describe("getWeakness", () => {

  test("Low rebounding should be the weakness", () => {
    expect(
      getWeakness({
        scoring: "Elite",
        playmaking: "Strong",
        rebounding: "Low"
      })
    ).toBe("Rebounding");
  });

  test("Low playmaking and low rebounding should show both weaknesses", () => {
    expect(
      getWeakness({
        scoring: "Elite",
        playmaking: "Low",
        rebounding: "Low"
      })
    ).toBe("Playmaking & Rebounding");
  });

  test("Strong or better in every category should be Balanced", () => {
    expect(
      getWeakness({
        scoring: "Strong",
        playmaking: "Strong",
        rebounding: "Elite"
      })
    ).toBe("Balanced");
  });

});

describe("analyzePlayer", () => {

  test("should create a complete basketball evaluation", () => {

    const result = analyzePlayer({
      name: "Test Player",
      points: 30,
      assists: 8,
      rebounds: 4
    });

    expect(result.performance).toEqual({
      scoring: "Elite",
      playmaking: "Elite",
      rebounding: "Moderate"
    });

    expect(result.overallScore).toBe(3.4);

    expect(result.grade).toBe("A");

    expect(result.starter).toBe("Starter");

    expect(result.strength).toBe("Scoring & Playmaking");

    expect(result.weakness).toBe("Rebounding");

    expect(result.role).toBe("All-Around Star");

    expect(result.milestone).toEqual({
      type: "None",
      categories: []
    });

    expect(result.message).toBe(
      "Excellent overall performance!"
    );
  });

});

describe("analyzePlayerWithAI", () => {

  test("should combine basketball analysis with AI analysis", async () => {

    analyzeWithAI.mockResolvedValue({
      aiAnalysis: {
        scoringAnalysis: "Elite scoring output",
        playmakingAnalysis: "Strong playmaking output",
        reboundingAnalysis: "Moderate rebounding output",
        strength: "Scoring and playmaking",
        weakness: "Rebounding",
        overall: "Excellent overall performance"
      },
      aiAvailable: true
    });

    const result = await analyzePlayerWithAI({
      name: "Test Player",
      points: 30,
      assists: 8,
      rebounds: 4
    });

    expect(result.grade).toBe("A");

    expect(result.role).toBe("All-Around Star");

    expect(result.aiAvailable).toBe(true);

    expect(result.aiAnalysis).toEqual({
      scoringAnalysis: "Elite scoring output",
      playmakingAnalysis: "Strong playmaking output",
      reboundingAnalysis: "Moderate rebounding output",
      strength: "Scoring and playmaking",
      weakness: "Rebounding",
      overall: "Excellent overall performance"
    });

  });

});

test("should return fallback AI data when AI is unavailable", async () => {

  analyzeWithAI.mockResolvedValue({
    aiAnalysis: {
      overall: "AI analysis is currently unavailable.",
      strength: "Unable to generate AI analysis.",
      weakness: "Unable to generate AI analysis.",
      scoringAnalysis: "AI analysis unavailable.",
      playmakingAnalysis: "AI analysis unavailable.",
      reboundingAnalysis: "AI analysis unavailable."
    },
    aiAvailable: false
  });

  const result = await analyzePlayerWithAI({
    name: "Test Player",
    points: 30,
    assists: 8,
    rebounds: 4
  });

  expect(result.aiAvailable).toBe(false);

  expect(result.aiAnalysis.overall).toBe(
    "AI analysis is currently unavailable."
  );

  expect(result.grade).toBe("A");

});

describe("validatePlayer", () => {

  test("valid player should return no errors", () => {
    expect(
      validatePlayer({
        name: "Jason",
        points: 30,
        assists: 8,
        rebounds: 10
      })
    ).toEqual({});
  });

  test("missing name should return a name error", () => {
    expect(
      validatePlayer({
        points: 30,
        assists: 8,
        rebounds: 10
      })
    ).toEqual({
      name: "Player name is required"
    });
  });

  test("negative points should return a points error", () => {
    expect(
      validatePlayer({
        name: "Jason",
        points: -1,
        assists: 8,
        rebounds: 10
      })
    ).toEqual({
      points: "Points must be a number greater than or equal to 0"
    });
  });

  test("string points should return a points error", () => {
    expect(
      validatePlayer({
        name: "Jason",
        points: "30",
        assists: 8,
        rebounds: 10
      })
    ).toEqual({
      points: "Points must be a number greater than or equal to 0"
    });
  });

  test("zero points should be valid", () => {
    expect(
      validatePlayer({
        name: "Jason",
        points: 0,
        assists: 0,
        rebounds: 0
      })
    ).toEqual({});
  });

});

describe("validatePlayerUpdate", () => {

  test("valid partial update should return no errors", () => {
    expect(
      validatePlayerUpdate({
        points: 30
      })
    ).toEqual({});
  });

  test("empty update should return no errors", () => {
    expect(
      validatePlayerUpdate({})
    ).toEqual({});
  });

  test("negative points should return a points error", () => {
    expect(
      validatePlayerUpdate({
        points: -1
      })
    ).toEqual({
      points: "Points must be a number >= 0"
    });
  });

  test("empty player name should return a name error", () => {
    expect(
      validatePlayerUpdate({
        name: "   "
      })
    ).toEqual({
      name: "Player name must be a non-empty string"
    });
  });

  test("zero values should be valid", () => {
    expect(
      validatePlayerUpdate({
        points: 0,
        assists: 0,
        rebounds: 0
      })
    ).toEqual({});
  });

});
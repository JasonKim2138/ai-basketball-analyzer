jest.mock("../models/Player", () => {
  return jest.fn().mockImplementation(function (data) {
    this.data = data;

    this.save = jest.fn().mockResolvedValue({
      _id: "player123",
      ...data
    });
  });
});

jest.mock("../services/playerAnalysisService", () => ({
  analyzePlayerWithAI: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const Player = require("../models/Player");

Player.find = jest.fn();

Player.findOne = jest.fn();

Player.findOneAndDelete = jest.fn();

const {
  analyzePlayerWithAI
} = require("../services/playerAnalysisService");

const {
    createPlayer,
    getPlayers,
    deletePlayer,
    updatePlayer
} = require("../services/playerService");


describe("createPlayer", () => {

  test("should analyze and save a player", async () => {

    const playerData = {
      name: "Jason",
      points: 30,
      assists: 8,
      rebounds: 10
    };

    const userId = "user123";

    const analysis = {
      performance: {
        scoring: "Elite",
        playmaking: "Elite",
        rebounding: "Strong"
      },
      overallScore: 3.7,
      starter: "Starter",
      grade: "S",
      message: "Elite all-around performance!",
      strength: "Scoring & Playmaking",
      weakness: "Rebounding",
      role: "All-Around Star",
      milestone: {
        type: "Double-Double",
        categories: ["Points", "Rebounds"]
      },
      aiAnalysis: {
        overall: "Excellent performance"
      },
      aiAvailable: true
    };

    analyzePlayerWithAI.mockResolvedValue(analysis);

    const result = await createPlayer(
      playerData,
      userId
    );

    expect(analyzePlayerWithAI)
      .toHaveBeenCalledWith(playerData);

    expect(Player)
      .toHaveBeenCalledWith({
        ...analysis,
        player: playerData,
        userId
      });

    expect(result).toEqual({
      _id: "player123",
      ...analysis,
      player: playerData,
      userId
    });

  });

});

describe("getPlayers", () => {

  test("should find players belonging to the user", async () => {

    const fakePlayers = [
      {
        player: {
          name: "Jason"
        }
      }
    ];

    Player.find.mockResolvedValue(fakePlayers);

    const result = await getPlayers("user123");

    expect(Player.find).toHaveBeenCalledWith({
      userId: "user123"
    });

    expect(result).toEqual(fakePlayers);
  });

});

test("should filter by grade when provided", async () => {

  Player.find.mockResolvedValue([]);

  await getPlayers("user123", {
    grade: "A"
  });

  expect(Player.find).toHaveBeenCalledWith({
    userId: "user123",
    grade: "A"
  });

});

test("should filter by player name when provided", async () => {

  Player.find.mockResolvedValue([]);

  await getPlayers("user123", {
    name: "curry"
  });

  expect(Player.find).toHaveBeenCalledWith({
    userId: "user123",
    "player.name": {
      $regex: "curry",
      $options: "i"
    }
  });

});

describe("deletePlayer", () => {

  test("should delete only the player's record belonging to the user", async () => {

    const deletedPlayer = {
      _id: "player123",
      userId: "user123"
    };

    Player.findOneAndDelete.mockResolvedValue(deletedPlayer);

    const result = await deletePlayer(
      "player123",
      "user123"
    );

    expect(Player.findOneAndDelete).toHaveBeenCalledWith({
      _id: "player123",
      userId: "user123"
    });

    expect(result).toEqual(deletedPlayer);
  });

  test("should return null when the player is not found", async () => {

    Player.findOneAndDelete.mockResolvedValue(null);

    const result = await deletePlayer(
      "missing123",
      "user123"
    );

    expect(result).toBeNull();

  });

});

describe("updatePlayer", () => {

  test("should return notFound when the player does not exist", async () => {

    Player.findOne.mockResolvedValue(null);

    const result = await updatePlayer(
      "missing123",
      "user123",
      {
        points: 30
      }
    );

    expect(Player.findOne).toHaveBeenCalledWith({
      _id: "missing123",
      userId: "user123"
    });

    expect(result).toEqual({
      notFound: true
    });

  });

  test("should return validation errors for invalid updated data", async () => {

    Player.findOne.mockResolvedValue({
        player: {
        name: "Jason",
        points: 20,
        assists: 5,
        rebounds: 5
        }
    });

    const result = await updatePlayer(
        "player123",
        "user123",
        {
        points: -1
        }
    );

    expect(result).toEqual({
        validationErrors: {
        points: "Points must be a number >= 0"
        }
    });

    expect(analyzePlayerWithAI).not.toHaveBeenCalled();

  });

  test("should update and save a valid player", async () => {

        const player = {
            player: {
            name: "Jason",
            points: 20,
            assists: 5,
            rebounds: 5
            },
            save: jest.fn().mockResolvedValue()
        };

        Player.findOne.mockResolvedValue(player);

        const analysis = {
            performance: {
            scoring: "Elite",
            playmaking: "Strong",
            rebounding: "Moderate"
            },
            overallScore: 3.5,
            starter: "Starter",
            grade: "S",
            message: "Excellent overall performance!",
            strength: "Scoring",
            weakness: "Rebounding",
            role: "Scoring Specialist",
            milestone: {
            type: "None",
            categories: []
            },
            aiAnalysis: {
            overall: "Excellent performance"
            },
            aiAvailable: true
        };

        analyzePlayerWithAI.mockResolvedValue(analysis);

        const result = await updatePlayer(
            "player123",
            "user123",
            {
            points: 30
            }
        );

        expect(analyzePlayerWithAI).toHaveBeenCalledWith({
            name: "Jason",
            points: 30,
            assists: 5,
            rebounds: 5
        });

        expect(player.player).toEqual({
            name: "Jason",
            points: 30,
            assists: 5,
            rebounds: 5
        });

        expect(player.performance).toEqual(
            analysis.performance
        );

        expect(player.overallScore).toBe(
            analysis.overallScore
        );

        expect(player.grade).toBe(
            analysis.grade
        );

        expect(player.role).toBe(
            analysis.role
        );

        expect(player.milestone).toEqual(
            analysis.milestone
        );

        expect(player.save).toHaveBeenCalled();

        expect(result).toEqual({
            player
        });

    });
});
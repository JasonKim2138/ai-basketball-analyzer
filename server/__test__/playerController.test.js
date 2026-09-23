jest.mock("../services/playerService", () => ({
  createPlayer: jest.fn(),
  getPlayers: jest.fn(),
  deletePlayer: jest.fn(),
  updatePlayer: jest.fn()
}));

jest.mock("../validators/playerValidator", () => ({
  validatePlayer: jest.fn()
}));

jest.mock("../utils/response", () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn()
}));

const {
  createPlayer,
  getPlayers,
  deletePlayer,
  updatePlayer
} = require("../services/playerService");

const {
  validatePlayer
} = require("../validators/playerValidator");

const {
  successResponse,
  errorResponse
} = require("../utils/response");

const {
  createAnalysis
} = require("../controllers/playerController");

beforeEach(() => {
  jest.clearAllMocks();
});

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe("createAnalysis", () => {

  test("should validate, create, and return a player", async () => {

    const req = {
      body: {
        name: "Jason",
        points: 30,
        assists: 8,
        rebounds: 10
      },
      user: {
        userId: "user123"
      }
    };

    const res = createResponse();
    const next = jest.fn();

    const savedPlayer = {
      _id: "player123",
      player: req.body,
      grade: "S"
    };

    validatePlayer.mockReturnValue({});

    createPlayer.mockResolvedValue(savedPlayer);

    await createAnalysis(req, res, next);

    expect(validatePlayer).toHaveBeenCalledWith(
      req.body
    );

    expect(createPlayer).toHaveBeenCalledWith(
      req.body,
      "user123"
    );

    expect(successResponse).toHaveBeenCalledWith(
      res,
      savedPlayer,
      201
    );

    expect(next).not.toHaveBeenCalled();

  });

  test("should return 400 when player validation fails", async () => {

    const req = {
        body: {
        name: "Jason",
        points: -1,
        assists: 8,
        rebounds: 10
        },
        user: {
        userId: "user123"
        }
    };

    const res = createResponse();
    const next = jest.fn();

    const validationErrors = {
        points: "Points must be a number greater than or equal to 0"
    };

    validatePlayer.mockReturnValue(validationErrors);

    await createAnalysis(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
        res,
        "Invalid player data",
        400,
        validationErrors
    );

    expect(createPlayer).not.toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();

    });

    test("should pass unexpected errors to next", async () => {

        const req = {
            body: {
            name: "Jason",
            points: 30,
            assists: 8,
            rebounds: 10
            },
            user: {
            userId: "user123"
            }
        };

        const res = createResponse();
        const next = jest.fn();

        validatePlayer.mockReturnValue({});

        const error = new Error("Database connection failed");

        createPlayer.mockRejectedValue(error);

        await createAnalysis(req, res, next);

        expect(next).toHaveBeenCalledWith(error);

        expect(successResponse).not.toHaveBeenCalled();

    });

});

describe("getPlayers", () => {

  test("should get players using the user ID and search filters", async () => {

    const req = {
      user: {
        userId: "user123"
      },
      query: {
        name: "Curry",
        grade: "A"
      }
    };

    const res = createResponse();
    const next = jest.fn();

    const players = [
      {
        _id: "player123",
        grade: "A"
      }
    ];

    getPlayers.mockResolvedValue(players);

    const { getPlayers: getPlayersController } =
      require("../controllers/playerController");

    await getPlayersController(req, res, next);

    expect(getPlayers).toHaveBeenCalledWith(
      "user123",
      {
        name: "Curry",
        grade: "A"
      }
    );

    expect(successResponse).toHaveBeenCalledWith(
      res,
      players
    );

    expect(next).not.toHaveBeenCalled();

  });

});

describe("deleteAnalysis", () => {

  test("should delete player and return success", async () => {

    const req = {
      params: {
        id: "player123"
      },
      user: {
        userId: "user123"
      }
    };

    const res = createResponse();
    const next = jest.fn();

    deletePlayer.mockResolvedValue({
      _id: "player123"
    });

    const {
      deleteAnalysis
    } = require("../controllers/playerController");

    await deleteAnalysis(req, res, next);

    expect(deletePlayer).toHaveBeenCalledWith(
      "player123",
      "user123"
    );

    expect(successResponse).toHaveBeenCalledWith(
      res,
      {
        message: "Deleted successfully"
      }
    );

    expect(next).not.toHaveBeenCalled();

  });


  test("should return 404 when player is not found", async () => {

    const req = {
      params: {
        id: "missing123"
      },
      user: {
        userId: "user123"
      }
    };

    const res = createResponse();
    const next = jest.fn();

    deletePlayer.mockResolvedValue(null);

    const {
      deleteAnalysis
    } = require("../controllers/playerController");

    await deleteAnalysis(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      "Analysis not found",
      404
    );

    expect(next).not.toHaveBeenCalled();

  });

});

describe("updatePlayer", () => {

  test("should update player and return success", async () => {

    const req = {
      params: {
        id: "player123"
      },
      user: {
        userId: "user123"
      },
      body: {
        points: 30
      }
    };

    const res = createResponse();
    const next = jest.fn();

    const updatedPlayer = {
      _id: "player123",
      grade: "A"
    };

    updatePlayer.mockResolvedValue({
      player: updatedPlayer
    });

    const {
      updatePlayer: updatePlayerController
    } = require("../controllers/playerController");

    await updatePlayerController(req, res, next);

    expect(updatePlayer).toHaveBeenCalledWith(
      "player123",
      "user123",
      {
        points: 30
      }
    );

    expect(successResponse).toHaveBeenCalledWith(
      res,
      updatedPlayer
    );

    expect(next).not.toHaveBeenCalled();

  });


  test("should return 404 when player is not found", async () => {

    const req = {
      params: {
        id: "missing123"
      },
      user: {
        userId: "user123"
      },
      body: {
        points: 30
      }
    };

    const res = createResponse();
    const next = jest.fn();

    updatePlayer.mockResolvedValue({
      notFound: true
    });

    const {
      updatePlayer: updatePlayerController
    } = require("../controllers/playerController");

    await updatePlayerController(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      "Player not found",
      404
    );

    expect(next).not.toHaveBeenCalled();

  });


  test("should return 400 when updated data is invalid", async () => {

    const req = {
      params: {
        id: "player123"
      },
      user: {
        userId: "user123"
      },
      body: {
        points: -1
      }
    };

    const res = createResponse();
    const next = jest.fn();

    const validationErrors = {
      points: "Points must be a number >= 0"
    };

    updatePlayer.mockResolvedValue({
      validationErrors
    });

    const {
      updatePlayer: updatePlayerController
    } = require("../controllers/playerController");

    await updatePlayerController(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      "Invalid player data",
      400,
      validationErrors
    );

    expect(next).not.toHaveBeenCalled();

  });

});
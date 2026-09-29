jest.mock("../services/playerService", () => ({
  createPlayer: jest.fn(),
  getPlayers: jest.fn(),
  deletePlayer: jest.fn(),
  updatePlayer: jest.fn()
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");

const {
    createPlayer,
    getPlayers,
    deletePlayer,
    updatePlayer
} = require("../services/playerService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /", () => {

  test("should return the API health message", async () => {

    const response = await request(app)
      .get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "AI Basketball Backend Running 🏀"
    });

  });

});

describe("POST /player", () => {

    test("should return 401 when no token is provided", async () => {

        const response = await request(app)
            .post("/player")
            .send({
            name: "Jason",
            points: 30,
            assists: 8,
            rebounds: 10
            });

        expect(response.statusCode).toBe(401);

        expect(response.body).toEqual({
            message: "No token provided"
        });

    });

    test("should create a player when a valid token is provided", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        const playerData = {
            name: "Jason",
            points: 30,
            assists: 8,
            rebounds: 10
        };

        const savedPlayer = {
            _id: "player123",
            player: playerData,
            grade: "A"
        };

        createPlayer.mockResolvedValue(savedPlayer);

        const response = await request(app)
            .post("/player")
            .set("Authorization", `Bearer ${token}`)
            .send(playerData);

        expect(response.statusCode).toBe(201);

        expect(createPlayer).toHaveBeenCalledWith(
            playerData,
            "user123"
        );

        expect(response.body).toEqual({
            success: true,
            data: savedPlayer
        });

    });

    test("should return 401 when an invalid token is provided", async () => {

        const response = await request(app)
            .post("/player")
            .set("Authorization", "Bearer invalid-token")
            .send({
            name: "Jason",
            points: 30,
            assists: 8,
            rebounds: 10
            });

        expect(response.statusCode).toBe(401);

        expect(response.body).toEqual({
            message: "Invalid token"
        });

        expect(createPlayer).not.toHaveBeenCalled();

    });

    test("should return 400 when authenticated request has invalid player data", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        const response = await request(app)
            .post("/player")
            .set("Authorization", `Bearer ${token}`)
            .send({
            name: "Jason",
            points: -1,
            assists: 8,
            rebounds: 10
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            success: false,
            message: "Invalid player data",
            errors: {
            points: "Points must be a number greater than or equal to 0"
            }
        });

        expect(createPlayer).not.toHaveBeenCalled();

    });
});

describe("GET /player", () => {

    test("should return the user's players when authenticated", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        const players = [
            {
            _id: "player123",
            player: {
                name: "Jason",
                points: 30,
                assists: 8,
                rebounds: 10
            },
            grade: "A"
            }
        ];

        getPlayers.mockResolvedValue(players);

        const response = await request(app)
            .get("/player")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(getPlayers).toHaveBeenCalledWith(
            "user123",
            {
            name: undefined,
            grade: undefined
            }
        );

        expect(response.body).toEqual({
            success: true,
            data: players
        });

    });

    test("should pass name and grade filters to the player service", async () => {

        const token = jwt.sign(
        {
            userId: "user123"
        },
        process.env.JWT_SECRET
        );

        const players = [
        {
            _id: "player123",
            player: {
            name: "Jason"
            },
            grade: "A"
        }
        ];

        getPlayers.mockResolvedValue(players);

        const response = await request(app)
        .get("/player")
        .query({
            name: "Jason",
            grade: "A"
        })
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(getPlayers).toHaveBeenCalledWith(
        "user123",
        {
            name: "Jason",
            grade: "A"
        }
        );

        expect(response.body).toEqual({
        success: true,
        data: players
        });

    });
});

describe("DELETE /player/:id", () => {

    test("should delete a player when authenticated", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        deletePlayer.mockResolvedValue({
            _id: "player123",
            userId: "user123"
        });

        const response = await request(app)
            .delete("/player/player123")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(deletePlayer).toHaveBeenCalledWith(
            "player123",
            "user123"
        );

        expect(response.body).toEqual({
            success: true,
            data: {
            message: "Deleted successfully"
            }
        });

    });

    test("should return 404 when the player does not exist", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        deletePlayer.mockResolvedValue(null);

        const response = await request(app)
            .delete("/player/missing123")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(deletePlayer).toHaveBeenCalledWith(
            "missing123",
            "user123"
        );

        expect(response.body).toEqual({
            success: false,
            message: "Analysis not found",
            errors: null
        });

    });
});

describe("PUT /player/:id", () => {

    test("should update a player when authenticated", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        const updatedPlayer = {
            _id: "player123",
            player: {
            name: "Jason",
            points: 30,
            assists: 8,
            rebounds: 10
            },
            grade: "A"
        };

        updatePlayer.mockResolvedValue({
            player: updatedPlayer
        });

        const response = await request(app)
            .put("/player/player123")
            .set("Authorization", `Bearer ${token}`)
            .send({
            points: 30,
            assists: 8,
            rebounds: 10
            });

        expect(response.statusCode).toBe(200);

        expect(updatePlayer).toHaveBeenCalledWith(
            "player123",
            "user123",
            {
            points: 30,
            assists: 8,
            rebounds: 10
            }
        );

        expect(response.body).toEqual({
            success: true,
            data: updatedPlayer
        });

    });

    test("should return 404 when the player is not found", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        updatePlayer.mockResolvedValue({
            notFound: true
        });

        const response = await request(app)
            .put("/player/missing123")
            .set("Authorization", `Bearer ${token}`)
            .send({
            points: 30
            });

        expect(response.statusCode).toBe(404);

        expect(updatePlayer).toHaveBeenCalledWith(
            "missing123",
            "user123",
            {
            points: 30
            }
        );

        expect(response.body).toEqual({
            success: false,
            message: "Player not found",
            errors: null
        });

    });

    test("should return 404 when the player is not found", async () => {

        const token = jwt.sign(
        {
            userId: "user123"
        },
        process.env.JWT_SECRET
        );

        updatePlayer.mockResolvedValue({
        notFound: true
        });

        const response = await request(app)
        .put("/player/missing123")
        .set("Authorization", `Bearer ${token}`)
        .send({
            points: 30
        });

        expect(response.statusCode).toBe(404);

        expect(updatePlayer).toHaveBeenCalledWith(
        "missing123",
        "user123",
        {
            points: 30
        }
        );

        expect(response.body).toEqual({
        success: false,
        message: "Player not found",
        errors: null
        });

    });

    test("should return 500 when the player service throws an unexpected error", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        const error = new Error("Database connection failed");

        updatePlayer.mockRejectedValue(error);

        const response = await request(app)
            .put("/player/player123")
            .set("Authorization", `Bearer ${token}`)
            .send({
            points: 30
            });

        expect(response.statusCode).toBe(500);

        expect(response.body).toEqual({
            message: "Internal server error"
        });

    });

    test("should return 400 when an invalid player ID causes a CastError", async () => {

        const token = jwt.sign(
            {
            userId: "user123"
            },
            process.env.JWT_SECRET
        );

        const error = new Error("Invalid ObjectId");
        error.name = "CastError";

        updatePlayer.mockRejectedValue(error);

        const response = await request(app)
            .put("/player/not-a-valid-id")
            .set("Authorization", `Bearer ${token}`)
            .send({
            points: 30
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid player ID"
        });

    });
});
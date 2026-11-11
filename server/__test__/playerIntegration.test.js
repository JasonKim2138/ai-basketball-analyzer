jest.mock("../services/playerAnalysisService", () => ({
  analyzePlayerWithAI: jest.fn()
}));

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");


const User = require("../models/User");
const Player = require("../models/Player");

const {
  createPlayer,
  getPlayers
} = require("../services/playerService");

const {
  analyzePlayerWithAI
} = require("../services/playerAnalysisService");

let mongoServer;

beforeAll(async () => {

    console.log("STEP 1: Starting MongoDB Memory Server");

    mongoServer = await MongoMemoryServer.create();

    console.log("STEP 2: MongoDB Memory Server started");


    console.log("MONGOOSE VERSION:", mongoose.version);
    console.log("MONGODB DRIVER VERSION:", mongoose.mongo?.version);
    console.log("NODE VERSION:", process.version);

    await mongoose.connect(mongoServer.getUri(), {
        serverSelectionTimeoutMS: 5000,
        runtimeAdapters: {
            os: require("os")
        }
    });

    console.log("STEP 3: Mongoose connected");

}, 30000);

afterAll(async () => {

  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }

}, 30000);

beforeEach(async () => {

  await User.deleteMany({});

  await Player.deleteMany({});

  jest.clearAllMocks();

});

describe("Player Database Integration", () => {

    test("should save and retrieve a real player from MongoDB", async () => {

        // 1. Create a real User
        const user = await User.create({
        email: "test@example.com",
        password: "testpassword123"
        });

        // 2. Prepare predictable AI analysis
        analyzePlayerWithAI.mockResolvedValue({
        performance: {
            scoring: "Elite",
            playmaking: "Strong",
            rebounding: "Strong"
        },
        overallScore: 3.7,
        starter: "Starter",
        grade: "S",
        message: "Elite performance",
        strength: "Scoring",
        weakness: "None",
        role: "All-Around Star",
        milestone: {
            type: "Double-Double",
            categories: ["Points", "Assists"]
        },
        aiAnalysis: {
            overall: "Excellent performance"
        },
        aiAvailable: true
        });

        // 3. Create a player using the REAL service
        const savedPlayer = await createPlayer(
        {
            name: " Stephen Curry ",
            points: 30,
            assists: 8,
            rebounds: 5
        },
        user._id
        );

        // 4. Retrieve players using the REAL service
        const players = await getPlayers(user._id);

        // 5. Verify actual database results
        expect(savedPlayer._id).toBeDefined();

        expect(players).toHaveLength(1);

        expect(players[0].player.name).toBe("Stephen Curry");

        expect(players[0].performance.scoring).toBe("Elite");

        expect(players[0].userId.toString()).toBe(
        user._id.toString()
        );

    });

});
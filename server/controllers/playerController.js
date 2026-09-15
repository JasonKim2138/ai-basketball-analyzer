const Player = require("../models/Player");
const {
  validatePlayer,
  validatePlayerUpdate
} = require("../validators/playerValidator");

const {
  analyzePlayer
} = require("../services/playerAnalysisService");

const {
  analyzeWithAI
} = require("../services/aiService");

const {
  successResponse,
  errorResponse
} = require("../utils/response");

async function getPlayers(req, res, next) {

  try {

    const query = {
      userId: req.user.userId
    };

    if (req.query.grade) {
      query.grade = req.query.grade;
    }

    if (req.query.name) {
      query["player.name"] = {
        $regex: req.query.name,
        $options: "i"
      };
    }

    const players = await Player.find(query);

    successResponse(res, players);

  } catch (error) {

    next(error);

  }

}

async function createAnalysis(req, res, next) {
  try {
    
    const player = req.body;

    const errors = validatePlayer(player);

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, "Invalid player data", 400, errors);
    }

  const analysis = analyzePlayer(player);

  let aiAnalysis;

  let aiAvailable = true;

  try {
      aiAnalysis = await analyzeWithAI(player);
  } catch (error) {
      console.error("OpenAI analysis failed:", error.message);

      aiAvailable = false;

      aiAnalysis = {
          overall: "AI analysis is currently unavailable.",
          strength: "Unable to generate AI analysis.",
          weakness: "Unable to generate AI analysis.",
          scoringAnalysis: "AI analysis unavailable.",
          playmakingAnalysis: "AI analysis unavailable.",
          reboundingAnalysis: "AI analysis unavailable."
      };
  }

    const newPlayer = new Player({
      ...analysis,
      player,
      aiAnalysis,
      aiAvailable,
      userId: req.user.userId
    });

    await newPlayer.save();

    successResponse(res, newPlayer, 201);

  } catch (error) {

    next(error);

  }
}

async function deleteAnalysis(req, res) {
  const id = req.params.id;

  const deletedAnalysis =
    await Player.findOneAndDelete({
      _id: id,
      userId: req.user.userId
    });

  if (!deletedAnalysis) {
    return res.status(404).json({
      message: "Analysis not found"
    });
  }

  successResponse(res, {
      message: "Deleted successfully"
  });
}

async function updatePlayer(req, res) {
  const id = req.params.id;

  const player = await Player.findOne({
    _id: id,
    userId: req.user.userId
  });

  if (!player) {
    return res.status(404).json({
      message: "Player not found"
    });
  }

  const updatedPlayerData = {
    ...player.player,

    ...(req.body.name !== undefined && {
      name: req.body.name
    }),

    ...(req.body.points !== undefined && {
      points: req.body.points
    }),

    ...(req.body.assists !== undefined && {
      assists: req.body.assists
    }),

    ...(req.body.rebounds !== undefined && {
      rebounds: req.body.rebounds
    })
  };

  const errors = validatePlayerUpdate(updatedPlayerData);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Invalid player data",
      errors
    });
  }

  const analysis = analyzePlayer(updatedPlayerData);

  let aiAnalysis;
  let aiAvailable = true;
  
  try {
    aiAnalysis = await analyzeWithAI(updatedPlayerData);
  } catch (error) {
    console.error("OpenAI analysis failed during update:", error.message);

    aiAvailable = false;

    aiAnalysis = {
      overall: "AI analysis is currently unavailable.",
      strength: "Unable to generate AI analysis.",
      weakness: "Unable to generate AI analysis.",
      scoringAnalysis: "AI analysis unavailable.",
      playmakingAnalysis: "AI analysis unavailable.",
      reboundingAnalysis: "AI analysis unavailable."
    };
  }

  player.player = updatedPlayerData;
  player.starter = analysis.starter;
  player.grade = analysis.grade;
  player.message = analysis.message;
  player.aiAnalysis = aiAnalysis;
  player.aiAvailable = aiAvailable;

  await player.save();

  res.json(player);
}

module.exports = {
  getPlayers,
  createAnalysis,
  deleteAnalysis,
  updatePlayer
};
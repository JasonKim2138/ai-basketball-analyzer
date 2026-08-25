const Player = require("../models/Player");
const {
  validatePlayer,
  validatePlayerUpdate
} = require("../validators/playerValidator");

const {
  analyzePlayer
} = require("../services/playerAnalysisService");

async function getPlayers(req, res) {
  const encodedGrade = req.query.grade;
  const encodedName = req.query.name;

  let query = {};

  if (encodedGrade) {
    query.grade = encodedGrade;
  }

  if (encodedName) {
    query["player.name"] = {
      $regex: encodedName,
      $options: "i"
    };
  }

  const players = await Player.find(query);

  res.json(players);
}

async function getHistory(req, res) {
  const history = await Player.find({
    userId: req.user.userId
  }).sort({ createdAt: -1 });

  res.json(history);
}

async function createAnalysis(req, res, next) {
  try {
    
    const player = req.body;

    const errors = validatePlayer(player);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Invalid player data",
        errors
      });
    }
    const analysis = analyzePlayer(player);

    const newPlayer = new Player({
      ...analysis,
      userId: req.user.userId
    });

    await newPlayer.save();

    res.status(201).json(newPlayer);

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

  res.json({
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

  player.player = updatedPlayerData;
  player.starter = analysis.starter;
  player.grade = analysis.grade;
  player.message = analysis.message;

  await player.save();

  res.json(player);
}

module.exports = {
  getPlayers,
  getHistory,
  createAnalysis,
  deleteAnalysis,
  updatePlayer
};
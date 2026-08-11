const Player = require("../models/Player");

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
  });

  res.json(history);
}

async function createAnalysis(req, res) {
  const player = req.body;

  const analysis = analyzePlayer(player);

  const newAnalysis = new Player({
    ...analysis,
    userId: req.user.userId
  });

  await newAnalysis.save();

  res.json(newAnalysis);
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

async function updateAnalysis(req, res) {
  const id = req.params.id;

  const updatedData = req.body;

  const updatedAnalysis =
    await Player.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.userId
      },
      updatedData,
      {
        returnDocument: "after"
      }
    );

  if (!updatedAnalysis) {
    return res.status(404).json({
      message: "Analysis not found"
    });
  }

  res.json(updatedAnalysis);
}

module.exports = {
  getPlayers,
  getHistory,
  createAnalysis,
  deleteAnalysis,
  updateAnalysis
};
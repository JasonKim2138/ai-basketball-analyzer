const Player = require("../models/Player");

const {
  analyzePlayerWithAI
} = require("./playerAnalysisService");

const {
  validatePlayerUpdate
} = require("../validators/playerValidator");

async function createPlayer(playerData, userId) {

  const analysis = await analyzePlayerWithAI(playerData);

  const newPlayer = new Player({
    ...analysis,
    player: playerData,
    userId
  });

  return await newPlayer.save();
}

async function getPlayers(userId, filters = {}) {

  const query = {
    userId
  };

  if (filters.grade) {
    query.grade = filters.grade;
  }

  if (filters.name) {
    query["player.name"] = {
      $regex: filters.name,
      $options: "i"
    };
  }

  return await Player.find(query);
}

async function deletePlayer(id, userId) {

  return await Player.findOneAndDelete({
    _id: id,
    userId
  });
}

async function updatePlayer(id, userId, updatedData) {

  const player = await Player.findOne({
    _id: id,
    userId
  });

  if (!player) {
    return {
      notFound: true
    };
  }

  const updatedPlayerData = {
    ...player.player,

    ...(updatedData.name !== undefined && {
      name: updatedData.name
    }),

    ...(updatedData.points !== undefined && {
      points: updatedData.points
    }),

    ...(updatedData.assists !== undefined && {
      assists: updatedData.assists
    }),

    ...(updatedData.rebounds !== undefined && {
      rebounds: updatedData.rebounds
    })
  };

  const errors = validatePlayerUpdate(updatedPlayerData);

  if (Object.keys(errors).length > 0) {
    return {
      validationErrors: errors
    };
  }

  const analysis = await analyzePlayerWithAI(
    updatedPlayerData
  );

  player.player = updatedPlayerData;
  player.performance = analysis.performance;
  player.overallScore = analysis.overallScore;
  player.starter = analysis.starter;
  player.grade = analysis.grade;
  player.message = analysis.message;
  player.strength = analysis.strength;
  player.weakness = analysis.weakness;
  player.role = analysis.role;
  player.aiAnalysis = analysis.aiAnalysis;
  player.aiAvailable = analysis.aiAvailable;
  player.milestone = analysis.milestone;

  await player.save();

  return {
    player
  };
}

module.exports = {
    createPlayer,
    getPlayers,
    deletePlayer,
    updatePlayer
};
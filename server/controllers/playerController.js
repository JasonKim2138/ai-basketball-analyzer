const asyncHandler = require("../utils/asyncHandler");

const {
  createPlayer,
  getPlayers,
  deletePlayer,
  updatePlayer: updatePlayerService
} = require("../services/playerService");

const {
  validatePlayer
} = require("../validators/playerValidator");

const {
  successResponse,
  errorResponse
} = require("../utils/response");

async function getPlayersController(req, res) {

  const players = await getPlayers(
    req.user.userId,
    {
      name: req.query.name,
      grade: req.query.grade
    }
  );

  return successResponse(res, players);

}

async function createAnalysis(req, res) {

  const player = req.body;

  const errors = validatePlayer(player);

  if (Object.keys(errors).length > 0) {
    return errorResponse(
      res,
      "Invalid player data",
      400,
      errors
    );
  }

  const newPlayer = await createPlayer(
    player,
    req.user.userId
  );

  return successResponse(res, newPlayer, 201);

}

async function deleteAnalysis(req, res) {

    const deletedPlayer = await deletePlayer(
      req.params.id,
      req.user.userId
    );

    if (!deletedPlayer) {
      return errorResponse(
        res,
        "Analysis not found",
        404
      );
    }

    return successResponse(res, {
      message: "Deleted successfully"
    });
}

async function updatePlayer(req, res) {

    const result = await updatePlayerService(
      req.params.id,
      req.user.userId,
      req.body,
    );

    if (result.notFound) {
      return errorResponse(
        res,
        "Player not found",
        404
      );
    }

    if (result.validationErrors) {
      return errorResponse(
        res,
        "Invalid player data",
        400,
        result.validationErrors
      );
    }

    return successResponse(
      res,
      result.player
    );
}

module.exports = {
  getPlayers: asyncHandler(getPlayersController),
  createAnalysis: asyncHandler(createAnalysis),
  deleteAnalysis: asyncHandler(deleteAnalysis),
  updatePlayer: asyncHandler(updatePlayer)
};
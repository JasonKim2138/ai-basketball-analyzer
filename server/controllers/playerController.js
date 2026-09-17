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

async function getPlayersController(req, res, next) {

  try {

    const players = await getPlayers(
      req.user.userId,
      {
        name: req.query.name,
        grade: req.query.grade
      }
    );


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

    const newPlayer = await createPlayer(
      player,
      req.user.userId
    );

    successResponse(res, newPlayer, 201);

  } catch (error) {

    next(error);

  }
}

async function deleteAnalysis(req, res, next) {

  try {

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

    successResponse(res, {
      message: "Deleted successfully"
    });

  } catch (error) {
    next(error);
  }
}

async function updatePlayer(req, res, next) {

  try {

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

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlayers: getPlayersController,
  createAnalysis,
  deleteAnalysis,
  updatePlayer
};
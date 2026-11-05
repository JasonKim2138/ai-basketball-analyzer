function isInvalidStat(value) {
  return !Number.isFinite(value) || value < 0;
}

function isInvalidName(name) {
  return typeof name !== "string" || name.trim() === "";
}

function validatePlayer(player) {

  const errors = {};

  if (isInvalidName(player.name)) {
    errors.name = "Player name is required";
  }

  if (isInvalidStat(player.points)) {
    errors.points = "Points must be a number greater than or equal to 0";
  }

  if (isInvalidStat(player.assists)) {
    errors.assists = "Assists must be a number greater than or equal to 0";
  }

  if (isInvalidStat(player.rebounds)) {
    errors.rebounds = "Rebounds must be a number greater than or equal to 0";
  }

  return errors;
}

function validatePlayerUpdate(player) {

  const errors = {};

  if (
    player.name !== undefined &&
    isInvalidName(player.name)
  ) {
    errors.name = "Player name must be a non-empty string";
  }

  if (
    player.points !== undefined &&
    isInvalidStat(player.points)
  ) {
    errors.points = "Points must be a number >= 0";
  }

  if (
    player.assists !== undefined &&
    isInvalidStat(player.assists)
  ) {
    errors.assists = "Assists must be a number >= 0";
  }

  if (
    player.rebounds !== undefined &&
    isInvalidStat(player.rebounds)
  ) {
    errors.rebounds = "Rebounds must be a number >= 0";
  }

  return errors;
}

module.exports = {
    validatePlayer, 
    validatePlayerUpdate
};
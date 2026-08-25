function validatePlayer(player) {
  const errors = {};

  if (!player.name || typeof player.name !== "string") {
    errors.name = "Player name is required";
  }

  if (
    player.points === undefined ||
    typeof player.points !== "number" ||
    player.points < 0
  ) {
    errors.points = "Points must be a number greater than or equal to 0";
  }

  if (
    player.assists === undefined ||
    typeof player.assists !== "number" ||
    player.assists < 0
  ) {
    errors.assists = "Assists must be a number greater than or equal to 0";
  }

  if (
    player.rebounds === undefined ||
    typeof player.rebounds !== "number" ||
    player.rebounds < 0
  ) {
    errors.rebounds = "Rebounds must be a number greater than or equal to 0";
  }

  return errors;
}

function validatePlayerUpdate(player) {
  const errors = {};

  if (player.name !== undefined) {
    if (
      typeof player.name !== "string" ||
      player.name.trim() === ""
    ) {
      errors.name = "Player name must be a non-empty string";
    }
  }

  if (player.points !== undefined) {
    if (
      typeof player.points !== "number" ||
      player.points < 0
    ) {
      errors.points = "Points must be a number >= 0";
    }
  }

  if (player.assists !== undefined) {
    if (
      typeof player.assists !== "number" ||
      player.assists < 0
    ) {
      errors.assists = "Assists must be a number >= 0";
    }
  }

  if (player.rebounds !== undefined) {
    if (
      typeof player.rebounds !== "number" ||
      player.rebounds < 0
    ) {
      errors.rebounds = "Rebounds must be a number >= 0";
    }
  }

  return errors;
}

module.exports = {
    validatePlayer, 
    validatePlayerUpdate
};
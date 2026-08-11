const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema(
  {
  player: Object,

  starter: String,

  grade: String,

  message: String,
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

  },

  {
    timestamps: true
  }
);

const Player = mongoose.model(
  "Player",
  playerSchema
);

module.exports = Player;
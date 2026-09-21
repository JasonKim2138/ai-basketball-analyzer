const mongoose = require("mongoose")

const playerSchema = new mongoose.Schema(
  {
  player: Object,

  performance: Object,

  overallScore: Number,

  starter: String,
  grade: String,
  message: String,

  strength: String,
  weakness: String,
  role: String,
  milestone: Object,

  aiAnalysis: Object,
  aiAvailable: Boolean,
  
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
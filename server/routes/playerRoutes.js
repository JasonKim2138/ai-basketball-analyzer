const express = require("express");

const auth = require("../middleware/auth");

const {
  getPlayers,
  getHistory,
  createAnalysis,
  deleteAnalysis,
  updatePlayer
} = require("../controllers/playerController");

const router = express.Router();

router.get("/players", auth, getPlayers);

router.get("/history", auth, getHistory);

router.post("/analyze", auth, createAnalysis);

router.delete("/history/:id", auth, deleteAnalysis);

router.put("/history/:id", auth, updatePlayer);

module.exports = router;
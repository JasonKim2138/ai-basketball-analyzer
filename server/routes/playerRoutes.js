const express = require("express");

const auth = require("../middleware/auth");

const {
  getPlayers,
  createAnalysis,
  deleteAnalysis,
  updatePlayer
} = require("../controllers/playerController");

const router = express.Router();

router.get("/", auth, getPlayers);

router.post("/", auth, createAnalysis);

router.delete("/:id", auth, deleteAnalysis);

router.put("/:id", auth, updatePlayer);

module.exports = router;
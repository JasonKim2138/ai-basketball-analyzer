const express = require("express");

const loginLimiter = require("../middleware/loginLimiter");

const auth = require("../middleware/auth");

const {
  signup,
  login,
  getMe
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", loginLimiter, login);

router.get("/me", auth, getMe);

module.exports = router;
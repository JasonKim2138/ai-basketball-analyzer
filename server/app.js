const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Basketball Backend Running 🏀"
  });
});

app.use("/auth", authRoutes);
app.use("/player", playerRoutes);

app.use(errorHandler);

module.exports = app;
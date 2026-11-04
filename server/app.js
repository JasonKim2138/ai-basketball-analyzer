const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins
  })
);

app.use(express.json());

const {
  successResponse
} = require("./utils/response");

app.get("/", (req, res) => {
  successResponse(res, {
    message: "AI Basketball Backend Running 🏀"
  });
});

app.use("/auth", authRoutes);
app.use("/player", playerRoutes);

app.use(errorHandler);

module.exports = app;
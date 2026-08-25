console.log("SERVER IS STARTING...");

const express = require('express');
const cors = require('cors');
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('AI Basketball Backend Running 🏀');
});

app.use("/auth", authRoutes);
app.use("/player", playerRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

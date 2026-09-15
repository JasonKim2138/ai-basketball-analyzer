console.log("SERVER IS STARTING...");

const express = require('express');
const cors = require('cors');
require("dotenv").config();

console.log("OpenAI key loaded:", !!process.env.OPENAI_API_KEY);

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

const errorHandler = require("./middleware/errorHandler");

const { analyzeWithAI } = require("./services/aiService");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', async (req, res, next) => {
    try {
        const result = await analyzeWithAI({
            name: "Stephen Curry",
            points: 32,
            assists: 8,
            rebounds: 5
        });

        res.json({
            analysis: result
        });

    } catch (error) {
        next(error);
    }
});

/*
app.get('/', (req, res) => {
  res.send('AI Basketball Backend Running 🏀');
});
*/

app.use("/auth", authRoutes);
app.use("/player", playerRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

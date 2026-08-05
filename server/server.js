console.log("SERVER IS STARTING...");

const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


async function connectDB() {
  try {
    // 1. Trigger the connection
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 2. FORCE a real request to the actual database server
    await mongoose.connection.db.admin().command({ ping: 1 });
    
    console.log("✅ REAL CONNECTION SUCCESS: Database is responding!");
  } catch (err) {
    console.error("❌ ACTUAL CONNECTION ERROR:", err);
  }
}

connectDB();

const playerSchema = new mongoose.Schema(
  {
  player: Object,

  starter: String,

  grade: String,

  message: String

  },

  {
    timestamps: true
  }
);

const userSchema = new mongoose.Schema(
  {
    email: String,

    password: String
  }
)

const PlayerAnalysis = mongoose.model("PlayerAnalysis", playerSchema);
const User = mongoose.model("User",userSchema);

function auth(req, res, next) {

  const authHeader = req.headers.authorization;

    console.log("==============");
    console.log("URL:", req.originalUrl);
    console.log("Header:", authHeader);
    console.log("!authHeader =", !authHeader);

    if (!authHeader) {
        console.log("NO TOKEN!");
        return res.status(401).json({
            message: "No token provided"
        });
    }

  const token = authHeader.split(" ")[1];

  try {

    const decoded =
        jwt.verify(
            token,
            JWT_SECRET
        );

    req.user = decoded;

    next();

  } catch(error) {

    return res.status(401).json({
        message: "Invalid token"
    });

  }
}

app.get("/me", auth, async (req, res) => {

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
          message: "User not found"
      });
    }
    
    res.json({
        _id: user._id,
        email: user.email
    });

});

app.post("/signup", async (req, res) => {

  const email = req.body.email;

  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required"
    });
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({email: normalizedEmail});

  if (existingUser) {
    return res.status(400).json({
          message: "User already exists"
    });
  }

  const hashedPassword =
  await bcrypt.hash(password, 10);

  const user = new User({

    email,

    password: hashedPassword

  });

  await user.save();

  res.json({
    message: "User created"
  });
});

app.post("/login", async (req,res) => {
  const email = req.body.email;

  const password = req.body.password;

  const user = await User.findOne({ email });

  if (!user) {
      return res.status(401).json({
          message: "Invalid email or password"
      });
  }

  const isValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValid) {
      return res.status(401).json({
          message: "Invalid email or password"
      });
  }

  const token = jwt.sign(
  {
    userId: user._id
  },
    JWT_SECRET
  );

  res.json({
    message: "Login successful",
    token
  });
})

app.get('/', (req, res) => {
  res.send('AI Basketball Backend Running 🏀');
});

app.get("/players", auth, async (req, res) => {

  const encodedGrade = req.query.grade;

  const encodedName = req.query.name;
  
  let query = {};

  if (encodedGrade)
  {
    query.grade = encodedGrade;
  }

  if (encodedName) {

    query["player.name"] = {
    $regex: encodedName,
    $options: "i"
    };
  }

  const players =
    await PlayerAnalysis.find(query);

  res.json(players);

});

app.get("/history", auth, async(req, res) => {
  
  token = req.headers.authorization
  
  const history = await PlayerAnalysis.find();

  res.json(history);
});

app.post("/analyze", async (req, res) => {

  const player = req.body;

  const analysis = analyzePlayer(player);

  const newAnalysis = new PlayerAnalysis(analysis);

  await newAnalysis.save();

  res.json(newAnalysis);
});

app.delete("/history/:id", async (req, res) => {

  const id = req.params.id;

  await PlayerAnalysis.findByIdAndDelete(id);

  res.json({ message: "Deleted successfully" });

});

app.put("/history/:id", async (req, res) => {

  const id = req.params.id;

  const updatedData = req.body;

  const updatedAnalysis = await PlayerAnalysis.findByIdAndUpdate(id, updatedData, {new: true});

  res.json(updatedAnalysis);

});

function analyzePlayer(player) {
  const starter = getStarterStatus(player);

  const grade = getGrade(player);

  const message = getMessage(player);

  return ({
    player: player,
    starter,
    grade,
    message
  });
}

function getStarterStatus(player) {

  let starter = "Bench player";

  if (player.points >= 25 && player.assists >= 5 && player.rebounds >= 3) {
      starter = "Starter";
  }
  else if (player.points >= 25) {
    starter = "Starter";
  }
  else if (player.assists <= 7) {
    starter = "Bench player";

  }
  else if (player.rebounds >= 10) {
    starter = "Start player";
  }

  return (starter)
}

function getGrade(player){
  let grade = "D";
  if (player.points >= 30 && player.assists >= 7 && player.rebounds >= 5){
    grade = "S";
  } 
  else if (player.points >= 30 && (player.assists < 7 || player.rebounds < 5)){
    grade = "A";
  }
  else if (player.points < 30 && player.assists >= 7 && player.rebounds >= 5){
    grade = "B";
  }
  else if (player.points < 30 && player.assists < 7 && player.rebounds < 5){
    grade ="C";
  }
  else {
    grade = "D";
  }

  return (grade);
}

function getMessage(player){
  let message = "message";
  if (player.points >= 30 && player.assists >= 7 && player.rebounds >= 5){
    message = "Amazing!";
  } 
  else if (player.points >= 30 && (player.assists < 7 || player.rebounds < 5)){
    message = "Good!";
  }
  else if (player.points < 30 && player.assists >= 7 && player.rebounds >= 5){
    message = "Average";
  }
  else if (player.points < 30 && player.assists < 7 && player.rebounds < 5){
    message ="Need some work";
  }
  else {
    message = "Need a lot of improvement";
  }

  return (message);
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

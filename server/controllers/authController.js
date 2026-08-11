const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

async function signup(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email: normalizedEmail,
    password: hashedPassword
  });

  await user.save();

  res.json({
    message: "User created"
  });
}

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail
  });

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
}

async function getMe(req, res) {
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
}

module.exports = {
  signup,
  login,
  getMe
};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

const JWT_SECRET = env.jwtSecret;

const User = require("../models/User");

const {
  successResponse,
  errorResponse
} = require("../utils/response");

const {
  validateSignup,
  validateLogin
} = require("../validators/authValidator");


async function signup(req, res) {

  const errors = validateSignup(req.body);

  if (Object.keys(errors).length > 0) {

    if (!req.body.email || !req.body.password) {
      return errorResponse(
        res,
        "Email and password are required",
        400
      );
    }

    if (errors.password) {
      return errorResponse(
        res,
        "Password must be at least 8 characters",
        400
      );
    }

    return errorResponse(res, errors, 400);
  }

  const email = req.body.email;
  const password = req.body.password;

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail
  });

  if (existingUser) {
    return errorResponse(
      res,
      "User already exists",
      400
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email: normalizedEmail,
    password: hashedPassword
  });

  await user.save();

  return successResponse(res, {
    message: "User created"
  }, 201);
}


async function login(req, res) {

  const errors = validateLogin(req.body);

  if (Object.keys(errors).length > 0) {
    return errorResponse(
      res,
      errors,
      400
    );
  }

  const email = req.body.email;
  const password = req.body.password;

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail
  });

  if (!user) {
    return errorResponse(
      res,
      "Invalid email or password",
      401
    );
  }

  const isValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValid) {
    return errorResponse(
      res,
      "Invalid email or password",
      401
    );
  }

  const token = jwt.sign(
    {
      userId: user._id
    },
    JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return successResponse(res, {
    message: "Login successful",
    token
  });
}


async function getMe(req, res) {

  const user = await User.findById(req.user.userId);

  if (!user) {
    return errorResponse(
      res,
      "User not found",
      404
    );
  }

  return successResponse(res, {
    _id: user._id,
    email: user.email
  });
}


module.exports = {
  signup: asyncHandler(signup),
  login: asyncHandler(login),
  getMe: asyncHandler(getMe)
};
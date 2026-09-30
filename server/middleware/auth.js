const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  errorResponse
} = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(
      res,
      "No token provided",
      401
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(
      res,
      "Invalid token",
      401
    );
  }
}

module.exports = auth;
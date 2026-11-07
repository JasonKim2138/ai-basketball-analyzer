const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const {
  errorResponse
} = require("../utils/response");

const JWT_SECRET = env.jwtSecret;

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(
      res,
      "No token provided",
      401
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return errorResponse(
      res,
      "Invalid authorization format",
      401
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch {
    return errorResponse(
      res,
      "Invalid token",
      401
    );
  }
}

module.exports = auth;
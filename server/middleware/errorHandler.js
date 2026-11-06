const {
  errorResponse
} = require("../utils/response");


function errorHandler(err, req, res, _next) {

  console.error("🔥 ERROR:", err);

  if (err.name === "CastError") {

    return errorResponse(
      res,
      "Invalid player ID",
      400
    );

  }

  if (err.code === 11000) {
    return errorResponse(
      res,
      "A record with this value already exists",
      409
    );
  }

  return errorResponse(
    res,
    "Internal server error",
    500
  );

}


module.exports = errorHandler;
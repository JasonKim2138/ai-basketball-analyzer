const {
  errorResponse
} = require("../utils/response");


function errorHandler(err, req, res, next) {

  console.error("🔥 ERROR:", err);

  if (err.name === "CastError") {

    return errorResponse(
      res,
      "Invalid player ID",
      400
    );

  }

  return errorResponse(
    res,
    "Internal server error",
    500
  );

}


module.exports = errorHandler;
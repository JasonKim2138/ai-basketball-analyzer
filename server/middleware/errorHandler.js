const {
  errorResponse
} = require("../utils/response");


function errorHandler(err, req, res, _next) {

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large"
    });
  }

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

  if (err.name === "ValidationError") {
    return errorResponse(
      res,
      "Invalid data provided",
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
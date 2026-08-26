function errorHandler(err, req, res, next) {

  console.error("🔥 ERROR:", err);

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid player ID"
    });
  }

  res.status(500).json({
    message: "Internal server error"
  });

}

module.exports = errorHandler;
function errorHandler(err, req, res, next) {

  console.error("🔥 ERROR:", err);

  res.status(500).json({
    message: "Internal server error"
  });

}

module.exports = errorHandler;
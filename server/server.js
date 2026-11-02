console.log("SERVER IS STARTING...");

const {
  env,
  validateEnv
} = require("./config/env");

const connectDB = require("./config/db");

async function startServer() {

  try {

    validateEnv();

    const app = require("./app");

    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });

  } catch (error) {

    console.error("❌ SERVER STARTUP FAILED:", error);

    process.exit(1);

  }

}

startServer();
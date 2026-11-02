require("dotenv").config();

const env = Object.freeze({

  port: Number(process.env.PORT) || 3000,

  mongoUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,

  openaiApiKey: process.env.OPENAI_API_KEY

});


function validateEnv() {

  const requiredVariables = {
    MONGODB_URI: env.mongoUri,
    JWT_SECRET: env.jwtSecret,
    OPENAI_API_KEY: env.openaiApiKey
  };

  const missingVariables = Object.entries(requiredVariables)
    .filter(([, value]) => !value || !value.trim())
    .map(([key]) => key);

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(", ")}`
    );
  }

}


module.exports = {
  env,
  validateEnv
};
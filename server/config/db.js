const mongoose = require("mongoose");

mongoose.set("sanitizeFilter", true);

const { env } = require("./env");

async function connectDB() {

  await mongoose.connect(env.mongoUri);

  await mongoose.connection.db.admin().command({
    ping: 1
  });

  console.log("✅ REAL CONNECTION SUCCESS: Database is responding!");

}

module.exports = connectDB;
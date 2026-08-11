const mongoose = require("mongoose");

async function connectDB() {
  try {
    // 1. Trigger the connection
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 2. FORCE a real request to the actual database server
    await mongoose.connection.db.admin().command({ ping: 1 });
    
    console.log("✅ REAL CONNECTION SUCCESS: Database is responding!");
  } catch (err) {
    console.error("❌ ACTUAL CONNECTION ERROR:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  console.log(
    "Inside connectDB, URI:",
    process.env.MONGO_URI ? "URI present" : "URI missing"
  );
  try {
    console.log("Calling mongoose.connect...");
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

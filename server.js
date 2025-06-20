const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const AppError = require('./utilities/AppError')
const errorHandler = require('./middleware/errorHandler')
const listEndpoints = require('express-list-endpoints');


console.log("Starting server...");
dotenv.config({path: './config.env'});
console.log("Environment variables loaded:", process.env.PORT);

const app = express();

console.log("Setting up middleware...");
app.use(cors());
app.use(express.json());

console.log("Attempting to connect to MongoDB...");
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }

  console.log("Setting up routes...");
  app.get("/", (req, res) => {
    console.log("Root route accessed");
    res.send("E-commerce Backend is Running");
  });

  app.get("/test-db", async (req, res) => {
    try {
      const testCollection = mongoose.connection.db.collection("test");
      await testCollection.insertOne({ test: "Hello MongoDB" });
      const result = await testCollection.findOne({ test: "Hello MongoDB" });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  app.use("/api/products", require("./routes/products"));
  app.use("/api/users", require("./routes/users"));
  app.use("/api/cart", require("./routes/cart"));
  app.use("/api/orders", require("./routes/orders"));
  app.use("/api/admin", require("./routes/admin"));
 
  // app.use('*' , (req , res , next)  => {
  //   const err = new AppError(`Can't find ${req.originalUrl} on this server!` , 404)
        
  //   next(err);
  // })
  

  app.use(errorHandler)

  const PORT = process.env.PORT || 5000;
  console.log("Starting server on port", PORT);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

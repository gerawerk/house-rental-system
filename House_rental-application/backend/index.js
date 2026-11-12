
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectionofDb = require("./config/connect.js");
const path = require("path");
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

//////dotenv config/////////////////////
dotenv.config();


app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


app.get("/readyz", (req, res) => {
  // readyState 1 means fully connected to MongoDB
  const isDbReady = mongoose.connection.readyState === 1;
  if (isDbReady) {
    return res.status(200).json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(503).json({
    status: "not_ready",
    database: "disconnected",
    timestamp: new Date().toISOString(),
  });
});





//////connection to DB/////////////////
connectionofDb();

///////////////port number///////////////////
const PORT = process.env.PORT || 5001;

/////////////////middlewares////////////////
app.use(express.json());
app.use(cors());

/////////////////routes/////////////////////
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/user', require('./routes/userRoutes.js'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/owner', require('./routes/ownerRoutes'))
app.use('/api/payment', paymentRoutes);



const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/////////////////Graceful Shutdown for Kubernetes (SIGTERM & SIGINT)/////////////////
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  // 1. Stop accepting new connections
  server.close(async () => {
    console.log("HTTP server closed. Finishing in-flight requests.");
    try {
      // 2. Cleanly close database connections
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed cleanly.");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  });

  // 3. Fallback: force shutdown if requests take longer than 10s
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
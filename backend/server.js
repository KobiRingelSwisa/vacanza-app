import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ✅ Log Incoming Requests for Debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} Request to ${req.url}`);
  next();
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Server is Running Successfully!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/trips", tripRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;

// ✅ Sync Database & Start Server
sequelize
  .sync()
  .then(() => {
    console.log("✅ Database Synced");
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Error syncing database:", err));

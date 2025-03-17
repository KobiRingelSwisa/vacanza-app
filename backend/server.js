import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Allow CORS for all frontend requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Ensure JSON Parsing is Enabled
app.use(express.json());
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

const PORT = process.env.PORT || 3000;

// ✅ Sync Database & Start Server
sequelize
  .sync()
  .then(() => {
    console.log("✅ Database Synced");
    app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Error syncing database:", err));

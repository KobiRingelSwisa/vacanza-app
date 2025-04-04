import express from "express";
import bcrypt from "bcryptjs";
import { authenticateToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { register, login, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

// ✅ Debugging Middleware: Logs every request
router.use((req, res, next) => {
  console.log(`📥 ${req.method} Request to ${req.url}`);
  console.log("🔎 Headers:", req.headers);
  console.log("📦 Body:", req.body);
  next();
});

// Protected Route: get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Verify email
router.get("/verify-email/:token", verifyEmail);

export default router;

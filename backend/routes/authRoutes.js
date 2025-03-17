import express from "express";
import bcrypt from "bcryptjs";
import { authenticateToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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
    const user = await User.findByPk(req.user.userId, {
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

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    console.log("📥 Register Request Received:", req.body); // Debugging Log

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "❌ All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "❌ Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("✅ User Registered Successfully:", newUser);
    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("❌ Registration Failed:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    console.log("Login Request Received:", req.body); //Debugging Log
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login Successful for: ", user.email);
    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Login Failed: ", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;

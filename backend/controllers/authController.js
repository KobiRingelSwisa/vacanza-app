import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../utils/email.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // Create verification token
    const verificationToken = uuidv4();

    // Create user with UUID
    const user = await User.create({
      id: uuidv4(), // Explicitly set UUID
      firstName,
      lastName,
      email,
      password,
      verificationToken,
      isVerified: true, // Auto-verify for now
    });

    // Try to send verification email, but don't fail if it doesn't work
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
          <h1>Welcome to Vacanza!</h1>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't throw the error, just log it
    }

    // Generate JWT token with the UUID
    const token = generateToken(user.id);

    // Return success response
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed. Please try again.",
      details: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate token with the UUID
    const token = generateToken(user.id);

    // Return user data and token (excluding password)
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
    };

    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed. Please try again.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({
        error: "Invalid verification token",
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      error: "Email verification failed. Please try again.",
    });
  }
};

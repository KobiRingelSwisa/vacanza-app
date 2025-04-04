import express from "express";
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new trip
router.post("/", createTrip);

// Get all trips for the authenticated user
router.get("/", getUserTrips);

// Get a specific trip
router.get("/:id", getTripById);

// Update a trip
router.put("/:id", updateTrip);

// Delete a trip
router.delete("/:id", deleteTrip);

export default router;

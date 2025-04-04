import { generateItinerary } from "../utils/openai.js";
import Trip from "../models/Trip.js";
import { v4 as uuidv4 } from "uuid";

export const createTrip = async (req, res) => {
  try {
    console.log("Creating trip with user ID:", req.user.id);
    console.log("Request body:", req.body);

    const {
      destination,
      startDate,
      endDate,
      interests,
      budget,
      travelStyle,
      accommodation,
      transportation,
    } = req.body;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let itinerary;
    try {
      // Generate AI itinerary
      itinerary = await generateItinerary({
        destination,
        duration,
        interests,
        budget,
        travelStyle,
        accommodation,
        transportation,
      });
    } catch (aiError) {
      console.error("AI Itinerary generation error:", aiError);
      // If AI generation fails, create a basic itinerary
      itinerary = `Basic ${duration}-day itinerary for ${destination}:
      Day 1: Arrival and local exploration
      Day 2: Main attractions and sightseeing
      Day 3: Cultural experiences and local cuisine
      ...`;
    }

    // Convert camelCase to snake_case for database
    const tripData = {
      id: uuidv4(),
      user_id: req.user.id,
      destination,
      start_date: startDate,
      end_date: endDate,
      interests,
      budget,
      travel_style: travelStyle,
      accommodation,
      transportation,
      itinerary,
      status: "planned",
    };

    console.log("Attempting to create trip with data:", tripData);
    const trip = await Trip.create(tripData);
    console.log("Trip created successfully:", trip);

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    console.error("Trip creation error:", error);
    if (error.parent) {
      console.error("Database error details:", error.parent);
    }
    res.status(500).json({
      error: "Failed to create trip",
      details: error.message,
    });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    console.log("Fetching trips for user ID:", req.user.id);

    const trips = await Trip.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });

    console.log("Found trips:", trips);
    console.log("Query parameters:", {
      user_id: req.user.id,
      model: Trip.getTableName(),
      attributes: Object.keys(Trip.rawAttributes),
    });

    if (trips.length === 0) {
      console.log("No trips found. Verifying user exists...");
      const userTripsCount = await Trip.count({
        where: { user_id: req.user.id },
      });
      console.log("Total trips count for user:", userTripsCount);
    }

    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    if (error.parent) {
      console.error("Database error details:", error.parent);
    }
    res.status(500).json({
      error: "Failed to fetch trips",
    });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    res.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({
      error: "Failed to fetch trip",
    });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    // Update trip details
    await trip.update(req.body);

    res.json({
      message: "Trip updated successfully",
      trip,
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({
      error: "Failed to update trip",
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    await trip.destroy();

    res.json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({
      error: "Failed to delete trip",
    });
  }
};

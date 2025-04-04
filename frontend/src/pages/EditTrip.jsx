import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditTrip.css";

const EditTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch trip details");
      const data = await response.json();
      console.log("Received trip data:", data); // Debug log
      setTrip(data); // The response is the trip object directly
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert camelCase to snake_case for the backend
      const tripData = {
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: trip.budget,
        travel_style: trip.travel_style,
        accommodation: trip.accommodation,
        transportation: trip.transportation,
        interests: trip.interests,
        status: trip.status,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) throw new Error("Failed to update trip");

      setSuccessMessage("Trip updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert form field names to database field names
    const fieldMapping = {
      startDate: "start_date",
      endDate: "end_date",
      travelStyle: "travel_style",
    };

    setTrip((prev) => ({
      ...prev,
      [fieldMapping[name] || name]: value,
    }));
  };

  if (isLoading) return <div className="loading">Loading trip details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!trip) return <div className="error-message">Trip not found</div>;

  return (
    <div className="edit-trip-container">
      <h2>Edit Trip</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="edit-trip-form">
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={trip.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={new Date(trip.start_date).toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={new Date(trip.end_date).toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget Range</label>
          <select
            id="budget"
            name="budget"
            value={trip.budget}
            onChange={handleChange}
            required
          >
            <option value="budget">Budget</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="travelStyle">Travel Style</label>
          <select
            id="travelStyle"
            name="travelStyle"
            value={trip.travel_style}
            onChange={handleChange}
            required
          >
            <option value="adventure">Adventure</option>
            <option value="relaxation">Relaxation</option>
            <option value="cultural">Cultural</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="accommodation">Accommodation Type</label>
          <select
            id="accommodation"
            name="accommodation"
            value={trip.accommodation}
            onChange={handleChange}
            required
          >
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="airbnb">Airbnb</option>
            <option value="resort">Resort</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transportation">Transportation Type</label>
          <select
            id="transportation"
            name="transportation"
            value={trip.transportation}
            onChange={handleChange}
            required
          >
            <option value="public">Public Transportation</option>
            <option value="rental">Rental Car</option>
            <option value="private">Private Transport</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTrip;

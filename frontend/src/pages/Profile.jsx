import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trips");
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch trips");
      }

      const data = await response.json();
      console.log("Received trips data:", data); // Debug log
      setTrips(data || []); // The response is the trips array directly
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again later.");
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/trips/${tripId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete trip");

      // Remove the deleted trip from the state
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTrip = (tripId) => {
    navigate(`/edit-trip/${tripId}`);
  };

  const handleViewTrip = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-info"
    >
      <div className="profile-header">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-details">
          <h2>Your Profile</h2>
          <p>Member since {new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{trips.length}</span>
          <span className="stat-label">Trips Planned</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {new Set(trips.map((trip) => trip.destination)).size}
          </span>
          <span className="stat-label">Destinations</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {trips.filter((trip) => trip.status === "completed").length}
          </span>
          <span className="stat-label">Completed Trips</span>
        </div>
      </div>
    </motion.div>
  );

  const renderTrips = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="trips-section"
    >
      {isLoading ? (
        <div className="loading">Loading trips...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : trips.length === 0 ? (
        <div className="no-trips">
          <p>You haven't planned any trips yet.</p>
          <button
            className="create-trip-btn"
            onClick={() => navigate("/plan-trip")}
          >
            Plan Your First Trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <div className="trip-header">
                <h3>{trip.destination}</h3>
                <span className={`trip-status ${trip.status}`}>
                  {trip.status}
                </span>
              </div>
              <div className="trip-dates">
                <p>
                  {new Date(trip.start_date).toLocaleDateString()} -{" "}
                  {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="trip-actions">
                <button
                  className="view-details-btn"
                  onClick={() => handleViewTrip(trip.id)}
                >
                  View Details
                </button>
                <button
                  className="edit-trip-btn"
                  onClick={() => handleEditTrip(trip.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-trip-btn"
                  onClick={() => handleDeleteTrip(trip.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderPreferences = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="preferences-section"
    >
      <div className="preference-card">
        <h3>Travel Preferences</h3>
        <div className="preference-item">
          <span>Preferred Seat</span>
          <select className="preference-select">
            <option>Window</option>
            <option>Aisle</option>
            <option>No Preference</option>
          </select>
        </div>
        <div className="preference-item">
          <span>Preferred Airlines</span>
          <input
            type="text"
            placeholder="Add airlines..."
            className="preference-input"
          />
        </div>
        <div className="preference-item">
          <span>Dietary Requirements</span>
          <select className="preference-select">
            <option>None</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Halal</option>
            <option>Kosher</option>
          </select>
        </div>
        <button className="save-preferences-btn">Save Preferences</button>
      </div>
    </motion.div>
  );

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "trips" ? "active" : ""}`}
            onClick={() => setActiveTab("trips")}
          >
            My Trips
          </button>
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-button ${
              activeTab === "preferences" ? "active" : ""
            }`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "trips" && renderTrips()}
          {activeTab === "preferences" && renderPreferences()}
        </div>
      </div>
    </div>
  );
};

export default Profile;

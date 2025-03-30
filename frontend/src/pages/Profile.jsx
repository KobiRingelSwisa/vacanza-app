import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("trips");

  // Mock data - replace with actual API calls
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    joinedDate: "January 2024",
  };

  const mockTrips = [
    {
      id: 1,
      destination: "Paris, France",
      date: "2024-06-15",
      status: "upcoming",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      destination: "Tokyo, Japan",
      date: "2024-08-20",
      status: "planning",
      image:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3",
    },
  ];

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-info"
    >
      <div className="profile-header">
        <img src={mockUser.avatar} alt="Profile" className="profile-avatar" />
        <div className="profile-details">
          <h2>{mockUser.name}</h2>
          <p>{mockUser.email}</p>
          <span className="join-date">Member since {mockUser.joinedDate}</span>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">12</span>
          <span className="stat-label">Trips Planned</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">8</span>
          <span className="stat-label">Countries Visited</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">15</span>
          <span className="stat-label">Places Saved</span>
        </div>
      </div>
    </motion.div>
  );

  const renderTrips = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="trips-grid"
    >
      {mockTrips.map((trip) => (
        <div key={trip.id} className="trip-card">
          <div
            className="trip-image"
            style={{ backgroundImage: `url(${trip.image})` }}
          >
            <span className={`trip-status ${trip.status}`}>{trip.status}</span>
          </div>
          <div className="trip-info">
            <h3>{trip.destination}</h3>
            <p>
              {new Date(trip.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <button className="view-trip-btn">View Details</button>
          </div>
        </div>
      ))}
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

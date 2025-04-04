import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/PlanTrip.css";

const PlanTrip = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelStyle: "",
    accommodation: "",
    transportation: "",
    interests: [],
    preferences: {
      pace: "moderate",
      foodPreferences: [],
      accessibility: false,
    },
  });

  const travelStyles = [
    { id: "luxury", label: "Luxury", icon: "🏰" },
    { id: "adventure", label: "Adventure", icon: "🏃‍♂️" },
    { id: "cultural", label: "Cultural", icon: "🏛️" },
    { id: "relaxation", label: "Relaxation", icon: "🌴" },
    { id: "budget", label: "Budget", icon: "💰" },
  ];

  const activities = [
    { id: "hiking", label: "Hiking", icon: "🏔️" },
    { id: "beach", label: "Beach", icon: "🏖️" },
    { id: "museums", label: "Museums", icon: "🎨" },
    { id: "food", label: "Food Tours", icon: "🍽️" },
    { id: "shopping", label: "Shopping", icon: "🛍️" },
    { id: "nightlife", label: "Nightlife", icon: "🌙" },
    { id: "history", label: "Historical Sites", icon: "🏛️" },
    { id: "nature", label: "Nature", icon: "🌿" },
    { id: "photography", label: "Photography", icon: "📸" },
    { id: "adventure", label: "Adventure Sports", icon: "🏄‍♂️" },
  ];

  const accommodationTypes = [
    { id: "hotel", label: "Hotel", icon: "🏨" },
    { id: "hostel", label: "Hostel", icon: "🛏️" },
    { id: "apartment", label: "Apartment", icon: "🏢" },
    { id: "resort", label: "Resort", icon: "🌅" },
    { id: "camping", label: "Camping", icon: "⛺" },
  ];

  const transportationTypes = [
    { id: "public", label: "Public Transport", icon: "🚌" },
    { id: "car", label: "Rental Car", icon: "🚗" },
    { id: "walking", label: "Walking", icon: "🚶" },
    { id: "bike", label: "Bicycle", icon: "🚲" },
    { id: "taxi", label: "Taxi/Ride Share", icon: "🚕" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleStyleSelect = (styleId) => {
    setFormData((prev) => ({
      ...prev,
      travelStyle: styleId,
    }));
  };

  const handleAccommodationSelect = (accommodationId) => {
    setFormData((prev) => ({
      ...prev,
      accommodation: accommodationId,
    }));
  };

  const handleTransportationSelect = (transportationId) => {
    setFormData((prev) => ({
      ...prev,
      transportation: transportationId,
    }));
  };

  const nextStep = () => {
    // Validate current step before proceeding
    let isValid = true;
    let errorMessage = "";

    switch (step) {
      case 1:
        if (!formData.destination) {
          isValid = false;
          errorMessage = "Please enter a destination";
        }
        if (!formData.startDate) {
          isValid = false;
          errorMessage = "Please select a start date";
        }
        if (!formData.endDate) {
          isValid = false;
          errorMessage = "Please select an end date";
        }
        if (!formData.budget) {
          isValid = false;
          errorMessage = "Please select a budget range";
        }
        break;
      case 2:
        if (!formData.travelStyle) {
          isValid = false;
          errorMessage = "Please select a travel style";
        }
        break;
      case 3:
        if (formData.interests.length === 0) {
          isValid = false;
          errorMessage = "Please select at least one interest";
        }
        break;
      case 4:
        if (!formData.accommodation) {
          isValid = false;
          errorMessage = "Please select an accommodation type";
        }
        if (!formData.transportation) {
          isValid = false;
          errorMessage = "Please select a transportation type";
        }
        break;
    }

    if (!isValid) {
      setError(errorMessage);
      return;
    }

    setError(""); // Clear any previous errors
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debug log

      if (!token) {
        setError("Please log in to create a trip");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Server response:", data); // Debug log

      if (!response.ok) {
        if (response.status === 403) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(data.details || data.error || "Failed to create trip");
      }

      // Show success message
      setSuccessMessage("Trip created successfully! Redirecting to profile...");

      // Store the created trip in localStorage for the profile page to access
      localStorage.setItem("lastCreatedTrip", JSON.stringify(data.trip));

      // Wait for 2 seconds to show the success message
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error creating trip:", err);
      setError(err.message || "Failed to create trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <h2>Where would you like to go?</h2>
            <div className="form-group">
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Enter destination"
                className="form-input"
                required
              />
            </div>
            <div className="date-inputs">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Budget Range</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select budget range</option>
                <option value="budget">Budget ($)</option>
                <option value="moderate">Moderate ($$)</option>
                <option value="luxury">Luxury ($$$)</option>
              </select>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <h2>What's your travel style?</h2>
            <div className="style-grid">
              {travelStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={`style-card ${
                    formData.travelStyle === style.id ? "selected" : ""
                  }`}
                  onClick={() => handleStyleSelect(style.id)}
                >
                  <span className="style-icon">{style.icon}</span>
                  <span className="style-label">{style.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <h2>What interests you?</h2>
            <div className="interests-grid">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  className={`interest-card ${
                    formData.interests.includes(activity.id) ? "selected" : ""
                  }`}
                  onClick={() => handleInterestToggle(activity.id)}
                >
                  <span className="interest-icon">{activity.icon}</span>
                  <span className="interest-label">{activity.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <h2>Accommodation & Transportation</h2>
            <div className="preferences-section">
              <h3>Preferred Accommodation</h3>
              <div className="accommodation-grid">
                {accommodationTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`preference-card ${
                      formData.accommodation === type.id ? "selected" : ""
                    }`}
                    onClick={() => handleAccommodationSelect(type.id)}
                  >
                    <span className="preference-icon">{type.icon}</span>
                    <span className="preference-label">{type.label}</span>
                  </button>
                ))}
              </div>

              <h3>Transportation Preferences</h3>
              <div className="transportation-grid">
                {transportationTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`preference-card ${
                      formData.transportation === type.id ? "selected" : ""
                    }`}
                    onClick={() => handleTransportationSelect(type.id)}
                  >
                    <span className="preference-icon">{type.icon}</span>
                    <span className="preference-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="plan-trip-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="trip-form">
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {renderStep()}

        <div className="form-navigation">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="nav-button prev"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="nav-button next"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className={`nav-button submit ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Creating Itinerary..." : "Create Itinerary"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;

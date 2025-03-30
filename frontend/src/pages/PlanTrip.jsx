import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/PlanTrip.css";

const PlanTrip = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelStyle: "",
    activities: [],
    preferences: {
      accommodation: "",
      transportation: "",
      pace: "",
      interests: [],
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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActivityToggle = (activityId) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter((id) => id !== activityId)
        : [...prev.activities, activityId],
    }));
  };

  const handleStyleSelect = (styleId) => {
    setFormData((prev) => ({
      ...prev,
      travelStyle: styleId,
    }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we'll add the API call to generate the trip plan
    console.log("Form submitted:", formData);
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
                />
              </div>
            </div>
            <div className="form-group">
              <label>Budget (USD)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget"
                className="form-input"
              />
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
            <h2>What activities interest you?</h2>
            <div className="activities-grid">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  className={`activity-card ${
                    formData.activities.includes(activity.id) ? "selected" : ""
                  }`}
                  onClick={() => handleActivityToggle(activity.id)}
                >
                  <span className="activity-icon">{activity.icon}</span>
                  <span className="activity-label">{activity.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="plan-trip-container">
      <div className="plan-trip-content">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="step-buttons">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Generate Trip Plan
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanTrip;

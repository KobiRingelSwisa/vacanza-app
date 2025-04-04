import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/TripDetails.css";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid trip ID");
      setIsLoading(false);
      return;
    }
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/trips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Trip not found");
          return;
        }
        if (response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch trip details");
      }

      const data = await response.json();
      console.log("Received trip data:", data); // Debug log
      setTrip(data); // The response is the trip object directly
    } catch (err) {
      console.error("Error fetching trip details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading trip details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!trip) return <div className="error-message">Trip not found</div>;

  // Parse the itinerary text into a more readable format
  const formatItinerary = (itineraryText) => {
    // Split the itinerary text into days
    const days = itineraryText
      .split(/Day \d+:/)
      .filter((day) => day.trim())
      .map((day) => day.trim());

    return days;
  };

  return (
    <div className="trip-details-container">
      <div className="trip-header">
        <h1>{trip.destination}</h1>
        <span className={`trip-status ${trip.status}`}>{trip.status}</span>
      </div>

      <div className="trip-meta">
        <p>
          {new Date(trip.start_date).toLocaleDateString()} -{" "}
          {new Date(trip.end_date).toLocaleDateString()}
        </p>
      </div>

      <div className="trip-info-grid">
        <div className="info-card">
          <h3>Budget</h3>
          <p>{trip.budget}</p>
        </div>
        <div className="info-card">
          <h3>Travel Style</h3>
          <p>{trip.travel_style}</p>
        </div>
        <div className="info-card">
          <h3>Accommodation</h3>
          <p>{trip.accommodation}</p>
        </div>
        <div className="info-card">
          <h3>Transportation</h3>
          <p>{trip.transportation}</p>
        </div>
      </div>

      <div className="interests-section">
        <h2>Interests</h2>
        <div className="interests-grid">
          {trip.interests.map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="itinerary-section">
        <h2>AI-Generated Itinerary</h2>
        <div className="itinerary-content">
          {formatItinerary(trip.itinerary).map((day, index) => (
            <div key={index} className="day-plan">
              <h3>Day {index + 1}</h3>
              <p>{day}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;

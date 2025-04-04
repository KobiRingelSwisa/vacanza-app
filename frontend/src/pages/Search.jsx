import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Search.css";

const Search = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [searchData, setSearchData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: "1",
    cityCode: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (type) => {
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      if (type === "flights") {
        const response = await fetch(
          `http://localhost:3000/api/flights/search?${new URLSearchParams({
            origin: searchData.origin,
            destination: searchData.destination,
            departureDate: searchData.departureDate,
            returnDate: searchData.returnDate,
            adults: searchData.adults,
          })}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || errorData.error || "Failed to search flights"
          );
        }

        const data = await response.json();
        setSearchResults(data);
      } else {
        // Format dates for hotel search
        const checkInDate = formatDate(searchData.checkInDate);
        const checkOutDate = formatDate(searchData.checkOutDate);
        const cityCode = searchData.cityCode.toUpperCase();
        const adults = searchData.adults.toString();

        console.log("Sending hotel search params:", {
          cityCode,
          checkInDate,
          checkOutDate,
          adults,
        });

        const response = await fetch(
          `http://localhost:3000/api/hotels/search?${new URLSearchParams({
            cityCode,
            checkInDate,
            checkOutDate,
            adults,
          })}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Hotel search error response:", errorData);
          throw new Error(
            errorData.details || errorData.error || "Failed to search hotels"
          );
        }

        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error("Error searching hotels:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFlightSearch = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="search-form"
    >
      <div className="form-group">
        <label htmlFor="origin">From</label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={searchData.origin}
          onChange={handleInputChange}
          placeholder="Airport Code (e.g., LAX)"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="destination">To</label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={searchData.destination}
          onChange={handleInputChange}
          placeholder="Airport Code (e.g., JFK)"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="departureDate">Departure Date</label>
        <input
          type="date"
          id="departureDate"
          name="departureDate"
          value={searchData.departureDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="returnDate">Return Date</label>
        <input
          type="date"
          id="returnDate"
          name="returnDate"
          value={searchData.returnDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="adults">Number of Adults</label>
        <input
          type="number"
          id="adults"
          name="adults"
          value={searchData.adults}
          onChange={handleInputChange}
          min="1"
          required
        />
      </div>
      <button
        type="button"
        className="search-button"
        onClick={() => handleSearch("flights")}
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search Flights"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {searchResults && searchResults.length > 0 && (
        <div className="search-results">
          <h3>Available Flights</h3>
          <div className="flights-grid">
            {searchResults.map((flight) => (
              <div key={flight.id} className="flight-card">
                <h4>
                  {flight.origin} → {flight.destination}
                </h4>
                <p>
                  Departure:{" "}
                  {new Date(flight.departureDate).toLocaleDateString()}
                </p>
                {flight.returnDate && (
                  <p>
                    Return: {new Date(flight.returnDate).toLocaleDateString()}
                  </p>
                )}
                <p className="price">
                  Price: {flight.price} {flight.currency}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderHotelSearch = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="search-form"
    >
      <div className="form-group">
        <label htmlFor="cityCode">City Code (e.g., NYC)</label>
        <input
          type="text"
          id="cityCode"
          name="cityCode"
          value={searchData.cityCode}
          onChange={handleInputChange}
          placeholder="Enter city code"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="checkInDate">Check-in Date</label>
        <input
          type="date"
          id="checkInDate"
          name="checkInDate"
          value={searchData.checkInDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="checkOutDate">Check-out Date</label>
        <input
          type="date"
          id="checkOutDate"
          name="checkOutDate"
          value={searchData.checkOutDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="adults">Number of Adults</label>
        <input
          type="number"
          id="adults"
          name="adults"
          value={searchData.adults}
          onChange={handleInputChange}
          min="1"
          max="10"
          required
        />
      </div>
      <button
        type="button"
        className="search-button"
        onClick={() => handleSearch("hotels")}
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Search Hotels"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {searchResults && searchResults.length > 0 && (
        <div className="search-results">
          <h3>Available Hotels</h3>
          <div className="hotels-grid">
            {searchResults.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <h4>{hotel.name}</h4>
                {hotel.rating && <p>Rating: {hotel.rating} stars</p>}
                {hotel.address && (
                  <p>
                    Address: {hotel.address.lines?.join(", ") || hotel.address}
                  </p>
                )}
                {hotel.description && <p>{hotel.description}</p>}
                {hotel.price && (
                  <p className="price">
                    Price: {hotel.price} {hotel.currency}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="search-container">
      <div className="search-content">
        <div className="search-header">
          <h1>Search Flights & Hotels</h1>
          <p>Find the best deals for your next trip</p>
        </div>

        <div className="search-tabs">
          <button
            className={`tab-button ${activeTab === "flights" ? "active" : ""}`}
            onClick={() => setActiveTab("flights")}
          >
            <span className="tab-icon">✈️</span>
            Flights
          </button>
          <button
            className={`tab-button ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => setActiveTab("hotels")}
          >
            <span className="tab-icon">🏨</span>
            Hotels
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "flights" ? renderFlightSearch() : renderHotelSearch()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;

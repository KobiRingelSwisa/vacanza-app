import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Search.css";

const Search = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [searchData, setSearchData] = useState({
    flights: {
      from: "",
      to: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      class: "economy",
    },
    hotels: {
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      rooms: 1,
    },
  });

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSearch = (e, section) => {
    e.preventDefault();
    // Here we'll add the API integration for flight/hotel search
    console.log(`Searching ${section}:`, searchData[section]);
  };

  const renderFlightSearch = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="search-form"
      onSubmit={(e) => handleSearch(e, "flights")}
    >
      <div className="form-row">
        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            name="from"
            value={searchData.flights.from}
            onChange={(e) => handleInputChange(e, "flights")}
            placeholder="City or Airport"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>To</label>
          <input
            type="text"
            name="to"
            value={searchData.flights.to}
            onChange={(e) => handleInputChange(e, "flights")}
            placeholder="City or Airport"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={searchData.flights.departureDate}
            onChange={(e) => handleInputChange(e, "flights")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={searchData.flights.returnDate}
            onChange={(e) => handleInputChange(e, "flights")}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Passengers</label>
          <input
            type="number"
            name="passengers"
            value={searchData.flights.passengers}
            onChange={(e) => handleInputChange(e, "flights")}
            min="1"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Class</label>
          <select
            name="class"
            value={searchData.flights.class}
            onChange={(e) => handleInputChange(e, "flights")}
            className="form-input"
          >
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>
    </motion.form>
  );

  const renderHotelSearch = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="search-form"
      onSubmit={(e) => handleSearch(e, "hotels")}
    >
      <div className="form-group">
        <label>Destination</label>
        <input
          type="text"
          name="destination"
          value={searchData.hotels.destination}
          onChange={(e) => handleInputChange(e, "hotels")}
          placeholder="City, Region, or Hotel Name"
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Check-in Date</label>
          <input
            type="date"
            name="checkIn"
            value={searchData.hotels.checkIn}
            onChange={(e) => handleInputChange(e, "hotels")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Check-out Date</label>
          <input
            type="date"
            name="checkOut"
            value={searchData.hotels.checkOut}
            onChange={(e) => handleInputChange(e, "hotels")}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Guests</label>
          <input
            type="number"
            name="guests"
            value={searchData.hotels.guests}
            onChange={(e) => handleInputChange(e, "hotels")}
            min="1"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Rooms</label>
          <input
            type="number"
            name="rooms"
            value={searchData.hotels.rooms}
            onChange={(e) => handleInputChange(e, "hotels")}
            min="1"
            className="form-input"
          />
        </div>
      </div>
    </motion.form>
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

        <button
          type="submit"
          className="search-button"
          onClick={(e) => handleSearch(e, activeTab)}
        >
          Search {activeTab === "flights" ? "Flights" : "Hotels"}
        </button>
      </div>
    </div>
  );
};

export default Search;

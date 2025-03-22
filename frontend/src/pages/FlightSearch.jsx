import { useState } from "react";
import { searchFlights } from "../services/api.js";

function FlightSearch() {
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: "1",
  });
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("🔍 Search Params:", searchParams);

    if (
      !searchParams.origin ||
      !searchParams.destination ||
      !searchParams.departureDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const results = await searchFlights(searchParams);
      console.log("✅ Raw API Response:", results);
      console.log("📦 Extracted flights:", results?.data);

      if (results?.data) {
        setFlights(results.data);
      } else {
        setFlights([]);
        setError("No flight data found in response.");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("Error fetching flights. Please try again.");
    }
  };

  return (
    <div>
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={searchParams.origin}
          onChange={handleChange}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={searchParams.destination}
          onChange={handleChange}
        />
        <input
          type="date"
          name="departureDate"
          value={searchParams.departureDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="returnDate"
          value={searchParams.returnDate}
          onChange={handleChange}
        />
        <input
          type="number"
          name="adults"
          value={searchParams.adults}
          min="1"
          onChange={handleChange}
        />
        <button type="submit">Search Flights</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {Array.isArray(flights) && flights.length > 0 ? (
        <ul>
          {flights.map((flight, index) => (
            <li key={index}>
              From: {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
              {flight.itineraries[0].segments[0].arrival.iataCode}
              <br />
              Price: ${flight.price.total}
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights available</p>
      )}
    </div>
  );
}

export default FlightSearch;

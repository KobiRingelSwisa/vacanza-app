import { useState } from "react";

function Booking() {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState(null);
  const [hotels, setHotels] = useState(null);
  const [cars, setCars] = useState(null);
  const [filters, setFilters] = useState({
    price: "",
    rating: "",
    airline: "",
  });

  const searchBookings = async () => {
    try {
      const flightRes = await fetch(
        `https://api.example.com/flights?destination=${destination}&date=${date}`
      );
      const flightData = await flightRes.json();
      setFlights(flightData);

      const hotelRes = await fetch(
        `https://api.example.com/hotels?destination=${destination}&date=${date}`
      );
      const hotelData = await hotelRes.json();
      setHotels(hotelData);

      const carRes = await fetch(
        `https://api.example.com/cars?destination=${destination}&date=${date}`
      );
      const carData = await carRes.json();
      setCars(carData);
    } catch (error) {
      console.log("Error fetching flights: ", error);
    }
  };

  return (
    <div className="p-6 text-center bg-white rounded-lg shadow-lg max-w-3xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-blue-900">Book Your Trip</h2>
      <p className="text-gray-700 mt-4">
        Find and book flights, hotels, and car rentals.
      </p>
      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Enter Destination"
          className="border p-3 rounded-md w-full"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="date"
          className="border p-3 rounded-md w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="border p-3 rounded-md w-full"
          onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        >
          <option value="">Select Price Range</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="border p-3 rounded-md w-full"
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
        >
          <option value="">Select Hotel Rating</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <select
          className="border p-3 rounded-md w-full"
          onChange={(e) => setFilters({ ...filters, airline: e.target.value })}
        >
          <option value="">Select Airline</option>
          <option value="Delta">Delta</option>
          <option value="United">United</option>
          <option value="American Airlines">American Airlines</option>
        </select>
        <button
          className="mt-4 bg-orange-500 text-white px-6 py-2 round-md hover:bg-orange-600 transition w-full"
          onClick={searchBookings}
        >
          Search
        </button>
        {flights && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-bold">Available Flights</h3>
            <ul>
              {flights.map((flight, index) => (
                <li key={index} className="text-gray-700">
                  {flight}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hotels && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-bold">Available Hotels</h3>
            <ul>
              {hotels.map((hotel, index) => (
                <li key={index} className="text-gray-700">
                  {hotel}
                </li>
              ))}
            </ul>
          </div>
        )}
        {cars && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-bold">Available Cars</h3>
            <ul>
              {cars.map((car, index) => (
                <li key={index} className="text-gray-700">
                  {car}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;

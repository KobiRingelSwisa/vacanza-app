import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BookingDetails() {
  const [flight, setFlight] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("selectedFlight");
    if (stored) {
      setFlight(JSON.parse(stored));
    } else {
      navigate("/flights");
    }
  }, [navigate]);

  if (!flight) return null;

  const segment = flight.itineraries[0].segments[0];
  const departureTime = new Date(segment.departure.at).toLocaleString();
  const arrivalTime = new Date(segment.arrival.at).toLocaleString();
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${segment.carrierCode}_50_50_s.png`;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Booking Details</h2>

      <div className="flex items-center space-x-4 mb-4">
        <img
          src={logoUrl}
          alt={segment.carrierCode}
          className="w-12 h-12 object-contain"
        />
        <div>
          <p className="text-xl font-semibold text-blue-700">
            {segment.departure.iataCode}
          </p>
          <p className="text-sm text-gray-600">{segment.carrierCode}</p>
        </div>
      </div>

      <div className="mb-4">
        <p>
          <strong>Departure: </strong>
          {departureTime}
        </p>
        <p>
          <strong>Arrival: </strong>
          {arrivalTime}
        </p>
        <p>
          <strong>Price: </strong>${flight.price.total}
        </p>
      </div>

      <button
        onClick={() => alert("Redirecting to carrier or OTA...")}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
      >
        Continue to Book
      </button>
    </div>
  );
}

export default BookingDetails;

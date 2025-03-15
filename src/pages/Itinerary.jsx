import { useState } from "react";

function Itinerary() {
  const [itinerary, setItinerary] = useState(null);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(
        "https://api.example.com/itinerary?destination=paris"
      );
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.log("Error fetching itinerary: ", error);
    }
  };
  return (
    <div className="p-6 text-center bg-white rounded-lg shadow-lg max-w-3xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-blue-900">Your Itinerary</h2>
      <p className="text-gray-700 mt-4">
        View and customize your AI-generated travel itinerary.
      </p>
      <button
        className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
        onClick={fetchItinerary}
      >
        Generate AI Itinerary
      </button>
      {itinerary && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">{itinerary.destination}</h3>
          <p>{itinerary.details}</p>
        </div>
      )}
    </div>
  );
}

export default Itinerary;

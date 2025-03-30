import { useState } from "react";

function HotelSearch() {
  const [form, setForm] = useState({
    cityCode: "",
    checkInDate: "",
    checkOutDate: "",
    adults: "",
  });

  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/hotels/search?cityCode=${form.cityCode}&checkInDate=${form.checkInDate}&checkOutDate=${form.checkOutDate}&adults=${form.adults}`
      );
      const data = await response.json();

      if (response.ok) {
        setHotels(data.data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Failed to fetch hotels.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Search Hotels</h2>
      <form onSubmit={handleSearch} className="grid gap-4 mb-6">
        <input
          type="text"
          name="cityCode"
          placeholder="City/Airport Code (e.g., NYC)"
          value={form.cityCode}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          name="checkInDate"
          value={form.checkInDate}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          name="checkOutDate"
          value={form.checkOutDate}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="adults"
          value={form.adults}
          min="1"
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Search Hotels
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {Array.isArray(hotels) && hotels.length > 0 && (
        <div className="grid gap-4">
          {hotels.map((hotel, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold text-blue-800">
                {hotel.hotel.name}
              </h3>
              <p className="text-sm text-gray-500">
                {hotel.hotel.address?.lines?.join(", ")}
              </p>
              <p className="mt-1 text-sm">
                Rating: {hotel.hotel.rating} || "N/A"
              </p>
              <p className="mt-2 font-semibold text-green-700">
                From ${hotel.offers[0]?.price.total} || "--"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelSearch;

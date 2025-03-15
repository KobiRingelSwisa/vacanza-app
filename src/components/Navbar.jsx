import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-white">Vacanza</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-orange-400">
          Home
        </Link>
        <Link to="/itinerary" className="hover:text-orange-400">
          Itinerary
        </Link>
        <Link to="/booking" className="hover:text-orange-400">
          Booking
        </Link>
        <Link to="/profile" className="hover:text-orange-400">
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

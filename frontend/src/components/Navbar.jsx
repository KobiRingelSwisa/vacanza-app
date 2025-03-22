import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const links = (
    <>
      <Link
        to="/"
        className="hover:text-orange-400"
        onClick={() => setIsOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/itinerary"
        className="hover:text-orange-400"
        onClick={() => setIsOpen(false)}
      >
        Itinerary
      </Link>
      <Link
        to="/booking"
        className="hover:text-orange-400"
        onClick={() => setIsOpen(false)}
      >
        Booking
      </Link>
      <Link
        to="/profile"
        className="hover:text-orange-400"
        onClick={() => setIsOpen(false)}
      >
        Profile
      </Link>
      {isAuthenticated ? (
        <>
          <Link
            to="/dashboard"
            className="hover:text-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="hover:text-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
        </>
      )}
    </>
  );
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-white">Vacanza</h1>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden bg-orange-500 px-3 py-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">{links}</div>
      {/* Mobile Dropdown Menu */}

      <div
        className={`absolute top-14 left-0 w-full bg-blue-900 text-white flex flex-col items-center md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 max-h-96 py-4"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {links}
      </div>
    </nav>
  );
}

export default Navbar;

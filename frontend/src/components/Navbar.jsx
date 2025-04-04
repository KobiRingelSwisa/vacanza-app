import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Navbar.css";
import vacanzaLogo from "../assets/vacanza-logo.png";
import {
  HomeIcon,
  CalendarIcon,
  BellIcon,
  ArrowRightEndOnRectangleIcon,
  RocketLaunchIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/plan-trip", label: "Plan Trip" },
    { path: "/search", label: "Search" },
  ];

  const authLinks = isAuthenticated
    ? [
        { path: "/profile", label: "Profile" },
        { path: "#", label: "Logout", onClick: handleLogout },
      ]
    : [
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
      ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={vacanzaLogo} alt="Vacanza Logo" className="logo-image" />
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {authLinks.map((link) =>
            link.onClick ? (
              <button
                key={link.path}
                onClick={link.onClick}
                className="nav-link logout-button"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${
                  location.pathname === link.path ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="mobile-menu"
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.3 }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-nav-link ${
              location.pathname === link.path ? "active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {authLinks.map((link) =>
          link.onClick ? (
            <button
              key={link.path}
              onClick={() => {
                link.onClick();
                setIsMobileMenuOpen(false);
              }}
              className="mobile-nav-link logout-button"
            >
              {link.label}
            </button>
          ) : (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${
                location.pathname === link.path ? "active" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          )
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;

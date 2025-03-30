import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Plan Your Perfect Vacation</h1>
          <p>Let AI create your dream itinerary based on your preferences</p>
          <Link to="/plan-trip" className="cta-button">
            Start Planning
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className="fas fa-plane"></i>
            <h3>Smart Flight Search</h3>
            <p>Find the best flights and book directly with airlines</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className="fas fa-hotel"></i>
            <h3>Hotel Booking</h3>
            <p>Discover perfect accommodations for your stay</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <i className="fas fa-robot"></i>
            <h3>AI Trip Planning</h3>
            <p>Get personalized itineraries based on your preferences</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Tell Us About Your Trip</h3>
            <p>
              Share your travel dates, preferences, and activities you enjoy
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Creates Your Plan</h3>
            <p>Our AI generates a personalized itinerary just for you</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Book & Travel</h3>
            <p>Book your flights and hotels, then start your adventure</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

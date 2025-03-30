import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For development/testing, let's simulate a successful login
      localStorage.setItem("token", "dummy-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "John Doe",
          email: formData.email,
        })
      );

      // Redirect to profile page after successful login
      navigate("/profile");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>

          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>
          <button className="social-button facebook">
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
            Continue with Facebook
          </button>
        </div>

        <p className="register-prompt">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

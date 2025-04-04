// amadeus api for flights
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    // Store token and user data on successful registration
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error);
    throw (
      error.response?.data?.error ||
      error.response?.data?.details ||
      "Registration failed"
    );
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Email verification failed";
  }
};

export const searchFlights = async (params) => {
  try {
    const response = await api.get("/flights/search", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Flight search failed";
  }
};

export const searchHotels = async (params) => {
  try {
    const response = await api.get("/hotels/search", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Hotel search failed";
  }
};

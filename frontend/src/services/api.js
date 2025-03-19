// amadeus api for flights
const BACKEND_API_URL = "http://localhost:3000/api/auth";
const FLIGHT_API_KEY = "lRhxpMClvMyMR4oLHYPYscINXT1GtWGo";
const FLIGHT_API_SECRET = "pstkXPPhdwIMQLd2";

export const getAccessToken = async () => {
  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: FLIGHT_API_KEY,
          client_secret: FLIGHT_API_SECRET,
        }),
      }
    );
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.log("Error fetching flight API token:", error);
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.log("Error during registration: ", error);
    return { error: "Registration failed." };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.log("Error during login: ", error);
    return { error: "Login failed." };
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { error: "No token found. Please log in." };

    const response = await fetch(`${BACKEND_API_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log("Error fetching user profile: ", error);
    return { error: "Failed to fetch profile." };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

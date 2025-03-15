// amadeus api for flights
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
    console.log("Error fetching token:", error);
    return null;
  }
};

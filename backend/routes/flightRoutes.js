import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const AMADEUS_API_URL =
  "https://test.api.amadeus.com/v2/shopping/flight-offers";

// Get Amadeus API Token
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error fetching Amadeus token:", error);
    return null;
  }
};

// Search Flights Route
router.get("/search", async (req, res) => {
  const { origin, destination, departureDate } = req.query;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: "Missing required parameters." });
  }
  try {
    const token = await getAccessToken();
    if (!token)
      return res
        .status(500)
        .json({ error: "Failed to authenticate with Amadeus" });

    const response = await axios.get(AMADEUS_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        returnDate: req.query.returnDate || undefined,
        adults: req.query.adults || 1,
        currencyCode: "USD",
        max: 10,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.log("Error fetching flights:", error);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

export default router;

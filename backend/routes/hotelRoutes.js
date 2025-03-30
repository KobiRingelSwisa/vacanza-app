import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

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
    console.log("Error fetching Amadeus token:", error);
    throw new Error("Unable to get access token");
  }
};

router.get("/search", async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, adults } = req.query;

  if (!cityCode || !checkInDate || !checkOutDate || !adults) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const token = await getAccessToken();

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/hotel-offers",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults,
          roomQuantity: 1,
          currency: "USD",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Failed to fetch hotel data." });
  }
});

export default router;

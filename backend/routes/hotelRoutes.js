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
    console.error(
      "Error fetching Amadeus token:",
      error.response?.data || error.message
    );
    throw new Error("Unable to get access token");
  }
};

// Helper function to validate city code
const validateCityCode = async (token, cityCode) => {
  try {
    const response = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          subType: "CITY",
          keyword: cityCode,
          page: { limit: 10 },
        },
      }
    );

    // Check if we have any matching cities
    if (response.data.data && response.data.data.length > 0) {
      // First try exact IATA code match
      const exactMatch = response.data.data.find(
        (city) => city.iataCode === cityCode
      );
      if (exactMatch) return true;

      // If no exact match, try case-insensitive match
      const caseInsensitiveMatch = response.data.data.find(
        (city) => city.iataCode?.toUpperCase() === cityCode.toUpperCase()
      );
      if (caseInsensitiveMatch) return true;

      // If still no match, check if the city name contains the code
      const nameMatch = response.data.data.find((city) =>
        city.address?.cityName?.toUpperCase().includes(cityCode.toUpperCase())
      );
      return !!nameMatch;
    }
    return false;
  } catch (error) {
    console.error(
      "Error validating city code:",
      error.response?.data || error.message
    );
    return false;
  }
};

router.get("/search", async (req, res) => {
  const { cityCode, checkInDate, checkOutDate, adults } = req.query;

  console.log("Received hotel search request with params:", {
    cityCode,
    checkInDate,
    checkOutDate,
    adults,
  });

  if (!cityCode || !checkInDate || !checkOutDate || !adults) {
    console.log("Missing required parameters");
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // Validate dates
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Max 3 months in advance

    console.log("Date validation:", {
      today: today.toISOString(),
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      maxDate: maxDate.toISOString(),
    });

    if (checkIn < today) {
      console.log("Invalid check-in date: date is in the past");
      return res.status(400).json({
        error: "Invalid check-in date",
        message: "Check-in date cannot be in the past",
      });
    }

    if (checkOut <= checkIn) {
      console.log("Invalid check-out date: must be after check-in");
      return res.status(400).json({
        error: "Invalid check-out date",
        message: "Check-out date must be after check-in date",
      });
    }

    if (checkIn > maxDate) {
      console.log("Invalid check-in date: too far in future");
      return res.status(400).json({
        error: "Date too far in future",
        message: "Can only book up to 3 months in advance",
      });
    }

    const stayDuration = Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
    if (stayDuration > 21) {
      console.log("Invalid stay duration: too long");
      return res.status(400).json({
        error: "Stay too long",
        message: "Maximum stay duration is 21 days",
      });
    }

    console.log("Getting Amadeus access token...");
    const token = await getAccessToken();
    if (!token) {
      console.log("Failed to get Amadeus access token");
      return res.status(500).json({
        error: "Authentication failed",
        message: "Unable to authenticate with Amadeus API",
      });
    }
    console.log("Successfully got Amadeus access token");

    // Parse the adults parameter to get the number of adults
    const numAdults = parseInt(adults);
    if (isNaN(numAdults) || numAdults < 1 || numAdults > 10) {
      console.log("Invalid number of adults");
      return res.status(400).json({
        error: "Invalid number of adults",
        message: "Number of adults must be between 1 and 10",
      });
    }

    // First, get a list of hotels in the city
    console.log("Getting hotels in city:", cityCode);
    const hotelsResponse = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          cityCode: cityCode.toUpperCase(),
          radius: 5,
          radiusUnit: "KM",
          hotelSource: "ALL",
        },
      }
    );

    console.log("Hotels in city response:", hotelsResponse.data);

    if (!hotelsResponse.data.data || hotelsResponse.data.data.length === 0) {
      console.log("No hotels found in the specified city");
      return res.status(404).json({
        error: "No hotels found",
        message: "No hotels found in the specified city",
      });
    }

    // Get hotel IDs from the response
    const hotelIds = hotelsResponse.data.data.map((hotel) => hotel.hotelId);

    // Split hotel IDs into chunks of 10 (Amadeus API limit)
    const chunkSize = 10;
    const hotelIdChunks = [];
    for (let i = 0; i < hotelIds.length; i += chunkSize) {
      hotelIdChunks.push(hotelIds.slice(i, i + chunkSize));
    }

    console.log(
      "Making requests to Amadeus API with chunks:",
      hotelIdChunks.length
    );

    // Process each chunk and collect results
    const allHotels = [];
    for (const chunk of hotelIdChunks) {
      console.log("Processing chunk with hotel IDs:", chunk);

      const response = await axios.get(
        "https://test.api.amadeus.com/v3/shopping/hotel-offers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          params: {
            hotelIds: chunk.join(","),
            checkInDate,
            checkOutDate,
            adults: numAdults,
            roomQuantity: 1,
            currency: "USD",
            bestRateOnly: true,
          },
        }
      );

      console.log("Amadeus API response status:", response.status);

      if (response.data.data && response.data.data.length > 0) {
        const hotels = response.data.data.map((hotel) => ({
          id: hotel.hotel.hotelId,
          name: hotel.hotel.name,
          rating: hotel.hotel.rating,
          address: hotel.hotel.address,
          description: hotel.hotel.description?.text,
          amenities: hotel.hotel.amenities,
          price: hotel.offers[0]?.price?.total,
          currency: hotel.offers[0]?.price?.currency,
        }));
        allHotels.push(...hotels);
      }
    }

    if (allHotels.length === 0) {
      console.log("No hotel offers found for the specified criteria");
      return res.status(404).json({
        error: "No hotels found",
        message: "No hotels found for the specified criteria",
      });
    }

    console.log("Sending response with hotels:", allHotels);
    res.json(allHotels);
  } catch (error) {
    console.error("Error fetching hotels:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      stack: error.stack,
    });

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Unable to authenticate with Amadeus API",
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        error: "Invalid request",
        message:
          error.response?.data?.errors?.[0]?.detail ||
          "Invalid request parameters",
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "An error occurred while searching for hotels",
    });
  }
});

export default router;

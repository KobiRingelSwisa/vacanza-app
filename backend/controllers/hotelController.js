const searchHotels = async (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate, adults } = req.query;

    // Log the incoming request parameters
    console.log("Making request to Amadeus API with params:", {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
    });

    // Validate required parameters
    if (!cityCode || !checkInDate || !checkOutDate || !adults) {
      return res.status(400).json({
        error: "Missing required parameters",
        details: {
          cityCode: !cityCode ? "City code is required" : undefined,
          checkInDate: !checkInDate ? "Check-in date is required" : undefined,
          checkOutDate: !checkOutDate
            ? "Check-out date is required"
            : undefined,
          adults: !adults ? "Number of adults is required" : undefined,
        },
      });
    }

    // Validate city code format
    if (!/^[A-Z]{3}$/.test(cityCode)) {
      return res.status(400).json({
        error: "Invalid city code format",
        details:
          "City code must be exactly 3 uppercase letters (e.g., NYC, LON)",
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({
        error: "Invalid check-in date",
        details: "Check-in date cannot be in the past",
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        error: "Invalid check-out date",
        details: "Check-out date must be after check-in date",
      });
    }

    // Validate adults count
    const adultsCount = parseInt(adults);
    if (isNaN(adultsCount) || adultsCount < 1 || adultsCount > 10) {
      return res.status(400).json({
        error: "Invalid number of adults",
        details: "Number of adults must be between 1 and 10",
      });
    }

    // Make request to Amadeus API
    const response = await axios.get(
      `${process.env.AMADEUS_API_URL}/v2/shopping/hotel-offers`,
      {
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults,
          roomQuantity: 1,
          paymentPolicy: "NONE",
          includeClosed: false,
          bestRateOnly: true,
          view: "FULL",
          sort: "PRICE",
        },
        headers: {
          Authorization: `Bearer ${process.env.AMADEUS_ACCESS_TOKEN}`,
        },
      }
    );

    // Process and return the results
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

    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      fullError: error,
    });

    if (error.response?.status === 400) {
      const errorDetails =
        error.response?.data?.errors?.[0]?.detail ||
        error.response?.data?.errors?.[0]?.title ||
        error.message;
      return res.status(400).json({
        error: "Invalid request parameters",
        details: errorDetails,
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Authentication failed",
        details: "Please try again later",
      });
    }

    res.status(500).json({
      error: "Failed to fetch hotels",
      details: error.message,
    });
  }
};

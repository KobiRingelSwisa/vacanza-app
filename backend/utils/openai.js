import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateItinerary = async ({
  destination,
  duration,
  interests,
  budget,
  travelStyle,
  accommodation,
  transportation,
}) => {
  try {
    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination}. 
    Travel Style: ${travelStyle}
    Budget: ${budget}
    Interests: ${interests.join(", ")}
    Preferred Accommodation: ${accommodation}
    Transportation: ${transportation}

    Please provide a day-by-day itinerary including:
    - Morning, afternoon, and evening activities
    - Recommended restaurants and cuisine
    - Estimated costs for activities
    - Travel tips and local customs
    - Must-see attractions
    - Off-the-beaten-path recommendations
    - Local transportation options

    Format the response in a clear, structured way with daily schedules.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner with deep knowledge of global destinations, local customs, and travel logistics. Provide detailed, practical, and engaging travel itineraries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary");
  }
};

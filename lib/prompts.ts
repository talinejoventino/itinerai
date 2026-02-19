import type { City } from "@/types";

export function buildItineraryPrompt(city: City): string {
  return `You are a tourism expert with up-to-date knowledge about destinations around the world.

Create detailed and practical travel itineraries for **${city.name}, ${city.country}**.

Return ONLY valid JSON, without any additional text, with this exact structure:

{
  "city": "${city.name}",
  "country": "${city.country}",
  "highlights": [
    "Tourist attraction name 1",
    "Tourist attraction name 2",
    "Tourist attraction name 3",
    "Tourist attraction name 4",
    "Tourist attraction name 5"
  ],
  "itineraries": {
    "1day": {
      "title": "Best of ${city.name} in 1 Day",
      "days": [
        {
          "day": 1,
          "theme": "Essential Highlights",
          "activities": [
            {
              "time": "09:00",
              "title": "Location name",
              "description": "Description of what to do and see at this location.",
              "tip": "Practical tip (price, hours, how to get there, reservation, etc.)",
              "emoji": "🏛️"
            }
          ]
        }
      ]
    },
    "3days": {
      "title": "Exploring ${city.name} in 3 Days",
      "days": [
        {
          "day": 1,
          "theme": "Day 1 theme",
          "activities": [...]
        },
        {
          "day": 2,
          "theme": "Day 2 theme",
          "activities": [...]
        },
        {
          "day": 3,
          "theme": "Day 3 theme",
          "activities": [...]
        }
      ]
    },
    "7days": {
      "title": "Complete ${city.name} Immersion: 7 Days",
      "days": [
        {
          "day": 1,
          "theme": "Day 1 theme",
          "activities": [...]
        }
      ]
    }
  }
}

Important rules:
- Each 1-day itinerary should have 5 to 6 activities
- Each day in the 3-day itinerary should have 4 to 5 activities
- Each day in the 7-day itinerary should have 3 to 4 activities
- Include relevant emojis for each activity
- Times should be realistic and consider travel time
- Tips should be practical and useful (approximate prices, transportation tips, etc.)
- Use English language
- Return ONLY the JSON, without markdown, without text before or after`;
}

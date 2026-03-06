import type { City } from "@/types";

export function buildOverviewPrompt(city: City): string {
  return `You are a tourism expert with up-to-date knowledge about destinations around the world.

Create a destination overview for **${city.name}, ${city.country}**.

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
  "estimatedBudgetPerPerson": {
    "budget": "~$XX/day",
    "midRange": "~$XX/day",
    "luxury": "~$XX/day",
    "notes": "Brief note about what's included (accommodation, meals, transport, attractions)"
  },
  "style": ["Historical", "Cultural"],
  "bestSeason": {
    "recommended": "Spring (March–May) and Autumn (September–November)",
    "toAvoid": "July–August (very crowded and hot)",
    "notes": "Brief explanation of why those seasons are best"
  },
  "recommendedDuration": {
    "minimum": 2,
    "ideal": 4,
    "maximum": 7,
    "notes": "Brief justification for the recommended number of days"
  },
  "nearbyExcursions": [
    {
      "destination": "Nearby city or town name",
      "country": "Country name",
      "distance": "~XX km from ${city.name}",
      "travelTime": "~X hours by train/bus/car",
      "why": "Brief reason why it's worth visiting",
      "bestFor": "Day trip / Overnight"
    }
  ]
}

Important rules:
- For "estimatedBudgetPerPerson", provide realistic daily cost ranges in USD covering budget, mid-range, and luxury traveler profiles, including accommodation, meals, local transport, and paid attractions
- For "style", choose all applicable tags from: Historical, Cultural, Nature, Adventure, Beach, Romantic, Gastronomy, Religious, Art & Museums, Architecture, Nightlife, Shopping, Family-friendly, Eco-tourism
- For "bestSeason", consider local climate, crowds, and events to give practical travel timing advice
- For "recommendedDuration", provide minimum (rushed visit), ideal (comfortable visit), and maximum (deep exploration) in number of days, with a brief justification
- For "nearbyExcursions": if ${city.name} has limited tourist attractions OR if the destination greatly benefits from day trips to surrounding areas, include 2 to 4 nearby destinations worth visiting. These can be in the same country or in a neighboring country. If the city already has abundant attractions to fill 5+ days, you may return an empty array []
- Return ONLY the JSON, without markdown, without text before or after`;
}

export function buildItineraryDaysPrompt(city: City, days: 1 | 3 | 5): string {
  const titles: Record<number, string> = {
    1: `Best of ${city.name} in 1 Day`,
    3: `Exploring ${city.name} in 3 Days`,
    5: `Complete ${city.name} Immersion: 5 Days`,
  };

  const activityCounts: Record<number, string> = {
    1: "5 to 6 activities",
    3: "4 to 5 activities per day",
    5: "3 to 4 activities per day",
  };

  const activitySample = `{
              "time": "09:00",
              "title": "Location name",
              "description": "Description of what to do and see at this location.",
              "tip": "Practical tip (price, hours, how to get there, reservation, etc.)",
              "emoji": "🏛️",
              "lat": 48.8584,
              "lng": 2.2945
            }`;

  const day1 = `{
          "day": 1,
          "theme": "${days === 1 ? "Essential Highlights" : "Day 1 theme"}",
          "activities": [
            ${activitySample}
          ]
        }`;

  const extraDays = Array.from({ length: days - 1 }, (_, i) => `,
        {
          "day": ${i + 2},
          "theme": "Day ${i + 2} theme",
          "activities": [...]
        }`).join("");

  return `You are a tourism expert with up-to-date knowledge about destinations around the world.

Create a ${days}-day travel itinerary for **${city.name}, ${city.country}**.

Return ONLY valid JSON, without any additional text, with this exact structure:

{
  "title": "${titles[days]}",
  "days": [
        ${day1}${extraDays}
      ]
}

Important rules:
- Include ${activityCounts[days]}
- Include relevant emojis for each activity
- Times should be realistic and consider travel time between locations
- Tips should be practical and useful (approximate prices, transportation tips, etc.)
- Use English language
- For each activity, include the real GPS coordinates (lat/lng) of the named place — must be accurate real-world coordinates located in or near ${city.name}. These are used to plot the route on a map
- Return ONLY the JSON, without markdown, without text before or after`;
}

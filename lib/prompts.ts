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
- For "highlights": list ONLY places genuinely well-known and confirmed to exist as tourist attractions in ${city.name}. List fewer than 5 if needed — never invent or pad. Each highlight must be the exact place name only (no dashes, no descriptions).
- For "estimatedBudgetPerPerson", provide realistic daily cost ranges in USD covering budget, mid-range, and luxury traveler profiles, including accommodation, meals, local transport, and paid attractions
- For "style", choose all applicable tags from: Historical, Cultural, Nature, Adventure, Beach, Romantic, Gastronomy, Religious, Art & Museums, Architecture, Nightlife, Shopping, Family-friendly, Eco-tourism
- For "bestSeason", consider local climate, crowds, and events to give practical travel timing advice
- For "recommendedDuration", provide minimum (rushed visit), ideal (comfortable visit), and maximum (deep exploration) in number of days, with a brief justification
- For "nearbyExcursions": always evaluate honestly how many days of unique attractions ${city.name} itself can fill. If the city can keep a tourist busy for fewer than 3 days, include 2–4 nearby destinations (cities, nature sites, or cross-border spots) that complement the trip. If the city has 5+ days of attractions, return [].
- Return ONLY the JSON, without markdown, without text before or after`;
}

export function buildItineraryDaysPrompt(city: City, days: 1 | 3 | 5): string {
  const titles: Record<number, string> = {
    1: `Best of ${city.name} in 1 Day`,
    3: `Exploring ${city.name} in 3 Days`,
    5: `Complete ${city.name} Immersion: 5 Days`,
  };

  const activityCounts: Record<number, string> = {
    1: "up to 5 activities (use fewer if the city has limited confirmed attractions — never invent places to reach a minimum)",
    3: "3 to 5 activities per day",
    5: "3 to 4 activities per day",
  };

  const activitySample = `{
              "time": "09:00",
              "title": "EXACT official name as it appears on maps — must exist and be verifiable (e.g. 'Eiffel Tower', 'Louvre Museum', 'Montmartre')",
              "localName": "Official name in the local language as it appears on OSM/local maps (e.g. 'Musée du Louvre', 'Torre Eiffel'). If hasLocation is false, omit this field.",
              "description": "Description of what to do and see at this location.",
              "tip": "Practical tip if have (price, hours, how to get there, reservation, etc.)",
              "emoji": "🏛️",
              "lat": 48.8584,
              "lng": 2.2945,
              "isInBaseCity": true,
              "hasLocation": true
            }`;

  const day1 = `{
          "day": 1,
          "theme": "${days === 1 ? "Essential Highlights" : "Day 1 theme"}",
          "baseCity": "${city.name}",
          "activities": [
            ${activitySample}
          ]
        }`;

  const extraDays = Array.from({ length: days - 1 }, (_, i) => `,
        {
          "day": ${i + 2},
          "theme": "Day ${i + 2} theme",
          "baseCity": "${city.name} or nearby destination name if this day focuses on an excursion",
          "activities": [...]
        }`).join("");

  return `You are a tourism expert with up-to-date knowledge about destinations around the world.

Create a ${days}-day travel itinerary for **${city.name}, ${city.country}**.

## CRITICAL RULE — Honesty about local attractions:
Before building the itinerary, honestly assess how many days of REAL, confirmed tourist attractions ${city.name} itself has.
- If ${city.name} has enough genuine attractions to fill all ${days} days, build the entire itinerary there.
- If ${city.name} does NOT have enough real attractions to fill ${days} days, dedicate the remaining days to excursions to nearby cities, towns, or natural sites — even in neighboring countries if relevant.
- If ${city.name} has very few genuine tourist attractions (less than half a day worth), treat a well-known nearby city as the base for the trip and include ${city.name} as a brief excursion within the itinerary.
- NEVER invent, fabricate, or include non-tourist places (e.g. random streets, local markets with no touristic value, generic viewpoints) just to fill days. Only include places that a travel guidebook would genuinely recommend.
- Before adding any place, ask yourself: "Am I 100% certain this exact place exists in this city with this exact name?" If there is any doubt, skip it or replace it with a place you are more certain about.
- Prefer internationally recognized attractions. When in doubt, always choose the more famous, well-documented place over an obscure one.
- Do NOT invent generic-sounding names like "Historic Cultural Center", "Old City Market Square", "Municipal Heritage Museum", "City Cultural Park" — these are common hallucination patterns. Only use the real, specific official name.
- Every place you include must be verifiable on Google Maps or TripAdvisor with that exact name.

Return ONLY valid JSON, without any additional text, with this exact structure:

{
  "title": "${titles[days]}",
  "days": [
        ${day1}${extraDays}
      ]
}

Important rules:
- Include ${activityCounts[days]}
- For days that are excursions to other cities/regions, set "baseCity" to that destination's name and set "isInBaseCity": false on each activity
- Include relevant emojis for each activity
- Times should be realistic and consider travel time between locations (include travel as the first activity of the day when visiting another city)
- Tips should be practical and useful (approximate prices, transportation tips, etc.)
- Use English language
- **title** must be the short, exact place name only — NO dashes, NO em-dashes, NO descriptions or subtitles appended to the name. Correct: "Mercado Municipal" — Wrong: "Mercado Municipal - historic market hall"
- **hasLocation**: set to true if the activity is a specific named place that can be found on a map (museum, monument, restaurant, beach, neighborhood, park, etc.). Set to false for generic activities that have no fixed map location (e.g. "Coral Reef Snorkeling Tour", "Relax at the hotel", "Dinner at a local restaurant", "Travel by bus to X")
- **localName**: when hasLocation is true, provide the official name of the place in the local language of the destination, exactly as it appears on local maps and OpenStreetMap (e.g. "Museo Nacional del Prado" for "Prado Museum", "筑地市場" for "Tsukiji Market"). If the title is already in the local language, repeat it. Omit this field when hasLocation is false.
- For activities where hasLocation is true, include the real GPS coordinates (lat/lng) of that exact place. For hasLocation false, you can omit lat/lng or set them to null
- If you are not highly confident a place exists with that exact name, omit it — it is better to include fewer places than to invent one
- Return ONLY the JSON, without markdown, without text before or after`;
}
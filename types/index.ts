export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
    country_code?: string;
  };
  type: string;
  class: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  tip?: string;
  emoji?: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface ItineraryData {
  title: string;
  days: DayPlan[];
}

export interface Itinerary {
  city: string;
  country: string;
  highlights: string[];
  itineraries: {
    "1day": ItineraryData;
    "3days": ItineraryData;
    "7days": ItineraryData;
  };
}

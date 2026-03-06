export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string]; // [south, north, west, east]
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
  lat?: number;  // AI-provided GPS latitude (optional)
  lng?: number;  // AI-provided GPS longitude (optional)
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

export interface EstimatedBudgetPerPerson {
  budget: string;
  midRange: string;
  luxury: string;
  notes: string;
}

export interface BestSeason {
  recommended: string;
  toAvoid: string;
  notes: string;
}

export interface RecommendedDuration {
  minimum: number;
  ideal: number;
  maximum: number;
  notes: string;
}

export interface NearbyExcursion {
  destination: string;
  country: string;
  distance: string;
  travelTime: string;
  why: string;
  bestFor: string;
}

export interface Itinerary {
  city: string;
  country: string;
  highlights: string[];
  estimatedBudgetPerPerson?: EstimatedBudgetPerPerson;
  style?: string[];
  bestSeason?: BestSeason;
  recommendedDuration?: RecommendedDuration;
  nearbyExcursions?: NearbyExcursion[];
  itineraries: {
    "1day": ItineraryData;
    "3days": ItineraryData;
    "5days": ItineraryData;
  };
}

/** A single place shown on the map when clicking an activity */
export interface ActiveLocation {
  lat: number;
  lng: number;
  title: string;
  emoji?: string;
}

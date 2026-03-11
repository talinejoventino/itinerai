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
  localName?: string; // official name in the local language, used for geocoding
  description: string;
  tip?: string;
  emoji?: string;
  lat?: number;
  lng?: number;
  hasLocation?: boolean; // true = named place that can be shown on map; false = generic activity (tour, dinner, etc.)
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

/** Itinerary being built progressively via streaming */
export interface PartialItinerary {
  city: string;
  country: string;
  highlights: string[];
  estimatedBudgetPerPerson?: EstimatedBudgetPerPerson;
  style?: string[];
  bestSeason?: BestSeason;
  recommendedDuration?: RecommendedDuration;
  nearbyExcursions?: NearbyExcursion[];
  itineraries: {
    "1day"?: ItineraryData;
    "3days"?: ItineraryData;
    "5days"?: ItineraryData;
  };
}

/** A single place shown on the map when clicking an activity */
export interface ActiveLocation {
  lat: number;
  lng: number;
  title: string;
  emoji?: string;
}

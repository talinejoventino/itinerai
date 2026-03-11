import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { geocodePlace } from "@/lib/nominatim";
import type { Activity } from "@/types";

// Strip common meal/activity prefixes the model sometimes adds to titles
function cleanTitleForGeocoding(title: string): string {
  return title
    .replace(/^(dinner at|lunch at|breakfast at|brunch at|visit to|tour of)\s+/i, "")
    .trim();
}

// Try geocoding with the cleaned title; if that fails and the title has multiple
// words, retry with the first meaningful words (drops trailing English qualifiers
// like "Marine Reserve", "National Park" that may not exist in OSM/Mapbox).
async function geocodeWithFallback(
  title: string,
  cityName: string,
  cityLat: number,
  cityLng: number
): Promise<{ lat: number; lng: number } | null> {
  const cleaned = cleanTitleForGeocoding(title);

  const result = await geocodePlace(cleaned, cityName, cityLat, cityLng);
  if (result) return result;

  const words = cleaned.split(/\s+/);
  if (words.length > 2) {
    const shorter = words.slice(0, Math.max(2, words.length - 2)).join(" ");
    return geocodePlace(shorter, cityName, cityLat, cityLng);
  }

  return null;
}

export function useLocationHandler() {
  const { selectedCity, setActiveLocation, activeLocation } = useAppStore();

  const handleShowLocation = useCallback(
    async (activity: Activity) => {
      if (!selectedCity) return;

      // 1. Geocoding by name — most accurate for named places
      // Prefer localName (local language) for better OSM/Photon match accuracy
      const geocoded = await geocodeWithFallback(
        activity.localName ?? activity.title,
        selectedCity.name,
        selectedCity.lat,
        selectedCity.lng
      );

     console.log("Geocoding result for", activity.title, geocoded);

      if (geocoded) {
        setActiveLocation({ lat: geocoded.lat, lng: geocoded.lng, title: activity.title, emoji: activity.emoji });
        return;
      }

      // 2. AI-provided coordinates — fallback, valid only if close to city (±0.3°)
      const aiLat = activity.lat;
      const aiLng = activity.lng;

      console.log("AI-provided coordinates for", activity.title, aiLat, aiLng);
      if (
        aiLat && aiLng &&
        Math.abs(aiLat - selectedCity.lat) <= 0.3 &&
        Math.abs(aiLng - selectedCity.lng) <= 0.3
      ) {
        setActiveLocation({ lat: aiLat, lng: aiLng, title: activity.title, emoji: activity.emoji });
        return;
      }

      // 3. City center — last resort
      setActiveLocation({ lat: selectedCity.lat, lng: selectedCity.lng, title: activity.title, emoji: activity.emoji });
    },
    [selectedCity, setActiveLocation]
  );

  return { handleShowLocation };
}

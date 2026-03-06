import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { geocodePlace } from "@/lib/nominatim";
import type { Activity } from "@/types";

export function useLocationHandler() {
  const { selectedCity, setActiveLocation } = useAppStore();

  const handleShowLocation = useCallback(
    async (activity: Activity) => {
      if (!selectedCity) return;

      let lat = activity.lat;
      let lng = activity.lng;

      const isNear = (a: number, b: number) => Math.abs(a - b) <= 1.5;
      if (!lat || !lng || !isNear(lat, selectedCity.lat) || !isNear(lng, selectedCity.lng)) {
        const result = await geocodePlace(
          activity.title,
          selectedCity.name,
          selectedCity.lat,
          selectedCity.lng
        );
        if (result) {
          lat = result.lat;
          lng = result.lng;
        } else {
          lat = selectedCity.lat;
          lng = selectedCity.lng;
        }
      }

      setActiveLocation({
        lat: lat!,
        lng: lng!,
        title: activity.title,
        emoji: activity.emoji,
      });
    },
    [selectedCity, setActiveLocation]
  );

  return { handleShowLocation };
}

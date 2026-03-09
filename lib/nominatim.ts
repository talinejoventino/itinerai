import type { City, NominatimResult } from "@/types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "6",
    featuretype: "city",
    addressdetails: "1",
    "accept-language": "en",
  });

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { "User-Agent": "Itinerai/1.0" },
  });

  if (!res.ok) return [];

  const results: NominatimResult[] = await res.json();

  return results
    .filter((r) => ["city", "town", "village", "administrative"].includes(r.type) || r.class === "place")
    .map((r) => ({
      name: r.address?.city || r.address?.town || r.address?.village || r.name,
      country: r.address?.country || "",
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      displayName: r.display_name,
    }));
}

export async function geocodePlace(
  title: string,
  cityName: string,
  cityLat: number,
  cityLng: number
): Promise<{ lat: number; lng: number } | null> {
  const delta = 0.4;
  // Commas must NOT be URL-encoded for bbox — build URL manually
  const bboxStr = `${cityLng - delta},${cityLat - delta},${cityLng + delta},${cityLat + delta}`;
  const proximityStr = `${cityLng},${cityLat}`;

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (mapboxToken) {
    // Include poi, neighborhood, locality, address — but NOT "place" (returns the city itself when nothing found)
    const query = encodeURIComponent(`${title}, ${cityName}`);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`
      + `?proximity=${proximityStr}&bbox=${bboxStr}&limit=1&types=poi,neighborhood,locality,address&access_token=${mapboxToken}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.features?.length) {
        const feature = data.features[0];
        const placeType: string = feature.place_type?.[0] ?? "";

        // Reject city/region-level fallbacks
        const isCityLevel = ["place", "region", "country", "district"].includes(placeType);
        if (!isCityLevel) {
          // Verify the result text actually relates to the title query.
          // Mapbox sometimes matches a neighborhood/locality named after the city
          // (e.g. querying "Instituto Ricardo Brennand, Recife" returns neighborhood "Recife").
          // Check that feature.text shares at least one meaningful word with the title
          // (ignoring words that are just the city name).
          const featureText = (feature.text ?? "").toLowerCase();
          const cityWords = cityName.toLowerCase().split(/[\s,]+/);
          const titleWords = title.toLowerCase().split(/[\s,]+/).filter(w => w.length > 2);
          const nonCityTitleWords = titleWords.filter(w => !cityWords.includes(w));
          const isRelevant = nonCityTitleWords.length === 0 ||
            nonCityTitleWords.some(w => featureText.includes(w));

          if (isRelevant) {
            const [lng, lat] = feature.geometry.coordinates as [number, number];
            return { lat, lng };
          }
        }
      }
    }
  }

  // Fallback: Photon (OSM) — good for landmarks and neighborhoods
  const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(title)}`
    + `&lat=${cityLat}&lon=${cityLng}&limit=1&lang=en&bbox=${bboxStr}`;

  const photonRes = await fetch(photonUrl, {
    headers: { "User-Agent": "Itinerai/1.0" },
  });

  if (!photonRes.ok) return null;

  const photonData = await photonRes.json();
  if (!photonData.features?.length) return null;

  const [lng, lat] = photonData.features[0].geometry.coordinates as [number, number];
  return { lat, lng };
}

export async function reverseGeocode(lat: number, lng: number): Promise<City | null> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: "json",
    zoom: "10",
    "accept-language": "en",
  });

  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: { "User-Agent": "Itinerai/1.0" },
  });

  if (!res.ok) return null;

  const result: NominatimResult = await res.json();

  const name =
    result.address?.city ||
    result.address?.town ||
    result.address?.village ||
    result.address?.county ||
    result.name;

  if (!name) return null;

  return {
    name,
    country: result.address?.country || "",
    lat,
    lng,
    displayName: result.display_name,
  };
}

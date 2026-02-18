import type { City, NominatimResult } from "@/types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "6",
    featuretype: "city",
    "accept-language": "pt-BR,pt,en",
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

export async function reverseGeocode(lat: number, lng: number): Promise<City | null> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: "json",
    zoom: "10",
    "accept-language": "pt-BR,pt,en",
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

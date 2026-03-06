import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { PartialItinerary } from "@/types";

export function useItineraryGeneration() {
  const { selectedCity, setItinerary, setAppState, setError, setPanelOpen, setActiveLocation } =
    useAppStore();

  const generate = useCallback(async () => {
    if (!selectedCity) return;

    setAppState("loading");
    setError(null);
    setItinerary(null);
    setActiveLocation(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCity),
      });

      if (!res.ok || !res.body) {
        const data = await res.json();
        throw new Error(data.error || "Error generating itinerary");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let partial: PartialItinerary = {
        city: selectedCity.name,
        country: selectedCity.country,
        highlights: [],
        itineraries: {},
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          let event: { type: string } & Record<string, unknown>;
          try {
            event = JSON.parse(line);
          } catch {
            console.error("[stream] failed to parse line:", line.slice(0, 120));
            continue;
          }

          if (event.type === "error") {
            throw new Error((event.message as string) || "Error generating itinerary");
          } else if (event.type === "overview") {
            const { type: _type, ...data } = event;
            partial = { ...partial, ...(data as Omit<PartialItinerary, "itineraries">) };
            setItinerary({ ...partial });
            setAppState("streaming");
            setPanelOpen(true);
          } else if (
            event.type === "1day" ||
            event.type === "3days" ||
            event.type === "5days"
          ) {
            const { type, ...data } = event;
            partial = {
              ...partial,
              itineraries: { ...partial.itineraries, [type]: data },
            };
            setItinerary({ ...partial });
          }
        }
      }

      setAppState("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setAppState("error");
      setPanelOpen(false);
    }
  }, [selectedCity, setItinerary, setAppState, setError, setPanelOpen, setActiveLocation]);

  return { generate };
}

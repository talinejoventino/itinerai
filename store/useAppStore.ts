import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { City, PartialItinerary, ActiveLocation } from "@/types";

export type AppState = "idle" | "loading" | "streaming" | "done" | "error";

interface AppStore {
  selectedCity: City | null;
  itinerary: PartialItinerary | null;
  appState: AppState;
  error: string | null;
  panelOpen: boolean;
  activeLocation: ActiveLocation | null;

  selectCity: (city: City) => void;
  reset: () => void;
  setItinerary: (itinerary: PartialItinerary | null) => void;
  setAppState: (state: AppState) => void;
  setError: (error: string | null) => void;
  setPanelOpen: (open: boolean) => void;
  setActiveLocation: (location: ActiveLocation | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      selectedCity: null,
      itinerary: null,
      appState: "idle",
      error: null,
      panelOpen: false,
      activeLocation: null,

      selectCity: (city) =>
        set({
          selectedCity: city,
          itinerary: null,
          appState: "idle",
          error: null,
          panelOpen: false,
          activeLocation: null,
        }),

      reset: () =>
        set({
          selectedCity: null,
          itinerary: null,
          appState: "idle",
          error: null,
          panelOpen: false,
          activeLocation: null,
        }),

      setItinerary: (itinerary) => set({ itinerary }),
      setAppState: (appState) => set({ appState }),
      setError: (error) => set({ error }),
      setPanelOpen: (panelOpen) => set({ panelOpen }),
      setActiveLocation: (activeLocation) => set({ activeLocation }),
    }),
    {
      name: "itinerai-storage",
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        itinerary: state.itinerary,
        panelOpen: state.panelOpen,
        appState: state.appState === "done" ? "done" : "idle",
      }),
    }
  )
);

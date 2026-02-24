"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, Loader2, AlertCircle, X, Pin, MapPlus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ItineraryPanel from "@/components/ItineraryPanel";
import type { City, Itinerary, Activity, ActiveLocation } from "@/types";
import { geocodePlace } from "@/lib/nominatim";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#0A1931" }}>
      <div className="flex flex-col items-center gap-3" style={{ color: "rgba(179,207,229,0.6)" }}>
        <Globe className="w-8 h-8 animate-pulse" style={{ color: "#4A7FA7" }} />
        <p style={{ fontFamily: "var(--font-body, Outfit, sans-serif)", fontSize: "14px" }}>
          Loading map...
        </p>
      </div>
    </div>
  ),
});

type AppState = "idle" | "loading" | "done" | "error";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
    setItinerary(null);
    setState("idle");
    setError(null);
    setPanelOpen(false);
    setActiveLocation(null);
  }, []);

  const handleGenerate = async () => {
    if (!selectedCity) return;
    setState("loading");
    setError(null);
    setActiveLocation(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCity),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error generating itinerary");
      }

      setItinerary(data);
      setState("done");
      setPanelOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setState("error");
    }
  };

  const handleShowLocation = useCallback(async (activity: Activity) => {
    if (!selectedCity) return;

    let lat = activity.lat;
    let lng = activity.lng;

    // If AI-provided coords are missing or implausibly far, geocode via Nominatim
    const isNear = (a: number, b: number) => Math.abs(a - b) <= 1.5;
    if (!lat || !lng || !isNear(lat, selectedCity.lat) || !isNear(lng, selectedCity.lng)) {
      const result = await geocodePlace(activity.title, selectedCity.name, selectedCity.lat, selectedCity.lng);
      if (result) {
        lat = result.lat;
        lng = result.lng;
      } else {
        lat = selectedCity.lat;
        lng = selectedCity.lng;
      }
    }

    setActiveLocation({ lat: lat!, lng: lng!, title: activity.title, emoji: activity.emoji });
  }, [selectedCity]);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0A1931" }}>

      {/* ── Full-screen map ── */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <MapView
          selectedCity={selectedCity}
          onCityClick={handleCitySelect}
          activeLocation={activeLocation}
        />
      </motion.div>

      {/* ── Floating header ── */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-[500] pointer-events-none"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 p-4">
          {/* Logo */}
          <div
            className="pointer-events-auto shrink-0 overflow-hidden"
            style={{
              width: "128px",
              height: "56px",
              background: "rgba(246,250,253,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(179,207,229,0.2)",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(10,25,49,0.18)",
            }}
          >
            <img
              src="/ItinerAi.png"
              alt="ItinerAI"
              className="w-full h-full"
              style={{ objectFit: "contain", transform: "scale(1.5)", transformOrigin: "center" }}
            />
          </div>

          {/* Search bar */}
          <div className="pointer-events-auto flex-1 max-w-[480px]">
            <SearchBar onCitySelect={handleCitySelect} selectedCity={selectedCity} />
          </div>
        </div>
      </motion.header>

      {/* ── Bottom CTA area ── */}
      <AnimatePresence mode="wait">
        {selectedCity && !panelOpen ? (
          <motion.div
            key="cta"
            className="absolute bottom-8 left-1/2 z-[500]"
            style={{ x: "-50%" }}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="flex flex-col items-center gap-3">
              {/* City badge */}
              <div
                className="flex items-center gap-2 px-5 py-2"
                style={{
                  background: "rgba(246,250,253,0.1)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(179,207,229,0.2)",
                  borderRadius: "999px",
                  boxShadow: "0 4px 20px rgba(10,25,49,0.18)",
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#fff",
                }}
              >
                <Pin size={14} color="#fff" />
                <span>{selectedCity.name}, {selectedCity.country}</span>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {state === "error" && error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm max-w-sm"
                    style={{
                      background: "rgba(220,38,38,0.15)",
                      border: "1px solid rgba(220,38,38,0.3)",
                      borderRadius: "14px",
                      color: "#fca5a5",
                      fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                    }}
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate CTA */}
              <motion.button
                onClick={handleGenerate}
                disabled={state === "loading"}
                className="flex items-center gap-2.5 text-white font-semibold disabled:opacity-70"
                style={{
                  background: "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
                  borderRadius: "14px",
                  padding: "0 28px",
                  height: "52px",
                  fontSize: "15px",
                  fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                  boxShadow: "0 0 24px rgba(74,127,167,0.35), 0 4px 20px rgba(10,25,49,0.18)",
                  border: "none",
                  cursor: state === "loading" ? "not-allowed" : "pointer",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(74,127,167,0.5), 0 4px 20px rgba(10,25,49,0.25)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate AI Itinerary
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : !selectedCity ? (
          <motion.div
            key="hint"
            className="absolute bottom-8 left-1/2 z-[500] pointer-events-none"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div
              className="flex items-center gap-2 px-6 py-3.5 text-center"
              style={{
                background: "rgba(246,250,253,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(179,207,229,0.15)",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(10,25,49,0.18)",
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "14px",
                fontWeight: 500,
                color: "rgba(179,207,229,0.7)",
                whiteSpace: "nowrap",
              }}
            >
              <MapPlus /> Click on a city name on the map
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Itinerary sidebar ── */}
      <AnimatePresence>
        {panelOpen && itinerary && selectedCity && (
          <motion.div
            className="absolute top-0 right-0 h-full w-full sm:w-[420px] z-[600]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ItineraryPanel
              city={selectedCity}
              itinerary={itinerary}
              onClose={() => setPanelOpen(false)}
              onShowLocation={handleShowLocation}
              activeLocation={activeLocation}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading overlay ── */}
      <AnimatePresence>
        {state === "loading" && (
          <motion.div
            className="absolute inset-0 z-[550] flex items-center justify-center pointer-events-none"
            style={{ background: "rgba(10,25,49,0.5)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4 p-8 mx-4"
              style={{
                background: "rgba(10,25,49,0.97)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(179,207,229,0.15)",
                borderRadius: "28px",
                boxShadow: "0 8px 40px rgba(10,25,49,0.5)",
                maxWidth: "320px",
                width: "100%",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
                  borderRadius: "18px",
                }}
              >
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="text-center">
                <p
                  className="font-semibold text-base"
                  style={{
                    fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                    color: "#F6FAFD",
                  }}
                >
                  Creating your itinerary
                </p>
                <p
                  className="mt-1.5 text-sm"
                  style={{
                    fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                    color: "rgba(179,207,229,0.6)",
                  }}
                >
                  AI is preparing the best experience in {selectedCity?.name}...
                </p>
              </div>
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#4A7FA7" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reopen panel tab ── */}
      <AnimatePresence>
        {itinerary && !panelOpen && selectedCity && (
          <motion.div
            className="absolute top-1/2 right-0 z-[500]"
            style={{ y: "-50%" }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => setPanelOpen(true)}
              className="flex flex-col items-center gap-1 px-2 py-4 transition-colors"
              style={{
                background: "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
                borderRadius: "14px 0 0 14px",
                boxShadow: "-4px 0 20px rgba(10,25,49,0.3)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              title="View itinerary"
            >
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: "0.05em",
                }}
              >
                View Itinerary
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

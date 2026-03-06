"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pin, Sparkles, Loader2, AlertCircle, X, MapPlus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useItineraryGeneration } from "@/hooks/useItineraryGeneration";

export default function CtaArea() {
  const { selectedCity, appState, error, panelOpen, setError } = useAppStore();
  const { generate } = useItineraryGeneration();

  return (
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
              <span>
                {selectedCity.name}, {selectedCity.country}
              </span>
            </div>

            <AnimatePresence>
              {appState === "error" && error && (
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
                  <button
                    onClick={() => setError(null)}
                    className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={generate}
              disabled={appState === "loading"}
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
                cursor: appState === "loading" ? "not-allowed" : "pointer",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 0 32px rgba(74,127,167,0.5), 0 4px 20px rgba(10,25,49,0.25)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {appState === "loading" ? (
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
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pin, Sparkles, Loader2, AlertCircle, X, MapPlus, Map } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useItineraryGeneration } from "@/hooks/useItineraryGeneration";

const FONT_DISPLAY = { fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)" };
const FONT_BODY = { fontFamily: "var(--font-body, 'Outfit', sans-serif)" };

const BTN_SHADOW = "0 0 24px rgba(74,127,167,0.35), 0 4px 20px rgba(10,25,49,0.18)";
const BTN_SHADOW_HOVER = "0 0 32px rgba(74,127,167,0.5), 0 4px 20px rgba(10,25,49,0.25)";

export default function CtaArea() {
  const { selectedCity, appState, error, panelOpen, itinerary, setError, setPanelOpen, reset } = useAppStore();
  const { generate } = useItineraryGeneration();

  return (
    <AnimatePresence mode="wait">
      {selectedCity && !panelOpen && itinerary ? (
        <motion.div
          key="view"
          className="absolute bottom-8 left-1/2 z-[500]"
          style={{ x: "-50%" }}
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2.5 text-white font-semibold text-[15px] h-[52px] px-7 rounded-[14px] cursor-pointer border-0 bg-gradient-to-br from-[#4A7FA7] to-[#1A3D63]"
              style={{ ...FONT_DISPLAY, boxShadow: BTN_SHADOW }}
              whileHover={{ scale: 1.02, boxShadow: BTN_SHADOW_HOVER }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Map className="h-5 w-5" />
              View Itinerary
            </motion.button>
            <button
              onClick={reset}
              className="rounded-full cursor-pointer text-[13px] font-medium text-[#F6FAFD] tracking-[0.02em] py-1.5 px-4 bg-white/[0.12] border border-white/[0.35] backdrop-blur-sm shadow-[0_2px_10px_rgba(10,25,49,0.25)] transition-colors hover:bg-white/[0.22] hover:border-white/[0.6]"
              style={FONT_BODY}
            >
              Search a new city
            </button>
          </div>
        </motion.div>
      ) : selectedCity && !panelOpen ? (
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
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium text-white bg-white/10 backdrop-blur-xl border border-[rgba(179,207,229,0.2)] shadow-[0_4px_20px_rgba(10,25,49,0.18)]"
              style={FONT_BODY}
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
                  className="flex items-center gap-2 px-4 py-2.5 text-sm max-w-sm rounded-[14px] text-[#fca5a5] bg-red-600/15 border border-red-600/30"
                  style={FONT_BODY}
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
              className={`flex items-center gap-2.5 text-white font-semibold text-[15px] h-[52px] px-7 rounded-[14px] border-0 bg-gradient-to-br from-[#4A7FA7] to-[#1A3D63] disabled:opacity-70 ${appState === "loading" ? "cursor-not-allowed" : "cursor-pointer"}`}
              style={{ ...FONT_DISPLAY, boxShadow: BTN_SHADOW }}
              whileHover={{ scale: 1.02, boxShadow: BTN_SHADOW_HOVER }}
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
            className="flex items-center gap-2 px-6 py-3.5 text-center text-sm font-medium whitespace-nowrap rounded-[20px] text-[rgba(179,207,229,0.7)] bg-white/[0.08] backdrop-blur-xl border border-[rgba(179,207,229,0.15)] shadow-[0_4px_20px_rgba(10,25,49,0.18)]"
            style={FONT_BODY}
          >
            <MapPlus /> Click on a city name on the map
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function ReopenTab() {
  const { itinerary, panelOpen, selectedCity, setPanelOpen } = useAppStore();

  return (
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
  );
}

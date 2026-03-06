"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function LoadingOverlay() {
  const { appState, selectedCity } = useAppStore();

  return (
    <AnimatePresence>
      {appState === "loading" && (
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
  );
}

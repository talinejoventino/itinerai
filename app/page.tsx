"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import AppHeader from "@/components/layout/AppHeader";
import CtaArea from "@/components/layout/CtaArea";
import LoadingOverlay from "@/components/layout/LoadingOverlay";
import ItineraryPanel from "@/components/itinerary/ItineraryPanel";

const MapView = dynamic(() => import("@/components/map/MapView"), {
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

export default function HomePage() {
  const { panelOpen, itinerary } = useAppStore();

  return (
    <div className="relative w-screen h-dvh overflow-hidden" style={{ background: "#0A1931" }}>
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <MapView />
      </motion.div>

      <AppHeader />
      <CtaArea />
      <LoadingOverlay />

      <AnimatePresence>
        {panelOpen && itinerary && (
          <motion.div
            className="absolute top-0 right-0 h-full w-full sm:w-[420px] z-[600]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ItineraryPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import SearchBar from "@/components/search/SearchBar";
import { useAppStore } from "@/store/useAppStore";

export default function AppHeader() {
  const { selectedCity, selectCity } = useAppStore();

  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-[500] pointer-events-none"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 p-4">
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

        <div className="pointer-events-auto flex-1 max-w-[480px]">
          <SearchBar onCitySelect={selectCity} selectedCity={selectedCity} />
        </div>
      </div>
    </motion.header>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useLocationHandler } from "@/hooks/useLocationHandler";
import PanelHeader from "./PanelHeader";
import PanelTabs, { type Tab } from "./PanelTabs";
import PanelFooter from "./PanelFooter";
import InfoTab from "./InfoTab";
import ItineraryTab from "./ItineraryTab";

export default function ItineraryPanel() {
  const { selectedCity, itinerary, appState, activeLocation, setPanelOpen } = useAppStore();
  const { handleShowLocation, loadingTitle } = useLocationHandler();
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [openDayIndex, setOpenDayIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isComplete = appState === "done";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  if (!selectedCity || !itinerary) return null;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setOpenDayIndex(0);
  };

  return (
    <div
      className="h-full flex flex-col overflow-x-hidden"
      style={{
        background: "rgba(7,17,40,0.98)",
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
        borderLeft: "1px solid rgba(179,207,229,0.12)",
        boxShadow: "-8px 0 60px rgba(10,25,49,0.5)",
      }}
    >
      <PanelHeader city={selectedCity} isComplete={isComplete} onClose={() => setPanelOpen(false)} />

      <PanelTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        itinerary={itinerary}
        isComplete={isComplete}
      />

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ overflowAnchor: "none" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "info" ? (
              <InfoTab itinerary={itinerary} city={selectedCity} />
            ) : (
              <ItineraryTab
                data={itinerary.itineraries[activeTab]}
                openDayIndex={openDayIndex}
                setOpenDayIndex={setOpenDayIndex}
                city={selectedCity}
                onShowLocation={handleShowLocation}
                activeLocation={activeLocation}
                loadingTitle={loadingTitle}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <PanelFooter city={selectedCity} itinerary={itinerary} isComplete={isComplete} />
    </div>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import type { PartialItinerary } from "@/types";

export type Tab = "info" | "1day" | "3days" | "5days";

export const TABS: { value: Tab; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "1day", label: "1 Day" },
  { value: "3days", label: "3 Days" },
  { value: "5days", label: "5 Days" },
];

interface PanelTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  itinerary: PartialItinerary;
  isComplete: boolean;
}

export default function PanelTabs({
  activeTab,
  onTabChange,
  itinerary,
  isComplete,
}: PanelTabsProps) {
  return (
    <div
      className="shrink-0 flex px-6"
      style={{ borderBottom: "1px solid rgba(179,207,229,0.1)" }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        const isTabLoading =
          tab.value !== "info" && !itinerary.itineraries[tab.value] && !isComplete;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className="relative py-3 px-3 transition-colors duration-200 whitespace-nowrap flex items-center gap-1.5"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              fontSize: "13px",
              fontWeight: 600,
              color: isActive ? "#4A7FA7" : "rgba(179,207,229,0.5)",
            }}
          >
            {tab.label}
            {isTabLoading && (
              <Loader2
                className="animate-spin"
                style={{ width: "10px", height: "10px", color: "rgba(179,207,229,0.35)" }}
              />
            )}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: "2px",
                  background: "#4A7FA7",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

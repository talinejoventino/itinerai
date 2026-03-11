"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { City, DayPlan, Activity, ActiveLocation } from "@/types";
import ActivityItem from "./ActivityItem";

interface DayCardProps {
  day: DayPlan;
  isOpen: boolean;
  showDayHeader: boolean;
  onToggle: () => void;
  city: City;
  onShowLocation: (activity: Activity) => void;
  activeLocation: ActiveLocation | null;
  loadingTitle: string | null;
}

export default function DayCard({
  day,
  isOpen,
  showDayHeader,
  onToggle,
  city,
  onShowLocation,
  activeLocation,
  loadingTitle,
}: DayCardProps) {
  return (
    <div
      style={{
        background: "rgba(26,61,99,0.4)",
        border: "1px solid rgba(179,207,229,0.1)",
        borderLeft: "3px solid #4A7FA7",
        borderRadius: "16px",
        overflow: "hidden",
        minWidth: 0,
        width: "100%",
        transition: "border-left-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderLeftColor = "#B3CFE5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderLeftColor = "#4A7FA7";
      }}
    >
      {showDayHeader && (
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors duration-150"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderBottom: isOpen ? "1px solid rgba(179,207,229,0.08)" : "none",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(74,127,167,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <span
            className="shrink-0"
            style={{
              padding: "3px 12px",
              borderRadius: "999px",
              background: "rgba(74,127,167,0.2)",
              fontSize: "11px",
              color: "#4A7FA7",
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              fontWeight: 700,
            }}
          >
            Day {day.day}
          </span>

          <span
            className="flex-1 truncate text-left"
            style={{
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              fontWeight: 600,
              fontSize: "14px",
              color: "#F6FAFD",
            }}
          >
            {day.theme}
          </span>

          <span
            className="shrink-0"
            style={{
              fontSize: "12px",
              color: "rgba(179,207,229,0.45)",
              fontFamily: "var(--font-body, 'Outfit', sans-serif)",
            }}
          >
            {day.activities.length} act.
          </span>

          <ChevronDown
            className="shrink-0 transition-transform duration-300"
            style={{
              width: "14px",
              height: "14px",
              color: "rgba(179,207,229,0.4)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      )}

      <AnimatePresence initial={false}>
        {(isOpen || !showDayHeader) && (
          <motion.div
            key="activities"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden", width: "100%" }}
          >
            <div className="px-4 py-3">
              {day.activities.map((activity, i) => (
                <ActivityItem
                  key={i}
                  activity={activity}
                  isLast={i === day.activities.length - 1}
                  city={city}
                  onShowLocation={onShowLocation}
                  isActive={activeLocation?.title === activity.title}
                  isLoading={loadingTitle === activity.title}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

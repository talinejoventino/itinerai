"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Lightbulb } from "lucide-react";
import type { City, Activity, ActiveLocation } from "@/types";

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
  city: City;
  onShowLocation: (activity: Activity) => void;
  isActive: boolean;
}

export default function ActivityItem({
  activity,
  isLast,
  city,
  onShowLocation,
  isActive,
}: ActivityItemProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activity.title + ", " + city.name
  )}`;

  return (
    <div
      className="flex gap-3 py-3"
      style={{ borderBottom: isLast ? "none" : "1px solid rgba(179,207,229,0.06)" }}
    >
      <div className="shrink-0 w-11 pt-0.5">
        <span
          style={{
            fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
            fontWeight: 600,
            fontSize: "11px",
            color: "#4A7FA7",
          }}
        >
          {activity.time}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-semibold leading-tight mb-1"
          style={{
            fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
            fontSize: "13px",
            color: "#F6FAFD",
          }}
        >
          {activity.title}
        </p>

        <p
          className="leading-relaxed"
          style={{
            fontFamily: "var(--font-body, 'Outfit', sans-serif)",
            fontSize: "12px",
            color: "rgba(179,207,229,0.6)",
          }}
        >
          {activity.description}
        </p>

        {activity.tip && (
          <div
            className="flex items-start gap-1.5 mt-2 rounded-[8px] px-2.5 py-2"
            style={{
              background: "rgba(74,127,167,0.12)",
              border: "1px solid rgba(74,127,167,0.2)",
            }}
          >
            <Lightbulb
              className="shrink-0 mt-0.5"
              style={{ width: "12px", height: "12px", color: "#4A7FA7" }}
            />
            <p
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "11px",
                color: "#B3CFE5",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {activity.tip}
            </p>
          </div>
        )}

        <div className="flex items-center flex-wrap gap-2 mt-2.5">
          <motion.button
            onClick={() => onShowLocation(activity)}
            whileHover={{ background: isActive ? "rgba(74,127,167,0.3)" : "rgba(74,127,167,0.18)" }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 26,
              paddingLeft: 8,
              paddingRight: 10,
              borderRadius: 7,
              background: isActive ? "rgba(74,127,167,0.22)" : "rgba(74,127,167,0.1)",
              border: `1px solid ${isActive ? "rgba(74,127,167,0.55)" : "rgba(74,127,167,0.2)"}`,
              color: isActive ? "#B3CFE5" : "#4A7FA7",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            <MapPin style={{ width: 11, height: 11 }} />
            {isActive ? "No mapa" : "Ver no mapa"}
          </motion.button>

          <motion.a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ background: "rgba(74,127,167,0.1)" }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 26,
              paddingLeft: 8,
              paddingRight: 10,
              borderRadius: 7,
              background: "transparent",
              border: "1px solid rgba(179,207,229,0.15)",
              color: "rgba(179,207,229,0.5)",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 150ms ease",
            }}
          >
            <ExternalLink style={{ width: 11, height: 11 }} />
            Google Maps
          </motion.a>
        </div>
      </div>

      <span className="shrink-0 text-base pt-0.5">{activity.emoji ?? "📌"}</span>
    </div>
  );
}

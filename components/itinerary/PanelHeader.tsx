"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import type { City } from "@/types";

interface PanelHeaderProps {
  city: City;
  isComplete: boolean;
  onClose: () => void;
}

export default function PanelHeader({ city, isComplete, onClose }: PanelHeaderProps) {
  return (
    <div className="shrink-0 px-6 pt-5 pb-0">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 shrink-0 transition-colors duration-150"
          style={{
            background: "rgba(26,61,99,0.55)",
            border: "1px solid rgba(179,207,229,0.18)",
            borderRadius: "10px",
            color: "#B3CFE5",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(74,127,167,0.2)";
            (e.currentTarget as HTMLElement).style.color = "#F6FAFD";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(26,61,99,0.55)";
            (e.currentTarget as HTMLElement).style.color = "#B3CFE5";
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          <h2
            className="font-bold leading-tight truncate"
            style={{
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              fontSize: "18px",
              color: "#F6FAFD",
            }}
          >
            {city.name}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body, 'Outfit', sans-serif)",
              fontSize: "13px",
              color: "rgba(179,207,229,0.55)",
            }}
          >
            {city.country}
          </p>
        </div>

        {!isComplete && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Loader2
              className="animate-spin"
              style={{ width: "13px", height: "13px", color: "#4A7FA7" }}
            />
            <span
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "11px",
                color: "rgba(179,207,229,0.5)",
              }}
            >
              Loading...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

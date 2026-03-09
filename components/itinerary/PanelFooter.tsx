"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import type { City, PartialItinerary } from "@/types";

type SaveState = "idle" | "generating" | "done";

interface PanelFooterProps {
  city: City;
  itinerary: PartialItinerary;
  isComplete: boolean;
}

export default function PanelFooter({ city, itinerary, isComplete }: PanelFooterProps) {
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const handleSavePDF = async () => {
    if (saveState !== "idle" || !isComplete) return;
    setSaveState("generating");
    try {
      const { generateItineraryPDF } = await import("@/lib/pdf");
      await generateItineraryPDF(city, itinerary as Parameters<typeof generateItineraryPDF>[1]);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2000);
    }
  };

  return (
    <div
      className="shrink-0 px-5 pt-4"
      style={{
        borderTop: "1px solid rgba(179,207,229,0.1)",
        background: "rgba(10,25,49,0.8)",
        paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
      }}
    >
      <button
        onClick={handleSavePDF}
        disabled={saveState !== "idle" || !isComplete}
        className="w-full flex items-center justify-center gap-2.5 font-semibold text-white transition-all duration-200"
        style={{
          background:
            saveState === "done"
              ? "linear-gradient(135deg, #2E7D52 0%, #1B4D33 100%)"
              : "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
          borderRadius: "14px",
          height: "52px",
          fontSize: "15px",
          fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
          boxShadow:
            saveState === "done"
              ? "0 4px 20px rgba(46,125,82,0.4)"
              : "0 4px 20px rgba(74,127,167,0.4)",
          border: "none",
          cursor: saveState !== "idle" || !isComplete ? "not-allowed" : "pointer",
          opacity: saveState === "generating" || !isComplete ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (saveState !== "idle" || !isComplete) return;
          (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(74,127,167,0.55)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            saveState === "done"
              ? "0 4px 20px rgba(46,125,82,0.4)"
              : "0 4px 20px rgba(74,127,167,0.4)";
        }}
      >
        {saveState === "generating" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating PDF...
          </>
        )}
        {saveState === "done" && (
          <>
            <Check className="h-4 w-4" />
            Downloaded!
          </>
        )}
        {saveState === "idle" && !isComplete && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading itineraries...
          </>
        )}
        {saveState === "idle" && isComplete && (
          <>
            <Download className="h-4 w-4" />
            Save Itinerary
          </>
        )}
      </button>
    </div>
  );
}

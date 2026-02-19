"use client";

import { motion } from "framer-motion";
import { X, Clock, Lightbulb, ChevronLeft, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { City, Itinerary, DayPlan } from "@/types";

interface ItineraryPanelProps {
  city: City;
  itinerary: Itinerary;
  onClose: () => void;
}

export default function ItineraryPanel({ city, itinerary, onClose }: ItineraryPanelProps) {
  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "rgba(10,25,49,0.98)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderLeft: "1px solid rgba(179,207,229,0.12)",
        boxShadow: "-8px 0 48px rgba(10,25,49,0.4)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="shrink-0 px-6 py-5 flex items-center justify-between"
        style={{
          borderBottom: "1px solid rgba(179,207,229,0.1)",
          minHeight: "72px",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 transition-colors duration-150"
            style={{
              background: "rgba(246,250,253,0.08)",
              border: "1px solid rgba(179,207,229,0.2)",
              borderRadius: "14px",
              color: "#B3CFE5",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(74,127,167,0.2)";
              (e.currentTarget as HTMLElement).style.color = "#F6FAFD";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(246,250,253,0.08)";
              (e.currentTarget as HTMLElement).style.color = "#B3CFE5";
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2
              className="font-bold leading-tight"
              style={{
                fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                fontSize: "16px",
                color: "#F6FAFD",
              }}
            >
              {city.name}
            </h2>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "13px",
                color: "rgba(179,207,229,0.6)",
              }}
            >
              {city.country}
            </p>
          </div>
        </div>

        {/* Highlights pills */}
        <div className="flex flex-wrap gap-1.5 justify-end max-w-[180px]">
          {itinerary.highlights.slice(0, 2).map((h, i) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1"
              style={{
                background: "rgba(179,207,229,0.12)",
                border: "1px solid rgba(179,207,229,0.2)",
                borderRadius: "999px",
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                color: "#B3CFE5",
              }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="1day" className="flex-1 flex flex-col min-h-0">
        <div
          className="shrink-0 px-4 pt-4"
          style={{ borderBottom: "1px solid rgba(179,207,229,0.08)" }}
        >
          <TabsList
            className="w-full grid grid-cols-3 p-1 h-auto"
            style={{
              background: "rgba(246,250,253,0.05)",
              border: "1px solid rgba(179,207,229,0.1)",
              borderRadius: "14px",
            }}
          >
            {(["1day", "3days", "7days"] as const).map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="transition-all duration-200 data-[state=active]:text-white"
                style={{
                  fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgba(179,207,229,0.5)",
                  borderRadius: "10px",
                  padding: "8px 4px",
                }}
              >
                {tab === "1day" ? "1 Day" : tab === "3days" ? "3 Days" : "7 Days"}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {(["1day", "3days", "7days"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="flex-1 min-h-0 mt-0">
            <ItineraryContent data={itinerary.itineraries[tab]} />
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Footer CTA ── */}
      <div
        className="shrink-0 px-5 py-4"
        style={{
          borderTop: "1px solid rgba(179,207,229,0.1)",
          background: "rgba(10,25,49,0.8)",
        }}
      >
        <button
          className="w-full flex items-center justify-center gap-2.5 font-semibold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
            borderRadius: "14px",
            height: "52px",
            fontSize: "15px",
            fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
            boxShadow: "0 0 24px rgba(74,127,167,0.3)",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(74,127,167,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(74,127,167,0.3)";
          }}
        >
          <Sparkles className="h-4 w-4" />
          Save Itinerary
        </button>
      </div>
    </div>
  );
}

function ItineraryContent({ data }: { data: Itinerary["itineraries"]["1day"] }) {
  return (
    <ScrollArea className="h-full">
      <div className="px-5 pt-5 pb-6 space-y-4">
        {/* Plan title */}
        <p
          className="font-semibold"
          style={{
            fontFamily: "var(--font-editorial, 'DM Serif Display', serif)",
            fontSize: "18px",
            color: "#F6FAFD",
          }}
        >
          {data.title}
        </p>

        {data.days.map((day, idx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <DaySection day={day} showDayHeader={data.days.length > 1} />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}

function DaySection({ day, showDayHeader }: { day: DayPlan; showDayHeader: boolean }) {
  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        background: "rgba(26,61,99,0.4)",
        border: "1px solid rgba(179,207,229,0.1)",
        borderLeft: "3px solid #4A7FA7",
      }}
    >
      {showDayHeader && (
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(179,207,229,0.08)" }}
        >
          <span
            className="px-3 py-1 text-xs font-semibold text-white"
            style={{
              background: "#4A7FA7",
              borderRadius: "999px",
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
            }}
          >
            Day {day.day}
          </span>
          <div>
            <p
              className="font-semibold leading-tight"
              style={{
                fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                fontSize: "15px",
                color: "#F6FAFD",
              }}
            >
              {day.theme}
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-3 space-y-2">
        {day.activities.map((activity, i) => (
          <ActivityItem key={i} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: DayPlan["activities"][number] }) {
  const icon = activity.emoji ?? "📌";

  return (
    <div
      className="rounded-[14px] p-4 transition-colors duration-150"
      style={{
        background: "rgba(246,250,253,0.03)",
        border: "1px solid rgba(179,207,229,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(74,127,167,0.08)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,127,167,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(246,250,253,0.03)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(179,207,229,0.06)";
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          {/* Time */}
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="h-3 w-3" style={{ color: "#4A7FA7" }} />
            <span
              className="font-medium"
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "12px",
                color: "#4A7FA7",
              }}
            >
              {activity.time}
            </span>
          </div>

          {/* Title */}
          <p
            className="font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
              fontSize: "14px",
              color: "#F6FAFD",
            }}
          >
            {activity.title}
          </p>

          {/* Description */}
          <p
            className="mt-1 leading-relaxed"
            style={{
              fontFamily: "var(--font-body, 'Outfit', sans-serif)",
              fontSize: "13px",
              color: "rgba(179,207,229,0.6)",
            }}
          >
            {activity.description}
          </p>

          {/* Tip */}
          {activity.tip && (
            <div
              className="flex items-start gap-2 mt-2 rounded-[10px] p-2.5"
              style={{
                background: "rgba(74,127,167,0.12)",
                border: "1px solid rgba(74,127,167,0.2)",
              }}
            >
              <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#4A7FA7" }} />
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "12px",
                  color: "#B3CFE5",
                }}
              >
                {activity.tip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

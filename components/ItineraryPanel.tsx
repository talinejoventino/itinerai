"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  Lightbulb,
  CalendarDays,
  DollarSign,
  Compass,
  CloudSun,
  MapPin,
  ExternalLink,
  Loader2,
  Download,
  Check,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { City, Itinerary, DayPlan, Activity, ActiveLocation } from "@/types";

type Tab = "info" | "1day" | "3days" | "5days";

const TABS: { value: Tab; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "1day", label: "1 Day" },
  { value: "3days", label: "3 Days" },
  { value: "5days", label: "5 Days" },
];

interface SummaryCard {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
}

function buildSummaryCards(itinerary: Itinerary): SummaryCard[] {
  const { estimatedBudgetPerPerson, style, bestSeason, recommendedDuration } = itinerary;
  return [
    {
      icon: CalendarDays,
      label: "Duration",
      value: recommendedDuration ? `${recommendedDuration.ideal} days` : "1–5 days",
      sub: recommendedDuration
        ? `${recommendedDuration.minimum}–${recommendedDuration.maximum} day range`
        : "Choose your duration",
    },
    {
      icon: DollarSign,
      label: "Est. Budget",
      value: estimatedBudgetPerPerson?.midRange ?? "—",
      sub: estimatedBudgetPerPerson
        ? `Budget: ${estimatedBudgetPerPerson.budget}`
        : "Per person",
    },
    {
      icon: Compass,
      label: "Style",
      value: style?.[0] ?? "—",
      sub: style?.slice(1, 3).join(" · ") ?? "—",
    },
    {
      icon: CloudSun,
      label: "Best Season",
      value: bestSeason?.recommended.split(" and ")[0] ?? "—",
      sub: bestSeason ? `Avoid: ${bestSeason.toAvoid}` : "—",
    },
  ];
}

interface ItineraryPanelProps {
  city: City;
  itinerary: Itinerary;
  onClose: () => void;
  onShowLocation: (activity: Activity) => void;
  activeLocation: ActiveLocation | null;
}

export default function ItineraryPanel({
  city,
  itinerary,
  onClose,
  onShowLocation,
  activeLocation,
}: ItineraryPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [openDayIndex, setOpenDayIndex] = useState<number>(0);
  type SaveState = "idle" | "generating" | "done";
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setOpenDayIndex(0);
  };

  const handleSavePDF = async () => {
    if (saveState !== "idle") return;
    setSaveState("generating");
    try {
      const { generateItineraryPDF } = await import("@/lib/pdf");
      await generateItineraryPDF(city, itinerary);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2000);
    }
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: "rgba(7,17,40,0.98)",
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
        borderLeft: "1px solid rgba(179,207,229,0.12)",
        boxShadow: "-8px 0 60px rgba(10,25,49,0.5)",
      }}
    >
      {/* ── Header ── */}
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
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        className="shrink-0 flex px-6"
        style={{ borderBottom: "1px solid rgba(179,207,229,0.1)" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className="relative py-3 px-3 transition-colors duration-200 whitespace-nowrap"
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

      {/* ── Tab content ── */}
      <ScrollArea className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "info" ? (
              <InfoTab itinerary={itinerary} city={city} />
            ) : (
              <ItineraryTab
                data={itinerary.itineraries[activeTab]}
                openDayIndex={openDayIndex}
                setOpenDayIndex={setOpenDayIndex}
                city={city}
                onShowLocation={onShowLocation}
                activeLocation={activeLocation}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>

      {/* ── Footer CTA ── */}
      <div
        className="shrink-0 px-5 py-4"
        style={{
          borderTop: "1px solid rgba(179,207,229,0.1)",
          background: "rgba(10,25,49,0.8)",
        }}
      >
        <button
          onClick={handleSavePDF}
          disabled={saveState !== "idle"}
          className="w-full flex items-center justify-center gap-2.5 font-semibold text-white transition-all duration-200"
          style={{
            background: saveState === "done"
              ? "linear-gradient(135deg, #2E7D52 0%, #1B4D33 100%)"
              : "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
            borderRadius: "14px",
            height: "52px",
            fontSize: "15px",
            fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
            boxShadow: saveState === "done"
              ? "0 4px 20px rgba(46,125,82,0.4)"
              : "0 4px 20px rgba(74,127,167,0.4)",
            border: "none",
            cursor: saveState !== "idle" ? "not-allowed" : "pointer",
            opacity: saveState === "generating" ? 0.8 : 1,
          }}
          onMouseEnter={(e) => {
            if (saveState !== "idle") return;
            (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(74,127,167,0.55)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = saveState === "done"
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
          {saveState === "idle" && (
            <>
              <Download className="h-4 w-4" />
              Save Itinerary
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Info Tab ── */
function InfoTab({ itinerary, city }: { itinerary: Itinerary; city: City }) {
  const cards = buildSummaryCards(itinerary);
  const { estimatedBudgetPerPerson, style, bestSeason, recommendedDuration, nearbyExcursions } = itinerary;

  return (
    <div className="px-5 pt-5 pb-6 space-y-5">
      {/* Summary cards 2×2 */}
      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(26,61,99,0.55)",
                border: "1px solid rgba(179,207,229,0.1)",
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-lg mb-2.5"
                style={{ background: "rgba(74,127,167,0.18)" }}
              >
                <Icon style={{ width: "16px", height: "16px", color: "#4A7FA7" }} />
              </div>
              <span
                className="block"
                style={{
                  fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "rgba(179,207,229,0.45)",
                  marginBottom: "3px",
                }}
              >
                {card.label}
              </span>
              <span
                className="block font-bold truncate"
                style={{
                  fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: "15px",
                  color: "#F6FAFD",
                }}
              >
                {card.value}
              </span>
              <span
                className="block mt-0.5 truncate"
                style={{
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "11px",
                  color: "rgba(179,207,229,0.45)",
                }}
              >
                {card.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5"
        style={{
          background: "rgba(74,127,167,0.15)",
          border: "1px solid rgba(74,127,167,0.3)",
          borderRadius: "999px",
          fontSize: "11px",
          color: "#4A7FA7",
          fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#4A7FA7",
            display: "inline-block",
            animation: "pulse 2s infinite",
          }}
        />
        AI Generated
      </div>

      {/* Overview text */}
      <p
        style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontSize: "14px",
          lineHeight: 1.7,
          color: "rgba(179,207,229,0.75)",
        }}
      >
        A personalised itinerary for {city.name}, covering the top attractions,
        cultural experiences and local cuisine — at a comfortable travel pace.
      </p>

      {/* Style tags */}
      {style && style.length > 0 && (
        <div>
          <SectionLabel>Style</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {style.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5"
                style={{
                  background: "rgba(74,127,167,0.15)",
                  border: "1px solid rgba(74,127,167,0.3)",
                  borderRadius: "999px",
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#4A7FA7",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Best Season */}
      {bestSeason && (
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: "rgba(26,61,99,0.4)",
            border: "1px solid rgba(179,207,229,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <CloudSun style={{ width: "14px", height: "14px", color: "#4A7FA7" }} />
            <span
              style={{
                fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#F6FAFD",
              }}
            >
              Best Season
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.7px", color: "rgba(179,207,229,0.45)" }}>
                Recommended
              </span>
              <p style={{ fontFamily: "var(--font-body, 'Outfit', sans-serif)", fontSize: "13px", color: "#F6FAFD", marginTop: "2px" }}>
                {bestSeason.recommended}
              </p>
            </div>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.7px", color: "rgba(179,207,229,0.45)" }}>
                Avoid
              </span>
              <p style={{ fontFamily: "var(--font-body, 'Outfit', sans-serif)", fontSize: "13px", color: "#F6FAFD", marginTop: "2px" }}>
                {bestSeason.toAvoid}
              </p>
            </div>
            {bestSeason.notes && (
              <p style={{ fontFamily: "var(--font-body, 'Outfit', sans-serif)", fontSize: "12px", color: "rgba(179,207,229,0.55)", fontStyle: "italic", lineHeight: 1.5 }}>
                {bestSeason.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Budget breakdown */}
      {estimatedBudgetPerPerson && (
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: "rgba(26,61,99,0.4)",
            border: "1px solid rgba(179,207,229,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <DollarSign style={{ width: "14px", height: "14px", color: "#4A7FA7" }} />
            <span
              style={{
                fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#F6FAFD",
              }}
            >
              Est. Budget Per Person / Day
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { label: "Budget", value: estimatedBudgetPerPerson.budget },
                { label: "Mid-range", value: estimatedBudgetPerPerson.midRange },
                { label: "Luxury", value: estimatedBudgetPerPerson.luxury },
              ] as const
            ).map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-2.5 text-center"
                style={{ background: "rgba(74,127,167,0.1)", border: "1px solid rgba(74,127,167,0.2)" }}
              >
                <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.6px", color: "rgba(179,207,229,0.45)", display: "block" }}>
                  {label}
                </span>
                <span style={{ fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)", fontSize: "13px", fontWeight: 700, color: "#F6FAFD", display: "block", marginTop: "2px" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          {estimatedBudgetPerPerson.notes && (
            <p style={{ fontFamily: "var(--font-body, 'Outfit', sans-serif)", fontSize: "12px", color: "rgba(179,207,229,0.55)", fontStyle: "italic", lineHeight: 1.5 }}>
              {estimatedBudgetPerPerson.notes}
            </p>
          )}
        </div>
      )}

      {/* Duration notes */}
      {recommendedDuration?.notes && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(74,127,167,0.08)", border: "1px solid rgba(74,127,167,0.18)" }}
        >
          <div className="flex items-start gap-2">
            <CalendarDays style={{ width: "13px", height: "13px", color: "#4A7FA7", marginTop: "2px", flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-body, 'Outfit', sans-serif)", fontSize: "12px", color: "rgba(179,207,229,0.65)", lineHeight: 1.5 }}>
              {recommendedDuration.notes}
            </p>
          </div>
        </div>
      )}

      {/* Nearby Excursions */}
      {nearbyExcursions && nearbyExcursions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe style={{ width: "13px", height: "13px", color: "rgba(179,207,229,0.45)" }} />
            <span  >Nearby Excursions</span>
          </div>
          <div className="space-y-2">
            {nearbyExcursions.map((exc, i) => (
              <div
                key={i}
                className="rounded-xl p-3.5"
                style={{
                  background: "rgba(26,61,99,0.4)",
                  border: "1px solid rgba(179,207,229,0.1)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    style={{
                      fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#F6FAFD",
                    }}
                  >
                    {exc.destination}
                    {exc.country && (
                      <span style={{ fontWeight: 400, color: "rgba(179,207,229,0.45)", marginLeft: "5px", fontSize: "12px" }}>
                        {exc.country}
                      </span>
                    )}
                  </span>
                  <span
                    className="shrink-0"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#4A7FA7",
                      background: "rgba(74,127,167,0.15)",
                      border: "1px solid rgba(74,127,167,0.25)",
                      borderRadius: "999px",
                      padding: "2px 8px",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {exc.bestFor}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-body, 'Outfit', sans-serif)", fontSize: "12px", color: "rgba(179,207,229,0.6)", lineHeight: 1.5 }}>
                  {exc.why}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin style={{ width: "10px", height: "10px", color: "rgba(179,207,229,0.35)", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "rgba(179,207,229,0.4)" }}>{exc.distance}</span>
                  <span style={{ fontSize: "11px", color: "rgba(179,207,229,0.25)" }}>·</span>
                  <span style={{ fontSize: "11px", color: "rgba(179,207,229,0.4)" }}>{exc.travelTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      <div>
        <SectionLabel>Highlights</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {itinerary.highlights.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1.5"
              style={{
                background: "rgba(26,61,99,0.6)",
                border: "1px solid rgba(179,207,229,0.12)",
                borderRadius: "999px",
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "12px",
                fontWeight: 500,
                color: "rgba(179,207,229,0.7)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "rgba(179,207,229,0.45)",
        display: "block",
        marginBottom: "10px",
      }}
    >
      {children}
    </span>
  );
}

/* ── Itinerary Tab (day cards) ── */
function ItineraryTab({
  data,
  openDayIndex,
  setOpenDayIndex,
  city,
  onShowLocation,
  activeLocation,
}: {
  data: Itinerary["itineraries"]["1day"];
  openDayIndex: number;
  setOpenDayIndex: (i: number) => void;
  city: City;
  onShowLocation: (activity: Activity) => void;
  activeLocation: ActiveLocation | null;
}) {
  return (
    <div className="px-5 pt-4 pb-6 space-y-3">
      <p
        style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontSize: "13px",
          color: "rgba(179,207,229,0.5)",
          marginBottom: "4px",
        }}
      >
        {data.title}
      </p>

      {data.days.map((day, idx) => (
        <DayCard
          key={day.day}
          day={day}
          isOpen={openDayIndex === idx}
          showDayHeader={data.days.length > 1}
          onToggle={() => setOpenDayIndex(openDayIndex === idx ? -1 : idx)}
          city={city}
          onShowLocation={onShowLocation}
          activeLocation={activeLocation}
        />
      ))}
    </div>
  );
}

/* ── Day Card (accordion) ── */
function DayCard({
  day,
  isOpen,
  showDayHeader,
  onToggle,
  city,
  onShowLocation,
  activeLocation,
}: {
  day: DayPlan;
  isOpen: boolean;
  showDayHeader: boolean;
  onToggle: () => void;
  city: City;
  onShowLocation: (activity: Activity) => void;
  activeLocation: ActiveLocation | null;
}) {
  return (
    <div
      style={{
        background: "rgba(26,61,99,0.4)",
        border: "1px solid rgba(179,207,229,0.1)",
        borderLeft: "3px solid #4A7FA7",
        borderRadius: "16px",
        overflow: "hidden",
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
            style={{ overflow: "hidden" }}
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
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Activity Item ── */
function ActivityItem({
  activity,
  isLast,
  city,
  onShowLocation,
  isActive,
}: {
  activity: DayPlan["activities"][number];
  isLast: boolean;
  city: City;
  onShowLocation: (activity: Activity) => void;
  isActive: boolean;
}) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activity.title + ", " + city.name
  )}`;

  return (
    <div
      className="flex gap-3 py-3"
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(179,207,229,0.06)",
      }}
    >
      {/* Time */}
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

      {/* Content */}
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

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2 mt-2.5">
          {/* Ver no mapa */}
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

          {/* Abrir no Google Maps */}
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

      {/* Emoji icon */}
      <span className="shrink-0 text-base pt-0.5">{activity.emoji ?? "📌"}</span>
    </div>
  );
}

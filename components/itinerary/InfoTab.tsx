import { CloudSun, DollarSign, CalendarDays } from "lucide-react";
import type { City, PartialItinerary } from "@/types";
import SummaryCards from "./SummaryCards";
import NearbyExcursions from "./NearbyExcursions";

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

interface InfoTabProps {
  itinerary: PartialItinerary;
  city: City;
}

export default function InfoTab({ itinerary, city }: InfoTabProps) {
  const { estimatedBudgetPerPerson, style, bestSeason, recommendedDuration, nearbyExcursions } =
    itinerary;

  return (
    <div className="px-5 pt-5 pb-6 space-y-5">
      <SummaryCards itinerary={itinerary} />

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

      <p
        style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontSize: "14px",
          lineHeight: 1.7,
          color: "rgba(179,207,229,0.75)",
        }}
      >
        A personalised itinerary for {city.name}, covering the top attractions, cultural
        experiences and local cuisine — at a comfortable travel pace.
      </p>

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
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.7px",
                  color: "rgba(179,207,229,0.45)",
                }}
              >
                Recommended
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "13px",
                  color: "#F6FAFD",
                  marginTop: "2px",
                }}
              >
                {bestSeason.recommended}
              </p>
            </div>
            <div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.7px",
                  color: "rgba(179,207,229,0.45)",
                }}
              >
                Avoid
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "13px",
                  color: "#F6FAFD",
                  marginTop: "2px",
                }}
              >
                {bestSeason.toAvoid}
              </p>
            </div>
            {bestSeason.notes && (
              <p
                style={{
                  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                  fontSize: "12px",
                  color: "rgba(179,207,229,0.55)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                }}
              >
                {bestSeason.notes}
              </p>
            )}
          </div>
        </div>
      )}

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
                style={{
                  background: "rgba(74,127,167,0.1)",
                  border: "1px solid rgba(74,127,167,0.2)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.6px",
                    color: "rgba(179,207,229,0.45)",
                    display: "block",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#F6FAFD",
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
          {estimatedBudgetPerPerson.notes && (
            <p
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "12px",
                color: "rgba(179,207,229,0.55)",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {estimatedBudgetPerPerson.notes}
            </p>
          )}
        </div>
      )}

      {recommendedDuration?.notes && (
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: "rgba(74,127,167,0.08)",
            border: "1px solid rgba(74,127,167,0.18)",
          }}
        >
          <div className="flex items-start gap-2">
            <CalendarDays
              style={{
                width: "13px",
                height: "13px",
                color: "#4A7FA7",
                marginTop: "2px",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "12px",
                color: "rgba(179,207,229,0.65)",
                lineHeight: 1.5,
              }}
            >
              {recommendedDuration.notes}
            </p>
          </div>
        </div>
      )}

      {nearbyExcursions && nearbyExcursions.length > 0 && (
        <NearbyExcursions excursions={nearbyExcursions} />
      )}

      {itinerary.highlights.length > 0 && (
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
      )}
    </div>
  );
}

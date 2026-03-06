import { Globe, MapPin } from "lucide-react";
import type { NearbyExcursion } from "@/types";

export default function NearbyExcursions({ excursions }: { excursions: NearbyExcursion[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Globe style={{ width: "13px", height: "13px", color: "rgba(179,207,229,0.45)" }} />
        <span
          style={{
            fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(179,207,229,0.45)",
          }}
        >
          Nearby Excursions
        </span>
      </div>
      <div className="space-y-2">
        {excursions.map((exc, i) => (
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
                  <span
                    style={{
                      fontWeight: 400,
                      color: "rgba(179,207,229,0.45)",
                      marginLeft: "5px",
                      fontSize: "12px",
                    }}
                  >
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
                  whiteSpace: "nowrap",
                }}
              >
                {exc.bestFor}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                fontSize: "12px",
                color: "rgba(179,207,229,0.6)",
                lineHeight: 1.5,
              }}
            >
              {exc.why}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin
                style={{ width: "10px", height: "10px", color: "rgba(179,207,229,0.35)", flexShrink: 0 }}
              />
              <span style={{ fontSize: "11px", color: "rgba(179,207,229,0.4)" }}>{exc.distance}</span>
              <span style={{ fontSize: "11px", color: "rgba(179,207,229,0.25)" }}>·</span>
              <span style={{ fontSize: "11px", color: "rgba(179,207,229,0.4)" }}>{exc.travelTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

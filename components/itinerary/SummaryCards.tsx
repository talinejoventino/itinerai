import { CalendarDays, DollarSign, Compass, CloudSun, type LucideIcon } from "lucide-react";
import type { PartialItinerary } from "@/types";

interface SummaryCard {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
}

function buildSummaryCards(itinerary: PartialItinerary): SummaryCard[] {
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
      sub: estimatedBudgetPerPerson ? `Budget: ${estimatedBudgetPerPerson.budget}` : "Per person",
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

export default function SummaryCards({ itinerary }: { itinerary: PartialItinerary }) {
  const cards = buildSummaryCards(itinerary);

  return (
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
  );
}

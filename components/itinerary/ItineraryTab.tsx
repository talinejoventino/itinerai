"use client";

import type { City, ItineraryData, Activity, ActiveLocation } from "@/types";
import TabSkeleton from "./TabSkeleton";
import DayCard from "./DayCard";

interface ItineraryTabProps {
  data: ItineraryData | undefined;
  openDayIndex: number;
  setOpenDayIndex: (i: number) => void;
  city: City;
  onShowLocation: (activity: Activity) => void;
  activeLocation: ActiveLocation | null;
  loadingTitle: string | null;
}

export default function ItineraryTab({
  data,
  openDayIndex,
  setOpenDayIndex,
  city,
  onShowLocation,
  activeLocation,
  loadingTitle,
}: ItineraryTabProps) {
  if (!data) return <TabSkeleton />;

  return (
    <div className="px-5 pt-4 pb-6 space-y-3 w-full overflow-x-hidden">
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
          loadingTitle={loadingTitle}
        />
      ))}
    </div>
  );
}

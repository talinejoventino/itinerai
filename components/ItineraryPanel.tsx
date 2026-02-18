"use client";

import { X, Star, Clock, Lightbulb, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { City, Itinerary, DayPlan } from "@/types";

interface ItineraryPanelProps {
  city: City;
  itinerary: Itinerary;
  onClose: () => void;
}

export default function ItineraryPanel({ city, itinerary, onClose }: ItineraryPanelProps) {
  console.log("Rendering ItineraryPanel for", itinerary);
  return (
    <div className="h-full flex flex-col bg-white/98 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 text-white shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold leading-tight">{city.name}</h2>
            <p className="text-indigo-200 text-sm mt-0.5">{city.country}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 -mt-1 -mr-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Highlights */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 text-yellow-300" />
            <span className="text-xs font-medium text-indigo-100">Destaques</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {itinerary.highlights.map((h, i) => (
              <Badge
                key={i}
                className="bg-white/20 text-white border-white/30 text-xs hover:bg-white/30"
              >
                {h}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="1day" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-4 mb-0 grid grid-cols-3 shrink-0 bg-gray-100">
          <TabsTrigger value="1day" className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            1 Dia
          </TabsTrigger>
          <TabsTrigger value="3days" className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            3 Dias
          </TabsTrigger>
          <TabsTrigger value="7days" className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            7 Dias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="1day" className="flex-1 min-h-0 mt-0">
          <ItineraryContent data={itinerary.itineraries["1day"]} />
        </TabsContent>
        <TabsContent value="3days" className="flex-1 min-h-0 mt-0">
          <ItineraryContent data={itinerary.itineraries["3days"]} />
        </TabsContent>
        <TabsContent value="7days" className="flex-1 min-h-0 mt-0">
          <ItineraryContent data={itinerary.itineraries["7days"]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ItineraryContent({ data }: { data: Itinerary["itineraries"]["1day"] }) {
  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-3 pb-6">
        <p className="text-sm font-semibold text-indigo-700 mb-4">{data.title}</p>

        {data.days.map((day) => (
          <DaySection key={day.day} day={day} showDayHeader={data.days.length > 1} />
        ))}
      </div>
    </ScrollArea>
  );
}

function DaySection({ day, showDayHeader }: { day: DayPlan; showDayHeader: boolean }) {
  return (
    <div className="mb-6">
      {showDayHeader && (
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
            {day.day}
          </div>
          <div>
            <span className="text-xs text-gray-400">Dia {day.day}</span>
            <p className="text-sm font-semibold text-gray-700 leading-tight">{day.theme}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {day.activities.map((activity, i) => (
          <div
            key={i}
            className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-indigo-100"
          >
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors">
              <div className="flex items-start gap-2">
                <span className="text-lg leading-none shrink-0 mt-0.5">
                  {activity.emoji || "📌"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Clock className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span className="text-xs text-indigo-500 font-medium">{activity.time}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm leading-tight">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {activity.description}
                  </p>
                  {activity.tip && (
                    <div className="flex items-start gap-1.5 mt-2 bg-yellow-50 rounded-lg p-2 border border-yellow-100">
                      <Lightbulb className="h-3 w-3 text-yellow-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-700 leading-relaxed">{activity.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

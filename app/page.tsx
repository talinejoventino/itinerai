"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Globe, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import ItineraryPanel from "@/components/ItineraryPanel";
import type { City, Itinerary } from "@/types";

// Leaflet must be loaded client-side only
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-3 text-white/60">
        <Globe className="w-8 h-8 animate-pulse" />
        <p className="text-sm">Carregando mapa...</p>
      </div>
    </div>
  ),
});

type AppState = "idle" | "loading" | "done" | "error";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleCitySelect = useCallback((city: City) => {
    setSelectedCity(city);
    setItinerary(null);
    setState("idle");
    setError(null);
    setPanelOpen(false);
  }, []);

  const handleGenerate = async () => {
    if (!selectedCity) return;
    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCity),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar roteiro");
      }

      setItinerary(data);
      setState("done");
      setPanelOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      setState("error");
    }
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0 z-0">
        <MapView selectedCity={selectedCity} onCityClick={handleCitySelect} />
      </div>

      {/* Floating header */}
      <header className="absolute top-0 left-0 right-0 z-[500] pointer-events-none">
        <div className="flex items-center justify-between p-4 gap-4">
          {/* Logo */}
          <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur rounded-xl px-4 py-2.5 shadow-lg shrink-0">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-base tracking-tight">
              Itiner<span className="text-indigo-600">ai</span>
            </span>
          </div>

          {/* Search bar */}
          <div className="pointer-events-auto flex-1 max-w-md">
            <SearchBar onCitySelect={handleCitySelect} selectedCity={selectedCity} />
          </div>

          {/* Spacer for symmetry */}
          <div className="w-28 shrink-0 hidden sm:block" />
        </div>
      </header>

      {/* Generate button - bottom center */}
      {selectedCity && !panelOpen && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500]">
          <div className="flex flex-col items-center gap-2">
            {/* City badge */}
            <div className="bg-white/95 backdrop-blur text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium shadow-md flex items-center gap-1.5">
              <span className="text-base">📍</span>
              {selectedCity.name}, {selectedCity.country}
            </div>

            {/* Error message */}
            {state === "error" && error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm max-w-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
                <button onClick={() => setError(null)}>
                  <X className="h-3.5 w-3.5 ml-1 opacity-60 hover:opacity-100" />
                </button>
              </div>
            )}

            {/* Main CTA */}
            <Button
              onClick={handleGenerate}
              disabled={state === "loading"}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-indigo-500/40 rounded-2xl px-8 h-14 text-base font-semibold transition-all duration-200 disabled:opacity-80"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando roteiro...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar Roteiro com IA
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Instructions when no city selected */}
      {!selectedCity && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
          <div className="bg-white/90 backdrop-blur rounded-2xl px-6 py-4 shadow-xl text-center max-w-xs">
            <p className="text-gray-700 text-sm font-medium">
              🗺️ Clique no mapa ou pesquise uma cidade para começar
            </p>
          </div>
        </div>
      )}

      {/* Itinerary panel - slides from right */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-96 z-[600] transition-transform duration-500 ease-in-out ${
          panelOpen && itinerary ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {itinerary && selectedCity && (
          <ItineraryPanel
            city={selectedCity}
            itinerary={itinerary}
            onClose={handleClosePanel}
          />
        )}
      </div>

      {/* Loading overlay */}
      {state === "loading" && (
        <div className="absolute inset-0 z-[550] bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 max-w-xs mx-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">Criando seu roteiro</p>
              <p className="text-sm text-gray-500 mt-1">
                A IA está preparando a melhor experiência em {selectedCity?.name}...
              </p>
            </div>
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          </div>
        </div>
      )}

      {/* Reopen panel button when panel is closed but itinerary exists */}
      {itinerary && !panelOpen && selectedCity && (
        <div className="absolute top-1/2 right-0 -translate-y-1/2 z-[500]">
          <button
            onClick={() => setPanelOpen(true)}
            className="bg-indigo-600 text-white rounded-l-xl px-2 py-4 shadow-lg hover:bg-indigo-700 transition-colors flex flex-col items-center gap-1"
            title="Ver roteiro"
          >
            <span className="text-xs font-medium [writing-mode:vertical-rl] rotate-180">
              Ver Roteiro
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

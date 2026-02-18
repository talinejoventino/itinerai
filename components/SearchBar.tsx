"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchCities } from "@/lib/nominatim";
import type { City } from "@/types";

interface SearchBarProps {
  onCitySelect: (city: City) => void;
  selectedCity: City | null;
}

export default function SearchBar({ onCitySelect, selectedCity }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCity) {
      setQuery(`${selectedCity.name}, ${selectedCity.country}`);
      setOpen(false);
    }
  }, [selectedCity]);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const cities = await searchCities(q);
      setResults(cities);
      setOpen(cities.length > 0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelect = (city: City) => {
    onCitySelect(city);
    setQuery(`${city.name}, ${city.country}`);
    setOpen(false);
    setResults([]);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Pesquisar uma cidade..."
          className="pl-9 pr-4 bg-white/95 backdrop-blur border-0 shadow-lg rounded-xl h-11 text-sm focus-visible:ring-indigo-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[1000]">
          {results.map((city, i) => (
            <button
              key={i}
              onClick={() => handleSelect(city)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left group"
            >
              <MapPin className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0 group-hover:text-indigo-600" />
              <div className="min-w-0">
                <div className="font-medium text-gray-800 text-sm truncate">
                  {city.name}
                  {city.country && (
                    <span className="text-gray-400 font-normal">, {city.country}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">{city.displayName}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

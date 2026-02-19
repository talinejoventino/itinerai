"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
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
  const [focused, setFocused] = useState(false);
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
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input wrapper */}
      <div
        className="relative flex items-center transition-all duration-200"
        style={{
          height: "56px",
          background: "rgba(246,250,253,0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: focused
            ? "1.5px solid #4A7FA7"
            : "1.5px solid rgba(179,207,229,0.2)",
          borderRadius: open && results.length > 0 ? "28px 28px 0 0" : "999px",
          boxShadow: focused
            ? "0 0 24px rgba(74,127,167,0.25), 0 4px 20px rgba(10,25,49,0.18)"
            : "0 4px 20px rgba(10,25,49,0.18)",
        }}
      >
        {/* Search icon */}
        <div className="absolute left-5 flex items-center pointer-events-none">
          <Search
            className="h-4 w-4 transition-colors duration-200"
            style={{ color: focused ? "#4A7FA7" : "rgba(179,207,229,0.5)" }}
          />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
            if (results.length > 0) setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder="Search for a city..."
          className="w-full bg-transparent outline-none border-none"
          style={{
            paddingLeft: "52px",
            paddingRight: "52px",
            height: "56px",
            fontFamily: "var(--font-body, 'Outfit', sans-serif)",
            fontSize: "15px",
            color: "#F6FAFD",
          }}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Loader */}
        {loading && (
          <div className="absolute right-5">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#4A7FA7" }} />
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 overflow-hidden z-[1000]"
          style={{
            background: "rgba(10,25,49,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid #4A7FA7",
            borderTop: "1px solid rgba(179,207,229,0.1)",
            borderRadius: "0 0 20px 20px",
            maxHeight: "320px",
            overflowY: "auto",
            boxShadow: "0 8px 40px rgba(10,25,49,0.4)",
          }}
        >
          {results.map((city, i) => (
            <button
              key={i}
              onClick={() => handleSelect(city)}
              className="w-full flex items-start gap-3 text-left transition-colors duration-150"
              style={{
                padding: "14px 20px",
                minHeight: "52px",
                borderBottom: i < results.length - 1 ? "1px solid rgba(179,207,229,0.06)" : "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(74,127,167,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <MapPin
                className="h-4 w-4 mt-0.5 shrink-0 transition-colors"
                style={{ color: "rgba(179,207,229,0.5)" }}
              />
              <div className="min-w-0">
                <div
                  className="font-medium truncate"
                  style={{
                    fontFamily: "var(--font-display, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: "14px",
                    color: "#F6FAFD",
                  }}
                >
                  {city.name}
                  {city.country && (
                    <span style={{ color: "rgba(179,207,229,0.5)", fontWeight: 400 }}>
                      , {city.country}
                    </span>
                  )}
                </div>
                <div
                  className="truncate mt-0.5"
                  style={{
                    fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                    fontSize: "12px",
                    color: "rgba(179,207,229,0.4)",
                  }}
                >
                  {city.displayName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

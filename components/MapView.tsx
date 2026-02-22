"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import type { City, ActiveLocation } from "@/types";
import { reverseGeocode } from "@/lib/nominatim";
import { itineraiMapStyle } from "@/lib/map-style";
import { Pin, MapPin } from "lucide-react";

const CITY_LAYERS = ["label-capital", "label-city", "label-town"];

// City selection marker
function CustomMarker() {
  return (
    <div className="relative w-10 h-10 cursor-pointer">
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{
          background: "rgba(74,127,167,0.3)",
          animationDuration: "2s",
        }}
      />
      {/* Pin body */}
      <div
        className="absolute top-1/2 left-1/2 w-9 h-9 border-2 border-white"
        style={{
          background: "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
          borderRadius: "50% 50% 50% 0",
          transform: "translate(-50%, -60%) rotate(-45deg)",
          boxShadow: "0 0 24px rgba(74,127,167,0.5), 0 4px 12px rgba(10,25,49,0.4)",
        }}
      />
      {/* Pin icon */}
      <div
        className="absolute text-sm z-10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -70%)",
        }}
      >
        <Pin size={16} color="#fff" />
      </div>
    </div>
  );
}

// Active place marker — shown when user clicks an activity
function PlaceMarker({ emoji }: { emoji?: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 3px 10px rgba(10,25,49,0.7))",
      }}
    >
      {/* Pulse ring */}
      <div style={{ position: "relative", width: 44, height: 44 }}>
        <div
          className="animate-ping"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(179,207,229,0.25)",
            animationDuration: "1.5s",
          }}
        />
        {/* Pin body */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 40,
            height: 40,
            borderRadius: "50% 50% 50% 0",
            transform: "translate(-50%, -62%) rotate(-45deg)",
            background: "linear-gradient(135deg, #B3CFE5 0%, #4A7FA7 100%)",
            border: "2.5px solid #fff",
            boxShadow: "0 0 20px rgba(179,207,229,0.5), 0 4px 14px rgba(10,25,49,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ transform: "rotate(45deg)", fontSize: 14, lineHeight: 1 }}>
            {emoji ?? <MapPin size={14} color="#0A1931" />}
          </span>
        </div>
      </div>
    </div>
  );
}

interface MapViewProps {
  selectedCity: City | null;
  onCityClick: (city: City) => void;
  activeLocation: ActiveLocation | null;
}

export default function MapView({ selectedCity, onCityClick, activeLocation }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [cursor, setCursor] = useState<string>("grab");

  // FlyTo animation when selectedCity changes
  useEffect(() => {
    if (selectedCity && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedCity.lng, selectedCity.lat],
        zoom: 12,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedCity]);

  // FlyTo animation when an activity location is selected
  useEffect(() => {
    if (activeLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [activeLocation.lng, activeLocation.lat],
        zoom: 16,
        duration: 1200,
        essential: true,
      });
    }
  }, [activeLocation]);

  // Change cursor to pointer when hovering over a city label
  const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
    if (!mapRef.current) return;
    const { x, y } = event.point;
    const features = mapRef.current.queryRenderedFeatures(
      [[x - 3, y - 3], [x + 3, y + 3]],
      { layers: CITY_LAYERS }
    );
    setCursor(features.length > 0 ? "pointer" : "grab");
  }, []);

  // Click on a city label to select it
  const handleMapClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      if (!mapRef.current) return;
      const { x, y } = event.point;
      const features = mapRef.current.queryRenderedFeatures(
        [[x - 5, y - 5], [x + 5, y + 5]],
        { layers: CITY_LAYERS }
      );
      if (features.length === 0) return;

      const feature = features[0];
      const coords = (feature.geometry as unknown as { coordinates: [number, number] }).coordinates;
      const city = await reverseGeocode(coords[1], coords[0]);
      if (city) onCityClick(city);
    },
    [onCityClick]
  );

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 3,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={itineraiMapStyle}
      cursor={cursor}
      onClick={handleMapClick}
      onMouseMove={handleMouseMove}
      scrollZoom={true}
      dragRotate={false}
      pitchWithRotate={false}
      touchPitch={false}
      attributionControl={true}
    >
      {/* City selection marker */}
      {selectedCity && (
        <Marker
          longitude={selectedCity.lng}
          latitude={selectedCity.lat}
          anchor="bottom"
        >
          <CustomMarker />
        </Marker>
      )}

      {/* Active place marker (activity location) */}
      <AnimatePresence>
        {activeLocation && (
          <Marker
            key={`${activeLocation.lat}-${activeLocation.lng}`}
            longitude={activeLocation.lng}
            latitude={activeLocation.lat}
            anchor="bottom"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 450, damping: 24 }}
            >
              <PlaceMarker emoji={activeLocation.emoji} />
            </motion.div>
          </Marker>
        )}
      </AnimatePresence>
    </Map>
  );
}

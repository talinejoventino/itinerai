"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { City } from "@/types";
import { reverseGeocode } from "@/lib/nominatim";
import { itineraiMapStyle } from "@/lib/map-style";

const CITY_LAYERS = ["label-capital", "label-city", "label-town"];

// Custom marker matching design system colors
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
        📍
      </div>
    </div>
  );
}

interface MapViewProps {
  selectedCity: City | null;
  onCityClick: (city: City) => void;
}

export default function MapView({ selectedCity, onCityClick }: MapViewProps) {
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
      {selectedCity && (
        <Marker
          longitude={selectedCity.lng}
          latitude={selectedCity.lat}
          anchor="bottom"
        >
          <CustomMarker />
        </Marker>
      )}
    </Map>
  );
}

"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { reverseGeocode } from "@/lib/nominatim";
import { itineraiMapStyle } from "@/lib/map-style";
import CustomMarker from "./CustomMarker";
import PlaceMarker from "./PlaceMarker";

const CITY_LAYERS = ["label-capital", "label-city", "label-town"];

export default function MapView() {
  const { selectedCity, activeLocation, selectCity } = useAppStore();
  const mapRef = useRef<MapRef>(null);
  const [cursor, setCursor] = useState<string>("grab");

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

  const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
    if (!mapRef.current) return;
    const { x, y } = event.point;
    const features = mapRef.current.queryRenderedFeatures(
      [[x - 3, y - 3], [x + 3, y + 3]],
      { layers: CITY_LAYERS }
    );
    setCursor(features.length > 0 ? "pointer" : "grab");
  }, []);

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
      if (city) selectCity(city);
    },
    [selectCity]
  );

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 0, latitude: 20, zoom: 3 }}
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
        <Marker longitude={selectedCity.lng} latitude={selectedCity.lat} anchor="bottom">
          <CustomMarker />
        </Marker>
      )}

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

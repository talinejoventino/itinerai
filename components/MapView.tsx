"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { City } from "@/types";
import { reverseGeocode } from "@/lib/nominatim";

// Fix Leaflet icon issue with Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom animated marker icon
const createCustomIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          background: #6366f1;
          border-radius: 50% 50% 50% 0;
          transform: translate(-50%, -50%) rotate(-45deg);
          box-shadow: 0 4px 12px rgba(99,102,241,0.5);
          border: 3px solid white;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -55%);
          font-size: 14px;
          z-index: 10;
        ">📍</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });

interface FlyToProps {
  city: City | null;
}

function FlyToCity({ city }: FlyToProps) {
  const map = useMap();
  useEffect(() => {
    if (city) {
      map.flyTo([city.lat, city.lng], 12, { duration: 1.5 });
    }
  }, [city, map]);
  return null;
}

interface MapViewProps {
  selectedCity: City | null;
  onCityClick: (city: City) => void;
}

export default function MapView({ selectedCity, onCityClick }: MapViewProps) {
  const handleMapClick = async (lat: number, lng: number) => {
    const city = await reverseGeocode(lat, lng);
    if (city) {
      onCityClick(city);
    }
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      className="w-full h-full"
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={handleMapClick} />
      <FlyToCity city={selectedCity} />
      {selectedCity && (
        <Marker
          position={[selectedCity.lat, selectedCity.lng]}
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="text-center font-semibold">
              {selectedCity.name}, {selectedCity.country}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  const map = useMap();
  const handlerRef = useRef(onMapClick);
  handlerRef.current = onMapClick;

  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      handlerRef.current(e.latlng.lat, e.latlng.lng);
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map]);

  return null;
}

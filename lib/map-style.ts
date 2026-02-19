import type { StyleSpecification } from "maplibre-gl";

// ItinerAI custom dark map style
// Uses OpenFreeMap vector tiles with design system palette

const DS = {
  bg:         "#07111C",  // slightly deeper than deep-navy for ocean contrast
  land:       "#0A1931",  // deep-navy — land areas
  landAlt:    "#0C1E35",  // slight variation for parks / landcover
  water:      "#040B14",  // very dark water
  oceanMid:   "#1A3D63",  // roads, selected areas
  skyAccent:  "#4A7FA7",
  mist:       "#B3CFE5",
  border:     "rgba(179,207,229,0.18)",  // country borders
  borderFaint:"rgba(179,207,229,0.07)",  // state borders
  roadMajor:  "#152A42",
  roadMinor:  "#0E1F30",
  labelCountry: "rgba(179,207,229,0.75)",
  labelCity:    "rgba(179,207,229,0.85)",
  labelMuted:   "rgba(179,207,229,0.45)",
  labelWater:   "rgba(74,127,167,0.55)",
  halo:       "rgba(4,11,20,0.85)",
};

const FONT = ["Noto Sans Regular"];
const FONT_BOLD = ["Noto Sans Bold"];

export const itineraiMapStyle: StyleSpecification = {
  version: 8,
  name: "ItinerAI Dark",
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sprite: "https://tiles.openfreemap.org/sprites/liberty/sprites",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  layers: [

    // ── Background ──────────────────────────────────────
    {
      id: "background",
      type: "background",
      paint: { "background-color": DS.bg },
    },

    // ── Water ────────────────────────────────────────────
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: { "fill-color": DS.water },
    },
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      minzoom: 9,
      paint: {
        "line-color": DS.water,
        "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.5, 14, 2],
      },
    },

    // ── Landcover / Land use ─────────────────────────────
    {
      id: "landcover-grass",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["in", "class", "grass", "scrub", "wood", "forest"],
      paint: { "fill-color": "#091828", "fill-opacity": 0.8 },
    },
    {
      id: "landcover-sand",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["in", "class", "sand", "rock", "ice"],
      paint: { "fill-color": "#0C1E35", "fill-opacity": 0.6 },
    },
    {
      id: "landuse-residential",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["in", "class", "residential", "suburb"],
      minzoom: 10,
      paint: { "fill-color": "#0C1E35", "fill-opacity": 0.5 },
    },
    {
      id: "landuse-commercial",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["in", "class", "commercial", "industrial"],
      minzoom: 11,
      paint: { "fill-color": "#0F2240", "fill-opacity": 0.6 },
    },
    {
      id: "landuse-park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["in", "class", "park", "pitch", "recreation_ground", "village_green", "garden"],
      minzoom: 10,
      paint: { "fill-color": "#081624", "fill-opacity": 0.8 },
    },

    // ── National parks ───────────────────────────────────
    {
      id: "park-fill",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": "#081624", "fill-opacity": 0.5 },
    },

    // ── Boundaries ───────────────────────────────────────
    {
      id: "boundary-state",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["all", [">=", "admin_level", 4], ["!has", "claimed_by"]],
      minzoom: 4,
      paint: {
        "line-color": DS.borderFaint,
        "line-width": 0.6,
        "line-dasharray": [4, 3],
      },
    },
    {
      id: "boundary-country-outline",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["==", "admin_level", 2],
      paint: {
        "line-color": "rgba(179,207,229,0.06)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 2, 2, 8, 5],
        "line-blur": 2,
      },
    },
    {
      id: "boundary-country",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: ["==", "admin_level", 2],
      paint: {
        "line-color": DS.border,
        "line-width": ["interpolate", ["linear"], ["zoom"], 2, 0.4, 8, 1.2],
      },
    },

    // ── Roads ────────────────────────────────────────────
    {
      id: "road-motorway-casing",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["==", "class", "motorway"],
      minzoom: 8,
      layout: { "line-cap": "round" },
      paint: {
        "line-color": "#0A1931",
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2, 14, 6],
      },
    },
    {
      id: "road-motorway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["==", "class", "motorway"],
      minzoom: 8,
      layout: { "line-cap": "round" },
      paint: {
        "line-color": DS.roadMajor,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 14, 4],
      },
    },
    {
      id: "road-primary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", "class", "primary", "trunk"],
      minzoom: 9,
      layout: { "line-cap": "round" },
      paint: {
        "line-color": DS.roadMajor,
        "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.5, 14, 2.5],
      },
    },
    {
      id: "road-secondary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", "class", "secondary", "tertiary"],
      minzoom: 11,
      layout: { "line-cap": "round" },
      paint: {
        "line-color": DS.roadMinor,
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.3, 14, 1.5],
      },
    },
    {
      id: "road-minor",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", "class", "minor", "service"],
      minzoom: 13,
      paint: {
        "line-color": DS.roadMinor,
        "line-width": ["interpolate", ["linear"], ["zoom"], 13, 0.3, 16, 1],
      },
    },

    // ── Buildings ────────────────────────────────────────
    {
      id: "building",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "building",
      minzoom: 14,
      paint: {
        "fill-color": "#0F2240",
        "fill-opacity": 0.8,
        "fill-outline-color": "rgba(179,207,229,0.06)",
      },
    },

    // ── Labels: Water ────────────────────────────────────
    {
      id: "label-water",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "water_name",
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT,
        "text-size": 11,
        "text-letter-spacing": 0.12,
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": DS.labelWater,
        "text-halo-color": DS.halo,
        "text-halo-width": 1,
      },
    },

    // ── Labels: Countries ────────────────────────────────
    {
      id: "label-country",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", "class", "country"],
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT_BOLD,
        "text-size": ["interpolate", ["linear"], ["zoom"], 2, 10, 5, 13, 8, 16],
        "text-letter-spacing": 0.1,
        "text-transform": "uppercase",
        "text-max-width": 8,
      },
      paint: {
        "text-color": DS.labelCountry,
        "text-halo-color": DS.halo,
        "text-halo-width": 1.5,
        "text-opacity": ["interpolate", ["linear"], ["zoom"], 1, 0.8, 6, 1],
      },
    },

    // ── Labels: States / Provinces ───────────────────────
    {
      id: "label-state",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", "class", "state"],
      minzoom: 5,
      maxzoom: 10,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT,
        "text-size": ["interpolate", ["linear"], ["zoom"], 5, 9, 9, 12],
        "text-letter-spacing": 0.07,
        "text-transform": "uppercase",
        "text-max-width": 6,
      },
      paint: {
        "text-color": DS.labelMuted,
        "text-halo-color": DS.halo,
        "text-halo-width": 1,
      },
    },

    // ── Labels: Capitals ─────────────────────────────────
    {
      id: "label-capital",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", "capital", 2],
      minzoom: 3,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT_BOLD,
        "text-size": ["interpolate", ["linear"], ["zoom"], 3, 10, 8, 14],
        "text-anchor": "bottom",
        "text-offset": [0, -0.3],
      },
      paint: {
        "text-color": "#B3CFE5",
        "text-halo-color": DS.halo,
        "text-halo-width": 1.5,
      },
    },

    // ── Labels: Cities ───────────────────────────────────
    {
      id: "label-city",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["==", "class", "city"],
      minzoom: 5,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT,
        "text-size": ["interpolate", ["linear"], ["zoom"], 5, 10, 10, 14],
        "text-max-width": 8,
      },
      paint: {
        "text-color": DS.labelCity,
        "text-halo-color": DS.halo,
        "text-halo-width": 1.5,
      },
    },

    // ── Labels: Towns ────────────────────────────────────
    {
      id: "label-town",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["in", "class", "town", "village"],
      minzoom: 9,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT,
        "text-size": ["interpolate", ["linear"], ["zoom"], 9, 10, 14, 13],
      },
      paint: {
        "text-color": "rgba(179,207,229,0.6)",
        "text-halo-color": DS.halo,
        "text-halo-width": 1,
      },
    },

    // ── Labels: Neighbourhoods ───────────────────────────
    {
      id: "label-suburb",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["in", "class", "suburb", "neighbourhood", "quarter"],
      minzoom: 13,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT,
        "text-size": 11,
        "text-letter-spacing": 0.04,
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "rgba(179,207,229,0.4)",
        "text-halo-color": DS.halo,
        "text-halo-width": 1,
      },
    },

    // ── Labels: Road names ───────────────────────────────
    {
      id: "label-road",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "transportation_name",
      filter: ["in", "class", "motorway", "primary", "secondary"],
      minzoom: 12,
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": FONT,
        "text-size": 10,
        "symbol-placement": "line",
        "text-max-angle": 30,
      },
      paint: {
        "text-color": "rgba(74,127,167,0.5)",
        "text-halo-color": DS.halo,
        "text-halo-width": 1,
      },
    },
  ],
};

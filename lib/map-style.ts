import type { StyleSpecification } from "maplibre-gl";

// ItinerAI map style — DS palette, lighter tone
// Core DS: deep-navy #0A1931 | ocean-mid #1A3D63 | sky-accent #4A7FA7 | mist #B3CFE5

const DS = {
  bg:         "#2d516c",  // DS sky-accent — oceano
  land:       "#5C8FA8",  // terra — azul médio-escuro
  landAlt:    "#4F849E",  // variação levemente mais escura
  water:      "#0A1931",  // very dark water
  oceanMid:   "#1A3D63",
  skyAccent:  "#4A7FA7",
  mist:       "#B3CFE5",
  border:     "rgba(10,25,49,0.28)",   // deep-navy suave
  borderFaint:"rgba(10,25,49,0.10)",
  roadMajor:  "#7EAABF",
  roadMinor:  "#8EB8CC",
  labelCountry: "rgba(240,250,255,0.92)", // claro p/ leitura em fundo mais escuro
  labelCity:    "rgba(240,250,255,0.95)",
  labelMuted:   "rgba(200,228,245,0.75)",
  labelWater:   "rgba(200,228,245,0.70)",
  halo:       "rgba(45,81,108,0.45)",
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
      paint: { "fill-color": "#3A6A88", "fill-opacity": 0.75 },
    },
    {
      id: "landcover-sand",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["in", "class", "sand", "rock", "ice"],
      paint: { "fill-color": "#e0dedc", "fill-opacity": 0.6 },
    },
    {
      id: "landuse-residential",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["in", "class", "residential", "suburb"],
      minzoom: 10,
      paint: { "fill-color": "#4F849E", "fill-opacity": 0.5 },
    },
    {
      id: "landuse-commercial",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["in", "class", "commercial", "industrial"],
      minzoom: 11,
      paint: { "fill-color": "#487898", "fill-opacity": 0.6 },
    },
    {
      id: "landuse-park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: ["in", "class", "park", "pitch", "recreation_ground", "village_green", "garden"],
      minzoom: 10,
      paint: { "fill-color": "#3A6A88", "fill-opacity": 0.75 },
    },

    // ── National parks ───────────────────────────────────
    {
      id: "park-fill",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": "#3A6A88", "fill-opacity": 0.5 },
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
        "line-color": "rgba(50,90,130,0.08)",
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
        "line-color": "#5C8FA8",
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
        "fill-color": "#507A92",
        "fill-opacity": 0.75,
        "fill-outline-color": "rgba(10,25,49,0.12)",
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
        "text-color": "#E8F4FF",
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
        "text-color": "rgba(220,240,255,0.80)",
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
        "text-color": "rgba(200,228,245,0.65)",
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
        "text-color": "rgba(200,228,245,0.70)",
        "text-halo-color": DS.halo,
        "text-halo-width": 1,
      },
    },
  ],
};

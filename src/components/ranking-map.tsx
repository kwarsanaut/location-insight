"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { RANK_COLORS, UNRANKED_FILL, UNRANKED_BORDER, MAP_CENTER, MAP_ZOOM, TOP_N } from "@/lib/constants";
import type { DistrictRanking } from "@/lib/types";
import { formatCompact, polygonCenter } from "@/lib/utils";

import "leaflet/dist/leaflet.css";

interface RankingMapProps {
  rankings: DistrictRanking[];
  selectedKey: string | null;
  onDistrictClick: (key: string) => void;
  onDistrictHover: (district: DistrictRanking | null) => void;
  isAdmin?: boolean;
}

/* ── Numbered circle icon ──────────────────────── */
function makeNumberIcon(rank: number) {
  return L.divIcon({
    html: `<div style="
      font-size:12px;font-weight:700;color:#fff;
      background:#1a5c38;border:2px solid #fff;
      border-radius:50%;width:26px;height:26px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.45);
    ">${rank}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    className: "",
  });
}

/* ── Reset-view button control ─────────────────── */
function ResetViewButton() {
  const map = useMap();
  const handleReset = useCallback(() => {
    map.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 0.8 });
  }, [map]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: 10, marginRight: 10 }}>
      <div className="leaflet-control">
        <button
          onClick={handleReset}
          className="bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors"
          title="Reset view"
          style={{ cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Fly to district on click ──────────────────── */
function FlyToDistrict({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8, maxZoom: 14 });
    }
  }, [map, bounds]);
  return null;
}

/* ── Reset map view when rankings change ───────── */
function ResetOnNewRankings({ rankingsKey }: { rankingsKey: string }) {
  const map = useMap();
  const prevKey = useRef(rankingsKey);
  useEffect(() => {
    if (prevKey.current !== rankingsKey && rankingsKey) {
      map.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 0.6 });
    }
    prevKey.current = rankingsKey;
  }, [map, rankingsKey]);
  return null;
}

/* ── Main map component ────────────────────────── */
export function RankingMap({ rankings, selectedKey, onDistrictClick, onDistrictHover, isAdmin = false }: RankingMapProps) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [flyBounds, setFlyBounds] = useState<L.LatLngBounds | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const highlightedRef = useRef<L.Path | null>(null);

  useEffect(() => {
    fetch("/jabodetabek.geojson")
      .then((r) => r.json())
      .then((data: FeatureCollection) => setGeojson(data));
  }, []);

  // Reset flyBounds and highlight when rankings change (new search)
  useEffect(() => {
    setFlyBounds(null);
    highlightedRef.current = null;
  }, [rankings]);

  // For non-admin: only the top 3 of the countdown (ranks N, N-1, N-2) are visible
  const minVisibleRank = isAdmin ? 1 : Math.max(1, rankings.length - 2);
  const visibleRankings = rankings.filter((r) => r.rank >= minVisibleRank);

  const lookup = new Map<string, DistrictRanking>();
  for (const r of visibleRankings) {
    lookup.set(r.key, r);
  }

  const styleFeature = useCallback((feature: Feature | undefined) => {
    if (!feature) return {};
    const name3 = (feature.properties?.NAME_3 ?? "").toLowerCase().replace(/\s/g, "");
    const entry = lookup.get(name3);
    const isSelected = name3 === selectedKey;

    if (entry && entry.rank >= 1 && entry.rank <= TOP_N) {
      return {
        fillColor: RANK_COLORS[entry.rank - 1],
        color: isSelected ? "#059669" : "rgba(255,255,255,0.8)",
        weight: isSelected ? 3 : 1.5,
        fillOpacity: isSelected ? 0.85 : 0.7,
      };
    }
    return {
      fillColor: UNRANKED_FILL,
      color: UNRANKED_BORDER,
      weight: 0.5,
      fillOpacity: 0.25,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankings, selectedKey]);

  const onEachFeature = useCallback((feature: Feature, layer: L.Layer) => {
    const name3 = (feature.properties?.NAME_3 ?? "").toLowerCase().replace(/\s/g, "");
    const entry = lookup.get(name3);
    const path = layer as L.Path;

    path.on({
      mouseover: (e) => {
        // Reset previously highlighted layer first (prevents stuck hover styles)
        if (highlightedRef.current && highlightedRef.current !== e.target) {
          geoJsonRef.current?.resetStyle(highlightedRef.current);
        }

        const target = e.target as L.Path;
        target.setStyle({ fillOpacity: 0.9, weight: 3, color: "#059669" });
        target.bringToFront();
        highlightedRef.current = target;

        if (entry) {
          onDistrictHover(entry);
        }
      },
      mouseout: (e) => {
        geoJsonRef.current?.resetStyle(e.target as L.Path);
        if (highlightedRef.current === e.target) {
          highlightedRef.current = null;
        }
        onDistrictHover(null);
      },
      click: () => {
        if (entry && entry.rank >= 1 && entry.rank <= TOP_N) {
          onDistrictClick(entry.key);
          const bounds = (layer as L.Polygon).getBounds();
          setFlyBounds(bounds);
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankings, selectedKey]);

  if (!geojson) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="skeleton w-12 h-12 rounded-full mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Pre-compute markers — deduplicate by district key, only for visible rankings
  const seenKeys = new Set<string>();
  const markerData: { rank: number; key: string; lat: number; lng: number; district: string }[] = [];
  for (const feature of geojson.features) {
    const name3 = (feature.properties?.NAME_3 ?? "").toLowerCase().replace(/\s/g, "");
    if (seenKeys.has(name3)) continue;
    const entry = lookup.get(name3);
    if (entry && entry.rank >= 1 && entry.rank <= TOP_N) {
      const geom = feature.geometry as { coordinates: number[][][][] };
      const [lat, lng] = polygonCenter(geom.coordinates);
      markerData.push({ rank: entry.rank, key: entry.key, lat, lng, district: entry.district });
      seenKeys.add(name3);
    }
  }

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className="h-full w-full"
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        key={rankings.map((r) => r.key).join(",") + (selectedKey ?? "") + String(isAdmin)}
        ref={geoJsonRef as React.Ref<L.GeoJSON>}
        data={geojson}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />

      {/* Rank number markers */}
      {markerData.map((m) => (
        <Marker
          key={m.key}
          position={[m.lat, m.lng]}
          icon={makeNumberIcon(m.rank)}
          eventHandlers={{ click: () => onDistrictClick(m.key) }}
        >
          <Tooltip direction="top" offset={[0, -14]}>
            <span className="font-semibold">#{m.rank} {m.district}</span>
            <br />
            <span className="text-xs">{formatCompact(visibleRankings.find((r) => r.rank === m.rank)?.pred_mean ?? 0)}</span>
          </Tooltip>
        </Marker>
      ))}

      <FlyToDistrict bounds={flyBounds} />
      <ResetOnNewRankings rankingsKey={rankings.map((r) => r.key).join(",")} />
      <ResetViewButton />
    </MapContainer>
  );
}

"use client";

import { RANK_COLORS, UNRANKED_FILL } from "@/lib/constants";

export function MapLegend() {
  return (
    <div className="map-legend">
      <div className="legend-title">District Ranking</div>
      {RANK_COLORS.map((color, i) => (
        <div key={i} className="legend-row">
          <div className="legend-swatch" style={{ backgroundColor: color }} />
          <span>#{i + 1}</span>
        </div>
      ))}
      <div className="legend-row mt-1">
        <div className="legend-swatch" style={{ backgroundColor: UNRANKED_FILL }} />
        <span className="text-muted-foreground">Unranked</span>
      </div>
    </div>
  );
}

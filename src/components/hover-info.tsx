"use client";

import type { DistrictRanking } from "@/lib/types";
import { formatCompact, formatGtvRange } from "@/lib/utils";
import { RANK_COLORS } from "@/lib/constants";

interface HoverInfoProps {
  district: DistrictRanking | null;
}

export function HoverInfo({ district }: HoverInfoProps) {
  if (!district) {
    return (
      <div className="hover-info" style={{ opacity: 0.6 }}>
        <p className="text-xs text-muted-foreground">Hover over a ranked district</p>
      </div>
    );
  }

  return (
    <div className="hover-info">
      <div className="flex items-center gap-2 mb-1.5">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            backgroundColor: RANK_COLORS[district.rank - 1] ?? "#e8e8e8",
            color: district.rank <= 5 ? "#fff" : "#1a1a1a",
          }}
        >
          {district.rank}
        </div>
        <h4>{district.district}</h4>
      </div>
      <div className="info-row">
        <span className="info-label">Revenue</span>
        <span className="info-value">{formatCompact(district.pred_mean)}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Branches</span>
        <span className="info-value">{district.branches}</span>
      </div>
      <div className="info-row">
        <span className="info-label">GTV Range</span>
        <span className="info-value">{formatGtvRange(district.gtv)}</span>
      </div>
    </div>
  );
}

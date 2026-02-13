"use client";

import { RANK_COLORS } from "@/lib/constants";
import type { DistrictRanking } from "@/lib/types";
import { formatRupiah, formatCompact, formatGtvRange } from "@/lib/utils";

interface DetailPanelProps {
  district: DistrictRanking;
  maxRevenue: number;
  onClose: () => void;
}

export function DetailPanel({ district, maxRevenue, onClose }: DetailPanelProps) {
  const revPct = Math.round((district.pred_mean / maxRevenue) * 100);

  return (
    <div className="h-full flex flex-col bg-white shadow-2xl border-l">
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0"
            style={{
              backgroundColor: RANK_COLORS[district.rank - 1] ?? "#e8e8e8",
              color: district.rank <= 5 ? "#fff" : "#1a1a1a",
            }}
          >
            {district.rank}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg leading-tight truncate">{district.district}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rank #{district.rank} &middot; {district.branches} existing branches
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors shrink-0"
          aria-label="Close panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-5">
        {/* Predicted Revenue */}
        <div className="animate-fade-in-up">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
            Predicted Avg Revenue
          </p>
          <p className="text-2xl font-bold tabular-nums">{formatRupiah(district.pred_mean)}</p>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>vs. Top District</span>
              <span>{revPct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${revPct}%`,
                  backgroundColor: RANK_COLORS[district.rank - 1] ?? "#e8e8e8",
                }}
              />
            </div>
          </div>
        </div>

        {/* GTV Range */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
            GTV Range
          </p>
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-xl font-bold text-emerald-900 tabular-nums">
              {formatGtvRange(district.gtv)}
            </p>
            <div className="mt-3 relative h-3 bg-emerald-100 rounded-full overflow-hidden">
              {/* Range bar from low% to ambisius% */}
              <div
                className="absolute h-full rounded-full transition-all duration-700"
                style={{
                  left: `${Math.round((district.gtv.low / district.gtv.ambisius) * 100) - 5}%`,
                  right: "0%",
                  backgroundColor: "#059669",
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-emerald-700 mt-1.5">
              <span>Low ({formatCompact(district.gtv.low)})</span>
              <span>Ambisius ({formatCompact(district.gtv.ambisius)})</span>
            </div>
          </div>
        </div>

        {/* AOV */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
            Avg Order Value
          </p>
          <p className="text-lg font-bold tabular-nums">{formatRupiah(district.aov)}</p>
        </div>

        {/* Detailed Breakdown */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
            Summary
          </p>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Predicted Revenue</span>
              <span className="font-medium tabular-nums">{formatRupiah(district.pred_mean)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Order Value</span>
              <span className="font-medium tabular-nums">{formatRupiah(district.aov)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Existing Branches</span>
              <span className="font-medium">{district.branches}</span>
            </div>
            <hr className="my-1" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">GTV Range</span>
              <span className="font-medium tabular-nums">{formatGtvRange(district.gtv)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

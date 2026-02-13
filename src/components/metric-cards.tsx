"use client";

import type { DistrictRanking } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

interface MetricCardsProps {
  best: DistrictRanking;
  totalDistricts: number;
}

export function MetricCards({ best, totalDistricts }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 animate-fade-in-up">
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">#1 District</p>
        <p className="text-sm font-bold text-emerald-900 mt-0.5 truncate">{best.district}</p>
      </div>
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">Predicted Rev</p>
        <p className="text-sm font-bold text-emerald-900 mt-0.5 tabular-nums">{formatCompact(best.pred_mean)}</p>
      </div>
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">GTV Ambisius</p>
        <p className="text-sm font-bold text-emerald-900 mt-0.5 tabular-nums">{formatCompact(best.gtv.ambisius)}</p>
      </div>
      <div className="bg-emerald-50 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">Districts</p>
        <p className="text-sm font-bold text-emerald-900 mt-0.5">{totalDistricts} analyzed</p>
      </div>
    </div>
  );
}

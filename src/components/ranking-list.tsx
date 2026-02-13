"use client";

import { RANK_COLORS } from "@/lib/constants";
import type { DistrictRanking } from "@/lib/types";
import { formatCompact, formatGtvRange } from "@/lib/utils";

interface RankingListProps {
  rankings: DistrictRanking[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export function RankingList({ rankings, selectedKey, onSelect }: RankingListProps) {
  const maxRev = rankings[0]?.pred_mean ?? 1;

  return (
    <div className="space-y-0.5">
      {rankings.map((r) => {
        const pct = Math.round((r.pred_mean / maxRev) * 100);
        const isActive = r.key === selectedKey;

        return (
          <div
            key={r.key}
            className={`rank-item rounded-md px-3 py-2.5 ${isActive ? "active" : ""}`}
            onClick={() => onSelect(r.key)}
          >
            <div className="flex items-center gap-2.5">
              {/* Rank badge */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{
                  backgroundColor: RANK_COLORS[r.rank - 1] ?? "#e8e8e8",
                  color: r.rank <= 5 ? "#fff" : "#1a1a1a",
                }}
              >
                {r.rank}
              </div>

              {/* District info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold truncate">{r.district}</span>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {formatCompact(r.pred_mean)}
                  </span>
                </div>

                {/* Revenue bar */}
                <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="revenue-bar h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: RANK_COLORS[r.rank - 1] ?? "#e8e8e8",
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {r.branches} branches
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {formatGtvRange(r.gtv)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

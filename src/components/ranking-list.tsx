"use client";

import { RANK_COLORS } from "@/lib/constants";
import type { DistrictRanking } from "@/lib/types";
import { formatCompact, formatGtvRange } from "@/lib/utils";

interface RankingListProps {
  rankings: DistrictRanking[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  isAdmin?: boolean;
}

export function RankingList({ rankings, selectedKey, onSelect, isAdmin = false }: RankingListProps) {
  // maxRev always from rank #1 (highest revenue)
  const maxRev = rankings[0]?.pred_mean ?? 1;

  // Display countdown: rank N at top → rank 1 at bottom
  const displayed = [...rankings].reverse();
  // Top 3 of the countdown = ranks N, N-1, N-2 (highest rank numbers)
  const minVisibleRank = Math.max(1, rankings.length - 2);

  return (
    <div className="space-y-0.5">
      {displayed.map((r) => {
        const pct = Math.round((r.pred_mean / maxRev) * 100);
        const isActive = r.key === selectedKey;
        const isLocked = !isAdmin && r.rank < minVisibleRank;

        return (
          <div
            key={r.key}
            className={`rank-item rounded-md px-3 py-2.5 relative ${isActive && !isLocked ? "active" : ""}`}
            onClick={() => !isLocked && onSelect(r.key)}
            style={{ cursor: isLocked ? "default" : "pointer" }}
          >
            {/* Blur + admin-only overlay */}
            {isLocked && (
              <div
                className="absolute inset-0 rounded-md z-10 flex items-center justify-end pr-3"
                style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(255,255,255,0.45)" }}
              >
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Admin only
                </span>
              </div>
            )}

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
                    {r.branches} similar branch
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    AOV {formatCompact(r.aov).replace("M", "K")}
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

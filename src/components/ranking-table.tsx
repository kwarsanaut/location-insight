"use client";

import { Badge } from "@/components/ui/badge";
import { RANK_COLORS } from "@/lib/constants";
import type { DistrictRanking } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

interface RankingTableProps {
  rankings: DistrictRanking[];
}

export function RankingTable({ rankings }: RankingTableProps) {
  return (
    <div className="overflow-auto max-h-[520px] border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-muted sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left">Rank</th>
            <th className="px-3 py-2 text-left">Kecamatan</th>
            <th className="px-3 py-2 text-right">Branches</th>
            <th className="px-3 py-2 text-right">Predicted Avg</th>
            <th className="px-3 py-2 text-right">GTV Low</th>
            <th className="px-3 py-2 text-right">GTV Mid</th>
            <th className="px-3 py-2 text-right">GTV High</th>
            <th className="px-3 py-2 text-right">GTV Ambisius</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r) => (
            <tr key={r.rank} className="border-t hover:bg-muted/50">
              <td className="px-3 py-2">
                <Badge
                  style={{
                    backgroundColor: RANK_COLORS[r.rank - 1] ?? "#e8e8e8",
                    color: r.rank <= 5 ? "#fff" : "#333",
                  }}
                >
                  #{r.rank}
                </Badge>
              </td>
              <td className="px-3 py-2 font-medium">{r.district}</td>
              <td className="px-3 py-2 text-right">{r.branches}</td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(r.pred_mean)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(r.gtv.low)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(r.gtv.mid)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(r.gtv.high)}
              </td>
              <td className="px-3 py-2 text-right">
                {formatRupiah(r.gtv.ambisius)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

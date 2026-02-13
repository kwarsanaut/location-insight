export interface GtvRange {
  low: number;
  mid: number;
  high: number;
  ambisius: number;
}

export interface DistrictRanking {
  rank: number;
  district: string;
  key: string;
  branches: number;
  pred_mean: number;
  aov: number;
  gtv: GtvRange;
  subdistricts: string[];
}

export interface RankingResponse {
  category: string;
  city: string;
  rankings: DistrictRanking[];
}
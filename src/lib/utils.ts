import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(value: number): string {
  return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${value}`;
}

import type { GtvRange } from "./types";

export function formatGtvRange(gtv: GtvRange): string {
  return `${formatCompact(gtv.low)} - ${formatCompact(gtv.ambisius)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function polygonCenter(coords: any): [number, number] {
  let ring = coords;
  while (ring.length && Array.isArray(ring[0]) && Array.isArray(ring[0][0])) {
    ring = ring[0];
  }
  const lngs = (ring as number[][]).map((p: number[]) => p[0]);
  const lats = (ring as number[][]).map((p: number[]) => p[1]);
  return [
    lats.reduce((a: number, b: number) => a + b, 0) / lats.length,
    lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length,
  ];
}

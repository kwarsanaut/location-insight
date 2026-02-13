import type { RankingResponse } from "./types";

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchCities(): Promise<string[]> {
  const res = await fetch("/api/cities");
  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
}

export async function fetchDistricts(): Promise<string[]> {
  const res = await fetch("/api/districts");
  if (!res.ok) throw new Error("Failed to fetch districts");
  return res.json();
}

export async function fetchRankings(
  category: string,
  city: string,
  excludeDistricts: string[] = []
): Promise<RankingResponse> {
  const res = await fetch("/api/rankings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category,
      city,
      exclude_districts: excludeDistricts,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

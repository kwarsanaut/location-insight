"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchCategories, fetchCities, fetchDistricts, fetchRankings } from "@/lib/api";
import type { DistrictRanking } from "@/lib/types";
import { SearchForm } from "@/components/search-form";
import { LogoutButton } from "@/components/logout-button";
import { MetricCards } from "@/components/metric-cards";
import { RankingList } from "@/components/ranking-list";
import { DetailPanel } from "@/components/detail-panel";
import { MapLegend } from "@/components/map-legend";
import { HoverInfo } from "@/components/hover-info";
import { ModeSelector } from "@/components/mode-selector";
import { ExistingBrandForm } from "@/components/existing-brand-form";

const RankingMap = dynamic(
  () => import("@/components/ranking-map").then((m) => m.RankingMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="skeleton w-12 h-12 rounded-full mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

type Mode = "new" | "existing" | null;

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [rankings, setRankings] = useState<DistrictRanking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState({ category: "", city: "" });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictRanking | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Mode state
  const [mode, setMode] = useState<Mode>(null);

  // Existing-brand state
  const [brandName, setBrandName] = useState<string | null>(null);
  const [excludeDistricts, setExcludeDistricts] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchCities(),
      fetchDistricts().catch(() => [] as string[]),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => ({ role: "user" })),
    ]).then(([cats, cits, dists, me]) => {
      setCategories(cats);
      setCities(cits);
      setAllDistricts(dists);
      setIsAdmin((me as { role: string }).role === "admin");
    });
  }, []);

  async function handleSearch(category: string, city: string) {
    setLoading(true);
    setError(null);
    setSelectedKey(null);
    try {
      const res = await fetchRankings(
        category,
        city,
        mode === "existing" ? excludeDistricts : []
      );
      setRankings(res.rankings);
      setLabel({ category, city });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setRankings(null);
    } finally {
      setLoading(false);
    }
  }

  function handleBrandConfirm(name: string, districts: string[]) {
    setBrandName(name);
    setExcludeDistricts(districts);
  }

  function handleStartOver() {
    setMode(null);
    setRankings(null);
    setSelectedKey(null);
    setError(null);
    setBrandName(null);
    setExcludeDistricts([]);
    setLabel({ category: "", city: "" });
  }

  const handleDistrictClick = useCallback((key: string) => {
    setSelectedKey((prev) => (prev === key ? null : key));
  }, []);

  const handleDistrictHover = useCallback((district: DistrictRanking | null) => {
    setHoveredDistrict(district);
  }, []);

  const selectedDistrict = rankings?.find((r) => r.key === selectedKey) ?? null;
  const maxRevenue = rankings?.[0]?.pred_mean ?? 1;

  // In existing-brand mode, brand must be confirmed before showing search form
  const brandConfirmed = mode === "existing" && brandName !== null;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* -- Left Sidebar -- */}
      <aside
        className={`sidebar-panel relative z-20 flex flex-col bg-white border-r shadow-lg ${
          sidebarOpen ? "w-[360px]" : "w-0"
        } overflow-hidden shrink-0`}
        style={{ minWidth: sidebarOpen ? 360 : 0 }}
      >
        {/* Brand header */}
        <div className="px-5 py-4 border-b bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Location Insight</h1>
              <p className="text-emerald-100 text-xs mt-0.5">
                Find the best district for your next branch
              </p>
            </div>
            <div className="flex items-center gap-3">
              {mode !== null && (
                <button
                  onClick={handleStartOver}
                  className="text-emerald-200 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Start Over
                </button>
              )}
              <LogoutButton />
            </div>
          </div>
          {mode !== null && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                mode === "new"
                  ? "bg-emerald-500/30 text-emerald-100"
                  : "bg-amber-500/30 text-amber-100"
              }`}>
                {mode === "new" ? "New Brand" : "Existing Brand"}
              </span>
              {brandConfirmed && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white">
                  {brandName}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* --- Mode selection --- */}
          {mode === null && (
            <ModeSelector onSelect={setMode} />
          )}

          {/* --- New Brand mode: just the search form --- */}
          {mode === "new" && (
            <div className="px-5 py-4 border-b">
              {categories.length > 0 ? (
                <SearchForm
                  categories={categories}
                  cities={cities}
                  loading={loading}
                  onSearch={handleSearch}
                />
              ) : (
                <div className="space-y-3">
                  <div className="skeleton h-9 w-full" />
                  <div className="skeleton h-9 w-full" />
                  <div className="skeleton h-9 w-full" />
                </div>
              )}
            </div>
          )}

          {/* --- Existing Brand mode --- */}
          {mode === "existing" && (
            <>
              {/* Step 1: Brand info + district selection (before confirm) */}
              {!brandConfirmed && (
                <div className="px-5 py-4 border-b">
                  <ExistingBrandForm
                    districts={allDistricts}
                    onConfirm={handleBrandConfirm}
                  />
                </div>
              )}

              {/* Step 2: After brand confirmed — show summary + search form */}
              {brandConfirmed && (
                <>
                  {/* Brand summary */}
                  <div className="px-5 py-3 border-b">
                    <div className="bg-amber-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
                        </svg>
                        <span className="text-xs font-semibold text-amber-800">{brandName}</span>
                      </div>
                      <p className="text-[11px] text-amber-700 mb-2">
                        Excluding {excludeDistricts.length} district{excludeDistricts.length !== 1 ? "s" : ""} from recommendations:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {excludeDistricts.map((d) => (
                          <span
                            key={d}
                            className="inline-block px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900 text-[10px] font-medium"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Search form */}
                  <div className="px-5 py-4 border-b">
                    {categories.length > 0 ? (
                      <SearchForm
                        categories={categories}
                        cities={cities}
                        loading={loading}
                        onSearch={handleSearch}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="skeleton h-9 w-full" />
                        <div className="skeleton h-9 w-full" />
                        <div className="skeleton h-9 w-full" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Error */}
          {error && (
            <div className="mx-5 mt-3 bg-red-50 text-red-700 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Results */}
          {rankings && rankings.length > 0 && (
            <>
              {/* Result header */}
              <div className="px-5 py-3 border-b bg-gray-50/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Results for
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  {label.category} &middot; {label.city === "All Cities" ? "All Cities" : label.city}
                </p>
              </div>

              {/* KPI cards */}
              <div className="px-5 py-3 border-b">
                <MetricCards best={rankings[0]} totalDistricts={rankings.length} />
              </div>

              {/* Ranking list */}
              <div className="px-3 py-2">
                <p className="px-2 mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Top {rankings.length} Districts
                </p>
                <RankingList
                  rankings={rankings}
                  selectedKey={selectedKey}
                  onSelect={handleDistrictClick}
                  isAdmin={isAdmin}
                />
              </div>
            </>
          )}

          {/* Empty state (only when mode is selected but no results yet) */}
          {mode !== null && (mode === "new" || brandConfirmed) && !rankings && !loading && !error && (
            <div className="px-5 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Select a category and city, then click
              </p>
              <p className="text-sm font-semibold mt-0.5">Find Best Locations</p>
            </div>
          )}
        </div>
      </aside>

      {/* -- Sidebar toggle -- */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 z-30 bg-white border shadow-md rounded-r-md px-1.5 py-3 hover:bg-gray-50 transition-all"
        style={{ left: sidebarOpen ? 360 : 0 }}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* -- Map area -- */}
      <div className="flex-1 relative">
        <RankingMap
          rankings={rankings ?? []}
          selectedKey={selectedKey}
          onDistrictClick={handleDistrictClick}
          onDistrictHover={handleDistrictHover}
          isAdmin={isAdmin}
        />

        {/* Hover info */}
        {rankings && rankings.length > 0 && (
          <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
            <HoverInfo district={hoveredDistrict} />
          </div>
        )}

        {/* Legend */}
        {rankings && rankings.length > 0 && (
          <div className="absolute bottom-8 right-4 z-[1000]">
            <MapLegend />
          </div>
        )}
      </div>

      {/* -- Right detail panel -- */}
      {selectedDistrict && (
        <div
          className={`detail-panel absolute top-0 right-0 z-30 h-full w-[380px] ${
            selectedDistrict ? "panel-visible" : "panel-hidden"
          }`}
        >
          <DetailPanel
            district={selectedDistrict}
            maxRevenue={maxRevenue}
            onClose={() => setSelectedKey(null)}
          />
        </div>
      )}
    </div>
  );
}

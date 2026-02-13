"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { fetchBrands, fetchCannibalism } from "@/lib/api";
import type { CannibResponse } from "@/lib/types";

interface BrandSearchProps {
  onResult: (data: CannibResponse | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export function BrandSearch({ onResult, loading, setLoading }: BrandSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    setSelectedBrand(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await fetchBrands(value);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
    }, 250);
  }

  function handleSelect(brand: string) {
    setQuery(brand);
    setSelectedBrand(brand);
    setShowDropdown(false);
    setSuggestions([]);
  }

  async function handleSearch() {
    const brand = selectedBrand || query;
    if (!brand) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCannibalism(brand);
      onResult(data);
    } catch (err) {
      onResult(null);
      setError(err instanceof Error ? err.message : "Brand not found");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQuery("");
    setSelectedBrand(null);
    setError(null);
    onResult(null);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
        Brand Check
      </label>
      <div ref={wrapperRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Search brand name..."
              className="w-full h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={loading || !query}
            onClick={handleSearch}
            className="shrink-0"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "Check"
            )}
          </Button>
        </div>

        {/* Dropdown suggestions */}
        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((brand) => (
              <button
                key={brand}
                onClick={() => handleSelect(brand)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 transition-colors truncate"
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <p className="text-[10px] text-muted-foreground">
        Check if your brand already has branches in ranked districts
      </p>
    </div>
  );
}

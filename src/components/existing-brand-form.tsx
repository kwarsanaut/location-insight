"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExistingBrandFormProps {
  districts: string[];
  onConfirm: (brandName: string, excludeDistricts: string[]) => void;
}

export function ExistingBrandForm({ districts, onConfirm }: ExistingBrandFormProps) {
  const [brandName, setBrandName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  function toggle(district: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(district)) {
        next.delete(district);
      } else {
        next.add(district);
      }
      return next;
    });
  }

  const filtered = filter
    ? districts.filter((d) => d.toLowerCase().includes(filter.toLowerCase()))
    : districts;

  return (
    <div className="space-y-4">
      {/* Brand name */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
          Your Brand Name
        </label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="e.g. Anomali Coffee"
          className="w-full h-9 rounded-md border border-input bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* District picker */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
          Districts where you already operate
        </label>

        {/* Selected chips */}
        {selected.size > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[...selected].map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-medium"
              >
                {d}
                <button
                  onClick={() => toggle(d)}
                  className="hover:text-amber-950 ml-0.5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search filter */}
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search districts..."
          className="w-full h-8 rounded-md border border-input bg-white px-3 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring mb-1.5"
        />

        {/* District list */}
        <div className="border rounded-md max-h-44 overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground p-3 text-center">No districts found</p>
          ) : (
            filtered.map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selected.has(d)}
                  onChange={() => toggle(d)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
                />
                <span className={selected.has(d) ? "font-medium text-amber-800" : ""}>{d}</span>
              </label>
            ))
          )}
        </div>

        <p className="text-[10px] text-muted-foreground mt-1">
          {selected.size} district{selected.size !== 1 ? "s" : ""} selected — these will be excluded from recommendations
        </p>
      </div>

      {/* Confirm */}
      <Button
        size="sm"
        className="w-full"
        disabled={!brandName.trim() || selected.size === 0}
        onClick={() => onConfirm(brandName.trim(), [...selected])}
      >
        Continue
      </Button>
    </div>
  );
}

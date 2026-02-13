"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface SearchFormProps {
  categories: string[];
  cities: string[];
  loading: boolean;
  onSearch: (category: string, city: string) => void;
}

export function SearchForm({
  categories,
  cities,
  loading,
  onSearch,
}: SearchFormProps) {
  const [category, setCategory] = useState(
    categories.includes("Japanese Food") ? "Japanese Food" : categories[0] ?? ""
  );
  const [city, setCity] = useState("All Cities");

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Category
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full bg-white text-sm">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
          City
        </label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full bg-white text-sm">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Cities">All Cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        disabled={loading || !category}
        onClick={() => onSearch(category, city)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </span>
        ) : (
          "Find Best Locations"
        )}
      </Button>
    </div>
  );
}

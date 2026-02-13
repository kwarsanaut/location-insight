"use client";

interface ModeSelectorProps {
  onSelect: (mode: "new" | "existing") => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="px-5 py-8 space-y-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <p className="text-sm font-semibold">How would you like to start?</p>
        <p className="text-xs text-muted-foreground mt-1">
          Choose a mode based on your expansion strategy
        </p>
      </div>

      {/* New Brand card */}
      <button
        onClick={() => onSelect("new")}
        className="w-full text-left rounded-xl border-2 border-transparent bg-white shadow-sm hover:border-emerald-500 hover:shadow-md transition-all p-4 group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:text-emerald-700 transition-colors">
              New Brand
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Find the best districts for a brand entering a new market. No existing branches to worry about.
            </p>
          </div>
        </div>
      </button>

      {/* Existing Brand card */}
      <button
        onClick={() => onSelect("existing")}
        className="w-full text-left rounded-xl border-2 border-transparent bg-white shadow-sm hover:border-amber-500 hover:shadow-md transition-all p-4 group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:text-amber-700 transition-colors">
              Existing Brand
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Expand an existing brand while avoiding cannibalization. Districts with existing branches are flagged.
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

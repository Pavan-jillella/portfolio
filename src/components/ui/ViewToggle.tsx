"use client";

export type ViewMode = "list" | "grid" | "table";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  modes?: ViewMode[];
}

const viewIcons: Record<ViewMode, JSX.Element> = {
  list: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  grid: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  table: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
};

export function ViewToggle({ viewMode, onChange, modes = ["list", "grid", "table"] }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === mode
              ? "bg-white/10 text-blue-400"
              : "text-white/30 hover:text-white/60"
          }`}
          title={mode.charAt(0).toUpperCase() + mode.slice(1) + " view"}
        >
          {viewIcons[mode]}
        </button>
      ))}
    </div>
  );
}

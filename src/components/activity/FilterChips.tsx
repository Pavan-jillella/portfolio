"use client";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "study", label: "Study" },
  { key: "blog", label: "Blog" },
  { key: "code", label: "Code" },
  { key: "project", label: "Projects" },
  { key: "note", label: "Notes" },
  { key: "course", label: "Courses" },
];

interface FilterChipsProps {
  active: string;
  onChange: (filter: string) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
            active === f.key
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-white/4 text-white/30 border border-white/5 hover:bg-white/6 hover:text-white/50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

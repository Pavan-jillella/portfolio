"use client";

const TYPE_ICONS: Record<string, string> = {
  blog: "B",
  note: "N",
  course: "C",
  project: "P",
};

const TYPE_COLORS: Record<string, string> = {
  blog: "text-purple-400 bg-purple-400/10",
  note: "text-pink-400 bg-pink-400/10",
  course: "text-cyan-400 bg-cyan-400/10",
  project: "text-amber-400 bg-amber-400/10",
};

interface SearchResultProps {
  type: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export function SearchResult({ type, title, description, isSelected, onClick }: SearchResultProps) {
  const icon = TYPE_ICONS[type] || "?";
  const color = TYPE_COLORS[type] || "text-white/40 bg-white/5";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
        isSelected ? "bg-white/6" : "hover:bg-white/4"
      }`}
    >
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${color}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-white truncate">{title}</p>
        <p className="font-body text-xs text-white/30 truncate">{description}</p>
      </div>
      <span className="font-mono text-[10px] text-white/15 capitalize">{type}</span>
    </button>
  );
}

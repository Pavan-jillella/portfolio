"use client";

interface DifficultyBarProps {
  easy: number;
  medium: number;
  hard: number;
}

export function DifficultyBar({ easy, medium, hard }: DifficultyBarProps) {
  const total = easy + medium + hard;
  if (total === 0) return null;

  const easyPct = (easy / total) * 100;
  const mediumPct = (medium / total) * 100;
  const hardPct = (hard / total) * 100;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Difficulty Breakdown</h3>

      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden h-4 mb-4">
        <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${easyPct}%` }} />
        <div className="bg-amber-500 h-full transition-all duration-700" style={{ width: `${mediumPct}%` }} />
        <div className="bg-red-500 h-full transition-all duration-700" style={{ width: `${hardPct}%` }} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="font-body text-xs text-white/60">Easy</span>
          <span className="font-mono text-xs text-white/30">{easy}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="font-body text-xs text-white/60">Medium</span>
          <span className="font-mono text-xs text-white/30">{medium}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="font-body text-xs text-white/60">Hard</span>
          <span className="font-mono text-xs text-white/30">{hard}</span>
        </div>
      </div>
    </div>
  );
}

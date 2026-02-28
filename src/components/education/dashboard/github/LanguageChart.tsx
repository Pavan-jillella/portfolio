"use client";
import { GitHubLanguageBreakdown } from "@/types";

interface LanguageChartProps {
  data: GitHubLanguageBreakdown[];
}

export function LanguageChart({ data }: LanguageChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return null;

  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const pct = d.count / total;
    const dashLength = pct * circumference;
    const dashOffset = -offset;
    offset += dashLength;
    return { ...d, pct, dashLength, dashOffset };
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Languages</h3>
      <div className="flex items-center gap-6">
        <svg width={size} height={size} className="shrink-0 -rotate-90">
          {segments.map((seg) => (
            <circle
              key={seg.language}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="flex flex-col gap-2 flex-1">
          {segments.map((seg) => (
            <div key={seg.language} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="font-body text-xs text-white/60 flex-1">{seg.language}</span>
              <span className="font-mono text-xs text-white/30">{seg.count}</span>
              <span className="font-mono text-[10px] text-white/20 w-10 text-right">
                {Math.round(seg.pct * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

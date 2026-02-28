"use client";

interface CommitTimelineProps {
  commits: { date: string; count: number }[];
}

export function CommitTimeline({ commits }: CommitTimelineProps) {
  if (commits.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-sm text-white mb-4">GitHub Commits</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">No commit data available</p>
      </div>
    );
  }

  const width = 500;
  const height = 200;
  const padding = 40;

  const maxCount = Math.max(...commits.map((c) => c.count), 1);

  const points = commits.map((c, i) => {
    const x = padding + ((width - 2 * padding) / (commits.length - 1 || 1)) * i;
    const y = padding + (height - 2 * padding) * (1 - c.count / maxCount);
    return { x, y, ...c };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-sm text-white mb-1">GitHub Commits</h3>
      <p className="font-body text-xs text-white/30 mb-4">Recent activity</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padding + (height - 2 * padding) * (1 - frac);
          return (
            <line key={frac} x1={padding} x2={width - padding} y1={y} y2={y} className="stroke-white/5" />
          );
        })}

        <path d={areaPath} className="fill-emerald-400/10" />
        <path d={linePath} fill="none" className="stroke-emerald-400" strokeWidth={2} />

        {points.map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r={2.5} className="fill-emerald-400" />
        ))}
      </svg>
    </div>
  );
}

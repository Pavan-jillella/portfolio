"use client";
import { useMemo } from "react";
import { PartTimeJob, PartTimeHourEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface PartTimeEarningsChartProps {
  jobs: PartTimeJob[];
  hours: PartTimeHourEntry[];
}

export function PartTimeEarningsChart({ jobs, hours }: PartTimeEarningsChartProps) {
  const { weeks, lines, maxValue } = useMemo(() => {
    const now = new Date();
    const activeJobs = jobs.filter((j) => j.active);
    const weekLabels: string[] = [];
    const weekRanges: { start: string; end: string }[] = [];

    for (let w = 7; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      weekLabels.push(`W${8 - w}`);
      weekRanges.push({
        start: weekStart.toISOString().slice(0, 10),
        end: weekEnd.toISOString().slice(0, 10),
      });
    }

    const lineData = activeJobs.map((job) => {
      const points = weekRanges.map((range) => {
        const earnings = hours
          .filter((e) => e.job_id === job.id && e.date >= range.start && e.date <= range.end)
          .reduce((s, e) => s + e.hours * job.hourly_rate, 0);
        return earnings;
      });
      return { jobId: job.id, name: job.name, color: job.color || "#8b5cf6", points };
    }).filter((l) => l.points.some((p) => p > 0));

    const mv = Math.max(...lineData.flatMap((l) => l.points), 1);

    return { weeks: weekLabels, lines: lineData, maxValue: mv };
  }, [jobs, hours]);

  if (lines.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Earnings</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No earnings data</p>
      </div>
    );
  }

  const chartWidth = 500;
  const chartHeight = 200;
  const pt = 20, pb = 28, pl = 50, pr = 15;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;

  const scaleX = (i: number) => {
    if (weeks.length <= 1) return pl + dw / 2;
    return pl + (i / (weeks.length - 1)) * dw;
  };
  const scaleY = (v: number) => pt + dh - (v / maxValue) * dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Earnings</h4>
      <Chart3DWrapper tiltX={6} tiltY={-3}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
          <defs>
            <filter id="ptEarnGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line key={frac} x1={pl} y1={scaleY(frac * maxValue)} x2={chartWidth - pr} y2={scaleY(frac * maxValue)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
          ))}

          {/* Y-axis */}
          {[0, 0.5, 1].map((frac) => (
            <text key={`y-${frac}`} x={pl - 6} y={scaleY(frac * maxValue) + 3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8" className="font-mono">
              {formatCurrency(frac * maxValue)}
            </text>
          ))}

          {/* Lines */}
          {lines.map((line, li) => {
            const pts = line.points.map((p, i) => `${scaleX(i)},${scaleY(p)}`).join(" ");
            return (
              <g key={line.jobId}>
                <motion.polyline
                  points={pts} fill="none" stroke={line.color}
                  strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  filter="url(#ptEarnGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: li * 0.2, ease: "easeOut" }}
                />
                {line.points.map((p, i) => (
                  <motion.circle
                    key={i} cx={scaleX(i)} cy={scaleY(p)} r={3}
                    fill={line.color}
                    initial={{ opacity: 0, r: 0 }}
                    animate={{ opacity: 1, r: 3 }}
                    transition={{ duration: 0.3, delay: 0.5 + li * 0.1 + i * 0.05 }}
                  />
                ))}
              </g>
            );
          })}

          {/* X-axis labels */}
          {weeks.map((w, i) => (
            <text key={w} x={scaleX(i)} y={chartHeight - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" className="font-mono">
              {w}
            </text>
          ))}
        </svg>
      </Chart3DWrapper>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        {lines.map((l) => (
          <div key={l.jobId} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="font-mono text-[10px] text-white/40">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

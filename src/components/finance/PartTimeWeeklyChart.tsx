"use client";
import { useMemo } from "react";
import { PartTimeJob, PartTimeHourEntry } from "@/types";
import { motion } from "framer-motion";

interface PartTimeWeeklyChartProps {
  jobs: PartTimeJob[];
  hours: PartTimeHourEntry[];
}

export function PartTimeWeeklyChart({ jobs, hours }: PartTimeWeeklyChartProps) {
  const data = useMemo(() => {
    const now = new Date();
    const activeJobs = jobs.filter((j) => j.active);
    const weeks: { label: string; stacks: { jobId: string; jobName: string; color: string; hours: number }[]; total: number }[] = [];

    for (let w = 7; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      const startStr = weekStart.toISOString().slice(0, 10);
      const endStr = weekEnd.toISOString().slice(0, 10);

      const stacks = activeJobs.map((job) => {
        const h = hours
          .filter((e) => e.job_id === job.id && e.date >= startStr && e.date <= endStr)
          .reduce((s, e) => s + e.hours, 0);
        return { jobId: job.id, jobName: job.name, color: job.color || "#8b5cf6", hours: h };
      }).filter((s) => s.hours > 0);

      const label = `W${8 - w}`;
      weeks.push({ label, stacks, total: stacks.reduce((s, st) => s + st.hours, 0) });
    }

    return weeks;
  }, [jobs, hours]);

  const jobLegend = useMemo(() => {
    const seen = new Map<string, string>();
    data.forEach((w) => w.stacks.forEach((s) => { if (!seen.has(s.jobName)) seen.set(s.jobName, s.color); }));
    return Array.from(seen.entries()).map(([name, color]) => ({ name, color }));
  }, [data]);

  const hasData = data.some((w) => w.total > 0);

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Hours</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No hours logged</p>
      </div>
    );
  }

  const chartWidth = 500;
  const chartHeight = 200;
  const pt = 20, pb = 28, pl = 10, pr = 10;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;
  const maxValue = Math.max(...data.map((w) => w.total), 1);
  const groupW = dw / data.length;
  const barW = groupW * 0.55;
  const pillRx = barW / 2;
  const baseY = pt + dh;

  const scaleH = (v: number) => (v / maxValue) * dh;

  // Generate unique gradient IDs
  const colorSet = Array.from(new Set(jobLegend.map((j) => j.color)));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Hours</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        <defs>
          {colorSet.map((color) => (
            <linearGradient key={color} id={`pillGrad-ptwk-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.95} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac} x1={pl} y1={baseY - frac * dh} x2={chartWidth - pr} y2={baseY - frac * dh} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        ))}

        {data.map((week, wi) => {
          const x = pl + wi * groupW + (groupW - barW) / 2;
          let currentY = baseY;

          return (
            <g key={week.label}>
              {/* Background track */}
              <rect x={x} y={pt} width={barW} height={dh} rx={pillRx} fill="rgba(255,255,255,0.02)" />

              {week.stacks.map((stack, si) => {
                const h = scaleH(stack.hours);
                currentY -= h;
                const isTop = si === week.stacks.length - 1;
                const isBottom = si === 0;

                return (
                  <motion.rect
                    key={stack.jobId}
                    x={x} y={currentY} width={barW} height={h}
                    rx={isTop || isBottom ? pillRx : 0}
                    fill={`url(#pillGrad-ptwk-${stack.color.replace("#", "")})`}
                    initial={{ height: 0, y: baseY }}
                    animate={{ height: h, y: currentY }}
                    transition={{ duration: 0.5, delay: wi * 0.06 + si * 0.03 }}
                  />
                );
              })}

              {/* Total label */}
              {week.total > 0 && (
                <text
                  x={x + barW / 2} y={baseY - scaleH(week.total) - 5}
                  textAnchor="middle" fill="rgba(255,255,255,0.7)"
                  fontSize="12" fontWeight="600" className="font-mono"
                >
                  {week.total.toFixed(1)}h
                </text>
              )}

              {/* Week label */}
              <text
                x={x + barW / 2} y={chartHeight - 6}
                textAnchor="middle" fill="rgba(255,255,255,0.4)"
                fontSize="10" className="font-mono"
              >
                {week.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {jobLegend.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
          {jobLegend.map((j) => (
            <div key={j.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: j.color }} />
              <span className="font-mono text-[10px] text-white/50">{j.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

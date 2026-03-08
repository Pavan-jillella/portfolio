"use client";
import { useMemo, useState } from "react";
import { PartTimeJob, PartTimeHourEntry } from "@/types";
import { motion } from "framer-motion";

interface PartTimeWeeklyChartProps {
  jobs: PartTimeJob[];
  hours: PartTimeHourEntry[];
}

export function PartTimeWeeklyChart({ jobs, hours }: PartTimeWeeklyChartProps) {
  const [tooltip, setTooltip] = useState<{
    label: string;
    job: string;
    hours: number;
    x: number;
    y: number;
  } | null>(null);

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

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const maxValue = Math.max(...data.map((w) => w.total), 1);
  const groupW = width / data.length;
  const barW = Math.min(groupW * 0.5, 28);

  const colorSet = Array.from(new Set(jobLegend.map((j) => j.color)));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Hours</h4>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            {colorSet.map((color) => (
              <linearGradient key={color} id={`ptwk-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((g, i) => {
            const y = baseY - (g / 100) * barArea;
            return (
              <line key={i} x1="0" x2={width} y1={y} y2={y} stroke="#1f2937" strokeWidth="0.6" opacity="0.4" />
            );
          })}

          {data.map((week, wi) => {
            const x = wi * groupW + (groupW - barW) / 2;
            let currentY = baseY;

            return (
              <g key={week.label}>
                {week.stacks.map((stack, si) => {
                  const h = (stack.hours / maxValue) * barArea;
                  currentY -= h;
                  const isTop = si === week.stacks.length - 1;

                  return (
                    <motion.rect
                      key={stack.jobId}
                      x={x} width={barW}
                      rx={isTop ? "4" : "0"}
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: h, y: currentY }}
                      transition={{ duration: 0.6, delay: wi * 0.06 + si * 0.03 }}
                      fill={`url(#ptwk-${stack.color.replace("#", "")})`}
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ label: week.label, job: stack.jobName, hours: stack.hours, x, y: currentY })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}

                {week.total > 0 && (
                  <text x={x + barW / 2} y={baseY - (week.total / maxValue) * barArea - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                    {week.total.toFixed(1)}h
                  </text>
                )}

                <text x={x + barW / 2} y={200} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">
                  {week.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute text-xs bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 shadow-lg pointer-events-none z-10"
            style={{
              left: `${(tooltip.x / width) * 100}%`,
              top: `${(tooltip.y / height) * 100}%`,
              transform: "translate(10px, -100%)",
            }}
          >
            <div className="font-semibold text-white">{tooltip.label}</div>
            <div className="text-gray-300">{tooltip.job}: {tooltip.hours}h</div>
          </div>
        )}
      </div>

      {/* Legend */}
      {jobLegend.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-2 justify-center">
          {jobLegend.map((j) => (
            <div key={j.name} className="flex items-center gap-2 text-xs text-gray-300">
              <svg width="12" height="8"><rect width="12" height="8" rx="3" fill={j.color} /></svg>
              {j.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useMemo } from "react";
import { PartTimeJob, PartTimeHourEntry } from "@/types";
import { motion } from "framer-motion";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface PartTimeJobDistributionChartProps {
  jobs: PartTimeJob[];
  hours: PartTimeHourEntry[];
}

const FALLBACK_COLORS = [
  "#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ec4899",
  "#06b6d4", "#eab308", "#ef4444", "#6366f1", "#14b8a6",
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function PartTimeJobDistributionChart({ jobs, hours }: PartTimeJobDistributionChartProps) {
  const { segments, totalHours } = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.active);
    if (activeJobs.length === 0 || hours.length === 0) return { segments: [], totalHours: 0 };

    const hoursMap = new Map<string, number>();
    hours.forEach((h) => {
      hoursMap.set(h.job_id, (hoursMap.get(h.job_id) || 0) + h.hours);
    });

    const jobData = activeJobs
      .map((j, i) => ({
        id: j.id,
        name: j.name,
        color: j.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        hours: hoursMap.get(j.id) || 0,
      }))
      .filter((j) => j.hours > 0)
      .sort((a, b) => b.hours - a.hours);

    const total = jobData.reduce((s, j) => s + j.hours, 0);
    if (total === 0) return { segments: [], totalHours: 0 };

    let cumulativeAngle = 0;
    const segs = jobData.map((j) => {
      const angle = (j.hours / total) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      const percentage = (j.hours / total) * 100;
      return {
        ...j,
        startAngle,
        endAngle: startAngle + angle,
        percentage,
      };
    });

    return { segments: segs, totalHours: total };
  }, [jobs, hours]);

  if (segments.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Hours by Job</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No hours logged yet</p>
      </div>
    );
  }

  const cx = 120, cy = 120, r = 80, strokeW = 24;
  const depthOffset = 5;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Hours by Job</h4>
      <div className="flex flex-col items-center gap-6">
        <Chart3DWrapper tiltX={10} tiltY={-3}>
          <svg viewBox="0 0 240 260" className="w-full max-w-[240px] mx-auto h-auto">
            {/* Depth ring */}
            {segments.map((seg, i) => (
              <path
                key={`depth-${i}`}
                d={describeArc(cx, cy + depthOffset, r, seg.startAngle, seg.endAngle - 0.5)}
                fill="none"
                stroke={darkenColor(seg.color, 0.4)}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
            ))}

            {/* Main ring */}
            {segments.map((seg, i) => (
              <motion.path
                key={`ring-${i}`}
                d={describeArc(cx, cy, r, seg.startAngle, seg.endAngle - 0.5)}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeW}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            ))}

            {/* Center text */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" className="font-mono font-bold">
              {totalHours.toFixed(1)}h
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" className="font-mono">
              Total Hours
            </text>
          </svg>
        </Chart3DWrapper>

        {/* Legend */}
        <div className="w-full grid grid-cols-1 gap-y-2">
          {segments.map((seg) => (
            <div key={seg.id} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="font-body text-xs text-white/50 truncate">{seg.name}</span>
              <span className="font-mono text-xs text-white/30 ml-auto">
                {seg.hours.toFixed(1)}h ({seg.percentage.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { SUBJECT_COLORS } from "@/lib/constants";
import { formatDuration } from "@/lib/education-utils";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";
import { motion } from "framer-motion";

interface SubjectBreakdownChartProps {
  data: { subject: string; minutes: number }[];
}

export function SubjectBreakdownChart({ data }: SubjectBreakdownChartProps) {
  const total = data.reduce((s, d) => s + d.minutes, 0);

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Subject Breakdown</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">No study data yet</p>
      </div>
    );
  }

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const innerRadius = 50;
  const depthOffset = 4;

  let cumulativeAngle = -90;
  const segments = data.map((d) => {
    const angle = (d.minutes / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return { ...d, startAngle, angle, percentage: (d.minutes / total) * 100 };
  });

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    startAngle: number,
    endAngle: number
  ) {
    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      "Z",
    ].join(" ");
  }

  const totalHours = (total / 60).toFixed(1);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Subject Breakdown</h3>
      <div className="flex flex-col items-center gap-6">
        <Chart3DWrapper tiltX={10} tiltY={-3}>
          <div className="relative">
            <svg width={size} height={size + depthOffset} viewBox={`0 0 ${size} ${size + depthOffset}`}>
              <defs>
                <filter id="subjectDonutShadow">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
                </filter>
              </defs>

              {/* Depth ring — offset down, darkened */}
              <g transform={`translate(0, ${depthOffset})`}>
                {segments.map((seg) => {
                  const endAngle = seg.startAngle + Math.max(seg.angle - 1, 0.5);
                  const color = SUBJECT_COLORS[seg.subject] || "#6b7280";
                  return (
                    <path
                      key={`depth-${seg.subject}`}
                      d={describeArc(cx, cy, radius, innerRadius, seg.startAngle, endAngle)}
                      fill={darkenColor(color, 0.5)}
                    />
                  );
                })}
              </g>

              {/* Main ring */}
              <g filter="url(#subjectDonutShadow)">
                {segments.map((seg, i) => {
                  const endAngle = seg.startAngle + Math.max(seg.angle - 1, 0.5);
                  const color = SUBJECT_COLORS[seg.subject] || "#6b7280";
                  return (
                    <motion.path
                      key={seg.subject}
                      d={describeArc(cx, cy, radius, innerRadius, seg.startAngle, endAngle)}
                      fill={color}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      style={{ transformOrigin: `${cx}px ${cy}px` }}
                    />
                  );
                })}
              </g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-xs text-white/30">Total</p>
                <p className="font-display font-bold text-lg text-white">{totalHours}h</p>
              </div>
            </div>
          </div>
        </Chart3DWrapper>

        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
          {segments.map((seg) => (
            <div key={seg.subject} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: SUBJECT_COLORS[seg.subject] || "#6b7280" }}
              />
              <span className="font-body text-xs text-white/50 truncate">{seg.subject}</span>
              <span className="font-mono text-xs text-white/30 ml-auto">{seg.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

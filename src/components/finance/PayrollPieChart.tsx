"use client";
import { EmployerIncome } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";
import { motion } from "framer-motion";

interface PayrollPieChartProps {
  data: EmployerIncome[];
}

export function PayrollPieChart({ data }: PayrollPieChartProps) {
  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.gross, 0);
  const depthOffset = 4;

  // Build segments: each gets a dasharray and dashoffset
  let cumulativeOffset = 0;
  const segments = data.map((entry) => {
    const fraction = total > 0 ? entry.gross / total : 0;
    const segmentLength = fraction * circumference;
    const gap = circumference - segmentLength;
    const offset = -cumulativeOffset;
    cumulativeOffset += segmentLength;
    return {
      ...entry,
      fraction,
      dashArray: `${segmentLength} ${gap}`,
      dashOffset: offset,
    };
  });

  if (data.length === 0 || total === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Income by Employer</h4>
        <div className="flex flex-col items-center justify-center py-6">
          <svg viewBox="0 0 200 200" className="w-36 h-36">
            <circle
              cx={100}
              cy={100}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />
          </svg>
          <p className="font-body text-sm text-white/30 mt-3">No data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Income by Employer</h4>

      <div className="flex flex-col items-center">
        <Chart3DWrapper tiltX={10} tiltY={-3}>
          <svg viewBox={`0 0 200 ${200 + depthOffset}`} className="w-40 h-40">
            <defs>
              <filter id="payrollPieDropShadow">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.5)" />
              </filter>
            </defs>

            {/* Background ring */}
            <circle
              cx={100}
              cy={100}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth}
            />

            {/* Depth ring — offset down, darkened */}
            <g transform={`translate(0, ${depthOffset})`}>
              {segments.map((seg) => (
                <circle
                  key={`depth-${seg.employer_id}`}
                  cx={100}
                  cy={100}
                  r={radius}
                  fill="none"
                  stroke={darkenColor(seg.color, 0.5)}
                  strokeWidth={strokeWidth}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 100 100)"
                />
              ))}
            </g>

            {/* Main ring */}
            <g filter="url(#payrollPieDropShadow)">
              {segments.map((seg, i) => (
                <motion.circle
                  key={seg.employer_id}
                  cx={100}
                  cy={100}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 100 100)"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: seg.dashOffset }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                />
              ))}
            </g>

            {/* Center text */}
            <text
              x={100}
              y={95}
              textAnchor="middle"
              className="font-mono"
              fill="currentColor"
              fontSize="16"
              fontWeight="600"
            >
              {formatCurrency(total)}
            </text>
            <text
              x={100}
              y={115}
              textAnchor="middle"
              className="font-mono"
              fill="rgba(255,255,255,0.35)"
              fontSize="9"
            >
              TOTAL GROSS
            </text>
          </svg>
        </Chart3DWrapper>

        {/* Legend */}
        <div className="mt-4 w-full space-y-2">
          {segments.map((seg) => (
            <div key={seg.employer_id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-body text-xs text-white/60 truncate">{seg.employer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white/40">
                  {(seg.fraction * 100).toFixed(0)}%
                </span>
                <span className="font-mono text-xs text-white/60">
                  {formatCurrency(seg.gross)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useMemo } from "react";
import { PayStub } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface DeductionsBreakdownChartProps {
  payStubs: PayStub[];
  selectedMonth?: string;
}

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

const DEDUCTION_COLORS: Record<string, string> = {
  Federal: "#ef4444",
  State: "#f97316",
  "Social Security": "#eab308",
  Medicare: "#3b82f6",
  Other: "#6b7280",
};

export function DeductionsBreakdownChart({ payStubs, selectedMonth }: DeductionsBreakdownChartProps) {
  const deductions = useMemo(() => {
    const filtered = selectedMonth
      ? payStubs.filter((s) => s.pay_date.startsWith(selectedMonth))
      : payStubs;

    const totals = {
      Federal: filtered.reduce((s, p) => s + p.deductions.federal_tax, 0),
      State: filtered.reduce((s, p) => s + p.deductions.state_tax, 0),
      "Social Security": filtered.reduce((s, p) => s + p.deductions.social_security, 0),
      Medicare: filtered.reduce((s, p) => s + p.deductions.medicare, 0),
      Other: filtered.reduce((s, p) => s + p.deductions.other_deductions, 0),
    };

    return Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([label, value]) => ({ label, value, color: DEDUCTION_COLORS[label] || "#6b7280" }));
  }, [payStubs, selectedMonth]);

  const total = deductions.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Tax Deductions</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No deduction data available</p>
      </div>
    );
  }

  const cx = 120, cy = 120, r = 80, strokeW = 22;
  const depthOffset = 5;

  // Build arc segments
  let angle = 0;
  const segments = deductions.map((d) => {
    const sweep = (d.value / total) * 360;
    const seg = { ...d, start: angle, end: angle + sweep };
    angle += sweep;
    return seg;
  });

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Tax Deductions</h4>
      <Chart3DWrapper tiltX={10} tiltY={-3}>
        <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto h-auto">
          {/* Depth ring */}
          {segments.map((seg, i) => (
            <path
              key={`depth-${i}`}
              d={describeArc(cx, cy + depthOffset, r, seg.start, Math.min(seg.end - 0.5, seg.start + 359))}
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
              d={describeArc(cx, cy, r, seg.start, Math.min(seg.end - 0.5, seg.start + 359))}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            />
          ))}

          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" className="font-mono font-bold">
            {formatCurrency(total)}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" className="font-mono">
            Total Tax
          </text>
        </svg>
      </Chart3DWrapper>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="font-mono text-[10px] text-white/40">
              {seg.label}: {formatCurrency(seg.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

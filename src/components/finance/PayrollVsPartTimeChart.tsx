"use client";
import { useMemo, useState } from "react";
import { PayStub, PartTimeJob, PartTimeHourEntry } from "@/types";
import { motion } from "framer-motion";

interface PayrollVsPartTimeChartProps {
  payStubs: PayStub[];
  partTimeJobs: PartTimeJob[];
  partTimeHours: PartTimeHourEntry[];
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function PayrollVsPartTimeChart({ payStubs, partTimeJobs, partTimeHours }: PayrollVsPartTimeChartProps) {
  const [tooltip, setTooltip] = useState<{
    month: string;
    type: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  const data = useMemo(() => {
    const now = new Date();
    const jobMap = new Map(partTimeJobs.map((j) => [j.id, j]));

    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = d.toISOString().slice(0, 7);
      const payroll = payStubs
        .filter((s) => s.pay_date.startsWith(month))
        .reduce((sum, s) => sum + s.net_pay, 0);
      const partTime = partTimeHours
        .filter((h) => h.date.startsWith(month))
        .reduce((sum, h) => {
          const job = jobMap.get(h.job_id);
          return sum + h.hours * (job?.hourly_rate || 0);
        }, 0);
      return { month, payroll, partTime };
    });
  }, [payStubs, partTimeJobs, partTimeHours]);

  const hasData = data.some((d) => d.payroll > 0 || d.partTime > 0);

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Payroll vs Part-Time</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No income data available</p>
      </div>
    );
  }

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const maxValue = Math.max(...data.flatMap((d) => [d.payroll, d.partTime]), 1);
  const groupW = width / data.length;
  const barW = Math.min(groupW * 0.3, 18);
  const barGap = 4;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Payroll vs Part-Time</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#60a5fa" /></svg>
            Payroll
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#a78bfa" /></svg>
            Part-Time
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            <linearGradient id="pvptPay" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="pvptPt" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((g, i) => {
            const y = baseY - (g / 100) * barArea;
            return (
              <line key={i} x1="0" x2={width} y1={y} y2={y} stroke="#1f2937" strokeWidth="0.6" opacity="0.4" />
            );
          })}

          {/* Bars */}
          {data.map((entry, i) => {
            const totalW = barW * 2 + barGap;
            const startX = i * groupW + (groupW - totalW) / 2;
            const px = startX;
            const tx = startX + barW + barGap;
            const payH = (entry.payroll / maxValue) * barArea;
            const ptH = (entry.partTime / maxValue) * barArea;
            const monthLabel = SHORT_MONTHS[parseInt(entry.month.split("-")[1]) - 1];

            return (
              <g key={entry.month}>
                {entry.payroll > 0 && (
                  <>
                    <motion.rect
                      x={px} width={barW} rx="4"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: payH, y: baseY - payH }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      fill="url(#pvptPay)"
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ month: monthLabel, type: "Payroll", amount: entry.payroll, x: px, y: baseY - payH })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text x={px + barW / 2} y={baseY - payH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                      ${Math.round(entry.payroll)}
                    </text>
                  </>
                )}

                {entry.partTime > 0 && (
                  <>
                    <motion.rect
                      x={tx} width={barW} rx="4"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: ptH, y: baseY - ptH }}
                      transition={{ duration: 0.6, delay: i * 0.08 + 0.05 }}
                      fill="url(#pvptPt)"
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ month: monthLabel, type: "Part-Time", amount: entry.partTime, x: tx, y: baseY - ptH })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text x={tx + barW / 2} y={baseY - ptH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                      ${Math.round(entry.partTime)}
                    </text>
                  </>
                )}

                <text x={i * groupW + groupW / 2} y={200} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">
                  {monthLabel}
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
            <div className="font-semibold text-white">{tooltip.month}</div>
            <div className="text-gray-300">{tooltip.type}: ${tooltip.amount}</div>
          </div>
        )}
      </div>
    </div>
  );
}

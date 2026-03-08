"use client";
import { useMemo } from "react";
import { PayStub, PartTimeJob, PartTimeHourEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { bar3DPaths, darkenColor, lightenColor } from "@/lib/chart-3d-utils";

interface PayrollVsPartTimeChartProps {
  payStubs: PayStub[];
  partTimeJobs: PartTimeJob[];
  partTimeHours: PartTimeHourEntry[];
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function PayrollVsPartTimeChart({ payStubs, partTimeJobs, partTimeHours }: PayrollVsPartTimeChartProps) {
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

  const chartWidth = 500;
  const chartHeight = 220;
  const pt = 28, pb = 30, pl = 10, pr = 10;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;
  const maxValue = Math.max(...data.flatMap((d) => [d.payroll, d.partTime]), 1);
  const groupW = dw / data.length;
  const barW = groupW * 0.3;
  const barGap = groupW * 0.05;

  const scaleY = (v: number) => pt + dh - (v / maxValue) * dh;
  const baseY = pt + dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Payroll vs Part-Time</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[10px] text-white/40">Payroll</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-mono text-[10px] text-white/40">Part-Time</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Gradient defs + glow filter */}
        <defs>
          <linearGradient id="barGrad-pvpt-payroll" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightenColor("#3b82f6", 0.3)} />
            <stop offset="100%" stopColor={darkenColor("#3b82f6", 0.2)} />
          </linearGradient>
          <linearGradient id="barGrad-pvpt-parttime" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightenColor("#8b5cf6", 0.3)} />
            <stop offset="100%" stopColor={darkenColor("#8b5cf6", 0.2)} />
          </linearGradient>
          <filter id="barGlow-pvpt">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac} x1={pl} y1={scaleY(frac * maxValue)} x2={chartWidth - pr} y2={scaleY(frac * maxValue)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        ))}

        {data.map((entry, i) => {
          const groupX = pl + i * groupW + groupW * 0.15;
          const payH = (entry.payroll / maxValue) * dh;
          const ptH = (entry.partTime / maxValue) * dh;

          return (
            <g key={entry.month}>
              {/* Payroll bar */}
              {entry.payroll > 0 && (() => {
                const { rightFace, topFace } = bar3DPaths(groupX, baseY - payH, barW, payH, 8, -8);
                return (
                  <>
                    <path d={rightFace} fill={darkenColor("#3b82f6", 0.6)} />
                    <path d={topFace} fill={lightenColor("#3b82f6", 0.2)} />
                    <motion.rect
                      x={groupX} y={baseY - payH} width={barW} height={payH}
                      rx={6} fill="url(#barGrad-pvpt-payroll)" fillOpacity={0.9}
                      stroke="#3b82f6" strokeWidth={0.5} strokeOpacity={0.4}
                      filter="url(#barGlow-pvpt)"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: payH, y: baseY - payH }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    />
                    {/* Inner highlight stripe */}
                    <rect x={groupX} y={baseY - payH} width={2} height={payH} rx={1} fill={lightenColor("#3b82f6", 0.5)} fillOpacity={0.4} />
                    {/* Dot cap */}
                    <circle cx={groupX + barW / 2} cy={baseY - payH} r={2.5} fill={lightenColor("#3b82f6", 0.4)} />
                    <text x={groupX + barW / 2} y={baseY - payH - 4} textAnchor="middle" fill="rgba(59,130,246,0.7)" fontSize="11" className="font-mono">
                      {formatCurrency(entry.payroll)}
                    </text>
                  </>
                );
              })()}

              {/* Part-time bar */}
              {entry.partTime > 0 && (() => {
                const x2 = groupX + barW + barGap;
                const { rightFace, topFace } = bar3DPaths(x2, baseY - ptH, barW, ptH, 8, -8);
                return (
                  <>
                    <path d={rightFace} fill={darkenColor("#8b5cf6", 0.6)} />
                    <path d={topFace} fill={lightenColor("#8b5cf6", 0.2)} />
                    <motion.rect
                      x={x2} y={baseY - ptH} width={barW} height={ptH}
                      rx={6} fill="url(#barGrad-pvpt-parttime)" fillOpacity={0.9}
                      stroke="#8b5cf6" strokeWidth={0.5} strokeOpacity={0.4}
                      filter="url(#barGlow-pvpt)"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: ptH, y: baseY - ptH }}
                      transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                    />
                    {/* Inner highlight stripe */}
                    <rect x={x2} y={baseY - ptH} width={2} height={ptH} rx={1} fill={lightenColor("#8b5cf6", 0.5)} fillOpacity={0.4} />
                    {/* Dot cap */}
                    <circle cx={x2 + barW / 2} cy={baseY - ptH} r={2.5} fill={lightenColor("#8b5cf6", 0.4)} />
                    <text x={x2 + barW / 2} y={baseY - ptH - 4} textAnchor="middle" fill="rgba(139,92,246,0.7)" fontSize="11" className="font-mono">
                      {formatCurrency(entry.partTime)}
                    </text>
                  </>
                );
              })()}

              {/* Month label */}
              <text
                x={groupX + barW + barGap / 2}
                y={chartHeight - 6}
                textAnchor="middle" fill="rgba(255,255,255,0.35)"
                fontSize="10" className="font-mono"
              >
                {SHORT_MONTHS[parseInt(entry.month.split("-")[1]) - 1]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

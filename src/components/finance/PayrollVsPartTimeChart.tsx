"use client";
import { useMemo } from "react";
import { PayStub, PartTimeJob, PartTimeHourEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

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
  const pillRx = barW / 2;
  const baseY = pt + dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Payroll vs Part-Time</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-mono text-[10px] text-white/50">Payroll</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="font-mono text-[10px] text-white/50">Part-Time</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        <defs>
          <linearGradient id="pillGrad-pvpt-payroll" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="pillGrad-pvpt-parttime" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac} x1={pl} y1={pt + dh - frac * dh} x2={chartWidth - pr} y2={pt + dh - frac * dh} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        ))}

        {data.map((entry, i) => {
          const groupX = pl + i * groupW + groupW * 0.15;
          const payH = (entry.payroll / maxValue) * dh;
          const ptH = (entry.partTime / maxValue) * dh;

          return (
            <g key={entry.month}>
              {/* Background tracks */}
              <rect x={groupX} y={pt} width={barW} height={dh} rx={pillRx} fill="rgba(255,255,255,0.02)" />
              <rect x={groupX + barW + barGap} y={pt} width={barW} height={dh} rx={pillRx} fill="rgba(255,255,255,0.02)" />

              {/* Payroll pill bar */}
              {entry.payroll > 0 && (
                <>
                  <motion.rect
                    x={groupX} y={baseY - payH} width={barW} height={payH}
                    rx={pillRx} fill="url(#pillGrad-pvpt-payroll)"
                    initial={{ height: 0, y: baseY }}
                    animate={{ height: payH, y: baseY - payH }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                  />
                  <text x={groupX + barW / 2} y={baseY - payH - 5} textAnchor="middle" fill="rgba(96,165,250,0.9)" fontSize="12" fontWeight="600" className="font-mono">
                    {formatCurrency(entry.payroll)}
                  </text>
                </>
              )}

              {/* Part-time pill bar */}
              {entry.partTime > 0 && (
                <>
                  <motion.rect
                    x={groupX + barW + barGap} y={baseY - ptH} width={barW} height={ptH}
                    rx={pillRx} fill="url(#pillGrad-pvpt-parttime)"
                    initial={{ height: 0, y: baseY }}
                    animate={{ height: ptH, y: baseY - ptH }}
                    transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                  />
                  <text x={groupX + barW + barGap + barW / 2} y={baseY - ptH - 5} textAnchor="middle" fill="rgba(167,139,250,0.9)" fontSize="12" fontWeight="600" className="font-mono">
                    {formatCurrency(entry.partTime)}
                  </text>
                </>
              )}

              {/* Month label */}
              <text
                x={groupX + barW + barGap / 2}
                y={chartHeight - 6}
                textAnchor="middle" fill="rgba(255,255,255,0.4)"
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

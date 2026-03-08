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

  const W = 320, H = 160;
  const pt = 14, pb = 20, pl = 6, pr = 6;
  const dw = W - pl - pr;
  const dh = H - pt - pb;
  const maxValue = Math.max(...data.flatMap((d) => [d.payroll, d.partTime]), 1);
  const groupW = dw / data.length;
  const barW = Math.min(groupW * 0.3, 16);
  const barGap = Math.max(barW * 0.2, 2);
  const rx = Math.min(barW / 2, 4);
  const baseY = pt + dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Payroll vs Part-Time</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[9px] text-white/40">Payroll</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-mono text-[9px] text-white/40">Part-Time</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        <defs>
          <linearGradient id="pvptPay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="pvptPt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        {[0.5, 1].map((f) => (
          <line key={f} x1={pl} y1={baseY - f * dh} x2={W - pr} y2={baseY - f * dh} stroke="rgba(255,255,255,0.05)" strokeWidth={0.3} />
        ))}

        {data.map((entry, i) => {
          const cx = pl + i * groupW + groupW / 2;
          const px = cx - barW - barGap / 2;
          const tx = cx + barGap / 2;
          const payH = (entry.payroll / maxValue) * dh;
          const ptH = (entry.partTime / maxValue) * dh;

          return (
            <g key={entry.month}>
              {entry.payroll > 0 && (
                <>
                  <motion.rect x={px} y={baseY - payH} width={barW} height={payH} rx={rx}
                    fill="url(#pvptPay)"
                    initial={{ height: 0, y: baseY }} animate={{ height: payH, y: baseY - payH }}
                    transition={{ duration: 0.4, delay: i * 0.06 }} />
                  <text x={px + barW / 2} y={baseY - payH - 3} textAnchor="middle" fill="rgba(147,197,253,0.85)" fontSize="6.5" fontWeight="600" className="font-mono">
                    ${Math.round(entry.payroll)}
                  </text>
                </>
              )}
              {entry.partTime > 0 && (
                <>
                  <motion.rect x={tx} y={baseY - ptH} width={barW} height={ptH} rx={rx}
                    fill="url(#pvptPt)"
                    initial={{ height: 0, y: baseY }} animate={{ height: ptH, y: baseY - ptH }}
                    transition={{ duration: 0.4, delay: i * 0.06 + 0.05 }} />
                  <text x={tx + barW / 2} y={baseY - ptH - 3} textAnchor="middle" fill="rgba(196,181,253,0.85)" fontSize="6.5" fontWeight="600" className="font-mono">
                    ${Math.round(entry.partTime)}
                  </text>
                </>
              )}

              <text x={cx} y={H - 5} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" className="font-mono">
                {SHORT_MONTHS[parseInt(entry.month.split("-")[1]) - 1]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

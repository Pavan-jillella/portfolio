"use client";
import { WeeklyTrendEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface PayrollWeeklyTrendProps {
  data: WeeklyTrendEntry[];
}

export function PayrollWeeklyTrend({ data }: PayrollWeeklyTrendProps) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Trend</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No weekly data available</p>
      </div>
    );
  }

  const W = 320, H = 160;
  const pt = 14, pb = 20, pl = 6, pr = 6;
  const dh = H - pt - pb;
  const dw = W - pl - pr;
  const maxValue = Math.max(...data.map((d) => Math.max(d.gross, d.net)), 1);
  const groupW = dw / data.length;
  const barW = Math.min(groupW * 0.3, 16);
  const barGap = Math.max(barW * 0.2, 2);
  const rx = Math.min(barW / 2, 4);
  const baseY = pt + dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Weekly Trend</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[9px] text-white/40">Gross</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] text-white/40">Net</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        <defs>
          <linearGradient id="pwtGross" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="pwtNet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        {[0.5, 1].map((f) => (
          <line key={f} x1={pl} y1={baseY - f * dh} x2={W - pr} y2={baseY - f * dh} stroke="rgba(255,255,255,0.05)" strokeWidth={0.3} />
        ))}

        {data.map((entry, i) => {
          const cx = pl + i * groupW + groupW / 2;
          const gx = cx - barW - barGap / 2;
          const nx = cx + barGap / 2;
          const gH = (entry.gross / maxValue) * dh;
          const nH = (entry.net / maxValue) * dh;

          return (
            <g key={entry.week_label}>
              <motion.rect x={gx} y={baseY - gH} width={barW} height={gH} rx={rx}
                fill="url(#pwtGross)"
                initial={{ height: 0, y: baseY }} animate={{ height: gH, y: baseY - gH }}
                transition={{ duration: 0.4, delay: i * 0.06 }} />
              <motion.rect x={nx} y={baseY - nH} width={barW} height={nH} rx={rx}
                fill="url(#pwtNet)"
                initial={{ height: 0, y: baseY }} animate={{ height: nH, y: baseY - nH }}
                transition={{ duration: 0.4, delay: i * 0.06 + 0.05 }} />

              {entry.gross > 0 && (
                <text x={gx + barW / 2} y={baseY - gH - 3} textAnchor="middle" fill="rgba(147,197,253,0.85)" fontSize="6.5" fontWeight="600" className="font-mono">
                  ${Math.round(entry.gross)}
                </text>
              )}
              {entry.net > 0 && (
                <text x={nx + barW / 2} y={baseY - nH - 3} textAnchor="middle" fill="rgba(110,231,183,0.85)" fontSize="6.5" fontWeight="600" className="font-mono">
                  ${Math.round(entry.net)}
                </text>
              )}

              <text x={cx} y={H - 5} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6.5" className="font-mono">
                {entry.week_label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

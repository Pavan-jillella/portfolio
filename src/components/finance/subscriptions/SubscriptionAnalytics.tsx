"use client";
import { useMemo } from "react";
import { Subscription, MonthlySpending } from "@/types";
import { formatCurrency, getMonthlySubscriptionTotal } from "@/lib/finance-utils";
import { CATEGORY_HEX_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface SubscriptionAnalyticsProps {
  subscriptions: Subscription[];
}

export function SubscriptionAnalytics({ subscriptions }: SubscriptionAnalyticsProps) {
  const active = useMemo(() => subscriptions.filter((s) => s.active), [subscriptions]);
  const monthlyTotal = getMonthlySubscriptionTotal(subscriptions);
  const yearlyTotal = monthlyTotal * 12;

  // Category breakdown
  const categoryBreakdown = useMemo((): MonthlySpending[] => {
    const map = new Map<string, number>();
    active.forEach((s) => {
      const monthly =
        s.frequency === "monthly" ? s.amount :
        s.frequency === "yearly" ? s.amount / 12 :
        s.amount * 4.33;
      map.set(s.category, (map.get(s.category) || 0) + monthly);
    });
    return Array.from(map.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [active]);

  // Most / least expensive
  const sorted = [...active].sort((a, b) => b.amount - a.amount);
  const mostExpensive = sorted[0] || null;
  const leastExpensive = sorted[sorted.length - 1] || null;

  // Upcoming renewals this week
  const now = new Date();
  const upcomingWeek = active.filter((s) => {
    const billing = new Date(s.next_billing_date);
    const diff = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date));

  // Pie chart data
  const total = categoryBreakdown.reduce((s, d) => s + d.total, 0);
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 72;
  const innerRadius = 45;

  let cumulativeAngle = -90;
  const segments = categoryBreakdown.map((d) => {
    const angle = total > 0 ? (d.total / total) * 360 : 0;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return { ...d, startAngle, angle, percentage: total > 0 ? (d.total / total) * 100 : 0 };
  });

  function polarToCartesian(centerX: number, centerY: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: centerX + r * Math.cos(rad), y: centerY + r * Math.sin(rad) };
  }

  function describeArc(centerX: number, centerY: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
    const outerStart = polarToCartesian(centerX, centerY, outerR, startAngle);
    const outerEnd = polarToCartesian(centerX, centerY, outerR, endAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerR, endAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerR, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      "Z",
    ].join(" ");
  }

  if (active.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-body text-sm text-white/30">Add active subscriptions to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div className="glass-card rounded-2xl p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Monthly</p>
          <p className="font-mono text-xl text-white">{formatCurrency(monthlyTotal)}</p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Yearly</p>
          <p className="font-mono text-xl text-white/60">{formatCurrency(yearlyTotal)}</p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Active</p>
          <p className="font-mono text-xl text-blue-400">{active.length}</p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Categories</p>
          <p className="font-mono text-xl text-purple-400">{categoryBreakdown.length}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="font-display font-semibold text-sm text-white mb-4">Category Breakdown</h3>
          <div className="flex flex-col items-center gap-4">
            {total > 0 && (
              <div className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                  {segments.map((seg, i) => {
                    const endAngle = seg.startAngle + Math.max(seg.angle - 1, 0.5);
                    const color = CATEGORY_HEX_COLORS[seg.category] || "#6b7280";
                    return (
                      <motion.path
                        key={seg.category}
                        d={describeArc(cx, cy, radius, innerRadius, seg.startAngle, endAngle)}
                        fill={color}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-mono text-[10px] text-white/30">Monthly</p>
                    <p className="font-display font-bold text-sm text-white">{formatCurrency(monthlyTotal)}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
              {segments.map((seg) => (
                <div key={seg.category} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_HEX_COLORS[seg.category] || "#6b7280" }}
                  />
                  <span className="font-body text-xs text-white/50 truncate">{seg.category}</span>
                  <span className="font-mono text-[10px] text-white/30 ml-auto">{seg.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <div className="space-y-4">
          {/* Most / Least Expensive */}
          <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h4 className="font-display font-semibold text-sm text-white mb-3">Highlights</h4>
            <div className="space-y-3">
              {mostExpensive && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-white/30 uppercase">Most Expensive</p>
                    <p className="font-body text-sm text-white">{mostExpensive.name}</p>
                  </div>
                  <span className="font-mono text-sm text-red-400">{formatCurrency(mostExpensive.amount)}/{mostExpensive.frequency === "yearly" ? "yr" : "mo"}</span>
                </div>
              )}
              {leastExpensive && leastExpensive.id !== mostExpensive?.id && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-white/30 uppercase">Least Expensive</p>
                    <p className="font-body text-sm text-white">{leastExpensive.name}</p>
                  </div>
                  <span className="font-mono text-sm text-emerald-400">{formatCurrency(leastExpensive.amount)}/{leastExpensive.frequency === "yearly" ? "yr" : "mo"}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming This Week */}
          <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h4 className="font-display font-semibold text-sm text-white mb-3">Due This Week</h4>
            {upcomingWeek.length === 0 ? (
              <p className="font-body text-xs text-white/20">No renewals this week</p>
            ) : (
              <div className="space-y-2">
                {upcomingWeek.map((sub) => {
                  const days = Math.ceil((new Date(sub.next_billing_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={sub.id} className="flex items-center justify-between">
                      <span className="font-body text-sm text-white">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white/40">{formatCurrency(sub.amount)}</span>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                          days <= 1 ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Per-category monthly cost */}
          <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h4 className="font-display font-semibold text-sm text-white mb-3">Monthly by Category</h4>
            <div className="space-y-2">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="font-body text-xs text-white/60">{cat.category}</span>
                  <span className="font-mono text-xs text-white/40">{formatCurrency(cat.total)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

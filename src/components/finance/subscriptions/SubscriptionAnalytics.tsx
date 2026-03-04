"use client";
import { useMemo } from "react";
import { EnrichedSubscription, MonthlySpending } from "@/types";
import { formatCurrency, getUserSubscriptionMonthlyTotal } from "@/lib/finance-utils";
import { SUBSCRIPTION_CATEGORY_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface SubscriptionAnalyticsProps {
  subscriptions: EnrichedSubscription[];
}

// Shared SVG donut helpers
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, outerR: number, innerR: number, start: number, end: number) {
  const os = polarToCartesian(cx, cy, outerR, start);
  const oe = polarToCartesian(cx, cy, outerR, end);
  const ie = polarToCartesian(cx, cy, innerR, end);
  const is_ = polarToCartesian(cx, cy, innerR, start);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`,
    "Z",
  ].join(" ");
}

// Billing cycle colors
const CYCLE_COLORS: Record<string, string> = {
  weekly: "#f472b6",
  monthly: "#60a5fa",
  yearly: "#34d399",
};

export function SubscriptionAnalytics({ subscriptions }: SubscriptionAnalyticsProps) {
  const active = useMemo(() => subscriptions.filter((s) => s.active), [subscriptions]);
  const monthlyTotal = getUserSubscriptionMonthlyTotal(active);
  const yearlyTotal = monthlyTotal * 12;

  // ── Category breakdown ──
  const categoryBreakdown = useMemo((): MonthlySpending[] => {
    const map = new Map<string, number>();
    active.forEach((s) => {
      const monthly =
        s.billing_cycle === "monthly" ? s.price :
        s.billing_cycle === "yearly" ? s.price / 12 :
        s.price * 4.33;
      map.set(s.service.category, (map.get(s.service.category) || 0) + monthly);
    });
    return Array.from(map.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }, [active]);

  // ── Billing cycle breakdown ──
  const cycleBreakdown = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    active.forEach((s) => {
      const monthly =
        s.billing_cycle === "monthly" ? s.price :
        s.billing_cycle === "yearly" ? s.price / 12 :
        s.price * 4.33;
      const prev = map.get(s.billing_cycle) || { count: 0, total: 0 };
      map.set(s.billing_cycle, { count: prev.count + 1, total: prev.total + monthly });
    });
    return Array.from(map.entries())
      .map(([cycle, data]) => ({ cycle, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [active]);

  // ── Per-subscription cost (sorted by monthly cost) ──
  const perSubCost = useMemo(() => {
    return [...active]
      .map((s) => {
        const monthly =
          s.billing_cycle === "monthly" ? s.price :
          s.billing_cycle === "yearly" ? s.price / 12 :
          s.price * 4.33;
        return { id: s.id, name: s.service.name, category: s.service.category, monthly, raw: s.price, cycle: s.billing_cycle };
      })
      .sort((a, b) => b.monthly - a.monthly);
  }, [active]);

  const maxMonthlyCost = perSubCost.length > 0 ? perSubCost[0].monthly : 1;

  // ── Price range distribution ──
  const priceRanges = useMemo(() => {
    const ranges = [
      { label: "$0–5", min: 0, max: 5, count: 0, color: "#34d399" },
      { label: "$5–10", min: 5, max: 10, count: 0, color: "#60a5fa" },
      { label: "$10–20", min: 10, max: 20, count: 0, color: "#a78bfa" },
      { label: "$20–50", min: 20, max: 50, count: 0, color: "#f472b6" },
      { label: "$50+", min: 50, max: Infinity, count: 0, color: "#ef4444" },
    ];
    active.forEach((s) => {
      const monthly =
        s.billing_cycle === "monthly" ? s.price :
        s.billing_cycle === "yearly" ? s.price / 12 :
        s.price * 4.33;
      const r = ranges.find((r) => monthly >= r.min && monthly < r.max);
      if (r) r.count++;
    });
    return ranges;
  }, [active]);

  const maxRangeCount = Math.max(...priceRanges.map((r) => r.count), 1);

  // Most / least expensive
  const sorted = [...active].sort((a, b) => b.price - a.price);
  const mostExpensive = sorted[0] || null;
  const leastExpensive = sorted[sorted.length - 1] || null;

  // Upcoming renewals this week
  const now = new Date();
  const upcomingWeek = active.filter((s) => {
    const billing = new Date(s.next_billing_date);
    const diff = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date));

  // ── Donut helpers ──
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 72;
  const innerR = 45;

  function buildSegments(data: { label: string; value: number; color: string }[]) {
    const total = data.reduce((s, d) => s + d.value, 0);
    let angle = -90;
    return data.map((d) => {
      const sweep = total > 0 ? (d.value / total) * 360 : 0;
      const start = angle;
      angle += sweep;
      return { ...d, start, sweep, pct: total > 0 ? (d.value / total) * 100 : 0 };
    });
  }

  const categorySegments = buildSegments(
    categoryBreakdown.map((d) => ({
      label: d.category,
      value: d.total,
      color: SUBSCRIPTION_CATEGORY_COLORS[d.category] || "#6b7280",
    }))
  );

  const cycleSegments = buildSegments(
    cycleBreakdown.map((d) => ({
      label: d.cycle,
      value: d.total,
      color: CYCLE_COLORS[d.cycle] || "#6b7280",
    }))
  );

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
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Avg / Sub</p>
          <p className="font-mono text-xl text-purple-400">{formatCurrency(monthlyTotal / active.length)}</p>
        </motion.div>
      </div>

      {/* Row 1: Category Pie + Billing Cycle Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut */}
        <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="font-display font-semibold text-sm text-white mb-4">Spending by Category</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {categorySegments.map((seg, i) => {
                  const end = seg.start + Math.max(seg.sweep - 1, 0.5);
                  return (
                    <motion.path
                      key={seg.label}
                      d={describeArc(cx, cy, outerR, innerR, seg.start, end)}
                      fill={seg.color}
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
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
              {categorySegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="font-body text-xs text-white/50 truncate">{seg.label}</span>
                  <span className="font-mono text-[10px] text-white/30 ml-auto">{seg.pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Billing Cycle Donut */}
        <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="font-display font-semibold text-sm text-white mb-4">Billing Cycle Split</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {cycleSegments.map((seg, i) => {
                  const end = seg.start + Math.max(seg.sweep - 1, 0.5);
                  return (
                    <motion.path
                      key={seg.label}
                      d={describeArc(cx, cy, outerR, innerR, seg.start, end)}
                      fill={seg.color}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      style={{ transformOrigin: `${cx}px ${cy}px` }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-mono text-[10px] text-white/30">Active</p>
                  <p className="font-display font-bold text-lg text-white">{active.length}</p>
                </div>
              </div>
            </div>
            <div className="w-full space-y-2">
              {cycleBreakdown.map((c) => (
                <div key={c.cycle} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CYCLE_COLORS[c.cycle] || "#6b7280" }} />
                    <span className="font-body text-xs text-white/50 capitalize">{c.cycle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-white/30">{c.count} sub{c.count !== 1 ? "s" : ""}</span>
                    <span className="font-mono text-xs text-white/60">{formatCurrency(c.total)}/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Cost per Subscription Bar Chart */}
      <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-display font-semibold text-sm text-white mb-4">Cost per Subscription <span className="font-mono text-[10px] text-white/20 ml-1">(monthly equivalent)</span></h3>
        <div className="space-y-2.5">
          {perSubCost.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.03 }}
              className="flex items-center gap-3"
            >
              <span className="font-body text-xs text-white/60 w-28 truncate shrink-0">{sub.name}</span>
              <div className="flex-1 h-5 bg-white/[0.03] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: SUBSCRIPTION_CATEGORY_COLORS[sub.category] || "#6b7280" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max((sub.monthly / maxMonthlyCost) * 100, 4)}%` }}
                  transition={{ delay: 0.4 + i * 0.03, duration: 0.5, ease: "easeOut" }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/50">
                  {formatCurrency(sub.monthly)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Row 3: Price Range Distribution + Highlights + Due This Week */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Range Distribution */}
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h4 className="font-display font-semibold text-sm text-white mb-4">Price Distribution</h4>
          <div className="space-y-3">
            {priceRanges.map((range, i) => (
              <div key={range.label} className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-white/40 w-10 shrink-0">{range.label}</span>
                <div className="flex-1 h-4 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: range.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${range.count > 0 ? Math.max((range.count / maxRangeCount) * 100, 8) : 0}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  />
                </div>
                <span className="font-mono text-[10px] text-white/30 w-4 text-right">{range.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h4 className="font-display font-semibold text-sm text-white mb-3">Highlights</h4>
          <div className="space-y-3">
            {mostExpensive && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] text-white/30 uppercase">Most Expensive</p>
                  <p className="font-body text-sm text-white">
                    {mostExpensive.service.name}
                    {mostExpensive.plan && <span className="text-white/30 ml-1">({mostExpensive.plan.name})</span>}
                  </p>
                </div>
                <span className="font-mono text-sm text-red-400">{formatCurrency(mostExpensive.price)}/{mostExpensive.billing_cycle === "yearly" ? "yr" : "mo"}</span>
              </div>
            )}
            {leastExpensive && leastExpensive.id !== mostExpensive?.id && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] text-white/30 uppercase">Least Expensive</p>
                  <p className="font-body text-sm text-white">
                    {leastExpensive.service.name}
                    {leastExpensive.plan && <span className="text-white/30 ml-1">({leastExpensive.plan.name})</span>}
                  </p>
                </div>
                <span className="font-mono text-sm text-emerald-400">{formatCurrency(leastExpensive.price)}/{leastExpensive.billing_cycle === "yearly" ? "yr" : "mo"}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] text-white/30 uppercase">Daily Cost</p>
                <span className="font-mono text-xs text-white/50">{formatCurrency(yearlyTotal / 365)}/day</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Due This Week */}
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h4 className="font-display font-semibold text-sm text-white mb-3">Due This Week</h4>
          {upcomingWeek.length === 0 ? (
            <p className="font-body text-xs text-white/20">No renewals this week</p>
          ) : (
            <div className="space-y-2">
              {upcomingWeek.map((sub) => {
                const days = Math.ceil((new Date(sub.next_billing_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={sub.id} className="flex items-center justify-between">
                    <span className="font-body text-sm text-white">{sub.service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white/40">{formatCurrency(sub.price)}</span>
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
      </div>
    </div>
  );
}

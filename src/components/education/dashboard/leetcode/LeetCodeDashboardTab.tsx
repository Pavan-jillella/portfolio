"use client";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { DifficultyBar } from "./DifficultyBar";
import { motion } from "framer-motion";

function ProgressRing({ solved, total, color }: { solved: number; total: number; color: string }) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="flex-shrink-0">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="8" />
      <motion.circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="46" textAnchor="middle" className="fill-white font-display font-bold text-lg">
        {solved}
      </text>
      <text x="50" y="62" textAnchor="middle" className="fill-white/30 font-mono text-[10px]">
        / {total}
      </text>
    </svg>
  );
}

function DifficultyProgress({ label, solved, total, color, bgColor }: {
  label: string; solved: number; total: number; color: string; bgColor: string;
}) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-body text-sm text-white/60">{label}</span>
        <span className="font-mono text-xs text-white/40">{solved} / {total}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${bgColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export function LeetCodeDashboardTab() {
  const { data, isLoading, error } = useLeetCodeData();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display font-semibold text-xl text-white">LeetCode</h2>
        <SkeletonGrid count={4} columns="grid-cols-2 lg:grid-cols-4" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display font-semibold text-xl text-white">LeetCode</h2>
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/40">
            {error instanceof Error ? error.message : "No data available."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">LeetCode</h2>
        <a
          href={`https://leetcode.com/u/${process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "Punisher_17"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs text-white/30 hover:text-blue-400 transition-colors"
        >
          View profile →
        </a>
      </div>

      {/* Main progress card */}
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing solved={data.solved} total={data.totalQuestions} color="#3b82f6" />
          <div className="flex-1 w-full space-y-3">
            <DifficultyProgress
              label="Easy"
              solved={data.easy}
              total={data.totalEasy}
              color="#10b981"
              bgColor="bg-emerald-500"
            />
            <DifficultyProgress
              label="Medium"
              solved={data.medium}
              total={data.totalMedium}
              color="#f59e0b"
              bgColor="bg-amber-500"
            />
            <DifficultyProgress
              label="Hard"
              solved={data.hard}
              total={data.totalHard}
              color="#ef4444"
              bgColor="bg-red-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: data.solved, suffix: ` / ${data.totalQuestions}` },
          { label: "Easy", value: data.easy, suffix: "" },
          { label: "Medium", value: data.medium, suffix: "" },
          { label: "Hard", value: data.hard, suffix: "" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{s.label}</p>
            <p className="font-display font-bold text-2xl text-white">
              <AnimatedCounter target={s.value} duration={1200} />
              {s.suffix && <span className="text-sm text-white/30 font-normal">{s.suffix}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Difficulty breakdown bar */}
      <DifficultyBar easy={data.easy} medium={data.medium} hard={data.hard} />

      {/* Ranking */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-body text-xs text-white/40 mb-2">Global Ranking</p>
          <p className="font-display font-bold text-3xl text-white">
            {data.ranking > 0 ? (
              <AnimatedCounter target={data.ranking} prefix="#" duration={1200} />
            ) : (
              <span className="text-white/20">N/A</span>
            )}
          </p>
        </motion.div>
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="font-body text-xs text-white/40 mb-2">Contribution Points</p>
          <p className="font-display font-bold text-3xl text-white">
            <AnimatedCounter target={data.contributionPoints} duration={1200} />
          </p>
        </motion.div>
      </div>

      {/* Recent Submissions */}
      {data.recentSubmissions.length > 0 && (
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display font-semibold text-lg text-white mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {data.recentSubmissions.map((sub, i) => {
              const date = new Date(parseInt(sub.timestamp) * 1000);
              const isAccepted = sub.statusDisplay === "Accepted";
              return (
                <a
                  key={`${sub.titleSlug}-${i}`}
                  href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isAccepted ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className="font-body text-sm text-white/70 group-hover:text-white truncate transition-colors">
                      {sub.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="font-mono text-[10px] text-white/20 uppercase">{sub.lang}</span>
                    <span className="font-mono text-[10px] text-white/20">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { cn } from "@/lib/utils";
import {
  ROADMAP_PHASES,
  WEEKLY_PLAN,
  TARGETS,
  DAILY_COMMITMENT,
  RESOURCES,
  DEFAULT_ROADMAP_PROGRESS,
  getPhaseProgress,
  isTopicCompleted,
  toggleTopicProgress,
  migrateProgress,
  type RoadmapPhase,
} from "@/lib/roadmap-data";
import { PHASE_CLUSTERS } from "@/lib/roadmap-mindmap-utils";
import { DailyStudyTracker } from "./DailyStudyTracker";
import { StudyCalendar } from "./StudyCalendar";
import DailyQuestionsView from "./DailyQuestionsView";
import ProductivityDashboard from "./ProductivityDashboard";
import AdvancedFeatures from "./AdvancedFeatures";
import ResourcesView from "./ResourcesView";
import type { RoadmapProgress, UploadedFile } from "@/types";

/* Tab types */
type TabId = "mission" | "daily-questions" | "productivity" | "advanced" | "resources";

/* ================================================================
   DARK THEME COLOR MAPPINGS - Neon accents
   ================================================================ */

const PHASE_COLORS: Record<number, { accent: string; glow: string; bg: string; text: string }> = {
  1: { accent: "from-emerald-400 to-teal-500", glow: "shadow-emerald-500/20", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  2: { accent: "from-blue-400 to-indigo-500", glow: "shadow-blue-500/20", bg: "bg-blue-500/10", text: "text-blue-400" },
  3: { accent: "from-violet-400 to-purple-500", glow: "shadow-violet-500/20", bg: "bg-violet-500/10", text: "text-violet-400" },
  4: { accent: "from-fuchsia-400 to-pink-500", glow: "shadow-fuchsia-500/20", bg: "bg-fuchsia-500/10", text: "text-fuchsia-400" },
  5: { accent: "from-orange-400 to-amber-500", glow: "shadow-orange-500/20", bg: "bg-orange-500/10", text: "text-orange-400" },
  6: { accent: "from-amber-400 to-yellow-500", glow: "shadow-amber-500/20", bg: "bg-amber-500/10", text: "text-amber-400" },
  7: { accent: "from-rose-400 to-red-500", glow: "shadow-rose-500/20", bg: "bg-rose-500/10", text: "text-rose-400" },
  8: { accent: "from-cyan-400 to-sky-500", glow: "shadow-cyan-500/20", bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

/* ================================================================
   HELPERS
   ================================================================ */

const MS_DAY = 86_400_000;
const START = new Date("2026-03-14").getTime();
const END = new Date("2026-11-17").getTime();
const TOTAL_DAYS = Math.ceil((END - START) / MS_DAY);

function dayInfo() {
  const now = Date.now();
  const current = Math.max(1, Math.min(TOTAL_DAYS, Math.ceil((now - START) / MS_DAY) + 1));
  const remaining = Math.max(0, Math.ceil((END - now) / MS_DAY));
  const pct = Math.round((current / TOTAL_DAYS) * 100);
  return { current, remaining, pct };
}

function streak(progress: RoadmapProgress): number {
  const set = new Set<string>();
  for (const p of progress.phases)
    for (const t of p.topicProgress)
      if (t.completed && t.completedAt) set.add(t.completedAt.split("T")[0]);
  let n = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    if (set.has(d.toISOString().split("T")[0])) n++;
    else if (i > 0) break;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function heatmap(progress: RoadmapProgress) {
  const counts: Record<string, number> = {};
  for (const p of progress.phases)
    for (const t of p.topicProgress)
      if (t.completed && t.completedAt) {
        const k = t.completedAt.split("T")[0];
        counts[k] = (counts[k] || 0) + 1;
      }
  const out: { date: string; n: number }[] = [];
  const d = new Date();
  for (let i = 34; i >= 0; i--) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() - i);
    const k = nd.toISOString().split("T")[0];
    out.push({ date: k, n: counts[k] || 0 });
  }
  return out;
}

function phaseStatus(pct: number) {
  if (pct === 100) return { text: "Complete", style: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  if (pct > 0) return { text: "In Progress", style: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  return { text: "Locked", style: "bg-white/5 text-slate-500 border-white/10" };
}

function activePhase() {
  const t = new Date().toISOString().split("T")[0];
  return ROADMAP_PHASES.find((p) => t >= p.dateStart && t <= p.dateEnd)?.id ?? 1;
}

/* ================================================================
   PROGRESS RING — Neon glow style
   ================================================================ */

function ProgressRing({ value }: { value: number }) {
  const size = 200;
  const sw = 12;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-cyan-500/20 blur-2xl" />

      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 relative">
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          stroke="url(#neonGradient)"
          className="drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
        />
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-5xl text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          {value}
        </span>
        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-[0.25em] mt-1">percent</span>
      </div>
    </div>
  );
}

/* ================================================================
   HEATMAP — GitHub-style dark
   ================================================================ */

function Heatmap({ data }: { data: { date: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  const weeks: (typeof data)[] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Activity</p>
      <div className="flex gap-1">
        {weeks.map((wk, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {wk.map((d) => (
              <div
                key={d.date}
                title={`${d.date} — ${d.n} topic${d.n !== 1 ? "s" : ""}`}
                className={cn(
                  "w-3 h-3 rounded-sm transition-all",
                  d.n === 0
                    ? "bg-white/5"
                    : d.n <= max * 0.25
                    ? "bg-emerald-500/30"
                    : d.n <= max * 0.5
                    ? "bg-emerald-500/50"
                    : d.n <= max * 0.75
                    ? "bg-emerald-500/70"
                    : "bg-emerald-500 shadow-sm shadow-emerald-500/30"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   STAT PILL — Glass neon
   ================================================================ */

function Stat({
  label,
  value,
  sub,
  color = "blue",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: "blue" | "amber" | "orange" | "emerald" | "cyan";
}) {
  const colorMap = {
    blue: "bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
    amber: "bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
    orange: "bg-orange-500/10 border-orange-500/20 shadow-orange-500/10",
    emerald: "bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
    cyan: "bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10",
  };

  const textMap = {
    blue: "text-blue-400",
    amber: "text-amber-400",
    orange: "text-orange-400",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
  };

  return (
    <div className={cn("rounded-2xl px-5 py-4 border backdrop-blur-sm min-w-[90px] text-center shadow-lg", colorMap[color])}>
      <p className="font-mono text-[8px] text-slate-500 uppercase tracking-widest leading-none mb-2">{label}</p>
      <p className={cn("font-display font-bold text-2xl leading-none tabular-nums", textMap[color])}>
        {value}
        {sub && <span className="text-slate-600 text-sm font-normal">{sub}</span>}
      </p>
    </div>
  );
}

/* ================================================================
   PHASE CARD — Glass with neon accent
   ================================================================ */

function PhaseCard({
  phase,
  pct,
  active,
  selected,
  onSelect,
  idx,
}: {
  phase: RoadmapPhase;
  pct: number;
  active: boolean;
  selected: boolean;
  onSelect: () => void;
  idx: number;
}) {
  const s = phaseStatus(pct);
  const done = Math.round((pct / 100) * phase.topics.length);
  const colors = PHASE_COLORS[phase.id];

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.06 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "snap-start flex-shrink-0 w-[240px] rounded-3xl p-6 text-left transition-all relative overflow-hidden",
        "border backdrop-blur-xl",
        selected
          ? `bg-white/10 border-white/20 shadow-xl ${colors.glow}`
          : active
          ? "bg-white/8 border-white/15"
          : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
      )}
    >
      {/* Top accent gradient */}
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", colors.accent)} />

      {/* Icon */}
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br", colors.accent, "shadow-lg", colors.glow)}>
        {phase.icon}
      </div>

      {/* Title & subtitle */}
      <p className="font-display font-bold text-base text-white leading-snug mb-1">{phase.title}</p>
      <p className="font-mono text-[10px] text-slate-500 mb-4">{phase.subtitle}</p>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/10 mb-4 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", colors.accent)}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={cn("text-[10px] px-2.5 py-1 rounded-full border font-medium", s.style)}>{s.text}</span>
        <span className="font-mono text-xs text-slate-400">
          {done}/{phase.topics.length}
        </span>
      </div>
    </motion.button>
  );
}

/* ================================================================
   PHASE DETAIL — Expanded view
   ================================================================ */

function PhaseDetail({
  phase,
  progress,
  onToggle,
}: {
  phase: RoadmapPhase;
  progress: RoadmapProgress;
  onToggle: (pid: number, tid: string) => void;
}) {
  const colors = PHASE_COLORS[phase.id];
  const pct = getPhaseProgress(progress, phase.id);
  const done = Math.round((pct / 100) * phase.topics.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 relative overflow-hidden"
    >
      {/* Accent line */}
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", colors.accent)} />

      {/* Glow orb */}
      <div className={cn("absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 bg-gradient-to-br", colors.accent)} />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex items-start gap-4">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-xl", colors.accent, colors.glow)}>
              {phase.icon}
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                Phase {phase.id} · {phase.dateStart} → {phase.dateEnd}
              </p>
              <h3 className="font-display font-bold text-2xl text-white">{phase.title}</h3>
              <p className="font-body text-sm text-slate-400 mt-1">{phase.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-display font-bold text-3xl text-white tabular-nums">{pct}%</p>
              <p className="font-mono text-[10px] text-slate-500 uppercase">{done} of {phase.topics.length}</p>
            </div>
            <div className="w-16 h-16">
              <svg viewBox="0 0 36 36" className="-rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={100}
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - pct }}
                  className={cn("stroke-current", colors.text)}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Topics grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {phase.topics.map((t) => {
            const completed = isTopicCompleted(progress, phase.id, t.id);
            return (
              <button
                key={t.id}
                onClick={() => onToggle(phase.id, t.id)}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-2xl text-left transition-all",
                  "border",
                  completed
                    ? `bg-gradient-to-r ${colors.accent} border-transparent shadow-lg ${colors.glow}`
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                    completed ? "bg-white/20" : "bg-white/5 border border-white/20 group-hover:border-white/40"
                  )}
                >
                  {completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={cn("font-body text-sm transition-colors", completed ? "text-white" : "text-slate-300 group-hover:text-white")}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function FAANGRoadmapClient() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();

  /* state */
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("roadmap_progress", DEFAULT_ROADMAP_PROGRESS);
  const [selId, setSelId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("mission");
  const [files, setFiles] = useState<UploadedFile[]>([]);

  /* supabase */
  const { upload, remove: deleteFile, isAvailable: storageAvailable } = useSupabaseStorage();

  /* migrate */
  useEffect(() => {
    if (progress && progress.phases) {
      const migrated = migrateProgress(progress);
      if (migrated !== progress) setProgress(migrated);
    }
  }, [progress, setProgress]);

  /* callbacks */
  const pick = useCallback((id: number) => {
    setSelId((p) => (p === id ? null : id));
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, []);

  const toggle = useCallback((pid: number, tid: string) => {
    setProgress((prev) => toggleTopicProgress(prev, pid, tid));
  }, [setProgress]);

  const handleDeleteFile = useCallback(async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file?.file_url) {
      const match = file.file_url.match(/roadmap-solutions\/[^?]+/);
      if (match) await deleteFile(match[0]);
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, [files, deleteFile]);

  /* memos */
  const day = useMemo(() => dayInfo(), []);
  const act = useMemo(() => activePhase(), []);
  const heat = useMemo(() => heatmap(progress), [progress]);
  const stk = useMemo(() => streak(progress), [progress]);

  const totalTopics = ROADMAP_PHASES.reduce((s, p) => s + p.topics.length, 0);
  const totalDone = progress.phases.reduce(
    (s, p) => s + p.topicProgress.filter((t) => t.completed).length,
    0
  );
  const overallPct = Math.round((totalDone / totalTopics) * 100);

  /* loading */
  if (authLoading) return (
    <div className="flex justify-center py-32">
      <div className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  /* auth */
  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v.01M12 12v-4m0 12a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-xl text-white mb-2">Access Restricted</h2>
        <p className="font-body text-sm text-slate-400">Sign in to view this roadmap.</p>
      </div>
    );
  }

  const sel = selId ? ROADMAP_PHASES.find((p) => p.id === selId) : null;
  const totalHrs = DAILY_COMMITMENT.reduce((s, d) => s + d.hours, 0);

  const TABS = [
    { id: "mission" as TabId, label: "Mission Control", icon: "🎯" },
    { id: "daily-questions" as TabId, label: "Daily Questions", icon: "📝" },
    { id: "productivity" as TabId, label: "Productivity", icon: "⚡" },
    { id: "advanced" as TabId, label: "Advanced", icon: "🚀" },
    { id: "resources" as TabId, label: "Resources", icon: "📚" },
  ];

  return (
    <div className="space-y-8">
      {/* ─── TAB NAVIGATION — Glass pill ─── */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-mono text-sm transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── DAILY QUESTIONS TAB ─── */}
      {activeTab === "daily-questions" && <DailyQuestionsView />}

      {/* ─── PRODUCTIVITY TOOLS TAB ─── */}
      {activeTab === "productivity" && <ProductivityDashboard streak={stk} />}

      {/* ─── ADVANCED TRAINING TAB ─── */}
      {activeTab === "advanced" && <AdvancedFeatures />}

      {/* ─── RESOURCES TAB ─── */}
      {activeTab === "resources" && <ResourcesView />}

      {/* ─── MISSION CONTROL TAB ─── */}
      {activeTab === "mission" && (
        <div className="space-y-10">

          {/* ─── 1 HERO — Glass card with neon accents ─── */}
          <section className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-500 rounded-full blur-[150px] opacity-20" />

            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              {/* Progress Ring */}
              <ProgressRing value={overallPct} />

              {/* Text + Stats */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-xs text-blue-400 uppercase tracking-[0.3em] mb-2"
                  >
                    Mission Control
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display font-extrabold text-4xl leading-tight text-white"
                  >
                    Google SDE Prep
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-body text-base text-slate-400 mt-2"
                  >
                    8-month structured roadmap · Mar 14 – Nov 17, 2026
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
                  <Stat label="Day" value={day.current} sub={`/${TOTAL_DAYS}`} color="blue" />
                  <Stat label="Left" value={`${day.remaining}d`} color="amber" />
                  <Stat label="Streak" value={`${stk}d`} color="orange" />
                  <Stat label="Topics" value={totalDone} sub={`/${totalTopics}`} color="emerald" />
                </motion.div>
              </div>

              {/* Heatmap + Targets */}
              <div className="flex flex-col gap-6 flex-shrink-0">
                <Heatmap data={heat} />
                <div className="grid grid-cols-2 gap-3">
                  {TARGETS.map((t) => (
                    <div key={t.label} className="text-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                      <p className="font-display font-bold text-xl text-white leading-none">{t.target}</p>
                      <p className="font-mono text-[8px] text-slate-500 uppercase mt-1">{t.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─── 2 DAILY TRACKER ─── */}
          <section>
            <DailyStudyTracker
              progress={progress}
              onUpdateProgress={setProgress}
              files={files}
              onUploadFile={(f) => upload(f, `roadmap-solutions/${Date.now()}-${f.name}`)}
              onFileAdded={(f) => setFiles((prev) => [...prev, { ...f, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString() }])}
              onDeleteFile={handleDeleteFile}
            />
          </section>

          {/* ─── 2b STUDY CALENDAR ─── */}
          <section>
            <StudyCalendar progress={progress} files={files} />
          </section>

          {/* ─── 3 TIMELINE — Phase cards carousel ─── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">The Journey</p>
                <h3 className="font-display font-bold text-xl text-white mt-1">8 Phases to Success</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center px-4 mb-6">
              {ROADMAP_PHASES.map((p, i) => {
                const ppct = getPhaseProgress(progress, p.id);
                const full = ppct === 100;
                const isAct = p.id === act;
                const colors = PHASE_COLORS[p.id];
                return (
                  <div key={p.id} className="flex items-center flex-1">
                    <button
                      onClick={() => pick(p.id)}
                      title={p.title}
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all flex-shrink-0 hover:scale-125",
                        full
                          ? `bg-gradient-to-br ${colors.accent} shadow-lg ${colors.glow}`
                          : isAct
                          ? `${colors.bg} border-2 border-current ${colors.text}`
                          : ppct > 0
                          ? `${colors.bg} border border-white/20`
                          : "bg-white/5 border border-white/10"
                      )}
                    >
                      {full && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    {i < ROADMAP_PHASES.length - 1 && (
                      <div className="flex-1 h-0.5 bg-white/5 mx-2 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${ppct}%` }}
                          transition={{ duration: 0.8 }}
                          className={cn("h-full rounded-full bg-gradient-to-r", colors.accent)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scrollable cards */}
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {ROADMAP_PHASES.map((p, i) => (
                <PhaseCard
                  key={p.id}
                  phase={p}
                  pct={getPhaseProgress(progress, p.id)}
                  active={p.id === act}
                  selected={p.id === selId}
                  onSelect={() => pick(p.id)}
                  idx={i}
                />
              ))}
            </div>
          </section>

          {/* ─── 4 PHASE DETAIL ─── */}
          <div ref={detailRef}>
            <AnimatePresence mode="wait">
              {sel && <PhaseDetail key={sel.id} phase={sel} progress={progress} onToggle={toggle} />}
            </AnimatePresence>
          </div>

          {/* ─── 5 WEEKLY + DAILY — Glass cards ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="glass-card rounded-3xl p-8">
              <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Weekly Rhythm</p>
              <div className="space-y-2">
                {WEEKLY_PLAN.map((w, i) => {
                  const dayColors = ["emerald", "blue", "violet", "fuchsia", "amber", "rose", "cyan"];
                  const c = dayColors[i];
                  return (
                    <div key={w.day} className="flex items-center gap-4">
                      <span className="font-mono text-xs text-slate-500 w-10 font-medium">{w.day.slice(0, 3)}</span>
                      <div className={cn("flex-1 h-11 rounded-xl flex items-center px-4 border", `bg-${c}-500/10 border-${c}-500/20`)}>
                        <span className={cn("font-mono text-sm", `text-${c}-400`)}>{w.focus}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="glass-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">Daily Commitment</p>
                <span className="font-display text-sm text-blue-400 font-bold">{totalHrs} hours</span>
              </div>
              <div className="space-y-5">
                {DAILY_COMMITMENT.map((d, i) => {
                  const barColors = ["from-emerald-400 to-teal-500", "from-blue-400 to-indigo-500", "from-violet-400 to-purple-500", "from-amber-400 to-orange-500", "from-rose-400 to-pink-500"];
                  return (
                    <div key={d.activity} className="flex items-center gap-4">
                      <span className="font-body text-sm text-slate-300 flex-1">{d.activity}</span>
                      <div className="w-32 h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(d.hours / totalHrs) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={cn("h-full rounded-full bg-gradient-to-r", barColors[i % barColors.length])}
                        />
                      </div>
                      <span className="font-mono text-sm text-slate-400 w-8 text-right tabular-nums font-medium">{d.hours}h</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                <span className="font-body text-sm text-slate-500">Total</span>
                <span className="font-display text-lg text-white font-bold">{totalHrs} hours / day</span>
              </div>
            </section>
          </div>

          {/* ─── 6 RESOURCES — Grid with hover glow ─── */}
          <section>
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-5">Quick Links</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {RESOURCES.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl p-4 border border-white/10 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all text-center group backdrop-blur-sm"
                >
                  <p className="font-body text-sm text-slate-300 group-hover:text-blue-400 transition-colors leading-tight mb-1">{r.name}</p>
                  <p className="font-mono text-[9px] text-slate-600 uppercase">{r.category}</p>
                </a>
              ))}
            </div>
          </section>

          {/* ─── 7 FOOTER GOAL — Motivational glass card ─── */}
          <section className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500 rounded-full blur-[150px] opacity-15" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-violet-500 rounded-full blur-[150px] opacity-15" />

            <div className="relative">
              <p className="font-mono text-xs text-blue-400 uppercase tracking-[0.3em] mb-6">Mission Target — November 17, 2026</p>
              <h3 className="font-display font-extrabold text-2xl text-white mb-8">Ready for Google</h3>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {["Python mastery for interviews", "400+ coding problems solved", "3 portfolio projects deployed", "20+ system designs mastered", "25+ mock interviews completed", "Google interview-ready"].map((g, i) => (
                  <motion.div
                    key={g}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-500" />
                    <span className="font-body text-sm text-slate-300">{g}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

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
   LIGHT THEME COLOR MAPPINGS
   ================================================================ */

const LIGHT_PHASE_COLORS: Record<number, { bg: string; border: string; text: string; gradient: string; ring: string }> = {
  1: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", gradient: "from-emerald-400 to-teal-500", ring: "ring-emerald-200" },
  2: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", gradient: "from-blue-400 to-indigo-500", ring: "ring-blue-200" },
  3: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", gradient: "from-violet-400 to-purple-500", ring: "ring-violet-200" },
  4: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-600", gradient: "from-fuchsia-400 to-pink-500", ring: "ring-fuchsia-200" },
  5: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", gradient: "from-orange-400 to-amber-500", ring: "ring-orange-200" },
  6: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", gradient: "from-amber-400 to-yellow-500", ring: "ring-amber-200" },
  7: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", gradient: "from-rose-400 to-red-500", ring: "ring-rose-200" },
  8: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", gradient: "from-cyan-400 to-sky-500", ring: "ring-cyan-200" },
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
  if (pct === 100) return { text: "Complete", style: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (pct > 0) return { text: "In Progress", style: "bg-blue-100 text-blue-700 border-blue-200" };
  return { text: "Locked", style: "bg-slate-100 text-slate-500 border-slate-200" };
}

function activePhase() {
  const t = new Date().toISOString().split("T")[0];
  return ROADMAP_PHASES.find((p) => t >= p.dateStart && t <= p.dateEnd)?.id ?? 1;
}

/* ================================================================
   PROGRESS RING — Apple-style with light theme
   ================================================================ */

function ProgressRing({ value }: { value: number }) {
  const size = 180;
  const sw = 14;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Subtle shadow/glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 blur-2xl opacity-60" />

      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 relative">
        {/* track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw} />
        {/* value */}
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
          stroke="url(#progressGradient)"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span className="font-display font-extrabold text-5xl bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent tabular-nums">{value}</span>
        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">percent</span>
      </div>
    </div>
  );
}

/* ================================================================
   HEATMAP — GitHub-style with light colors
   ================================================================ */

function Heatmap({ data }: { data: { date: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  const weeks: (typeof data)[] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Last 5 Weeks</p>
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
                    ? "bg-slate-100"
                    : d.n <= max * 0.25
                    ? "bg-emerald-200"
                    : d.n <= max * 0.5
                    ? "bg-emerald-300"
                    : d.n <= max * 0.75
                    ? "bg-emerald-400"
                    : "bg-emerald-500"
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
   STAT PILL — Notion-style cards
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
  color?: "blue" | "amber" | "orange" | "emerald";
}) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-100",
    amber: "bg-amber-50 border-amber-100",
    orange: "bg-orange-50 border-orange-100",
    emerald: "bg-emerald-50 border-emerald-100",
  };

  return (
    <div className={cn("rounded-2xl px-5 py-4 border min-w-[90px] text-center backdrop-blur-sm", colorMap[color])}>
      <p className="font-mono text-[8px] text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
      <p className="font-display font-bold text-2xl text-slate-800 leading-none tabular-nums">
        {value}
        {sub && <span className="text-slate-300 text-sm font-normal">{sub}</span>}
      </p>
    </div>
  );
}

/* ================================================================
   PHASE CARD — Netflix-style cards with light theme
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
  const colors = LIGHT_PHASE_COLORS[phase.id];

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.06 }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "snap-start flex-shrink-0 w-[220px] rounded-3xl p-6 text-left transition-all relative overflow-hidden",
        "border shadow-sm hover:shadow-xl",
        selected
          ? `${colors.bg} ${colors.border} ring-2 ${colors.ring}`
          : active
          ? `${colors.bg} ${colors.border}`
          : "bg-white border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Gradient accent bar */}
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", colors.gradient)} />

      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 shadow-sm",
          `bg-gradient-to-br ${colors.gradient} text-white`
        )}
      >
        {phase.icon}
      </div>

      {/* Title */}
      <p className={cn("font-display font-bold text-base leading-snug mb-1", selected || active ? colors.text : "text-slate-700")}>
        {phase.title}
      </p>
      <p className="font-mono text-[10px] text-slate-400 mb-4">{phase.subtitle}</p>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-slate-100 mb-3 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-slate-400 tabular-nums">{done}/{phase.topics.length}</span>
        <span className={cn("font-mono text-[9px] px-2 py-1 rounded-full border leading-none font-medium", s.style)}>
          {s.text}
        </span>
      </div>
    </motion.button>
  );
}

/* ================================================================
   PHASE DETAIL — Expanded view with light theme
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
  const [q, setQ] = useState("");
  const clusters = PHASE_CLUSTERS[phase.id] || [];
  const done = phase.topics.filter((t) => isTopicCompleted(progress, phase.id, t.id)).length;
  const pct = getPhaseProgress(progress, phase.id);
  const searching = q.trim().length > 0;
  const filtered = searching
    ? phase.topics.filter((t) => t.label.toLowerCase().includes(q.toLowerCase()))
    : null;
  const colors = LIGHT_PHASE_COLORS[phase.id];

  const Checkbox = ({ checked }: { checked: boolean }) => (
    <div
      className={cn(
        "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
        checked
          ? `bg-gradient-to-br ${colors.gradient} border-transparent`
          : "border-slate-300 group-hover:border-slate-400"
      )}
    >
      {checked && (
        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </motion.svg>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("rounded-3xl border p-8 shadow-lg", colors.bg, colors.border)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg",
              `bg-gradient-to-br ${colors.gradient} text-white`
            )}
          >
            {phase.icon}
          </div>
          <div>
            <h3 className={cn("font-display font-bold text-2xl", colors.text)}>{phase.title}</h3>
            <p className="font-mono text-xs text-slate-400 mt-1">{phase.duration}</p>
            <p className="font-body text-sm text-slate-500 mt-2 max-w-md">{phase.goal}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className={cn("font-display font-bold text-3xl tabular-nums", colors.text)}>{pct}%</p>
            <p className="font-mono text-[9px] text-slate-400 uppercase">Progress</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-3xl text-slate-700 tabular-nums">{done}<span className="text-slate-300 text-lg">/{phase.topics.length}</span></p>
            <p className="font-mono text-[9px] text-slate-400 uppercase">Topics</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/80 mb-8 overflow-hidden shadow-inner">
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)} />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${phase.topics.length} topics…`}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 font-mono outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all shadow-sm"
        />
        {searching && (
          <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Topics */}
      {filtered ? (
        <div className="space-y-2 mb-6">
          {filtered.length === 0 && (
            <p className="text-center py-10 font-body text-sm text-slate-400">No topics match &ldquo;{q}&rdquo;</p>
          )}
          {filtered.map((topic) => {
            const checked = isTopicCompleted(progress, phase.id, topic.id);
            return (
              <label key={topic.id} className={cn("flex items-center gap-4 px-5 py-3 rounded-2xl cursor-pointer group transition-all", checked ? "bg-white/50" : "hover:bg-white/80")}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(phase.id, topic.id)} className="sr-only" />
                <Checkbox checked={checked} />
                <span className={cn("font-body text-sm", checked ? "text-slate-400 line-through" : "text-slate-600")}>{topic.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {clusters.map((name, ci) => {
            const per = Math.ceil(phase.topics.length / clusters.length);
            const items = phase.topics.slice(ci * per, (ci + 1) * per);
            const cDone = items.filter((t) => isTopicCompleted(progress, phase.id, t.id)).length;
            return (
              <div key={name} className="rounded-2xl bg-white/70 border border-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className={cn("font-mono text-xs uppercase tracking-wider font-semibold", colors.text)}>{name}</p>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">{cDone}/{items.length}</span>
                </div>
                <div className="space-y-1">
                  {items.map((topic) => {
                    const checked = isTopicCompleted(progress, phase.id, topic.id);
                    return (
                      <label key={topic.id} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer group transition-all", checked ? "" : "hover:bg-slate-50")}>
                        <input type="checkbox" checked={checked} onChange={() => onToggle(phase.id, topic.id)} className="sr-only" />
                        <Checkbox checked={checked} />
                        <span className={cn("font-body text-sm leading-snug", checked ? "text-slate-400 line-through" : "text-slate-600")}>{topic.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/50">
        <div>
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-3">Daily Practice</p>
          <p className="font-body text-sm text-slate-500 leading-relaxed">{phase.practice}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-3">Milestones</p>
          <ul className="space-y-2">
            {phase.milestones.map((m) => (
              <li key={m} className="flex items-start gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-gradient-to-r", colors.gradient)} />
                <span className="font-body text-sm text-slate-500 leading-snug">{m}</span>
              </li>
            ))}
          </ul>
        </div>
        {phase.platforms && (
          <div>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-3">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {phase.platforms.map((p) => (
                <span key={p} className="px-3 py-1.5 rounded-xl font-mono text-xs bg-white text-slate-500 border border-slate-200 shadow-sm">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN — MISSION CONTROL
   ================================================================ */

export function FAANGRoadmapClient() {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("pj-faang-roadmap", DEFAULT_ROADMAP_PROGRESS);
  const [files, setFiles] = useLocalStorage<UploadedFile[]>("pj-roadmap-solutions", []);
  const { upload, remove } = useSupabaseStorage();
  const [selId, setSelId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("mission");
  const detailRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* migrate old data */
  useEffect(() => {
    if (ROADMAP_PHASES.some((ph) => {
      const s = progress.phases.find((p) => p.phaseId === ph.id);
      return !s || s.topicProgress.length !== ph.topics.length;
    })) setProgress(migrateProgress(progress));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* derived state */
  const day = useMemo(dayInfo, []);
  const stk = useMemo(() => streak(progress), [progress]);
  const heat = useMemo(() => heatmap(progress), [progress]);
  const act = useMemo(activePhase, []);

  const totalDone = useMemo(() => {
    let n = 0;
    for (const p of progress.phases) for (const t of p.topicProgress) if (t.completed) n++;
    return n;
  }, [progress]);

  const totalTopics = useMemo(() => ROADMAP_PHASES.reduce((s, p) => s + p.topics.length, 0), []);

  const overallPct = useMemo(() => {
    let s = 0;
    ROADMAP_PHASES.forEach((p) => { s += getPhaseProgress(progress, p.id); });
    return Math.round(s / ROADMAP_PHASES.length);
  }, [progress]);

  /* handlers */
  const pick = useCallback((id: number) => {
    setSelId((p) => (p === id ? null : id));
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
  }, []);

  const toggle = useCallback((pid: number, tid: string) => {
    setProgress((p) => toggleTopicProgress(p, pid, tid));
  }, [setProgress]);

  const handleDeleteFile = useCallback((fileId: string, storagePath: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (storagePath) remove(storagePath).catch(() => {});
  }, [setFiles, remove]);

  /* loading */
  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  /* auth */
  if (!user) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v.01M12 12v-4m0 12a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </div>
        <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Access Restricted</h2>
        <p className="font-body text-sm text-slate-500">Sign in to view this roadmap.</p>
      </div>
    );
  }

  const sel = selId ? ROADMAP_PHASES.find((p) => p.id === selId) : null;
  const totalHrs = DAILY_COMMITMENT.reduce((s, d) => s + d.hours, 0);

  const TABS = [
    { id: "mission" as TabId, label: "Mission Control", icon: "🎯" },
    { id: "daily-questions" as TabId, label: "Daily Questions", icon: "📝" },
    { id: "productivity" as TabId, label: "Productivity Tools", icon: "⚡" },
    { id: "advanced" as TabId, label: "Advanced Training", icon: "🚀" },
    { id: "resources" as TabId, label: "Resources", icon: "📚" },
  ];

  return (
    <div className="space-y-8">
      {/* ─── TAB NAVIGATION — Apple-style segmented control ─── */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-mono text-sm transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── DAILY QUESTIONS TAB ────────────────────────────── */}
      {activeTab === "daily-questions" && (
        <DailyQuestionsView />
      )}

      {/* ─── PRODUCTIVITY TOOLS TAB ─────────────────────────── */}
      {activeTab === "productivity" && (
        <ProductivityDashboard streak={stk} />
      )}

      {/* ─── ADVANCED TRAINING TAB ───────────────────────────── */}
      {activeTab === "advanced" && (
        <AdvancedFeatures />
      )}

      {/* ─── RESOURCES TAB ───────────────────────────────────── */}
      {activeTab === "resources" && (
        <ResourcesView />
      )}

      {/* ─── MISSION CONTROL TAB ────────────────────────────── */}
      {activeTab === "mission" && (
        <div className="space-y-10">

      {/* ─── 1  HERO — Apple-style glass card ─────────────── */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/30 to-violet-50/30 p-8 md:p-12 relative overflow-hidden shadow-xl">
        {/* Subtle pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-[100px] opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-200 rounded-full blur-[100px] opacity-40" />

        <div className="relative flex flex-col lg:flex-row items-center gap-12">

          {/* Progress Ring */}
          <ProgressRing value={overallPct} />

          {/* Text + Stats */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs text-blue-500 uppercase tracking-[0.3em] mb-2"
              >
                Mission Control
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display font-extrabold text-4xl leading-tight bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent"
              >
                Google SDE Preparation
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
                <div key={t.label} className="text-center px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="font-display font-bold text-xl text-slate-700 leading-none">{t.target}</p>
                  <p className="font-mono text-[8px] text-slate-400 uppercase mt-1">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2  DAILY TRACKER ─────────────────────────────── */}
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

      {/* ─── 2b  STUDY CALENDAR ──────────────────────────── */}
      <section>
        <StudyCalendar progress={progress} files={files} />
      </section>

      {/* ─── 3  TIMELINE — Netflix-style phase cards ────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">The Journey</p>
            <h3 className="font-display font-bold text-xl text-slate-700 mt-1">8 Phases to Success</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scrollRef.current?.scrollBy({ left: -240, behavior: "smooth" })} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 240, behavior: "smooth" })} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center px-4 mb-6">
          {ROADMAP_PHASES.map((p, i) => {
            const ppct = getPhaseProgress(progress, p.id);
            const full = ppct === 100;
            const isAct = p.id === act;
            const colors = LIGHT_PHASE_COLORS[p.id];
            return (
              <div key={p.id} className="flex items-center flex-1">
                <button
                  onClick={() => pick(p.id)}
                  title={p.title}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 hover:scale-125",
                    full
                      ? `bg-gradient-to-br ${colors.gradient} border-transparent shadow-md`
                      : isAct
                      ? `${colors.border} ${colors.bg}`
                      : ppct > 0
                      ? `${colors.border} bg-white`
                      : "border-slate-200 bg-white"
                  )}
                >
                  {full && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>
                {i < ROADMAP_PHASES.length - 1 && (
                  <div className="flex-1 h-1 bg-slate-100 mx-2 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${ppct}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scrollable cards */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
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

      {/* ─── 4  PHASE DETAIL ──────────────────────────────── */}
      <div ref={detailRef}>
        <AnimatePresence mode="wait">
          {sel && <PhaseDetail key={sel.id} phase={sel} progress={progress} onToggle={toggle} />}
        </AnimatePresence>
      </div>

      {/* ─── 5  WEEKLY + DAILY — Notion-style cards ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-6">Weekly Rhythm</p>
          <div className="space-y-2">
            {WEEKLY_PLAN.map((w, i) => {
              const dayColors = [
                "bg-emerald-50 text-emerald-600 border-emerald-100",
                "bg-blue-50 text-blue-600 border-blue-100",
                "bg-violet-50 text-violet-600 border-violet-100",
                "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
                "bg-amber-50 text-amber-600 border-amber-100",
                "bg-rose-50 text-rose-600 border-rose-100",
                "bg-cyan-50 text-cyan-600 border-cyan-100",
              ];
              return (
                <div key={w.day} className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-400 w-10 font-medium">{w.day.slice(0, 3)}</span>
                  <div className={cn("flex-1 h-11 rounded-xl flex items-center px-4 border", dayColors[i])}>
                    <span className="font-mono text-sm">{w.focus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">Daily Commitment</p>
            <span className="font-display text-sm text-blue-500 font-bold">{totalHrs} hours</span>
          </div>
          <div className="space-y-5">
            {DAILY_COMMITMENT.map((d, i) => {
              const barColors = [
                "from-emerald-400 to-teal-500",
                "from-blue-400 to-indigo-500",
                "from-violet-400 to-purple-500",
                "from-amber-400 to-orange-500",
                "from-rose-400 to-pink-500",
              ];
              return (
                <div key={d.activity} className="flex items-center gap-4">
                  <span className="font-body text-sm text-slate-600 flex-1">{d.activity}</span>
                  <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(d.hours / totalHrs) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn("h-full rounded-full bg-gradient-to-r", barColors[i % barColors.length])}
                    />
                  </div>
                  <span className="font-mono text-sm text-slate-500 w-8 text-right tabular-nums font-medium">{d.hours}h</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
            <span className="font-body text-sm text-slate-400">Total</span>
            <span className="font-display text-lg text-slate-700 font-bold">{totalHrs} hours / day</span>
          </div>
        </section>
      </div>

      {/* ─── 6  RESOURCES — LeetCode-style grid ─────────── */}
      <section>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-5">Resources</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-4 border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all text-center group shadow-sm hover:shadow-md"
            >
              <p className="font-body text-sm text-slate-600 group-hover:text-blue-600 transition-colors leading-tight mb-1">{r.name}</p>
              <p className="font-mono text-[9px] text-slate-400 uppercase">{r.category}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ─── 7  FOOTER GOAL — Motivational ────────────────── */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-12 text-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full blur-[120px] opacity-30" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-200 rounded-full blur-[120px] opacity-30" />

        <div className="relative">
          <p className="font-mono text-xs text-blue-500 uppercase tracking-[0.3em] mb-6">Mission Target — November 17, 2026</p>
          <h3 className="font-display font-extrabold text-2xl text-slate-700 mb-8">Ready for Google</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "Python mastery for interviews",
              "400+ coding problems solved",
              "3 portfolio projects deployed",
              "20+ system designs mastered",
              "25+ mock interviews completed",
              "Google interview-ready",
            ].map((g, i) => (
              <motion.div
                key={g}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-500" />
                <span className="font-body text-sm text-slate-600">{g}</span>
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

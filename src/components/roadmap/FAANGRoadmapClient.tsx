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
import GoogleRoadmapRedesign from "./GoogleRoadmapRedesign";
import type { RoadmapProgress, UploadedFile } from "@/types";

/* Tab types */
type TabId = "mission" | "daily-questions" | "productivity" | "advanced";

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
  if (pct === 100) return { text: "Complete", style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  if (pct > 0) return { text: "In Progress", style: "bg-sky-500/20 text-sky-300 border-sky-500/30" };
  return { text: "Locked", style: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" };
}

function activePhase() {
  const t = new Date().toISOString().split("T")[0];
  return ROADMAP_PHASES.find((p) => t >= p.dateStart && t <= p.dateEnd)?.id ?? 1;
}

/* ================================================================
   PROGRESS RING  — Feature 1
   ================================================================ */

function ProgressRing({ value }: { value: number }) {
  const size = 160;
  const sw = 12;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
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
          className="stroke-blue-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span className="font-display font-extrabold text-4xl text-white tabular-nums">{value}</span>
        <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.15em] -mt-0.5">percent</span>
      </div>
      {/* glow */}
      <div className="absolute inset-4 rounded-full bg-blue-500/[0.07] blur-2xl pointer-events-none" />
    </div>
  );
}

/* ================================================================
   HEATMAP  — Feature 4
   ================================================================ */

function Heatmap({ data }: { data: { date: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  const weeks: (typeof data)[] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  return (
    <div className="space-y-1">
      <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Last 5 Weeks</p>
      <div className="flex gap-[3px]">
        {weeks.map((wk, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {wk.map((d) => (
              <div
                key={d.date}
                title={`${d.date} — ${d.n} topic${d.n !== 1 ? "s" : ""}`}
                className="w-[11px] h-[11px] rounded-sm"
                style={{
                  backgroundColor:
                    d.n === 0
                      ? "rgba(255,255,255,0.025)"
                      : `rgba(59,130,246,${Math.max(0.2, d.n / max)})`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   STAT PILL  — used in hero
   ================================================================ */

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className={cn("rounded-2xl px-4 py-3 border bg-white/[0.02] min-w-[80px] text-center", accent ?? "border-white/[0.06]")}>
      <p className="font-mono text-[7px] text-white/25 uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="font-display font-bold text-xl text-white leading-none tabular-nums">
        {value}
        {sub && <span className="text-white/20 text-[11px] font-normal">{sub}</span>}
      </p>
    </div>
  );
}

/* ================================================================
   PHASE CARD  — Feature 5, 6, 7
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

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: idx * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={cn(
        "snap-start flex-shrink-0 w-[200px] rounded-2xl p-5 text-left transition-all relative overflow-hidden",
        "border",
        selected
          ? `${phase.borderColor} ring-1 ring-inset ${phase.borderColor}`
          : active
          ? `${phase.borderColor} bg-white/[0.02]`
          : "border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.025]"
      )}
    >
      {/* top accent */}
      {(active || selected) && (
        <motion.div layoutId="phase-accent" className={cn("absolute inset-x-0 top-0 h-[2px]", phase.bgColor)} />
      )}

      {/* number */}
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold border mb-3",
          `bg-gradient-to-br ${phase.gradient} ${phase.color} ${phase.borderColor}`
        )}
      >
        {phase.icon}
      </div>

      {/* title */}
      <p className={cn("font-display font-bold text-[13px] leading-snug mb-0.5", selected || active ? phase.color : "text-white/50")}>
        {phase.title}
      </p>
      <p className="font-mono text-[9px] text-white/20 mb-4">{phase.subtitle}</p>

      {/* progress bar */}
      <div className="h-[3px] rounded-full bg-white/[0.04] mb-2 overflow-hidden">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", phase.bgColor + "/60")}
        />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/20 tabular-nums">{done}/{phase.topics.length}</span>
        <span className={cn("font-mono text-[8px] px-1.5 py-[2px] rounded border leading-none", s.style)}>
          {s.text}
        </span>
      </div>
    </motion.button>
  );
}

/* ================================================================
   PHASE DETAIL  — Feature 8, 9
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

  const Checkbox = ({ checked, color }: { checked: boolean; color: string }) => (
    <div
      className={cn(
        "w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
        checked ? `${color}/30 border-current` : "border-white/10 group-hover:border-white/20"
      )}
    >
      {checked && (
        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("rounded-3xl border p-6 md:p-8 bg-white/[0.015]", phase.borderColor)}
    >
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-base font-bold border",
              `bg-gradient-to-br ${phase.gradient} ${phase.color} ${phase.borderColor}`
            )}
          >
            {phase.icon}
          </div>
          <div>
            <h3 className={cn("font-display font-bold text-xl", phase.color)}>{phase.title}</h3>
            <p className="font-mono text-[10px] text-white/25 mt-0.5">{phase.duration}</p>
            <p className="font-body text-xs text-white/40 mt-1 max-w-md">{phase.goal}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className={cn("font-display font-bold text-2xl tabular-nums", phase.color)}>{pct}%</p>
            <p className="font-mono text-[8px] text-white/20 uppercase">Progress</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-white tabular-nums">{done}<span className="text-white/15 text-sm">/{phase.topics.length}</span></p>
            <p className="font-mono text-[8px] text-white/20 uppercase">Topics</p>
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="h-1 rounded-full bg-white/[0.04] mb-6 overflow-hidden">
        <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className={cn("h-full rounded-full", phase.bgColor + "/50")} />
      </div>

      {/* search — Feature 8 */}
      <div className="relative mb-5">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${phase.topics.length} topics…`}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-sm text-white placeholder:text-white/15 font-mono outline-none focus:border-white/15 transition-colors"
        />
        {searching && (
          <button onClick={() => setQ("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* search results */}
      {filtered ? (
        <div className="space-y-1 mb-6">
          {filtered.length === 0 && (
            <p className="text-center py-8 font-body text-sm text-white/20">No topics match &ldquo;{q}&rdquo;</p>
          )}
          {filtered.map((topic) => {
            const checked = isTopicCompleted(progress, phase.id, topic.id);
            return (
              <label key={topic.id} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer group transition-colors", phase.color, checked ? "bg-white/[0.015]" : "hover:bg-white/[0.02]")}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(phase.id, topic.id)} className="sr-only" />
                <Checkbox checked={checked} color={phase.bgColor} />
                <span className={cn("font-body text-sm", checked ? "text-white/25 line-through" : "text-white/60")}>{topic.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        /* clustered view — Feature 9 */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {clusters.map((name, ci) => {
            const per = Math.ceil(phase.topics.length / clusters.length);
            const items = phase.topics.slice(ci * per, (ci + 1) * per);
            const cDone = items.filter((t) => isTopicCompleted(progress, phase.id, t.id)).length;
            return (
              <div key={name} className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className={cn("font-mono text-[10px] uppercase tracking-wider font-medium", phase.color)}>{name}</p>
                  <span className="font-mono text-[10px] text-white/15 tabular-nums">{cDone}/{items.length}</span>
                </div>
                <div className="space-y-0.5">
                  {items.map((topic) => {
                    const checked = isTopicCompleted(progress, phase.id, topic.id);
                    return (
                      <label key={topic.id} className={cn("flex items-center gap-2.5 px-2.5 py-[7px] rounded-xl cursor-pointer group transition-colors", phase.color, checked ? "" : "hover:bg-white/[0.015]")}>
                        <input type="checkbox" checked={checked} onChange={() => onToggle(phase.id, topic.id)} className="sr-only" />
                        <Checkbox checked={checked} color={phase.bgColor} />
                        <span className={cn("font-body text-[13px] leading-snug", checked ? "text-white/25 line-through" : "text-white/55")}>{topic.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* bottom info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-white/[0.04]">
        <div>
          <p className="font-mono text-[9px] text-white/15 uppercase tracking-widest mb-2">Daily Practice</p>
          <p className="font-body text-[13px] text-white/40 leading-relaxed">{phase.practice}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] text-white/15 uppercase tracking-widest mb-2">Milestones</p>
          <ul className="space-y-1.5">
            {phase.milestones.map((m) => (
              <li key={m} className="flex items-start gap-2">
                <div className={cn("w-1 h-1 rounded-full mt-[7px] flex-shrink-0", phase.bgColor)} />
                <span className="font-body text-[13px] text-white/40 leading-snug">{m}</span>
              </li>
            ))}
          </ul>
        </div>
        {phase.platforms && (
          <div>
            <p className="font-mono text-[9px] text-white/15 uppercase tracking-widest mb-2">Platforms</p>
            <div className="flex flex-wrap gap-1.5">
              {phase.platforms.map((p) => (
                <span key={p} className="px-2.5 py-1 rounded-lg font-mono text-[11px] bg-white/[0.03] text-white/30 border border-white/[0.05]">{p}</span>
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
  if (loading) return <div className="flex justify-center py-32"><div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /></div>;

  /* auth */
  if (!user) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v.01M12 12v-4m0 12a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </div>
        <h2 className="font-display font-bold text-xl text-white mb-2">Access Restricted</h2>
        <p className="font-body text-sm text-white/35">Sign in to view this roadmap.</p>
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
  ];

  return (
    <div className="space-y-8">
      {/* ─── TAB NAVIGATION ─────────────────────────────────── */}
      <div className="flex justify-center">
        <div className="inline-flex gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-mono text-sm transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
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

      {/* ─── MISSION CONTROL TAB ────────────────────────────── */}
      {activeTab === "mission" && (
        <GoogleRoadmapRedesign />
      )}
    </div>
  );
}

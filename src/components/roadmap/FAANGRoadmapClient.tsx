"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { isOwner } from "@/lib/roles";
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
import type { RoadmapProgress, UploadedFile } from "@/types";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Helpers
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function getDayInfo() {
  const start = new Date("2026-03-14");
  const end = new Date("2026-11-17");
  const now = new Date();
  const msDay = 86_400_000;
  const total = Math.ceil((end.getTime() - start.getTime()) / msDay);
  const current = Math.max(1, Math.min(total, Math.ceil((now.getTime() - start.getTime()) / msDay) + 1));
  const remaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / msDay));
  return { current, total, remaining };
}

function computeStreak(progress: RoadmapProgress): number {
  const dates = new Set<string>();
  progress.phases.forEach((p) =>
    p.topicProgress.forEach((t) => {
      if (t.completed && t.completedAt) dates.add(t.completedAt.split("T")[0]);
    })
  );
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().split("T")[0];
    if (dates.has(key)) {
      streak++;
    } else if (i > 0) break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function getStudyHeatmap(progress: RoadmapProgress): { date: string; count: number }[] {
  const counts: Record<string, number> = {};
  progress.phases.forEach((p) =>
    p.topicProgress.forEach((t) => {
      if (t.completed && t.completedAt) {
        const day = t.completedAt.split("T")[0];
        counts[day] = (counts[day] || 0) + 1;
      }
    })
  );
  const result: { date: string; count: number }[] = [];
  const d = new Date();
  for (let i = 34; i >= 0; i--) {
    const nd = new Date(d);
    nd.setDate(nd.getDate() - i);
    const key = nd.toISOString().split("T")[0];
    result.push({ date: key, count: counts[key] || 0 });
  }
  return result;
}

function getPhaseStatus(pct: number): { label: string; cls: string } {
  if (pct === 100) return { label: "Complete", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
  if (pct > 0) return { label: "In Progress", cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" };
  return { label: "Locked", cls: "bg-white/5 text-white/25 border-white/10" };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Progress Ring
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ProgressRing({ value, size = 140, stroke = 10 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="stroke-blue-500"
        />
      </svg>
      <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display font-bold text-3xl text-white"
        >
          {value}%
        </motion.span>
        <span className="font-mono text-[8px] text-white/25 uppercase tracking-[0.2em]">Complete</span>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Study Heatmap (last 35 days)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function StudyHeatmap({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  // 5 rows x 7 cols
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  return (
    <div>
      <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest mb-1.5">Study Activity</p>
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((d) => {
              const intensity = d.count === 0 ? 0 : Math.max(0.2, d.count / max);
              return (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count} topic${d.count !== 1 ? "s" : ""}`}
                  className="w-[10px] h-[10px] rounded-[2px] transition-colors"
                  style={{ backgroundColor: d.count > 0 ? `rgba(59, 130, 246, ${intensity})` : "rgba(255,255,255,0.03)" }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Phase Timeline Card
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PhaseTimelineCard({
  phase, phasePct, isActive, isSelected, onSelect, index,
}: {
  phase: RoadmapPhase; phasePct: number; isActive: boolean; isSelected: boolean; onSelect: () => void; index: number;
}) {
  const status = getPhaseStatus(phasePct);
  const completedCount = Math.round((phasePct / 100) * phase.topics.length);

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "flex-shrink-0 w-[190px] rounded-2xl p-4 border text-left transition-all relative overflow-hidden snap-start",
        isSelected
          ? `${phase.borderColor} bg-gradient-to-b ${phase.gradient}`
          : isActive
          ? `${phase.borderColor} bg-white/[0.03]`
          : "border-white/5 bg-white/[0.015] hover:bg-white/[0.03]"
      )}
    >
      {/* Active glow line */}
      {(isActive || isSelected) && (
        <div className={cn("absolute top-0 left-0 right-0 h-[2px]", phase.bgColor)} />
      )}

      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold mb-3 border",
        `bg-gradient-to-br ${phase.gradient} ${phase.color} ${phase.borderColor}`
      )}>
        {phase.icon}
      </div>

      <h4 className={cn(
        "font-display font-bold text-sm mb-0.5 leading-tight",
        isSelected || isActive ? phase.color : "text-white/50"
      )}>
        {phase.title}
      </h4>
      <p className="font-mono text-[9px] text-white/20 mb-3">{phase.subtitle}</p>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-2">
        <motion.div
          animate={{ width: `${phasePct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", phase.bgColor + "/60")}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/25">{completedCount}/{phase.topics.length}</span>
        <span className={cn("font-mono text-[8px] px-1.5 py-0.5 rounded-md border", status.cls)}>
          {status.label}
        </span>
      </div>
    </motion.button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Phase Detail Panel (expanded with search + checkboxes)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PhaseDetail({
  phase, progress, onToggleTopic,
}: {
  phase: RoadmapPhase; progress: RoadmapProgress; onToggleTopic: (phaseId: number, topicId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const clusters = PHASE_CLUSTERS[phase.id] || [];
  const completedCount = phase.topics.filter((t) => isTopicCompleted(progress, phase.id, t.id)).length;
  const phasePct = getPhaseProgress(progress, phase.id);

  const filteredTopics = search.trim()
    ? phase.topics.filter((t) => t.label.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className={cn("glass-card rounded-2xl p-6 border", phase.borderColor)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold border", `bg-gradient-to-br ${phase.gradient} ${phase.color} ${phase.borderColor}`)}>
              {phase.icon}
            </div>
            <div>
              <h3 className={cn("font-display font-bold text-lg", phase.color)}>{phase.title}</h3>
              <p className="font-mono text-[10px] text-white/25">{phase.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className={cn("font-display font-bold text-xl", phase.color)}>{phasePct}%</span>
              <p className="font-mono text-[9px] text-white/20">{completedCount}/{phase.topics.length} topics</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-5">
          <motion.div animate={{ width: `${phasePct}%` }} transition={{ duration: 0.6 }} className={cn("h-full rounded-full", phase.bgColor + "/50")} />
        </div>

        <p className="font-body text-sm text-white/45 mb-5">{phase.goal}</p>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${phase.topics.length} topics…`}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-white/70 font-mono text-xs outline-none focus:border-white/15 placeholder:text-white/15 transition-colors"
          />
        </div>

        {/* Topics — search mode (flat list) */}
        {filteredTopics ? (
          <div className="space-y-0.5 mb-5">
            {filteredTopics.map((topic) => {
              const done = isTopicCompleted(progress, phase.id, topic.id);
              return (
                <label key={topic.id} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer group transition-colors", done ? "bg-white/[0.02]" : "hover:bg-white/[0.02]")}>
                  <input type="checkbox" checked={done} onChange={() => onToggleTopic(phase.id, topic.id)} className="sr-only" />
                  <div className={cn("w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0", done ? `${phase.bgColor}/30 ${phase.borderColor}` : "border-white/10 group-hover:border-white/25")}>
                    {done && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("w-2.5 h-2.5", phase.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>}
                  </div>
                  <span className={cn("font-body text-sm", done ? "text-white/30 line-through" : "text-white/65")}>{topic.label}</span>
                </label>
              );
            })}
            {filteredTopics.length === 0 && (
              <p className="text-center py-6 font-body text-sm text-white/20">No topics match &ldquo;{search}&rdquo;</p>
            )}
          </div>
        ) : (
          /* Topics — cluster mode (2-col grid) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {clusters.map((cluster, ci) => {
              const perCluster = Math.ceil(phase.topics.length / clusters.length);
              const clusterTopics = phase.topics.slice(ci * perCluster, (ci + 1) * perCluster);
              const clusterDone = clusterTopics.filter((t) => isTopicCompleted(progress, phase.id, t.id)).length;
              return (
                <div key={cluster} className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className={cn("font-mono text-[10px] uppercase tracking-wider", phase.color)}>{cluster}</p>
                    <span className="font-mono text-[9px] text-white/15">{clusterDone}/{clusterTopics.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {clusterTopics.map((topic) => {
                      const done = isTopicCompleted(progress, phase.id, topic.id);
                      return (
                        <label key={topic.id} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group transition-colors", done ? "bg-white/[0.01]" : "hover:bg-white/[0.02]")}>
                          <input type="checkbox" checked={done} onChange={() => onToggleTopic(phase.id, topic.id)} className="sr-only" />
                          <div className={cn("w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0", done ? `${phase.bgColor}/30 ${phase.borderColor}` : "border-white/10 group-hover:border-white/20")}>
                            {done && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("w-2.5 h-2.5", phase.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>}
                          </div>
                          <span className={cn("font-body text-xs", done ? "text-white/30 line-through" : "text-white/60")}>{topic.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom: Practice + Milestones + Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-white/5">
          <div>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-2">Practice</p>
            <p className="font-body text-xs text-white/45">{phase.practice}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-2">Milestones</p>
            {phase.milestones.map((m) => (
              <div key={m} className="flex items-start gap-1.5 mb-1">
                <div className={cn("w-1 h-1 rounded-full mt-1.5 flex-shrink-0", phase.color.replace("text-", "bg-"))} />
                <span className="font-body text-xs text-white/45">{m}</span>
              </div>
            ))}
          </div>
          {phase.platforms && (
            <div>
              <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-2">Platforms</p>
              <div className="flex flex-wrap gap-1.5">
                {phase.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-white/5 text-white/35 border border-white/5">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Component — Mission Control
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function FAANGRoadmapClient() {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("pj-faang-roadmap", DEFAULT_ROADMAP_PROGRESS);
  const [solutionFiles, setSolutionFiles] = useLocalStorage<UploadedFile[]>("pj-roadmap-solutions", []);
  const { upload: uploadFile } = useSupabaseStorage();
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Migration
  useEffect(() => {
    const needsMigration = ROADMAP_PHASES.some((phase) => {
      const stored = progress.phases.find((p) => p.phaseId === phase.id);
      return !stored || stored.topicProgress.length !== phase.topics.length;
    });
    if (needsMigration) setProgress(migrateProgress(progress));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dayInfo = useMemo(() => getDayInfo(), []);
  const streak = useMemo(() => computeStreak(progress), [progress]);
  const heatmap = useMemo(() => getStudyHeatmap(progress), [progress]);

  const overallPct = useMemo(() => {
    if (ROADMAP_PHASES.length === 0) return 0;
    let sum = 0;
    ROADMAP_PHASES.forEach((p) => { sum += getPhaseProgress(progress, p.id); });
    return Math.round(sum / ROADMAP_PHASES.length);
  }, [progress]);

  const totalTopicsCompleted = useMemo(() => {
    let count = 0;
    progress.phases.forEach((p) => p.topicProgress.forEach((t) => { if (t.completed) count++; }));
    return count;
  }, [progress]);

  const totalTopics = useMemo(() => ROADMAP_PHASES.reduce((sum, p) => sum + p.topics.length, 0), []);

  const activePhaseId = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return ROADMAP_PHASES.find((p) => today >= p.dateStart && today <= p.dateEnd)?.id ?? 1;
  }, []);

  const handleSelectPhase = useCallback((id: number) => {
    setSelectedPhaseId((prev) => (prev === id ? null : id));
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
  }, []);

  const handleToggleTopic = useCallback((phaseId: number, topicId: string) => {
    setProgress((prev) => toggleTopicProgress(prev, phaseId, topicId));
  }, [setProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isOwner(user.email)) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v.01M12 12v-4m0 12a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-xl text-white mb-2">Access Restricted</h2>
          <p className="font-body text-sm text-white/40 max-w-md mx-auto">This preparation roadmap is private.</p>
        </div>
      </FadeIn>
    );
  }

  const selectedPhase = selectedPhaseId ? ROADMAP_PHASES.find((p) => p.id === selectedPhaseId) : null;
  const totalHours = DAILY_COMMITMENT.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="space-y-10">
      {/* ━━ 1. Hero Command Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <FadeIn>
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-blue-500/10 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 relative overflow-hidden">
          {/* Subtle grid bg */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Progress Ring */}
            <ProgressRing value={overallPct} />

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="font-mono text-[10px] text-blue-400 uppercase tracking-[0.2em] mb-1">Mission Control</p>
              <h2 className="font-display font-bold text-2xl text-white mb-1">Beginner → Google SDE</h2>
              <p className="font-body text-sm text-white/35 mb-5">8-month structured preparation · Daily practice · Interview-ready</p>

              {/* Stats pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                <div className="glass-card rounded-xl px-3 py-2 border border-white/5 text-center min-w-[70px]">
                  <p className="font-mono text-[7px] text-white/20 uppercase tracking-widest">Day</p>
                  <p className="font-display font-bold text-base text-white leading-tight">{dayInfo.current}<span className="text-white/15 text-[10px]">/{dayInfo.total}</span></p>
                </div>
                <div className="glass-card rounded-xl px-3 py-2 border border-amber-500/10 text-center min-w-[70px]">
                  <p className="font-mono text-[7px] text-amber-400/80 uppercase tracking-widest">Remaining</p>
                  <p className="font-display font-bold text-base text-white leading-tight">{dayInfo.remaining}<span className="text-white/15 text-[10px]">d</span></p>
                </div>
                <div className="glass-card rounded-xl px-3 py-2 border border-orange-500/10 text-center min-w-[70px]">
                  <p className="font-mono text-[7px] text-orange-400/80 uppercase tracking-widest">Streak</p>
                  <p className="font-display font-bold text-base text-white leading-tight">{streak}<span className="text-white/15 text-[10px]">d</span></p>
                </div>
                <div className="glass-card rounded-xl px-3 py-2 border border-emerald-500/10 text-center min-w-[70px]">
                  <p className="font-mono text-[7px] text-emerald-400/80 uppercase tracking-widest">Topics</p>
                  <p className="font-display font-bold text-base text-white leading-tight">{totalTopicsCompleted}<span className="text-white/15 text-[10px]">/{totalTopics}</span></p>
                </div>
              </div>
            </div>

            {/* Heatmap + Targets */}
            <div className="flex flex-col gap-4 flex-shrink-0">
              <StudyHeatmap data={heatmap} />
              <div className="grid grid-cols-2 gap-2">
                {TARGETS.map((t) => (
                  <div key={t.label} className="text-center px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="font-display font-bold text-sm text-white">{t.target}</p>
                    <p className="font-mono text-[7px] text-white/20 uppercase">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ━━ 2. Daily Mission Briefing ━━━━━━━━━━━━━━━━━━━━━━ */}
      <FadeIn delay={0.05}>
        <DailyStudyTracker
          progress={progress}
          onUpdateProgress={setProgress}
          files={solutionFiles}
          onUploadFile={(file) => uploadFile(file, `roadmap-solutions/${Date.now()}-${file.name}`)}
          onFileAdded={(file) => setSolutionFiles((prev) => [...prev, { ...file, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString() }])}
        />
      </FadeIn>

      {/* ━━ 3. Phase Journey — Horizontal Timeline ━━━━━━━━━━ */}
      <FadeIn delay={0.1}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">The Journey — 8 Phases</p>
            <div className="flex gap-1.5">
              <button onClick={() => timelineRef.current?.scrollBy({ left: -220, behavior: "smooth" })} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/25 hover:text-white/60 transition-colors text-sm">&#8592;</button>
              <button onClick={() => timelineRef.current?.scrollBy({ left: 220, behavior: "smooth" })} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/25 hover:text-white/60 transition-colors text-sm">&#8594;</button>
            </div>
          </div>

          {/* Connected dot timeline */}
          <div className="flex items-center mb-4 px-2">
            {ROADMAP_PHASES.map((p, i) => {
              const pct = getPhaseProgress(progress, p.id);
              const isComplete = pct === 100;
              const isActive = p.id === activePhaseId;
              return (
                <div key={p.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleSelectPhase(p.id)}
                    className={cn(
                      "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 hover:scale-125",
                      isComplete ? `${p.bgColor} border-transparent` : isActive ? "border-blue-400 bg-blue-400/20" : pct > 0 ? `${p.borderColor} bg-white/5` : "border-white/10 bg-transparent"
                    )}
                    title={p.title}
                  >
                    {isComplete && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  {i < ROADMAP_PHASES.length - 1 && (
                    <div className="flex-1 h-px bg-white/8 mx-1 relative overflow-hidden">
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        className={cn("h-full absolute left-0 top-0", pct > 0 ? p.bgColor + "/50" : "")}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scrollable phase cards */}
          <div
            ref={timelineRef}
            className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {ROADMAP_PHASES.map((p, i) => (
              <PhaseTimelineCard
                key={p.id}
                phase={p}
                phasePct={getPhaseProgress(progress, p.id)}
                isActive={p.id === activePhaseId}
                isSelected={p.id === selectedPhaseId}
                onSelect={() => handleSelectPhase(p.id)}
                index={i}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ━━ 4. Phase Detail (expanded) ━━━━━━━━━━━━━━━━━━━━━ */}
      <div ref={detailRef}>
        <AnimatePresence mode="wait">
          {selectedPhase && (
            <PhaseDetail key={selectedPhase.id} phase={selectedPhase} progress={progress} onToggleTopic={handleToggleTopic} />
          )}
        </AnimatePresence>
      </div>

      {/* ━━ 5. Weekly Rhythm + Daily Commitment ━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.15}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-5">Weekly Rhythm</p>
            <div className="space-y-2">
              {WEEKLY_PLAN.map((w) => (
                <div key={w.day} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-white/25 w-8 flex-shrink-0">{w.day.slice(0, 3)}</span>
                  <div className="flex-1 h-8 rounded-lg overflow-hidden bg-white/[0.02] border border-white/5">
                    <div className={cn("h-full flex items-center px-3 rounded-lg", w.color)}>
                      <span className="font-mono text-[10px] truncate">{w.focus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Daily Commitment</p>
              <span className="font-mono text-xs text-blue-400 font-bold">{totalHours}h / day</span>
            </div>
            <div className="space-y-3.5">
              {DAILY_COMMITMENT.map((d) => (
                <div key={d.activity} className="flex items-center gap-3">
                  <span className="font-body text-xs text-white/45 flex-1">{d.activity}</span>
                  <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(d.hours / totalHours) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-blue-500/40"
                    />
                  </div>
                  <span className="font-mono text-xs text-blue-400 w-8 text-right">{d.hours}h</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="font-body text-sm text-white/30">Total daily</span>
              <span className="font-mono text-sm text-white font-bold">{totalHours} hours</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ━━ 6. Resources ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <FadeIn delay={0.25}>
        <div>
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-4">Resources</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {RESOURCES.map((r, i) => (
              <motion.a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass-card rounded-xl p-3 border border-white/5 hover:border-blue-500/20 transition-all group text-center"
              >
                <p className="font-body text-[11px] text-white/50 group-hover:text-white transition-colors mb-1 leading-tight">{r.name}</p>
                <p className="font-mono text-[8px] text-white/15 uppercase tracking-wider">{r.category}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ━━ 7. Mission Goal ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <FadeIn delay={0.3}>
        <div className="glass-card rounded-2xl p-8 border border-blue-500/10 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <p className="font-mono text-[10px] text-blue-400 uppercase tracking-[0.2em] mb-5">Mission Complete — By November 17</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {["Python mastery for interviews", "400+ coding problems solved", "3 portfolio projects deployed", "20+ system designs mastered", "25+ mock interviews completed", "Google interview-ready"].map((goal, i) => (
                <motion.div
                  key={goal}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="font-body text-sm text-white/55">{goal}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

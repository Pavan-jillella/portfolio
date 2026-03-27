"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code,
  ExternalLink,
  CheckCircle2,
  Circle,
  Flame,
  Target,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Clock,
  Zap,
  Brain,
  Sparkles,
  GraduationCap,
  Rocket,
  Lightbulb,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import {
  DAILY_PLANS,
  getDayPlan,
  getTotalDays,
  type DailyPlan,
  type DailyQuestionsProgress,
  type DailyProgress,
  DEFAULT_DAILY_PROGRESS,
} from "@/lib/roadmap-daily-questions";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

/* ================================================================
   CONSTANTS
   ================================================================ */

const PHASE_COLORS: Record<number, { bg: string; text: string; border: string; ring: string }> = {
  1: { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30", ring: "stroke-emerald-500" },
  2: { bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500/30", ring: "stroke-blue-500" },
  3: { bg: "bg-violet-500", text: "text-violet-400", border: "border-violet-500/30", ring: "stroke-violet-500" },
  4: { bg: "bg-fuchsia-500", text: "text-fuchsia-400", border: "border-fuchsia-500/30", ring: "stroke-fuchsia-500" },
  5: { bg: "bg-orange-500", text: "text-orange-400", border: "border-orange-500/30", ring: "stroke-orange-500" },
  6: { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30", ring: "stroke-amber-500" },
  7: { bg: "bg-rose-500", text: "text-rose-400", border: "border-rose-500/30", ring: "stroke-rose-500" },
  8: { bg: "bg-cyan-500", text: "text-cyan-400", border: "border-cyan-500/30", ring: "stroke-cyan-500" },
};

const DIFFICULTY_STYLES = {
  easy: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
  medium: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/25" },
  hard: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/25" },
};

const TIP_ICONS = {
  shortcut: Zap,
  pattern: Brain,
  trick: Sparkles,
  mindset: GraduationCap,
  optimization: Rocket,
};

/* ================================================================
   MINI PROGRESS RING
   ================================================================ */

function MiniRing({ value, size = 80, color = "stroke-blue-500" }: { value: number; size?: number; color?: string }) {
  const sw = 6;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-bold text-lg text-white tabular-nums">{value}%</span>
      </div>
    </div>
  );
}

/* ================================================================
   FOCUS MODE TIMER
   ================================================================ */

function FocusTimer({ onComplete }: { onComplete?: () => void }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setRunning(false);
      onComplete?.();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds, onComplete]);

  const reset = () => { setRunning(false); setSeconds(25 * 60); };
  const toggle = () => setRunning(!running);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <Clock className="w-4 h-4 text-white/30" />
        <span className="font-mono text-2xl text-white tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <button onClick={toggle} className={cn("p-3 rounded-xl transition-all", running ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30")}>
        {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <button onClick={reset} className="p-3 rounded-xl bg-white/[0.03] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all">
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ================================================================
   KANBAN PROBLEM CARD (draggable)
   ================================================================ */

interface KanbanProblem {
  id: string;
  title: string;
  number?: number;
  url: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  tags?: string[];
  status: "todo" | "in-progress" | "done";
}

function KanbanCard({ problem, onStatusChange, onFocus }: { problem: KanbanProblem; onStatusChange: (status: KanbanProblem["status"]) => void; onFocus: () => void }) {
  const diff = DIFFICULTY_STYLES[problem.difficulty];
  return (
    <Reorder.Item value={problem} id={problem.id} className="cursor-grab active:cursor-grabbing">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn("group p-4 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all", problem.status === "done" ? "border-emerald-500/20" : "border-white/[0.06]")}
      >
        <div className="flex items-start gap-3">
          <GripVertical className="w-4 h-4 text-white/10 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <a href={problem.url} target="_blank" rel="noopener noreferrer" className={cn("font-body text-sm hover:underline flex items-center gap-1.5", problem.status === "done" ? "text-emerald-400 line-through" : "text-white/80")}>
                {problem.number && <span className="font-mono text-white/30">#{problem.number}</span>}
                {problem.title}
                <ExternalLink className="w-3 h-3 text-white/20" />
              </a>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-mono uppercase border", diff.bg, diff.text, diff.border)}>{problem.difficulty}</span>
              {problem.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-white/25 bg-white/[0.03]">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {problem.status !== "done" && (
              <button onClick={onFocus} className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors" title="Focus Mode">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onStatusChange(problem.status === "done" ? "todo" : "done")}
              className={cn("p-1.5 rounded-lg transition-colors", problem.status === "done" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.03] text-white/30 hover:text-white/60")}
            >
              {problem.status === "done" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

/* ================================================================
   KANBAN COLUMN
   ================================================================ */

function KanbanColumn({ title, icon: Icon, items, color, onReorder, onStatusChange, onFocus }: {
  title: string;
  icon: typeof Code;
  items: KanbanProblem[];
  color: string;
  onReorder: (items: KanbanProblem[]) => void;
  onStatusChange: (id: string, status: KanbanProblem["status"]) => void;
  onFocus: (problem: KanbanProblem) => void;
}) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-2 rounded-xl", color.replace("text-", "bg-") + "/15")}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">{title}</span>
        <span className="ml-auto px-2 py-0.5 rounded-lg bg-white/[0.03] font-mono text-[10px] text-white/25">{items.length}</span>
      </div>
      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-2">
        <AnimatePresence>
          {items.map((p) => (
            <KanbanCard key={p.id} problem={p} onStatusChange={(s) => onStatusChange(p.id, s)} onFocus={() => onFocus(p)} />
          ))}
        </AnimatePresence>
      </Reorder.Group>
      {items.length === 0 && (
        <div className="py-8 text-center rounded-2xl border-2 border-dashed border-white/[0.04]">
          <p className="text-xs text-white/15">Drop items here</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   TIMELINE DAY NODE
   ================================================================ */

function TimelineNode({ day, isActive, isComplete, onClick, color }: { day: number; isActive: boolean; isComplete: boolean; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all border-2",
        isComplete ? `${color} border-transparent text-white` : isActive ? "border-blue-400 bg-blue-400/20 text-blue-400" : "border-white/10 text-white/20 hover:border-white/20"
      )}
    >
      {isComplete ? <CheckCircle2 className="w-4 h-4" /> : day}
    </button>
  );
}

/* ================================================================
   FOCUS MODE OVERLAY
   ================================================================ */

function FocusModeOverlay({ problem, onClose, onComplete, phaseColor }: { problem: KanbanProblem; onClose: () => void; onComplete: () => void; phaseColor: typeof PHASE_COLORS[1] }) {
  const diff = DIFFICULTY_STYLES[problem.difficulty];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl rounded-3xl border border-white/[0.08] bg-zinc-900/95 p-8 space-y-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-2">Focus Mode</p>
            <h2 className="font-display font-bold text-2xl text-white">
              {problem.number && <span className="text-white/30 mr-2">#{problem.number}</span>}
              {problem.title}
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <span className={cn("px-3 py-1 rounded-xl text-xs font-mono uppercase border", diff.bg, diff.text, diff.border)}>{problem.difficulty}</span>
              {problem.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-xl text-xs font-mono text-white/30 bg-white/[0.03]">{tag}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.03] text-white/30 hover:text-white/60 transition-colors">
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Timer */}
        <div className="flex justify-center">
          <FocusTimer />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all font-mono text-sm"
          >
            Open Problem <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onComplete}
            className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm transition-all", phaseColor.bg + "/30", phaseColor.text, "hover:opacity-80")}
          >
            <CheckCircle2 className="w-5 h-5" /> Mark Complete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function DailyQuestionsView() {
  const [progress, setProgress] = useLocalStorage<DailyQuestionsProgress>("pj-daily-questions-progress", DEFAULT_DAILY_PROGRESS);
  const [currentDay, setCurrentDay] = useState(progress.currentDay || 1);
  const [focusProblem, setFocusProblem] = useState<KanbanProblem | null>(null);
  const [kanbanItems, setKanbanItems] = useState<KanbanProblem[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const totalDays = getTotalDays();
  const dayPlan = useMemo(() => getDayPlan(currentDay), [currentDay]);
  const phaseColor = dayPlan ? PHASE_COLORS[dayPlan.phase] : PHASE_COLORS[1];

  // Initialize kanban items from day plan
  useEffect(() => {
    if (!dayPlan) return;
    const dayProgress = progress.dailyProgress.find((dp) => dp.day === currentDay);
    const completed = dayProgress?.problemsCompleted || [];
    setKanbanItems(
      dayPlan.problems.map((p, i) => ({
        id: `${currentDay}-${i}`,
        title: p.title,
        number: p.number,
        url: p.url,
        difficulty: p.difficulty,
        source: p.source,
        tags: p.tags,
        status: completed.includes(p.title) ? "done" : "todo",
      }))
    );
  }, [dayPlan, currentDay, progress]);

  // Stats
  const stats = useMemo(() => {
    const completedDays = progress.dailyProgress.filter((d) => d.completed).length;
    const totalProblems = progress.totalProblemsCompleted;
    const todayDone = kanbanItems.filter((i) => i.status === "done").length;
    const todayTotal = kanbanItems.length;
    const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;
    return { completedDays, totalProblems, todayDone, todayTotal, todayPct, streak: progress.streak };
  }, [progress, kanbanItems]);

  // Heatmap data (last 14 days)
  const heatmapData = useMemo(() => {
    const counts: Record<string, number> = {};
    progress.dailyProgress.forEach((dp) => {
      if (dp.completedAt) {
        const k = dp.completedAt.split("T")[0];
        counts[k] = (counts[k] || 0) + dp.problemsCompleted.length;
      }
    });
    const out: { date: string; n: number }[] = [];
    const d = new Date();
    for (let i = 13; i >= 0; i--) {
      const nd = new Date(d); nd.setDate(nd.getDate() - i);
      const k = nd.toISOString().split("T")[0];
      out.push({ date: k, n: counts[k] || 0 });
    }
    return out;
  }, [progress]);

  // Handlers
  const handleStatusChange = useCallback((id: string, status: KanbanProblem["status"]) => {
    setKanbanItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    // Update progress
    const problem = kanbanItems.find((p) => p.id === id);
    if (!problem) return;
    setProgress((prev) => {
      const dayProg = prev.dailyProgress.find((dp) => dp.day === currentDay);
      let newDailyProgress: DailyProgress[];
      if (dayProg) {
        const isNowDone = status === "done";
        newDailyProgress = prev.dailyProgress.map((dp) =>
          dp.day === currentDay
            ? {
                ...dp,
                problemsCompleted: isNowDone
                  ? Array.from(new Set([...dp.problemsCompleted, problem.title]))
                  : dp.problemsCompleted.filter((t) => t !== problem.title),
              }
            : dp
        );
      } else {
        newDailyProgress = [...prev.dailyProgress, { day: currentDay, completed: false, problemsCompleted: status === "done" ? [problem.title] : [], theoryRead: false }];
      }
      return { ...prev, dailyProgress: newDailyProgress, totalProblemsCompleted: newDailyProgress.reduce((s, d) => s + d.problemsCompleted.length, 0), updatedAt: new Date().toISOString() };
    });
  }, [kanbanItems, currentDay, setProgress]);

  const handleTheoryToggle = useCallback(() => {
    setProgress((prev) => {
      const dayProg = prev.dailyProgress.find((dp) => dp.day === currentDay);
      let newDailyProgress: DailyProgress[];
      if (dayProg) {
        newDailyProgress = prev.dailyProgress.map((dp) => (dp.day === currentDay ? { ...dp, theoryRead: !dp.theoryRead } : dp));
      } else {
        newDailyProgress = [...prev.dailyProgress, { day: currentDay, completed: false, problemsCompleted: [], theoryRead: true }];
      }
      return { ...prev, dailyProgress: newDailyProgress, updatedAt: new Date().toISOString() };
    });
  }, [currentDay, setProgress]);

  const handleCompleteDay = useCallback(() => {
    if (!dayPlan) return;
    setProgress((prev) => {
      const newDailyProgress = prev.dailyProgress.map((dp) =>
        dp.day === currentDay ? { ...dp, completed: true, completedAt: new Date().toISOString() } : dp
      ).concat(prev.dailyProgress.some((dp) => dp.day === currentDay) ? [] : [{ day: currentDay, completed: true, completedAt: new Date().toISOString(), problemsCompleted: dayPlan.problems.map((p) => p.title), theoryRead: true }]);
      const today = new Date().toDateString();
      const newStreak = prev.lastActiveDate === new Date(Date.now() - 86400000).toDateString() ? prev.streak + 1 : prev.lastActiveDate === today ? prev.streak : 1;
      return { ...prev, dailyProgress: newDailyProgress, currentDay: Math.min(currentDay + 1, totalDays), streak: newStreak, lastActiveDate: today, updatedAt: new Date().toISOString() };
    });
    if (currentDay < totalDays) setCurrentDay(currentDay + 1);
  }, [dayPlan, currentDay, totalDays, setProgress]);

  const currentDayProgress = progress.dailyProgress.find((dp) => dp.day === currentDay);
  const isDayComplete = currentDayProgress?.completed || false;
  const theoryRead = currentDayProgress?.theoryRead || false;
  const allProblemsDone = kanbanItems.every((p) => p.status === "done");
  const todoItems = kanbanItems.filter((p) => p.status === "todo");
  const doneItems = kanbanItems.filter((p) => p.status === "done");

  if (!dayPlan) {
    return (
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.01] p-12 text-center">
        <p className="text-white/40 font-body">Day {currentDay} plan coming soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusProblem && (
          <FocusModeOverlay
            problem={focusProblem}
            onClose={() => setFocusProblem(null)}
            onComplete={() => { handleStatusChange(focusProblem.id, "done"); setFocusProblem(null); }}
            phaseColor={phaseColor}
          />
        )}
      </AnimatePresence>

      {/* ─── HERO SECTION ───────────────────────────────── */}
      <section className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-violet-500/[0.04] via-transparent to-blue-500/[0.04] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          {/* Progress Ring */}
          <MiniRing value={stats.todayPct} size={100} color={phaseColor.ring} />

          {/* Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <span className={cn("px-3 py-1 rounded-xl text-[10px] font-mono uppercase", phaseColor.bg + "/20", phaseColor.text)}>Phase {dayPlan.phase}</span>
              {isDayComplete && <span className="px-3 py-1 rounded-xl text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400">Complete</span>}
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white mb-1">Day {currentDay}: {dayPlan.topic}</h2>
            <p className="font-body text-sm text-white/35 max-w-xl">{dayPlan.keyConceptsSummary}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { icon: Flame, label: "Streak", value: `${stats.streak}d`, color: "text-orange-400" },
              { icon: Target, label: "Total", value: stats.totalProblems, color: "text-emerald-400" },
              { icon: Trophy, label: "Days", value: `${stats.completedDays}/${totalDays}`, color: "text-amber-400" },
              { icon: CheckCircle2, label: "Today", value: `${stats.todayDone}/${stats.todayTotal}`, color: "text-blue-400" },
            ].map((s) => (
              <div key={s.label} className="px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
                <s.icon className={cn("w-4 h-4 mx-auto mb-1", s.color)} />
                <p className="font-display font-bold text-lg text-white leading-none">{s.value}</p>
                <p className="font-mono text-[8px] text-white/20 uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Mini Heatmap */}
          <div className="flex-shrink-0">
            <p className="font-mono text-[8px] text-white/15 uppercase tracking-widest mb-2 text-center">Last 2 Weeks</p>
            <div className="flex gap-[3px]">
              {[0, 7].map((offset) => (
                <div key={offset} className="flex flex-col gap-[3px]">
                  {heatmapData.slice(offset, offset + 7).map((d) => (
                    <div key={d.date} title={`${d.date}: ${d.n} problems`} className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.n === 0 ? "rgba(255,255,255,0.02)" : `rgba(139,92,246,${Math.min(1, 0.2 + d.n * 0.15)})` }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ───────────────────────────────────── */}
      <section className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Day Timeline</p>
          <div className="flex gap-1.5">
            <button onClick={() => setCurrentDay(Math.max(1, currentDay - 1))} disabled={currentDay <= 1} className="p-2 rounded-xl bg-white/[0.03] text-white/30 hover:text-white/60 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentDay(Math.min(totalDays, currentDay + 1))} disabled={currentDay >= totalDays} className="p-2 rounded-xl bg-white/[0.03] text-white/30 hover:text-white/60 disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={timelineRef} className="flex items-center gap-1 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {Array.from({ length: Math.min(30, totalDays) }, (_, i) => {
            const day = Math.max(1, currentDay - 15) + i;
            if (day > totalDays || day < 1) return null;
            const dp = progress.dailyProgress.find((d) => d.day === day);
            const plan = getDayPlan(day);
            const col = plan ? PHASE_COLORS[plan.phase] : PHASE_COLORS[1];
            return (
              <TimelineNode key={day} day={day} isActive={day === currentDay} isComplete={dp?.completed || false} onClick={() => setCurrentDay(day)} color={col.bg} />
            );
          })}
        </div>
      </section>

      {/* ─── THEORY SECTION ──────────────────────────────── */}
      <section className="rounded-3xl border border-white/[0.05] bg-white/[0.015] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Theory & Resources</h3>
              <p className="font-mono text-[10px] text-white/25">Read before solving problems</p>
            </div>
          </div>
          <button onClick={handleTheoryToggle} className={cn("px-4 py-2 rounded-xl font-mono text-xs transition-all flex items-center gap-2", theoryRead ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.03] text-white/40 hover:text-white/60")}>
            {theoryRead ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            {theoryRead ? "Completed" : "Mark as Read"}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {dayPlan.theoryToRead.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/20 hover:bg-white/[0.03] transition-all">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-white/70 group-hover:text-white transition-colors truncate">{r.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-white/25">{r.source}</span>
                  {r.estimatedTime && <><span className="text-white/10">|</span><span className="font-mono text-[10px] text-white/25">{r.estimatedTime}</span></>}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/15 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* ─── KANBAN BOARD ────────────────────────────────── */}
      <section className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/15">
            <Code className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">Problems Board</h3>
            <p className="font-mono text-[10px] text-white/25">Drag to reorder, click focus for timer</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          <KanbanColumn title="To Do" icon={Circle} items={todoItems} color="text-white/40" onReorder={(items) => setKanbanItems([...items, ...doneItems])} onStatusChange={handleStatusChange} onFocus={setFocusProblem} />
          <KanbanColumn title="Done" icon={CheckCircle2} items={doneItems} color="text-emerald-400" onReorder={(items) => setKanbanItems([...todoItems, ...items])} onStatusChange={handleStatusChange} onFocus={setFocusProblem} />
        </div>
      </section>

      {/* ─── TIPS SECTION ────────────────────────────────── */}
      <section className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-500/15">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Tips & Patterns</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dayPlan.learningTips.map((tip, i) => {
            const Icon = TIP_ICONS[tip.category as keyof typeof TIP_ICONS] || Lightbulb;
            const colors = {
              shortcut: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
              pattern: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              trick: "bg-purple-500/10 text-purple-400 border-purple-500/20",
              mindset: "bg-green-500/10 text-green-400 border-green-500/20",
              optimization: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            };
            const col = colors[tip.category as keyof typeof colors] || colors.mindset;
            return (
              <div key={i} className={cn("p-4 rounded-2xl border", col)}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">{tip.category}</span>
                </div>
                <p className="font-body text-sm text-white/50 leading-relaxed">{tip.tip}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TOMORROW PREVIEW ────────────────────────────── */}
      <section className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01] p-6">
        <div className="flex items-center gap-3 mb-3">
          <ArrowRight className={cn("w-5 h-5", phaseColor.text)} />
          <h3 className="font-display font-bold text-base text-white">Tomorrow&apos;s Preview</h3>
        </div>
        <p className="font-body text-sm text-white/40 leading-relaxed">{dayPlan.tomorrowPreview}</p>
      </section>

      {/* ─── COMPLETE DAY BUTTON ─────────────────────────── */}
      {!isDayComplete ? (
        <button
          onClick={handleCompleteDay}
          disabled={!allProblemsDone || !theoryRead}
          className={cn(
            "w-full py-5 rounded-2xl font-display font-bold text-base transition-all flex items-center justify-center gap-3",
            allProblemsDone && theoryRead
              ? `${phaseColor.bg}/25 ${phaseColor.text} hover:opacity-80 border ${phaseColor.border}`
              : "bg-white/[0.02] text-white/20 cursor-not-allowed border border-white/[0.04]"
          )}
        >
          <CheckCircle2 className="w-5 h-5" />
          {allProblemsDone && theoryRead ? "Complete Day & Continue" : `Finish all tasks (${stats.todayDone}/${stats.todayTotal} problems, ${theoryRead ? "theory done" : "read theory"})`}
        </button>
      ) : (
        <div className="py-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="font-display font-bold text-lg text-emerald-400">Day {currentDay} Complete!</p>
          <p className="font-body text-sm text-emerald-400/50 mt-1">Amazing progress. Keep going!</p>
        </div>
      )}
    </div>
  );
}

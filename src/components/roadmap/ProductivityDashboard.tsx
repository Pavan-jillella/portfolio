"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  FileText,
  Code2,
  BarChart3,
  Plus,
  Search,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  Clock,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Circle,
  Trash2,
  Star,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  type SpacedRepetitionState,
  type ReviewItem,
  type ProblemNotesState,
  type ProblemNote,
  type TemplateLibraryState,
  type CodeTemplate,
  type WeeklyStats,
  DEFAULT_SR_STATE,
  DEFAULT_NOTES_STATE,
  DEFAULT_TEMPLATE_STATE,
  BUILT_IN_TEMPLATES,
  PATTERN_LIST,
  getDueReviews,
  addProblemToSR,
  calculateNextReview,
  generateWeeklyReport,
} from "@/lib/productivity-utils";

/* ================================================================
   TAB TYPES
   ================================================================ */

type TabId = "spaced-rep" | "notes" | "templates" | "report";

const TABS: { id: TabId; label: string; icon: typeof Brain; color: string }[] = [
  { id: "spaced-rep", label: "Spaced Repetition", icon: Brain, color: "text-violet-400" },
  { id: "notes", label: "Problem Notes", icon: FileText, color: "text-emerald-400" },
  { id: "templates", label: "Code Templates", icon: Code2, color: "text-amber-400" },
  { id: "report", label: "Weekly Report", icon: BarChart3, color: "text-blue-400" },
];

/* ================================================================
   SPACED REPETITION PANEL
   ================================================================ */

function SpacedRepetitionPanel({
  state,
  setState,
}: {
  state: SpacedRepetitionState;
  setState: (s: SpacedRepetitionState | ((p: SpacedRepetitionState) => SpacedRepetitionState)) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newProblem, setNewProblem] = useState<{ title: string; url: string; difficulty: "easy" | "medium" | "hard"; pattern: string }>({ title: "", url: "", difficulty: "medium", pattern: "Arrays" });
  const [reviewingItem, setReviewingItem] = useState<ReviewItem | null>(null);

  const dueReviews = useMemo(() => getDueReviews(state), [state]);
  const masteredCount = state.items.filter((i) => i.status === "mastered").length;
  const learningCount = state.items.filter((i) => i.status === "learning" || i.status === "new").length;

  const handleAddProblem = () => {
    if (!newProblem.title || !newProblem.url) return;
    setState((prev) => addProblemToSR(prev, newProblem));
    setNewProblem({ title: "", url: "", difficulty: "medium", pattern: "Arrays" });
    setShowAdd(false);
  };

  const handleReview = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!reviewingItem) return;
    setState((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === reviewingItem.id ? calculateNextReview(i, quality) : i)),
      updatedAt: new Date().toISOString(),
    }));
    setReviewingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Due Today", value: dueReviews.length, icon: Clock, color: "text-amber-400" },
          { label: "Learning", value: learningCount, icon: BookOpen, color: "text-blue-400" },
          { label: "Mastered", value: masteredCount, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Total", value: state.items.length, icon: Target, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <s.icon className={cn("w-5 h-5 mx-auto mb-2", s.color)} />
            <p className="font-display font-bold text-2xl text-white">{s.value}</p>
            <p className="font-mono text-[9px] text-white/25 uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Review Session */}
      {reviewingItem ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-6">
          <p className="font-mono text-[10px] text-violet-400 uppercase tracking-widest mb-3">Review Session</p>
          <h3 className="font-display font-bold text-xl text-white mb-2">{reviewingItem.problemTitle}</h3>
          <div className="flex items-center gap-2 mb-6">
            <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-mono border", reviewingItem.difficulty === "easy" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" : reviewingItem.difficulty === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/25" : "bg-red-500/15 text-red-400 border-red-500/25")}>{reviewingItem.difficulty}</span>
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/[0.03] text-white/30">{reviewingItem.pattern}</span>
            <a href={reviewingItem.problemUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-violet-400 hover:text-violet-300 flex items-center gap-1 text-xs">
              Open Problem <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="font-body text-sm text-white/40 mb-6">How well did you remember the solution?</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { q: 0, label: "Forgot", color: "bg-red-500/20 text-red-400 border-red-500/30" },
              { q: 1, label: "Wrong", color: "bg-red-500/15 text-red-400 border-red-500/25" },
              { q: 2, label: "Struggled", color: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
              { q: 3, label: "Hard", color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
              { q: 4, label: "Good", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
              { q: 5, label: "Easy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
            ].map((btn) => (
              <button key={btn.q} onClick={() => handleReview(btn.q as 0 | 1 | 2 | 3 | 4 | 5)} className={cn("py-3 rounded-xl font-mono text-xs border transition-all hover:scale-[1.02]", btn.color)}>
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>
      ) : dueReviews.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-display font-bold text-white">{dueReviews.length} Reviews Due</span>
            </div>
            <button onClick={() => setReviewingItem(dueReviews[0])} className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-mono text-xs hover:bg-amber-500/30 transition-colors">
              Start Review
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {dueReviews.slice(0, 5).map((item) => (
              <button key={item.id} onClick={() => setReviewingItem(item)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <span className="font-body text-sm text-white/60 truncate">{item.problemTitle}</span>
                <span className="font-mono text-[10px] text-white/25">{item.pattern}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="font-display font-bold text-white">All caught up!</p>
          <p className="font-body text-sm text-white/40 mt-1">No reviews due. Add more problems below.</p>
        </div>
      )}

      {/* Add Problem */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
        <button onClick={() => setShowAdd(!showAdd)} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-violet-400" />
            <span className="font-mono text-sm text-white/60">Add Problem to Review Queue</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform", showAdd && "rotate-180")} />
        </button>
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <input value={newProblem.title} onChange={(e) => setNewProblem((p) => ({ ...p, title: e.target.value }))} placeholder="Problem title" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30" />
                <input value={newProblem.url} onChange={(e) => setNewProblem((p) => ({ ...p, url: e.target.value }))} placeholder="Problem URL" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30" />
                <select value={newProblem.difficulty} onChange={(e) => setNewProblem((p) => ({ ...p, difficulty: e.target.value as "easy" | "medium" | "hard" }))} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select value={newProblem.pattern} onChange={(e) => setNewProblem((p) => ({ ...p, pattern: e.target.value }))} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none">
                  {PATTERN_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <button onClick={handleAddProblem} disabled={!newProblem.title || !newProblem.url} className="mt-3 w-full py-3 rounded-xl bg-violet-500/20 text-violet-400 font-mono text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-500/30 transition-colors">
                Add to Queue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All Items */}
      {state.items.length > 0 && (
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">All Problems ({state.items.length})</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", item.status === "mastered" ? "bg-emerald-400" : item.status === "review" ? "bg-blue-400" : item.status === "learning" ? "bg-amber-400" : "bg-white/20")} />
                  <span className="font-body text-sm text-white/60 truncate">{item.problemTitle}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-[9px] text-white/20">{item.reviewCount} reviews</span>
                  <span className={cn("px-2 py-0.5 rounded text-[9px] font-mono", item.status === "mastered" ? "bg-emerald-500/15 text-emerald-400" : item.status === "review" ? "bg-blue-500/15 text-blue-400" : "bg-white/[0.03] text-white/30")}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   PROBLEM NOTES PANEL
   ================================================================ */

function ProblemNotesPanel({
  state,
  setState,
}: {
  state: ProblemNotesState;
  setState: (s: ProblemNotesState | ((p: ProblemNotesState) => ProblemNotesState)) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editingNote, setEditingNote] = useState<ProblemNote | null>(null);
  const [newNote, setNewNote] = useState<Partial<ProblemNote>>({
    problemTitle: "", problemUrl: "", difficulty: "medium", pattern: "Arrays", tags: [], approach: "", code: "", language: "python", timeComplexity: "", spaceComplexity: "", mistakes: "", tips: "", isFavorite: false,
  });

  const filteredNotes = useMemo(() => {
    let notes = state.notes;
    if (search) notes = notes.filter((n) => n.problemTitle.toLowerCase().includes(search.toLowerCase()) || n.pattern.toLowerCase().includes(search.toLowerCase()));
    if (filter !== "all") notes = notes.filter((n) => n.pattern === filter);
    return notes.sort((a, b) => b.solvedAt.localeCompare(a.solvedAt));
  }, [state.notes, search, filter]);

  const handleSave = () => {
    if (!newNote.problemTitle) return;
    const note: ProblemNote = {
      id: editingNote?.id || `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      problemTitle: newNote.problemTitle || "",
      problemUrl: newNote.problemUrl || "",
      difficulty: newNote.difficulty || "medium",
      pattern: newNote.pattern || "Arrays",
      tags: newNote.tags || [],
      approach: newNote.approach || "",
      code: newNote.code || "",
      language: newNote.language || "python",
      timeComplexity: newNote.timeComplexity || "",
      spaceComplexity: newNote.spaceComplexity || "",
      mistakes: newNote.mistakes || "",
      tips: newNote.tips || "",
      solvedAt: editingNote?.solvedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: newNote.isFavorite || false,
    };
    setState((prev) => ({
      notes: editingNote ? prev.notes.map((n) => (n.id === editingNote.id ? note : n)) : [note, ...prev.notes],
      updatedAt: new Date().toISOString(),
    }));
    setNewNote({ problemTitle: "", problemUrl: "", difficulty: "medium", pattern: "Arrays", tags: [], approach: "", code: "", language: "python", timeComplexity: "", spaceComplexity: "", mistakes: "", tips: "", isFavorite: false });
    setEditingNote(null);
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({ notes: prev.notes.filter((n) => n.id !== id), updatedAt: new Date().toISOString() }));
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/30" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/20" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none">
            <option value="all">All Patterns</option>
            {PATTERN_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button onClick={() => { setShowAdd(true); setEditingNote(null); }} className="px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-sm flex items-center gap-2 hover:bg-emerald-500/30 transition-colors">
          <Plus className="w-4 h-4" /> Add Note
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={newNote.problemTitle} onChange={(e) => setNewNote((p) => ({ ...p, problemTitle: e.target.value }))} placeholder="Problem title *" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none" />
                <input value={newNote.problemUrl} onChange={(e) => setNewNote((p) => ({ ...p, problemUrl: e.target.value }))} placeholder="Problem URL" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none" />
                <select value={newNote.difficulty} onChange={(e) => setNewNote((p) => ({ ...p, difficulty: e.target.value as "easy" | "medium" | "hard" }))} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select value={newNote.pattern} onChange={(e) => setNewNote((p) => ({ ...p, pattern: e.target.value }))} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none">
                  {PATTERN_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input value={newNote.timeComplexity} onChange={(e) => setNewNote((p) => ({ ...p, timeComplexity: e.target.value }))} placeholder="Time Complexity (e.g., O(n))" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none" />
                <input value={newNote.spaceComplexity} onChange={(e) => setNewNote((p) => ({ ...p, spaceComplexity: e.target.value }))} placeholder="Space Complexity (e.g., O(1))" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none" />
              </div>
              <textarea value={newNote.approach} onChange={(e) => setNewNote((p) => ({ ...p, approach: e.target.value }))} placeholder="Your approach / thought process..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none resize-none" />
              <textarea value={newNote.code} onChange={(e) => setNewNote((p) => ({ ...p, code: e.target.value }))} placeholder="Your solution code..." rows={8} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none resize-none font-mono" />
              <textarea value={newNote.mistakes} onChange={(e) => setNewNote((p) => ({ ...p, mistakes: e.target.value }))} placeholder="Common mistakes to avoid..." rows={2} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none resize-none" />
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={!newNote.problemTitle} className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-sm disabled:opacity-30 hover:bg-emerald-500/30 transition-colors">
                  {editingNote ? "Update Note" : "Save Note"}
                </button>
                <button onClick={() => { setShowAdd(false); setEditingNote(null); }} className="px-5 py-3 rounded-xl bg-white/[0.03] text-white/40 font-mono text-sm hover:text-white/60 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-8 text-center">
            <FileText className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="font-body text-sm text-white/30">No notes yet. Add your first problem note!</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <motion.div key={note.id} layout className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {note.isFavorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    <a href={note.problemUrl} target="_blank" rel="noopener noreferrer" className="font-display font-bold text-white hover:text-emerald-400 transition-colors truncate">
                      {note.problemTitle}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono border", note.difficulty === "easy" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" : note.difficulty === "medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/25" : "bg-red-500/15 text-red-400 border-red-500/25")}>{note.difficulty}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-white/30">{note.pattern}</span>
                    {note.timeComplexity && <span className="text-[10px] text-white/20">T: {note.timeComplexity}</span>}
                    {note.spaceComplexity && <span className="text-[10px] text-white/20">S: {note.spaceComplexity}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setNewNote(note); setEditingNote(note); setShowAdd(true); }} className="p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.03] transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {note.approach && <p className="font-body text-sm text-white/40 mb-3 line-clamp-2">{note.approach}</p>}
              {note.code && (
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 overflow-x-auto">
                  <pre className="font-mono text-xs text-white/50 whitespace-pre-wrap">{note.code.slice(0, 300)}{note.code.length > 300 && "..."}</pre>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================================================================
   CODE TEMPLATES PANEL
   ================================================================ */

function CodeTemplatesPanel({
  state,
  setState,
}: {
  state: TemplateLibraryState;
  setState: (s: TemplateLibraryState | ((p: TemplateLibraryState) => TemplateLibraryState)) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const allTemplates = [...BUILT_IN_TEMPLATES, ...state.customTemplates];
  const categories = Array.from(new Set(allTemplates.map((t) => t.category)));

  const filtered = useMemo(() => {
    let templates = allTemplates;
    if (search) templates = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") templates = templates.filter((t) => t.category === category);
    return templates;
  }, [allTemplates, search, category]);

  const handleCopy = async (template: CodeTemplate) => {
    await navigator.clipboard.writeText(template.code);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-amber-500/30" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((template) => (
          <motion.div key={template.id} layout className={cn("rounded-2xl border bg-white/[0.015] overflow-hidden transition-all", expanded === template.id ? "border-amber-500/30" : "border-white/[0.05]")}>
            <button onClick={() => setExpanded(expanded === template.id ? null : template.id)} className="w-full p-5 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span className="font-display font-bold text-sm text-white">{template.name}</span>
                  </div>
                  <p className="font-body text-xs text-white/40">{template.description}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-400">{template.category}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.03] text-white/25">{template.language}</span>
                  </div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-white/20 transition-transform", expanded === template.id && "rotate-180")} />
              </div>
            </button>
            <AnimatePresence>
              {expanded === template.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5">
                    <div className="relative rounded-xl bg-black/30 border border-white/[0.05] overflow-hidden">
                      <div className="absolute top-2 right-2 z-10">
                        <button onClick={() => handleCopy(template)} className={cn("px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all", copiedId === template.id ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.05] text-white/40 hover:text-white/70")}>
                          {copiedId === template.id ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                        </button>
                      </div>
                      <pre className="p-4 pt-10 overflow-x-auto"><code className="font-mono text-xs text-white/60 whitespace-pre">{template.code}</code></pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-8 text-center">
          <Code2 className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="font-body text-sm text-white/30">No templates match your search.</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   WEEKLY REPORT PANEL
   ================================================================ */

function WeeklyReportPanel({
  notesState,
  srState,
  streak,
}: {
  notesState: ProblemNotesState;
  srState: SpacedRepetitionState;
  streak: number;
}) {
  const report = useMemo(
    () => generateWeeklyReport(notesState.notes, srState, 0, 0, streak),
    [notesState.notes, srState, streak]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-violet-500/[0.05] p-6">
        <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-2">Weekly Performance Report</p>
        <p className="font-display font-bold text-xl text-white">{report.weekStart} — {report.weekEnd}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 text-center">
          <p className="font-display font-extrabold text-3xl text-white">{report.problemsSolved}</p>
          <p className="font-mono text-[9px] text-white/25 uppercase mt-1">Problems Solved</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 text-center">
          <p className="font-display font-extrabold text-3xl text-white">{report.streakDays}d</p>
          <p className="font-mono text-[9px] text-white/25 uppercase mt-1">Streak</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 text-center">
          <p className="font-display font-extrabold text-3xl text-white">{report.reviewsCompleted}</p>
          <p className="font-mono text-[9px] text-white/25 uppercase mt-1">Reviews Done</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 text-center">
          <p className="font-display font-extrabold text-3xl text-white">{Object.keys(report.patterns).length}</p>
          <p className="font-mono text-[9px] text-white/25 uppercase mt-1">Patterns Practiced</p>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">Difficulty Breakdown</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden flex">
            {report.problemsSolved > 0 && (
              <>
                <div className="h-full bg-emerald-500/50" style={{ width: `${(report.easyCount / report.problemsSolved) * 100}%` }} />
                <div className="h-full bg-amber-500/50" style={{ width: `${(report.mediumCount / report.problemsSolved) * 100}%` }} />
                <div className="h-full bg-red-500/50" style={{ width: `${(report.hardCount / report.problemsSolved) * 100}%` }} />
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400">{report.easyCount} Easy</span>
            <span className="text-amber-400">{report.mediumCount} Med</span>
            <span className="text-red-400">{report.hardCount} Hard</span>
          </div>
        </div>
      </div>

      {/* Patterns & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patterns This Week */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">Patterns Practiced</p>
          {Object.keys(report.patterns).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(report.patterns).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([pattern, count]) => (
                <div key={pattern} className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/50">{pattern}</span>
                  <span className="font-mono text-xs text-blue-400">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/25 text-center py-4">No problems solved this week</p>
          )}
        </div>

        {/* Weak/Strong Areas */}
        <div className="space-y-4">
          {report.weakPatterns.length > 0 && (
            <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.02] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest">Needs Work</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.weakPatterns.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-500/10 text-red-400">{p}</span>
                ))}
              </div>
            </div>
          )}
          {report.strongPatterns.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.02] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Strong Areas</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.strongPatterns.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-400">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.02] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">Recommendations</p>
          </div>
          <div className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <p className="font-body text-sm text-white/50">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MAIN PRODUCTIVITY DASHBOARD
   ================================================================ */

export default function ProductivityDashboard({ streak = 0 }: { streak?: number }) {
  const [activeTab, setActiveTab] = useState<TabId>("spaced-rep");
  const [srState, setSrState] = useLocalStorage<SpacedRepetitionState>("pj-spaced-repetition", DEFAULT_SR_STATE);
  const [notesState, setNotesState] = useLocalStorage<ProblemNotesState>("pj-problem-notes", DEFAULT_NOTES_STATE);
  const [templateState, setTemplateState] = useLocalStorage<TemplateLibraryState>("pj-code-templates", DEFAULT_TEMPLATE_STATE);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm transition-all whitespace-nowrap",
              activeTab === tab.id ? `bg-${tab.color.replace("text-", "")}/20 ${tab.color} border border-${tab.color.replace("text-", "")}/30` : "text-white/40 hover:text-white/60 bg-white/[0.02] border border-white/[0.05]"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === "spaced-rep" && <SpacedRepetitionPanel state={srState} setState={setSrState} />}
          {activeTab === "notes" && <ProblemNotesPanel state={notesState} setState={setNotesState} />}
          {activeTab === "templates" && <CodeTemplatesPanel state={templateState} setState={setTemplateState} />}
          {activeTab === "report" && <WeeklyReportPanel notesState={notesState} srState={srState} streak={streak} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

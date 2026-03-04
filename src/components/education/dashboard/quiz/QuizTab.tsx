"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Course, Note, StudySession, Quiz, QuizQuestion } from "@/types";
import { generateId } from "@/lib/finance-utils";
import { STUDY_SUBJECTS } from "@/lib/constants";
import { QuizCard } from "./QuizCard";
import { QuizResults } from "./QuizResults";

type QuizSourceType = "course" | "note" | "subject";
type QuizPhase = "select" | "loading" | "quiz" | "results";

interface QuizTabProps {
  courses: Course[];
  notes: Note[];
  sessions: StudySession[];
}

export function QuizTab({ courses, notes, sessions }: QuizTabProps) {
  const [sourceType, setSourceType] = useState<QuizSourceType>("subject");
  const [sourceId, setSourceId] = useState("");
  const [phase, setPhase] = useState<QuizPhase>("select");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [quizHistory, setQuizHistory] = useState<Quiz[]>([]);

  // Load quiz history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pj-quiz-history");
      if (raw) setQuizHistory(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function saveQuizHistory(q: Quiz) {
    const updated = [q, ...quizHistory].slice(0, 20);
    setQuizHistory(updated);
    try {
      localStorage.setItem("pj-quiz-history", JSON.stringify(updated));
    } catch { /* ignore */ }
  }

  const sourceOptions = useMemo(() => {
    if (sourceType === "course") return courses.map((c) => ({ id: c.id, label: c.name }));
    if (sourceType === "note") return notes.map((n) => ({ id: n.id, label: n.title }));
    return STUDY_SUBJECTS.map((s) => ({ id: s, label: s }));
  }, [sourceType, courses, notes]);

  function getSourceContent(): string {
    if (sourceType === "course") {
      const course = courses.find((c) => c.id === sourceId);
      return course ? `Course: ${course.name}, Category: ${course.category}, Platform: ${course.platform}` : "";
    }
    if (sourceType === "note") {
      const note = notes.find((n) => n.id === sourceId);
      return note ? note.content_html.replace(/<[^>]*>/g, "").slice(0, 4000) : "";
    }
    // Subject: use study session metadata
    const subjectSessions = sessions.filter((s) => s.subject === sourceId);
    const totalMins = subjectSessions.reduce((s, x) => s + x.duration_minutes, 0);
    return `Subject: ${sourceId}, Total study time: ${Math.round(totalMins / 60)} hours, Sessions: ${subjectSessions.length}`;
  }

  async function generateQuiz() {
    if (!sourceId) return;
    setPhase("loading");
    setError("");
    try {
      const content = getSourceContent();
      if (!content) throw new Error("No content found for selected source");

      const res = await fetch("/api/education/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quiz",
          data: content,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const json = await res.json();
      const questions: QuizQuestion[] = Array.isArray(json.result) ? json.result : JSON.parse(json.result);

      const quiz: Quiz = {
        id: generateId(),
        source_type: sourceType,
        source_id: sourceId,
        source_label: sourceOptions.find((o) => o.id === sourceId)?.label || sourceId,
        questions,
        created_at: new Date().toISOString(),
      };

      setCurrentQuiz(quiz);
      setCurrentQuestion(0);
      setAnswers([]);
      setPhase("quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("select");
    }
  }

  function handleAnswer(selectedIndex: number) {
    if (!currentQuiz) return;
    const newAnswers = [...answers, selectedIndex];
    setAnswers(newAnswers);

    // Auto-advance after delay
    setTimeout(() => {
      if (currentQuestion < currentQuiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // Calculate score
        const score = newAnswers.filter(
          (a, i) => a === currentQuiz.questions[i].correct_index
        ).length;
        const completedQuiz: Quiz = {
          ...currentQuiz,
          answers: newAnswers,
          score,
          total: currentQuiz.questions.length,
          completed_at: new Date().toISOString(),
        };
        setCurrentQuiz(completedQuiz);
        saveQuizHistory(completedQuiz);
        setPhase("results");
      }
    }, 1500);
  }

  function retryQuiz() {
    setCurrentQuestion(0);
    setAnswers([]);
    setPhase("quiz");
  }

  function newQuiz() {
    setCurrentQuiz(null);
    setPhase("select");
    setSourceId("");
  }

  // Stats
  const totalQuizzes = quizHistory.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((s, q) => s + ((q.score ?? 0) / (q.total ?? 1)) * 100, 0) / totalQuizzes)
    : 0;

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Quizzes Taken", value: totalQuizzes.toString(), color: "text-blue-400" },
          { label: "Average Score", value: `${avgScore}%`, color: "text-emerald-400" },
          { label: "Questions Answered", value: quizHistory.reduce((s, q) => s + (q.total ?? q.questions.length), 0).toString(), color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card rounded-xl p-4 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <p className="font-body text-xs text-white/40">{stat.label}</p>
            <p className={`font-display font-bold text-xl mt-1 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Source selector */}
      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div
            key="select"
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <h3 className="font-display font-semibold text-lg text-white mb-6">
              Generate a Quiz
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-body text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Source type */}
              <div>
                <label className="font-body text-xs text-white/40 mb-2 block">Quiz Source</label>
                <div className="flex gap-2">
                  {(["subject", "course", "note"] as QuizSourceType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setSourceType(t); setSourceId(""); }}
                      className={`px-3 py-2 rounded-lg text-xs font-body transition-all ${
                        sourceType === t
                          ? "glass-card text-blue-400"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source item */}
              <div>
                <label className="font-body text-xs text-white/40 mb-2 block">Select {sourceType}</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white font-body text-sm focus:outline-none focus:border-blue-500/40"
                >
                  <option value="" className="bg-[#1a1a1a] text-white/40">Choose...</option>
                  {sourceOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#1a1a1a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={generateQuiz}
              disabled={!sourceId}
              className="glass-card px-6 py-3 rounded-xl font-body text-sm text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Generate Quiz
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            className="glass-card rounded-2xl p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex justify-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
            <p className="font-body text-sm text-white/40">Generating quiz questions...</p>
          </motion.div>
        )}

        {/* Active quiz */}
        {phase === "quiz" && currentQuiz && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizCard
              question={currentQuiz.questions[currentQuestion]}
              questionNumber={currentQuestion + 1}
              totalQuestions={currentQuiz.questions.length}
              onAnswer={handleAnswer}
              answered={answers.length > currentQuestion}
              selectedIndex={answers[currentQuestion]}
            />
          </motion.div>
        )}

        {/* Results */}
        {phase === "results" && currentQuiz && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizResults quiz={currentQuiz} onRetry={retryQuiz} onNewQuiz={newQuiz} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

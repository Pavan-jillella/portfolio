"use client";
import { motion } from "framer-motion";
import { Quiz } from "@/types";

interface QuizResultsProps {
  quiz: Quiz;
  onRetry: () => void;
  onNewQuiz: () => void;
}

export function QuizResults({ quiz, onRetry, onNewQuiz }: QuizResultsProps) {
  const score = quiz.score ?? 0;
  const total = quiz.total ?? quiz.questions.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const gradeColor =
    pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-blue-400" : pct >= 40 ? "text-amber-400" : "text-red-400";
  const gradeLabel =
    pct >= 80 ? "Excellent!" : pct >= 60 ? "Good job!" : pct >= 40 ? "Keep practicing" : "Try again";

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Score summary */}
      <div className="text-center mb-8">
        <motion.p
          className={`font-display font-bold text-5xl ${gradeColor}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          {score}/{total}
        </motion.p>
        <p className="font-body text-sm text-white/40 mt-2">{pct}% correct</p>
        <p className={`font-display font-semibold text-lg mt-1 ${gradeColor}`}>
          {gradeLabel}
        </p>
      </div>

      {/* Question review */}
      <div className="space-y-3 mb-6">
        <p className="font-body text-xs text-white/30 uppercase tracking-wider">Review</p>
        {quiz.questions.map((q, i) => {
          const userAnswer = quiz.answers?.[i];
          const isCorrect = userAnswer === q.correct_index;
          return (
            <div key={i} className="glass-card rounded-xl p-3 flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono ${
                  isCorrect
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-body text-xs text-white/60 truncate">{q.question}</p>
                <p className="font-body text-[10px] text-white/30 mt-0.5">
                  Answer: {q.options[q.correct_index]}
                  {!isCorrect && userAnswer !== undefined && (
                    <span className="text-red-400/60 ml-2">
                      (You chose: {q.options[userAnswer]})
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 glass-card py-3 rounded-xl font-body text-sm text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          Retry Same Quiz
        </button>
        <button
          onClick={onNewQuiz}
          className="flex-1 glass-card py-3 rounded-xl font-body text-sm text-blue-400 hover:text-blue-300 transition-all hover:border-blue-500/30"
        >
          New Quiz
        </button>
      </div>
    </motion.div>
  );
}

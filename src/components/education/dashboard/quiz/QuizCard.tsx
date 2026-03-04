"use client";
import { motion } from "framer-motion";
import { QuizQuestion } from "@/types";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
  answered: boolean;
  selectedIndex?: number;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  answered,
  selectedIndex,
}: QuizCardProps) {
  const optionLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

  function getOptionStyle(idx: number): string {
    if (!answered) {
      return "glass-card hover:border-blue-500/30 hover:text-white cursor-pointer";
    }
    if (idx === question.correct_index) {
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    }
    if (idx === selectedIndex && idx !== question.correct_index) {
      return "bg-red-500/10 border-red-500/30 text-red-400";
    }
    return "bg-white/[0.02] border-white/5 text-white/20";
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-white/30">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < questionNumber ? "bg-blue-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="font-display font-semibold text-white text-lg mb-6 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !answered && onAnswer(idx)}
            disabled={answered}
            className={`p-4 rounded-xl border text-left font-body text-sm transition-all flex items-start gap-3 ${getOptionStyle(idx)}`}
          >
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                answered && idx === question.correct_index
                  ? "bg-emerald-500/20 text-emerald-400"
                  : answered && idx === selectedIndex
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/5 text-white/40"
              }`}
            >
              {optionLabels[idx]}
            </span>
            <span className="pt-0.5">{opt}</span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
        >
          <p className="font-body text-xs text-white/40 mb-1">Explanation</p>
          <p className="font-body text-sm text-white/70 leading-relaxed">
            {question.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

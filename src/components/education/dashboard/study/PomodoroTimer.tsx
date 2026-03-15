"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PomodoroTimerProps {
  onSessionComplete?: (durationMinutes: number, subject: string) => void;
}

const PRESETS = [
  { label: "25 / 5", work: 25, break: 5 },
  { label: "50 / 10", work: 50, break: 10 },
  { label: "90 / 20", work: 90, break: 20 },
];

type TimerPhase = "idle" | "work" | "break";

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [presetIndex, setPresetIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [subject, setSubject] = useState("");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const preset = PRESETS[presetIndex];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  function startWork() {
    clearTimer();
    setPhase("work");
    setSecondsLeft(preset.work * 60);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function startBreak() {
    clearTimer();
    setPhase("break");
    setSecondsLeft(preset.break * 60);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stop() {
    clearTimer();
    setPhase("idle");
    setSecondsLeft(0);
  }

  // Handle phase transitions when timer hits zero
  useEffect(() => {
    if (secondsLeft === 0 && phase === "work") {
      // Work session complete — log it
      const actualMinutes = Math.round((Date.now() - startTimeRef.current) / 60000);
      setSessionsCompleted((prev) => prev + 1);
      if (onSessionComplete) {
        onSessionComplete(actualMinutes || preset.work, subject || "Pomodoro");
      }
      // Auto-start break
      startBreak();
    } else if (secondsLeft === 0 && phase === "break") {
      // Break done — go idle
      setPhase("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = phase === "work" ? preset.work * 60 : phase === "break" ? preset.break * 60 : 1;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  // Circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          phase === "work"
            ? "bg-red-500/80 text-white"
            : phase === "break"
              ? "bg-emerald-500/80 text-white"
              : "glass-card text-white/60 hover:text-white"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Pomodoro Timer"
      >
        {phase !== "idle" ? (
          <span className="font-mono text-xs font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 6v6l4 2" />
          </svg>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-6 z-50 w-72 glass-card rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-sm text-white">Pomodoro Timer</h3>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Timer display */}
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  {phase !== "idle" && (
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke={phase === "work" ? "#ef4444" : "#10b981"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000 ease-linear"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl text-white font-bold">
                    {phase === "idle"
                      ? `${preset.work}:00`
                      : `${minutes}:${seconds.toString().padStart(2, "0")}`}
                  </span>
                  <span className="font-body text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">
                    {phase === "idle" ? "Ready" : phase === "work" ? "Focus" : "Break"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preset selector (only when idle) */}
            {phase === "idle" && (
              <div className="flex gap-2 mb-4">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => setPresetIndex(i)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono transition-all ${
                      i === presetIndex
                        ? "glass-card text-blue-400"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Subject input (only when idle) */}
            {phase === "idle" && (
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-body text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/30 transition-colors mb-4"
              />
            )}

            {/* Controls */}
            <div className="flex gap-2">
              {phase === "idle" ? (
                <button
                  onClick={startWork}
                  className="flex-1 glass-card px-4 py-2.5 rounded-xl text-sm font-body text-white/80 hover:text-white transition-all hover:border-red-500/30"
                >
                  Start Focus
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="flex-1 glass-card px-4 py-2.5 rounded-xl text-sm font-body text-red-400/60 hover:text-red-400 transition-all hover:border-red-500/30"
                >
                  Stop
                </button>
              )}
            </div>

            {/* Sessions count */}
            {sessionsCompleted > 0 && (
              <p className="font-mono text-[10px] text-white/20 text-center mt-3">
                {sessionsCompleted} session{sessionsCompleted !== 1 ? "s" : ""} completed today
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

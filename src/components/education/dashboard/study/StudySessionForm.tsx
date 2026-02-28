"use client";
import { useState, useEffect } from "react";
import { StudySession } from "@/types";
import { STUDY_SUBJECTS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface StudySessionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (session: Omit<StudySession, "id" | "created_at">) => void;
  editSession?: StudySession;
}

export function StudySessionForm({ open, onClose, onSubmit, editSession }: StudySessionFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [subject, setSubject] = useState(STUDY_SUBJECTS[0]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editSession) {
      setSubject(editSession.subject);
      setHours(Math.floor(editSession.duration_minutes / 60));
      setMinutes(editSession.duration_minutes % 60);
      setDate(editSession.date);
      setNotes(editSession.notes);
    } else {
      setSubject(STUDY_SUBJECTS[0]);
      setHours(0);
      setMinutes(30);
      setDate(today);
      setNotes("");
    }
  }, [editSession, today]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const duration_minutes = hours * 60 + minutes;
    if (duration_minutes <= 0) return;
    onSubmit({ subject, duration_minutes, date, notes });
    onClose();
  }

  const inputClass =
    "bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all w-full";
  const selectClass =
    "bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all w-full appearance-none";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="glass-card rounded-2xl p-6 w-full max-w-md relative z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-display font-semibold text-lg text-white mb-6">
              {editSession ? "Edit Study Session" : "Log Study Session"}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Subject */}
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={selectClass}
                >
                  {STUDY_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Duration</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                      className={inputClass}
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-white/20">
                      hours
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className={inputClass}
                      placeholder="30"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-white/20">
                      mins
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputClass} resize-none h-20`}
                  placeholder="What did you study?"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={hours * 60 + minutes <= 0}
                  className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 ml-auto"
                >
                  {editSession ? "Update" : "Log Session"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

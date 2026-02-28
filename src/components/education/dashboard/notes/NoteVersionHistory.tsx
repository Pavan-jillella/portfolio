"use client";
import { NoteVersion } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface NoteVersionHistoryProps {
  open: boolean;
  onClose: () => void;
  versions: NoteVersion[];
  onRestore: (contentHtml: string) => void;
}

export function NoteVersionHistory({ open, onClose, versions, onRestore }: NoteVersionHistoryProps) {
  const sorted = [...versions].sort((a, b) => b.saved_at.localeCompare(a.saved_at));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="glass-card rounded-2xl p-6 w-full max-w-2xl relative z-10 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-white">Version History</h3>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-lg">
                &times;
              </button>
            </div>

            {sorted.length === 0 ? (
              <p className="font-body text-sm text-white/20 text-center py-8">No versions saved yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {sorted.map((v) => {
                  const preview = v.content_html.replace(/<[^>]*>/g, "").slice(0, 100);
                  const date = new Date(v.saved_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  return (
                    <div key={v.id} className="glass-card rounded-xl p-4 flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs text-white/40 mb-1">{date}</p>
                        <p className="font-body text-sm text-white/50 truncate">{preview || "(empty)"}</p>
                      </div>
                      <button
                        onClick={() => {
                          onRestore(v.content_html);
                          onClose();
                        }}
                        className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 shrink-0"
                      >
                        Restore
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";
import { useState } from "react";
import { Certificate } from "@/types";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { generateId } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface CertificatesPanelProps {
  certificates: Certificate[];
  onAdd: (cert: Omit<Certificate, "id" | "created_at">) => void;
  onDelete: (id: string) => void;
}

export function CertificatesPanel({ certificates, onAdd, onDelete }: CertificatesPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");

  const inputClass =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all w-full";

  function resetForm() {
    setName("");
    setIssuer("");
    setDate("");
    setUrl("");
    setShowForm(false);
  }

  function handleSave() {
    if (!name.trim() || !issuer.trim() || !date) return;
    onAdd({
      name: name.trim(),
      issuer: issuer.trim(),
      date,
      url: url.trim(),
    });
    resetForm();
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-5 text-left flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-display font-semibold text-lg text-white">Certificates</h3>
          <span className="font-mono text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
            {certificates.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5">
              {/* Empty state */}
              {certificates.length === 0 && !showForm && (
                <p className="font-body text-sm text-white/20 text-center py-8">
                  No certificates earned yet. Add your first one!
                </p>
              )}

              {/* Certificate grid */}
              {certificates.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <AnimatePresence mode="popLayout">
                    {certificates.map((cert) => (
                      <motion.div
                        key={cert.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card rounded-2xl p-5 group relative"
                      >
                        <ConfirmDelete
                          onConfirm={() => onDelete(cert.id)}
                          label="&times;"
                          className="absolute top-3 right-3 sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                        />
                        <h4 className="font-display font-semibold text-sm text-white mb-1 pr-6 truncate">
                          {cert.name}
                        </h4>
                        <p className="font-body text-xs text-white/40 mb-2 truncate">{cert.issuer}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-white/30">{cert.date}</span>
                          {cert.url && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-body text-xs text-blue-400/70 hover:text-blue-400 transition-colors"
                            >
                              View
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Add Certificate form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex flex-col gap-3"
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Certificate name"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      placeholder="Issuer (e.g. Coursera, AWS)"
                      className={inputClass}
                    />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Certificate URL (optional)"
                      className={inputClass}
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSave}
                        disabled={!name.trim() || !issuer.trim() || !date}
                        className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30"
                      >
                        Save
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-5 py-2.5 rounded-xl text-sm font-body text-white/30 hover:text-white/50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add button */}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 glass-card px-5 py-2 rounded-2xl text-sm font-body text-white/60 hover:text-white hover:border-blue-500/30 transition-all duration-300 w-full"
                >
                  + Add Certificate
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

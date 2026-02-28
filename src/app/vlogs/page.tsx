"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Vlog } from "@/types";
import { VLOGS as DEFAULT_VLOGS } from "@/lib/vlogs";
import { PageHeader } from "@/components/ui/PageHeader";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { VlogManager } from "@/components/vlogs/VlogManager";

const categories = ["All", "Technology", "Education", "Finance", "Lifestyle", "Other"];

export default function VlogsPage() {
  const [vlogs, setVlogs] = useLocalStorage<Vlog[]>("pj-vlogs", DEFAULT_VLOGS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [manageMode, setManageMode] = useState(false);

  const filtered = activeCategory === "All"
    ? vlogs
    : vlogs.filter((v) => v.category === activeCategory);

  function addVlog(vlog: Vlog) {
    setVlogs((prev) => [vlog, ...prev]);
  }

  function editVlog(id: string, updates: Partial<Vlog>) {
    setVlogs((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  }

  function deleteVlog(id: string) {
    setVlogs((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <>
      <PageHeader
        label="Vlogs"
        title="Watch & learn."
        description="Video content on technology, education, and personal finance."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full border font-body text-xs transition-all duration-200 ${
                    activeCategory === cat
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                      : "border-white/8 bg-white/4 text-white/50 hover:text-white hover:border-white/15"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setManageMode(!manageMode)}
              className={`px-4 py-2 rounded-full border font-body text-xs transition-all duration-200 ${
                manageMode
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                  : "border-white/8 bg-white/4 text-white/50 hover:text-white hover:border-white/15"
              }`}
            >
              {manageMode ? "Done" : "Manage"}
            </button>
          </div>

          {/* Vlog Manager */}
          {manageMode && (
            <VlogManager
              vlogs={vlogs}
              onAdd={addVlog}
              onEdit={editVlog}
              onDelete={deleteVlog}
            />
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filtered.map((vlog) => (
                <motion.div
                  key={vlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <YouTubeEmbed videoId={vlog.youtubeId} title={vlog.title} />
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-white mb-2">{vlog.title}</h3>
                    <p className="font-body text-sm text-white/40 mb-3 line-clamp-2">{vlog.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                        {vlog.category}
                      </span>
                      <span className="font-mono text-xs text-white/20">{vlog.duration}</span>
                      <span className="font-mono text-xs text-white/20">{vlog.publishedAt}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-16">
                  <p className="font-body text-sm text-white/30">No vlogs in this category yet.</p>
                  <button
                    onClick={() => setManageMode(true)}
                    className="mt-3 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Add your first vlog
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

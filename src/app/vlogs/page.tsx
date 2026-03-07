"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { Vlog } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { VlogManager } from "@/components/vlogs/VlogManager";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";

const categories = ["All", "Technology", "Education", "Finance", "Lifestyle", "Other"];

export default function VlogsPage() {
  const [vlogs, setVlogs] = useSupabaseRealtimeSync<Vlog>("pj-vlogs", "vlogs", []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [manageMode, setManageMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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
            <div className="flex items-center gap-3">
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
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

          {/* Grid View */}
          {viewMode === "grid" && (
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
                    <YouTubeEmbed videoId={vlog.youtube_id} title={vlog.title} />
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-white mb-2">{vlog.title}</h3>
                      <p className="font-body text-sm text-white/40 mb-3 line-clamp-2">{vlog.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                          {vlog.category}
                        </span>
                        <span className="font-mono text-xs text-white/20">{vlog.duration}</span>
                        <span className="font-mono text-xs text-white/20">{vlog.published_at}</span>
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
          )}

          {/* List View */}
          {viewMode === "list" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-list`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {filtered.map((vlog) => (
                  <motion.a
                    key={vlog.id}
                    href={`https://www.youtube.com/watch?v=${vlog.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.02] hover:border-white/15 transition-all group"
                  >
                    <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0 bg-white/5">
                      <img src={`https://img.youtube.com/vi/${vlog.youtube_id}/mqdefault.jpg`} alt={vlog.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-semibold text-sm text-white group-hover:text-blue-300 transition-colors truncate mb-1">
                        {vlog.title}
                      </h3>
                      <p className="font-body text-xs text-white/40 line-clamp-1 mb-2">{vlog.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">{vlog.category}</span>
                        <span className="font-mono text-xs text-white/20">{vlog.duration}</span>
                        <span className="font-mono text-xs text-white/20">{vlog.published_at}</span>
                      </div>
                    </div>
                  </motion.a>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <p className="font-body text-sm text-white/30">No vlogs in this category yet.</p>
                    <button onClick={() => setManageMode(true)} className="mt-3 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Add your first vlog
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Published</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((vlog) => (
                      <tr key={vlog.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-2.5">
                          <a href={`https://www.youtube.com/watch?v=${vlog.youtube_id}`} target="_blank" rel="noopener noreferrer"
                             className="font-body text-xs text-white/70 hover:text-blue-300 transition-colors">
                            {vlog.title}
                          </a>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">{vlog.category}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-xs text-white/40">{vlog.duration}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="font-mono text-xs text-white/30">{vlog.published_at}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-body text-sm text-white/30">No vlogs in this category yet.</p>
                  <button onClick={() => setManageMode(true)} className="mt-3 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Add your first vlog
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { UserProject } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { useAuth } from "@/components/providers/AuthProvider";

const LANGUAGES = ["All", "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "Other"];

const inputClass =
  "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useSupabaseRealtimeSync<UserProject>("pj-user-projects", "user_projects", []);
  const [activeLang, setActiveLang] = useState("All");
  const [manageMode, setManageMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [url, setUrl] = useState("");
  const [topics, setTopics] = useState("");

  const languages = ["All", ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))];

  const filtered = activeLang === "All"
    ? projects
    : projects.filter((p) => p.language === activeLang);

  function resetForm() {
    setName("");
    setDescription("");
    setLanguage("TypeScript");
    setUrl("");
    setTopics("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const topicsList = topics.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name, description, language, url, topics: topicsList }
            : p
        )
      );
    } else {
      const newProject: UserProject = {
        id: Date.now().toString(),
        name,
        description,
        language,
        url,
        stars: 0,
        forks: 0,
        topics: topicsList,
        created_at: new Date().toISOString(),
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    resetForm();
  }

  function startEdit(project: UserProject) {
    setName(project.name);
    setDescription(project.description);
    setLanguage(project.language);
    setUrl(project.url);
    setTopics(project.topics.join(", "));
    setEditingId(project.id);
    setShowForm(true);
    setManageMode(true);
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <>
      <PageHeader
        label="Projects"
        title="Things I've built."
        description="Open source tools, libraries, and applications. Most are built to scratch my own itch."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap items-center gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all duration-200 ${
                    activeLang === lang
                      ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                      : "border-white/8 bg-white/4 text-white/40 hover:border-white/15 hover:text-white/60"
                  }`}
                >
                  {lang}
                  {lang !== "All" && (
                    <span className="ml-1.5 text-[10px] opacity-60">
                      {projects.filter((p) => p.language === lang).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
              {user && (
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
              )}
            </div>
          </div>

          {/* Project Manager */}
          {manageMode && (
            <div className="mb-10">
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
                >
                  + Add Project
                </button>
              )}

              <AnimatePresence>
                {showForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit}
                    className="glass-card rounded-2xl p-6 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold text-white text-sm">
                        {editingId ? "Edit Project" : "Add New Project"}
                      </h3>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-white/30 hover:text-white/60 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Project" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this project do?" rows={2} className={`${inputClass} resize-none`} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Language</label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`${inputClass} appearance-none`}>
                          {LANGUAGES.filter((l) => l !== "All").map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">URL</label>
                        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/..." className={inputClass} required />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Topics (comma-separated)</label>
                      <input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="react, typescript, api" className={inputClass} />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-body font-medium hover:bg-blue-500 transition-colors">
                        {editingId ? "Save Changes" : "Add Project"}
                      </button>
                      <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl text-white/40 text-sm font-body hover:text-white/60 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {projects.length > 0 && !showForm && (
                <div className="mt-4 space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-body text-sm text-white truncate">{project.name}</p>
                        <p className="font-mono text-[10px] text-white/30">{project.language}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button onClick={() => startEdit(project)} className="px-3 py-1.5 rounded-lg text-xs font-body text-white/40 hover:text-blue-400 hover:bg-white/4 transition-all">
                          Edit
                        </button>
                        {deleteConfirm === project.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => deleteProject(project.id)} className="px-3 py-1.5 rounded-lg text-xs font-body text-red-400 hover:bg-red-500/10 transition-all">Confirm</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1.5 rounded-lg text-xs font-body text-white/30 hover:text-white/50 transition-all">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(project.id)} className="px-3 py-1.5 rounded-lg text-xs font-body text-white/40 hover:text-red-400 hover:bg-white/4 transition-all">
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filtered projects */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((project, i) => (
                <FadeIn key={project.id} delay={i * 0.05}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass-card rounded-2xl p-6 hover:bg-white/[0.02] hover:border-white/15 transition-all duration-300 group h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {project.name}
                      </h3>
                      <span className="font-mono text-xs text-white/20 shrink-0 ml-3">{project.language}</span>
                    </div>
                    <p className="font-body text-sm text-white/40 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-white/30">★ {project.stars}</span>
                      <span className="font-mono text-xs text-white/30">⑂ {project.forks}</span>
                    </div>
                    {project.topics && project.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.topics.slice(0, 4).map((topic: string) => (
                          <span key={topic} className="px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-xs text-white/20">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </FadeIn>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="space-y-2">
              {filtered.map((project, i) => (
                <FadeIn key={project.id} delay={i * 0.03}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass-card rounded-2xl p-4 hover:bg-white/[0.02] hover:border-white/15 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-display font-semibold text-sm text-white group-hover:text-blue-300 transition-colors truncate">
                          {project.name}
                        </span>
                        <span className="font-mono text-[10px] text-white/30 shrink-0">{project.language}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-mono text-xs text-white/30">★ {project.stars}</span>
                        <span className="font-mono text-xs text-white/30">⑂ {project.forks}</span>
                        <span className="font-body text-xs text-white/20 truncate max-w-[250px] hidden md:block">
                          {project.description}
                        </span>
                      </div>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          )}

          {viewMode === "table" && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Language</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Stars</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Forks</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((project) => (
                      <tr key={project.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-2.5">
                          <a href={project.url} target="_blank" rel="noopener noreferrer"
                             className="font-body text-xs text-white/70 hover:text-blue-300 transition-colors">
                            {project.name}
                          </a>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-[10px] text-white/40">{project.language}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="font-mono text-xs text-white/40">{project.stars}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="font-mono text-xs text-white/40">{project.forks}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-body text-xs text-white/30 truncate max-w-[300px] block">{project.description}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-sm text-white/30">No projects yet.</p>
              {user && (
                <button
                  onClick={() => { setManageMode(true); setShowForm(true); }}
                  className="mt-3 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Add your first project
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import {
  AboutContent,
  AboutBioData,
  AboutSkillGroup,
  AboutTimelineEntry,
  AboutExperienceEntry,
  AboutEducationEntry,
  AboutMetaData,
} from "@/types";

// ─── Defaults ────────────────────────────────────────────

const DEFAULT_BIO: AboutBioData = {
  heading: "Data-Driven Problem Solver.",
  description:
    "Data Analyst at Morgan Stanley with expertise in Python, SQL, cloud platforms, and machine learning — turning complex data into actionable insights.",
  paragraphs: [
    "I'm Pavan — a Data Analyst at Morgan Stanley with a Master's in Data Analytics Engineering from George Mason University. I specialize in building scalable data pipelines, predictive models, and interactive dashboards that drive business decisions.",
    "With experience spanning Morgan Stanley, Stryker, and Walmart Global Tech, I've worked across financial analytics, healthcare operations, and retail intelligence. I'm certified as a Google Cloud Professional Data Engineer and AWS Certified ML Specialist.",
  ],
};

const DEFAULT_SKILLS: AboutSkillGroup[] = [
  { category: "Languages", items: ["Python", "R", "SQL", "JavaScript", "TypeScript", "Scala"] },
  { category: "Data & ML", items: ["TensorFlow", "PyTorch", "scikit-learn", "Pandas", "PySpark", "Hadoop"] },
  { category: "Cloud & Tools", items: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Airflow"] },
  { category: "Visualization", items: ["Tableau", "Power BI", "Plotly", "D3.js", "Looker"] },
];

const DEFAULT_TIMELINE: AboutTimelineEntry[] = [
  { year: "2024", title: "Data Analyst — Morgan Stanley", description: "Building data pipelines and predictive models for financial analytics." },
  { year: "2022", title: "M.S. Data Analytics Engineering", description: "George Mason University, GPA: 3.8/4.0." },
  { year: "2021", title: "Business Analyst — Stryker", description: "Optimized healthcare operations through advanced analytics." },
];

const DEFAULT_EXPERIENCE: AboutExperienceEntry[] = [
  { company: "Morgan Stanley", role: "Data Analyst", period: "Jan 2024 – Present", description: "Building data pipelines and predictive models for financial analytics. Streamlined reporting with automated ETL workflows.", current: true },
  { company: "Stryker", role: "Business Analyst", period: "Mar 2021 – Jul 2022", description: "Optimized healthcare supply chain operations using advanced analytics and Tableau dashboards." },
  { company: "Walmart Global Tech", role: "Data Analyst", period: "Feb 2019 – Feb 2021", description: "Built retail intelligence pipelines, implemented ML models for demand forecasting, and created executive dashboards." },
];

const DEFAULT_EDUCATION: AboutEducationEntry[] = [
  { institution: "George Mason University", degree: "M.S. Data Analytics Engineering", period: "Aug 2022 – May 2024", description: "GPA: 3.8/4.0. Coursework in Machine Learning, Big Data, NLP, and Statistical Methods." },
];

const DEFAULT_META: AboutMetaData = {
  photoUrl: "",
  resumeUrl: "/Pavan_Jillella_Resume.pdf",
  resumeFileName: "Pavan_Jillella_Resume.pdf",
};

// ─── Helpers ─────────────────────────────────────────────

function seedDefaults(): AboutContent[] {
  const now = new Date().toISOString();
  return [
    { id: "about-bio", section: "bio", data: DEFAULT_BIO, sort_order: 0, created_at: now, updated_at: now },
    { id: "about-skills", section: "skills", data: DEFAULT_SKILLS, sort_order: 1, created_at: now, updated_at: now },
    { id: "about-experience", section: "experience", data: DEFAULT_EXPERIENCE, sort_order: 2, created_at: now, updated_at: now },
    { id: "about-education", section: "education", data: DEFAULT_EDUCATION, sort_order: 3, created_at: now, updated_at: now },
    { id: "about-timeline", section: "timeline", data: DEFAULT_TIMELINE, sort_order: 4, created_at: now, updated_at: now },
    { id: "about-meta", section: "meta", data: DEFAULT_META, sort_order: 5, created_at: now, updated_at: now },
  ];
}

function extractSection<T>(items: AboutContent[], section: string, fallback: T): T {
  return (items.find((i) => i.section === section)?.data as T) ?? fallback;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all";
const textareaClass = `${inputClass} resize-none`;
const labelClass = "block font-body text-xs text-white/30 mb-1.5 ml-1";
const sectionCardClass = "rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8";

function SaveButton({ onClick, saving }: { onClick: () => void; saving?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="px-5 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-body text-xs font-medium hover:bg-blue-500/30 transition-all disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </button>
  );
}

function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display font-semibold text-lg text-white">{title}</h2>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 font-mono text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/20 transition-all"
    >
      Remove
    </button>
  );
}

function SavedBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-xs text-emerald-400"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Saved
    </motion.span>
  );
}

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Page ────────────────────────────────────────────────

export default function EditAboutPage() {
  // Synced state (source of truth from Supabase / localStorage)
  const [items, setItems] = useSupabaseRealtimeSync<AboutContent>("pj-about-content", "about_content", []);
  const [seeded, setSeeded] = useState(false);

  // Local draft state (edited freely, only pushed on Save)
  const [bio, setBio] = useState<AboutBioData>(DEFAULT_BIO);
  const [skills, setSkills] = useState<AboutSkillGroup[]>(DEFAULT_SKILLS);
  const [timeline, setTimeline] = useState<AboutTimelineEntry[]>(DEFAULT_TIMELINE);
  const [experience, setExperience] = useState<AboutExperienceEntry[]>(DEFAULT_EXPERIENCE);
  const [education, setEducation] = useState<AboutEducationEntry[]>(DEFAULT_EDUCATION);
  const [meta, setMeta] = useState<AboutMetaData>(DEFAULT_META);
  const draftsInitialized = useRef(false);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const { upload, remove: removeFile } = useSupabaseStorage();
  const { toasts, addToast, dismissToast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Seed defaults on first visit
  useEffect(() => {
    if (items.length === 0 && !seeded) {
      setItems(seedDefaults());
      setSeeded(true);
    }
  }, [items.length, seeded, setItems]);

  // Initialize drafts from synced items (once data is loaded)
  useEffect(() => {
    if (items.length > 0 && !draftsInitialized.current) {
      draftsInitialized.current = true;
      setBio(extractSection(items, "bio", DEFAULT_BIO));
      setSkills(extractSection(items, "skills", DEFAULT_SKILLS));
      setTimeline(extractSection(items, "timeline", DEFAULT_TIMELINE));
      setExperience(extractSection(items, "experience", DEFAULT_EXPERIENCE));
      setEducation(extractSection(items, "education", DEFAULT_EDUCATION));
      setMeta(extractSection(items, "meta", DEFAULT_META));
    }
  }, [items]);

  // ─── Save handler: push draft to synced state ──────────
  function saveSection(section: AboutContent["section"], data: AboutContent["data"]) {
    setItems((prev) => {
      const exists = prev.some((item) => item.section === section);
      if (exists) {
        return prev.map((item) =>
          item.section === section ? { ...item, data, updated_at: new Date().toISOString() } : item
        );
      }
      const now = new Date().toISOString();
      return [...prev, { id: `about-${section}`, section, data, sort_order: prev.length, created_at: now, updated_at: now }];
    });
    setSaveStatus(section);
    addToast(`${section.charAt(0).toUpperCase() + section.slice(1)} saved`, "success");
    setTimeout(() => setSaveStatus(null), 2000);
  }

  // ─── File upload handlers (save immediately) ───────────
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { addToast("Photo must be under 5MB", "error"); return; }
    setUploading("photo");
    const result = await upload(file, `about/photo-${Date.now()}.${file.name.split(".").pop()}`);
    if (result) {
      if (meta.photoUrl && meta.photoUrl.includes("/education-files/")) {
        const oldPath = meta.photoUrl.split("/education-files/")[1];
        if (oldPath) await removeFile(oldPath);
      }
      const newMeta = { ...meta, photoUrl: result.url };
      setMeta(newMeta);
      saveSection("meta", newMeta);
      addToast("Photo updated successfully", "success");
    } else {
      addToast("Failed to upload photo", "error");
    }
    setUploading(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { addToast("Resume must be under 10MB", "error"); return; }
    setUploading("resume");
    const result = await upload(file, `about/resume-${Date.now()}.${file.name.split(".").pop()}`);
    if (result) {
      if (meta.resumeUrl && meta.resumeUrl.includes("/education-files/")) {
        const oldPath = meta.resumeUrl.split("/education-files/")[1];
        if (oldPath) await removeFile(oldPath);
      }
      const newMeta = { ...meta, resumeUrl: result.url, resumeFileName: file.name };
      setMeta(newMeta);
      saveSection("meta", newMeta);
      addToast("Resume uploaded successfully", "success");
    } else {
      addToast("Failed to upload resume", "error");
    }
    setUploading(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  }

  // ─── Bio draft helpers ─────────────────
  function resetToDefaults() {
    if (!confirm("Reset all About page content to defaults? This will overwrite any custom edits.")) return;
    const seeded = seedDefaults();
    setItems(seeded);
    setBio(DEFAULT_BIO);
    setSkills(DEFAULT_SKILLS);
    setTimeline(DEFAULT_TIMELINE);
    setExperience(DEFAULT_EXPERIENCE);
    setEducation(DEFAULT_EDUCATION);
    setMeta(DEFAULT_META);
    addToast("All sections reset to defaults", "success");
    setSaveStatus("all");
    setTimeout(() => setSaveStatus(null), 2000);
  }

  function updateBioField(field: keyof AboutBioData, value: string | string[]) {
    setBio((prev) => ({ ...prev, [field]: value }));
  }
  function updateParagraph(index: number, value: string) {
    setBio((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs[index] = value;
      return { ...prev, paragraphs };
    });
  }
  function addParagraph() {
    setBio((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  }
  function removeParagraph(index: number) {
    setBio((prev) => ({ ...prev, paragraphs: prev.paragraphs.filter((_, i) => i !== index) }));
  }

  // ─── Skills draft helpers ──────────────
  function updateSkillGroup(index: number, field: "category" | "items", value: string | string[]) {
    setSkills((prev) => {
      const groups = [...prev];
      groups[index] = { ...groups[index], [field]: value };
      return groups;
    });
  }
  function addSkillGroup() {
    setSkills((prev) => [...prev, { category: "", items: [] }]);
  }
  function removeSkillGroup(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  // ─── Experience draft helpers ──────────
  function updateExperienceEntry(index: number, field: keyof AboutExperienceEntry, value: string | boolean) {
    setExperience((prev) => {
      const entries = [...prev];
      entries[index] = { ...entries[index], [field]: value };
      return entries;
    });
  }
  function addExperienceEntry() {
    setExperience((prev) => [{ company: "", role: "", period: "", description: "", current: false }, ...prev]);
  }
  function removeExperienceEntry(index: number) {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  }

  // ─── Education draft helpers ───────────
  function updateEducationEntry(index: number, field: keyof AboutEducationEntry, value: string) {
    setEducation((prev) => {
      const entries = [...prev];
      entries[index] = { ...entries[index], [field]: value };
      return entries;
    });
  }
  function addEducationEntry() {
    setEducation((prev) => [{ institution: "", degree: "", period: "", description: "" }, ...prev]);
  }
  function removeEducationEntry(index: number) {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }

  // ─── Timeline draft helpers ────────────
  function updateTimelineEntry(index: number, field: keyof AboutTimelineEntry, value: string) {
    setTimeline((prev) => {
      const entries = [...prev];
      entries[index] = { ...entries[index], [field]: value };
      return entries;
    });
  }
  function addTimelineEntry() {
    setTimeline((prev) => [{ year: "", title: "", description: "" }, ...prev]);
  }
  function removeTimelineEntry(index: number) {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <section className="px-6 pb-20">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div {...fadeIn()}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-2">Edit About Page</h1>
              <p className="font-body text-sm text-white/40">
                Edit your content below, then click <span className="text-blue-400 font-medium">Save</span> to publish to your <span className="text-blue-400">/about</span> page.
              </p>
            </div>
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-body text-xs font-medium hover:bg-amber-500/20 transition-all shrink-0"
            >
              Reset to Defaults
            </button>
          </div>
        </motion.div>

        {/* ─── Photo & Resume ─────────────────── */}
        <motion.div {...fadeIn(0.03)}>
          <div className={`${sectionCardClass} mb-6`}>
            <SectionHeader title="Photo & Resume">
              <AnimatePresence>{saveStatus === "meta" && <SavedBadge />}</AnimatePresence>
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Photo */}
              <div>
                <label className={labelClass}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden flex items-center justify-center shrink-0">
                    {meta.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={meta.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-white/15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploading === "photo"}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-body text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {uploading === "photo" ? "Uploading..." : meta.photoUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                    <p className="font-mono text-[10px] text-white/20 mt-1">JPG, PNG, WebP. Max 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div>
                <label className={labelClass}>Resume / CV</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0">
                    {meta.resumeUrl ? (
                      <svg className="w-8 h-8 text-emerald-400/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white/15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      disabled={uploading === "resume"}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-body text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      {uploading === "resume" ? "Uploading..." : meta.resumeUrl ? "Replace Resume" : "Upload Resume"}
                    </button>
                    {meta.resumeFileName ? (
                      <p className="font-mono text-[10px] text-emerald-400/50 mt-1">{meta.resumeFileName}</p>
                    ) : (
                      <p className="font-mono text-[10px] text-white/20 mt-1">PDF, DOC. Max 10MB.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Bio Section ─────────────────────── */}
        <motion.div {...fadeIn(0.06)}>
          <div className={`${sectionCardClass} mb-6`}>
            <SectionHeader title="Bio">
              <AnimatePresence>{saveStatus === "bio" && <SavedBadge />}</AnimatePresence>
              <SaveButton onClick={() => saveSection("bio", bio)} />
            </SectionHeader>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Page Heading</label>
                <input
                  type="text"
                  value={bio.heading}
                  onChange={(e) => updateBioField("heading", e.target.value)}
                  className={inputClass}
                  placeholder="Building at the intersection."
                />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  type="text"
                  value={bio.description}
                  onChange={(e) => updateBioField("description", e.target.value)}
                  className={inputClass}
                  placeholder="Developer, writer, and lifelong learner..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Paragraphs</label>
                  <button onClick={addParagraph} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
                    + Add paragraph
                  </button>
                </div>
                <div className="space-y-3">
                  {bio.paragraphs.map((p, i) => (
                    <div key={i} className="relative group">
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => updateParagraph(i, e.target.value)}
                        className={textareaClass}
                        placeholder={`Paragraph ${i + 1}`}
                      />
                      {bio.paragraphs.length > 1 && <RemoveButton onClick={() => removeParagraph(i)} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Experience Section ──────────────── */}
        <motion.div {...fadeIn(0.09)}>
          <div className={`${sectionCardClass} mb-6`}>
            <SectionHeader title="Experience">
              <button onClick={addExperienceEntry} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
                + Add
              </button>
              <AnimatePresence>{saveStatus === "experience" && <SavedBadge />}</AnimatePresence>
              <SaveButton onClick={() => saveSection("experience", experience)} />
            </SectionHeader>
            <div className="space-y-4">
              {experience.map((entry, i) => (
                <div key={i} className="relative group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        type="text"
                        value={entry.company}
                        onChange={(e) => updateExperienceEntry(i, "company", e.target.value)}
                        className={inputClass}
                        placeholder="Google, Meta, etc."
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Role</label>
                      <input
                        type="text"
                        value={entry.role}
                        onChange={(e) => updateExperienceEntry(i, "role", e.target.value)}
                        className={inputClass}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-3">
                    <div>
                      <label className={labelClass}>Period</label>
                      <input
                        type="text"
                        value={entry.period}
                        onChange={(e) => updateExperienceEntry(i, "period", e.target.value)}
                        className={inputClass}
                        placeholder="2024 – Present"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entry.current ?? false}
                          onChange={(e) => updateExperienceEntry(i, "current", e.target.checked)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                        />
                        <span className="font-body text-xs text-white/40">Current</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={2}
                      value={entry.description}
                      onChange={(e) => updateExperienceEntry(i, "description", e.target.value)}
                      className={textareaClass}
                      placeholder="Key responsibilities and accomplishments..."
                    />
                  </div>
                  <RemoveButton onClick={() => removeExperienceEntry(i)} />
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-center font-body text-sm text-white/20 py-8">No experience entries yet. Click + Add to start.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ─── Education Section ──────────────── */}
        <motion.div {...fadeIn(0.12)}>
          <div className={`${sectionCardClass} mb-6`}>
            <SectionHeader title="Education">
              <button onClick={addEducationEntry} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
                + Add
              </button>
              <AnimatePresence>{saveStatus === "education" && <SavedBadge />}</AnimatePresence>
              <SaveButton onClick={() => saveSection("education", education)} />
            </SectionHeader>
            <div className="space-y-4">
              {education.map((entry, i) => (
                <div key={i} className="relative group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input
                        type="text"
                        value={entry.institution}
                        onChange={(e) => updateEducationEntry(i, "institution", e.target.value)}
                        className={inputClass}
                        placeholder="University of..."
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input
                        type="text"
                        value={entry.degree}
                        onChange={(e) => updateEducationEntry(i, "degree", e.target.value)}
                        className={inputClass}
                        placeholder="B.S. Computer Science"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className={labelClass}>Period</label>
                    <input
                      type="text"
                      value={entry.period}
                      onChange={(e) => updateEducationEntry(i, "period", e.target.value)}
                      className={inputClass}
                      placeholder="2019 – 2023"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={2}
                      value={entry.description}
                      onChange={(e) => updateEducationEntry(i, "description", e.target.value)}
                      className={textareaClass}
                      placeholder="Relevant coursework, GPA, achievements..."
                    />
                  </div>
                  <RemoveButton onClick={() => removeEducationEntry(i)} />
                </div>
              ))}
              {education.length === 0 && (
                <p className="text-center font-body text-sm text-white/20 py-8">No education entries yet. Click + Add to start.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ─── Skills Section ──────────────────── */}
        <motion.div {...fadeIn(0.15)}>
          <div className={`${sectionCardClass} mb-6`}>
            <SectionHeader title="Technical Skills">
              <button onClick={addSkillGroup} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
                + Add group
              </button>
              <AnimatePresence>{saveStatus === "skills" && <SavedBadge />}</AnimatePresence>
              <SaveButton onClick={() => saveSection("skills", skills)} />
            </SectionHeader>
            <div className="space-y-4">
              {skills.map((group, i) => (
                <div key={i} className="relative group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
                    <div>
                      <label className={labelClass}>Category</label>
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => updateSkillGroup(i, "category", e.target.value)}
                        className={inputClass}
                        placeholder="Languages"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Items (comma-separated)</label>
                      <input
                        type="text"
                        value={group.items.join(", ")}
                        onChange={(e) =>
                          updateSkillGroup(i, "items", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                        }
                        className={inputClass}
                        placeholder="TypeScript, Python, Go"
                      />
                    </div>
                  </div>
                  <RemoveButton onClick={() => removeSkillGroup(i)} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Timeline Section ────────────────── */}
        <motion.div {...fadeIn(0.18)}>
          <div className={sectionCardClass}>
            <SectionHeader title="Journey / Timeline">
              <button onClick={addTimelineEntry} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
                + Add entry
              </button>
              <AnimatePresence>{saveStatus === "timeline" && <SavedBadge />}</AnimatePresence>
              <SaveButton onClick={() => saveSection("timeline", timeline)} />
            </SectionHeader>
            <div className="space-y-4">
              {timeline.map((entry, i) => (
                <div key={i} className="relative group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-3 mb-3">
                    <div>
                      <label className={labelClass}>Year</label>
                      <input
                        type="text"
                        value={entry.year}
                        onChange={(e) => updateTimelineEntry(i, "year", e.target.value)}
                        className={inputClass}
                        placeholder="2025"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Title</label>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => updateTimelineEntry(i, "title", e.target.value)}
                        className={inputClass}
                        placeholder="What happened"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      rows={2}
                      value={entry.description}
                      onChange={(e) => updateTimelineEntry(i, "description", e.target.value)}
                      className={textareaClass}
                      placeholder="Brief description of this milestone..."
                    />
                  </div>
                  <RemoveButton onClick={() => removeTimelineEntry(i)} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
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
  heading: "Building at the intersection.",
  description:
    "Developer, writer, and lifelong learner focused on technology, education, and financial independence.",
  paragraphs: [
    "I'm Pavan — a developer who believes in building things that matter. My work spans across technology, education, and personal finance, driven by the conviction that these three domains are deeply interconnected.",
    "When I'm not writing code, I'm usually reading, documenting what I learn, or optimizing some system in my life. I believe in compounding — in knowledge, in skills, and in investments. This portfolio is a reflection of that philosophy: everything here is built incrementally, one commit at a time.",
  ],
};

const DEFAULT_SKILLS: AboutSkillGroup[] = [
  { category: "Languages", items: ["TypeScript", "Python", "Go", "JavaScript", "SQL"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Vercel", "Figma"] },
];

const DEFAULT_TIMELINE: AboutTimelineEntry[] = [
  { year: "2026", title: "Google SDE Prep", description: "Focused preparation for Google SDE roles." },
  { year: "2025", title: "Full-Stack Portfolio & Tools", description: "Built this portfolio platform." },
  { year: "2024", title: "Full-Stack Developer", description: "Building products at the intersection of education, finance, and technology." },
];

const DEFAULT_EXPERIENCE: AboutExperienceEntry[] = [
  { company: "Your Company", role: "Software Engineer", period: "2024 – Present", description: "Describe your role and accomplishments.", current: true },
];

const DEFAULT_EDUCATION: AboutEducationEntry[] = [
  { institution: "Your University", degree: "B.S. Computer Science", period: "2019 – 2023", description: "Relevant coursework and achievements." },
];

const DEFAULT_META: AboutMetaData = {
  photoUrl: "",
  resumeUrl: "",
  resumeFileName: "",
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

const inputClass =
  "w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all";
const textareaClass = `${inputClass} resize-none`;
const labelClass = "block font-body text-xs text-white/30 mb-1.5 ml-1";
const sectionCardClass = "rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8";

function SaveButton({ onClick, label = "Save" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-body text-xs font-medium hover:bg-blue-500/30 transition-all"
    >
      {label}
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

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Page ────────────────────────────────────────────────

export default function EditAboutPage() {
  const [items, setItems] = useSupabaseRealtimeSync<AboutContent>("pj-about-content", "about_content", []);
  const [seeded, setSeeded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const { upload, remove: removeFile } = useSupabaseStorage();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Seed defaults on first visit
  useEffect(() => {
    if (items.length === 0 && !seeded) {
      setItems(seedDefaults());
      setSeeded(true);
    }
  }, [items.length, seeded, setItems]);

  // Extract sections
  const bioData = (items.find((i) => i.section === "bio")?.data ?? DEFAULT_BIO) as AboutBioData;
  const skillsData = (items.find((i) => i.section === "skills")?.data ?? DEFAULT_SKILLS) as AboutSkillGroup[];
  const timelineData = (items.find((i) => i.section === "timeline")?.data ?? DEFAULT_TIMELINE) as AboutTimelineEntry[];
  const experienceData = (items.find((i) => i.section === "experience")?.data ?? DEFAULT_EXPERIENCE) as AboutExperienceEntry[];
  const educationData = (items.find((i) => i.section === "education")?.data ?? DEFAULT_EDUCATION) as AboutEducationEntry[];
  const metaData = (items.find((i) => i.section === "meta")?.data ?? DEFAULT_META) as AboutMetaData;

  const showSaved = useCallback(() => {
    setSaveStatus("Saved");
    setTimeout(() => setSaveStatus(null), 2000);
  }, []);

  const updateSection = useCallback(
    (section: AboutContent["section"], data: AboutContent["data"]) => {
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
      showSaved();
    },
    [setItems, showSaved]
  );

  // ─── File upload handlers ─────────────
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    setUploading("photo");
    const result = await upload(file, `about/photo-${Date.now()}.${file.name.split(".").pop()}`);
    if (result) {
      if (metaData.photoUrl) {
        const oldPath = metaData.photoUrl.split("/education-files/")[1];
        if (oldPath) await removeFile(oldPath);
      }
      updateSection("meta", { ...metaData, photoUrl: result.url });
    }
    setUploading(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("Max 10MB"); return; }
    setUploading("resume");
    const result = await upload(file, `about/resume-${Date.now()}.${file.name.split(".").pop()}`);
    if (result) {
      if (metaData.resumeUrl) {
        const oldPath = metaData.resumeUrl.split("/education-files/")[1];
        if (oldPath) await removeFile(oldPath);
      }
      updateSection("meta", { ...metaData, resumeUrl: result.url, resumeFileName: file.name });
    }
    setUploading(null);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  }

  // ─── Bio Handlers ──────────────────────
  function updateBioField(field: keyof AboutBioData, value: string | string[]) {
    updateSection("bio", { ...bioData, [field]: value });
  }

  function updateParagraph(index: number, value: string) {
    const paragraphs = [...bioData.paragraphs];
    paragraphs[index] = value;
    updateSection("bio", { ...bioData, paragraphs });
  }

  function addParagraph() {
    updateSection("bio", { ...bioData, paragraphs: [...bioData.paragraphs, ""] });
  }

  function removeParagraph(index: number) {
    updateSection("bio", { ...bioData, paragraphs: bioData.paragraphs.filter((_, i) => i !== index) });
  }

  // ─── Skills Handlers ───────────────────
  function updateSkillGroup(index: number, field: "category" | "items", value: string | string[]) {
    const groups = [...skillsData];
    groups[index] = { ...groups[index], [field]: value };
    updateSection("skills", groups);
  }

  function addSkillGroup() {
    updateSection("skills", [...skillsData, { category: "", items: [] }]);
  }

  function removeSkillGroup(index: number) {
    updateSection("skills", skillsData.filter((_, i) => i !== index));
  }

  // ─── Experience Handlers ────────────────
  function updateExperienceEntry(index: number, field: keyof AboutExperienceEntry, value: string | boolean) {
    const entries = [...experienceData];
    entries[index] = { ...entries[index], [field]: value };
    updateSection("experience", entries);
  }

  function addExperienceEntry() {
    updateSection("experience", [{ company: "", role: "", period: "", description: "", current: false }, ...experienceData]);
  }

  function removeExperienceEntry(index: number) {
    updateSection("experience", experienceData.filter((_, i) => i !== index));
  }

  // ─── Education Handlers ─────────────────
  function updateEducationEntry(index: number, field: keyof AboutEducationEntry, value: string) {
    const entries = [...educationData];
    entries[index] = { ...entries[index], [field]: value };
    updateSection("education", entries);
  }

  function addEducationEntry() {
    updateSection("education", [{ institution: "", degree: "", period: "", description: "" }, ...educationData]);
  }

  function removeEducationEntry(index: number) {
    updateSection("education", educationData.filter((_, i) => i !== index));
  }

  // ─── Timeline Handlers ─────────────────
  function updateTimelineEntry(index: number, field: keyof AboutTimelineEntry, value: string) {
    const entries = [...timelineData];
    entries[index] = { ...entries[index], [field]: value };
    updateSection("timeline", entries);
  }

  function addTimelineEntry() {
    updateSection("timeline", [{ year: "", title: "", description: "" }, ...timelineData]);
  }

  function removeTimelineEntry(index: number) {
    updateSection("timeline", timelineData.filter((_, i) => i !== index));
  }

  return (
    <section className="px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div {...fadeIn()}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-2">Edit About Page</h1>
              <p className="font-body text-sm text-white/40">
                Changes auto-save and sync to your public <span className="text-blue-400">/about</span> page.
              </p>
            </div>
            <AnimatePresence>
              {saveStatus && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-xs text-emerald-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {saveStatus}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ─── Photo & Resume ─────────────────── */}
        <motion.div {...fadeIn(0.03)}>
          <div className={`${sectionCardClass} mb-6`}>
            <SectionHeader title="Photo & Resume" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Photo */}
              <div>
                <label className={labelClass}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden flex items-center justify-center shrink-0">
                    {metaData.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={metaData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
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
                      {uploading === "photo" ? "Uploading..." : metaData.photoUrl ? "Change Photo" : "Upload Photo"}
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
                    {metaData.resumeUrl ? (
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
                      {uploading === "resume" ? "Uploading..." : metaData.resumeUrl ? "Replace Resume" : "Upload Resume"}
                    </button>
                    {metaData.resumeFileName ? (
                      <p className="font-mono text-[10px] text-emerald-400/50 mt-1">{metaData.resumeFileName}</p>
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
              <SaveButton onClick={() => updateSection("bio", bioData)} />
            </SectionHeader>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Page Heading</label>
                <input
                  type="text"
                  value={bioData.heading}
                  onChange={(e) => updateBioField("heading", e.target.value)}
                  className={inputClass}
                  placeholder="Building at the intersection."
                />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  type="text"
                  value={bioData.description}
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
                  {bioData.paragraphs.map((p, i) => (
                    <div key={i} className="relative group">
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => updateParagraph(i, e.target.value)}
                        className={textareaClass}
                        placeholder={`Paragraph ${i + 1}`}
                      />
                      {bioData.paragraphs.length > 1 && <RemoveButton onClick={() => removeParagraph(i)} />}
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
              <SaveButton onClick={() => updateSection("experience", experienceData)} />
            </SectionHeader>
            <div className="space-y-4">
              {experienceData.map((entry, i) => (
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
              {experienceData.length === 0 && (
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
              <SaveButton onClick={() => updateSection("education", educationData)} />
            </SectionHeader>
            <div className="space-y-4">
              {educationData.map((entry, i) => (
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
              {educationData.length === 0 && (
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
              <SaveButton onClick={() => updateSection("skills", skillsData)} />
            </SectionHeader>
            <div className="space-y-4">
              {skillsData.map((group, i) => (
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
              <SaveButton onClick={() => updateSection("timeline", timelineData)} />
            </SectionHeader>
            <div className="space-y-4">
              {timelineData.map((entry, i) => (
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

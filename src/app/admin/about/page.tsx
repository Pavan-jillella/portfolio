"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { AboutContent, AboutBioData, AboutSkillGroup, AboutTimelineEntry } from "@/types";

// ─── Defaults (matches current hardcoded about page) ──────────

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
  { year: "2026", title: "Google SDE Prep", description: "Focused preparation for Google SDE roles. Building systems, solving 500+ LeetCode problems, and documenting everything." },
  { year: "2025", title: "Full-Stack Portfolio & Tools", description: "Built this portfolio platform with bento grid homepage, blog, finance tracker, education dashboard, and more." },
  { year: "2024", title: "Full-Stack Developer", description: "Building products at the intersection of education, finance, and technology." },
  { year: "2023", title: "Open Source Contributor", description: "Contributed to multiple open-source projects. Started building developer tools." },
  { year: "2022", title: "Started Learning in Public", description: "Launched blog and YouTube channel to document my learning journey." },
  { year: "2021", title: "First Lines of Code", description: "Wrote my first Python script. Everything changed from that point forward." },
];

// ─── Helpers ─────────────────────────────────────────────

function seedDefaults(): AboutContent[] {
  const now = new Date().toISOString();
  return [
    { id: "about-bio", section: "bio", data: DEFAULT_BIO, sort_order: 0, created_at: now, updated_at: now },
    { id: "about-skills", section: "skills", data: DEFAULT_SKILLS, sort_order: 1, created_at: now, updated_at: now },
    { id: "about-timeline", section: "timeline", data: DEFAULT_TIMELINE, sort_order: 2, created_at: now, updated_at: now },
  ];
}

const inputClass =
  "w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all";
const textareaClass = `${inputClass} resize-none`;
const labelClass = "block font-body text-xs text-white/30 mb-1.5 ml-1";

// ─── Page ────────────────────────────────────────────────

export default function AdminAboutPage() {
  const [items, setItems] = useSupabaseRealtimeSync<AboutContent>("pj-about-content", "about_content", []);
  const [seeded, setSeeded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Seed defaults on first visit
  useEffect(() => {
    if (items.length === 0 && !seeded) {
      setItems(seedDefaults());
      setSeeded(true);
    }
  }, [items.length, seeded, setItems]);

  const bioData = (items.find((i) => i.section === "bio")?.data ?? DEFAULT_BIO) as AboutBioData;
  const skillsData = (items.find((i) => i.section === "skills")?.data ?? DEFAULT_SKILLS) as AboutSkillGroup[];
  const timelineData = (items.find((i) => i.section === "timeline")?.data ?? DEFAULT_TIMELINE) as AboutTimelineEntry[];

  const updateSection = useCallback(
    (section: AboutContent["section"], data: AboutBioData | AboutSkillGroup[] | AboutTimelineEntry[]) => {
      setItems((prev) =>
        prev.map((item) =>
          item.section === section ? { ...item, data, updated_at: new Date().toISOString() } : item
        )
      );
      setSaveStatus("Saved");
      setTimeout(() => setSaveStatus(null), 2000);
    },
    [setItems]
  );

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
    <div className="max-w-4xl">
      <FadeIn>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">About Page</h1>
            <p className="font-body text-white/40">Edit your public profile. Changes sync to the live site.</p>
          </div>
          {saveStatus && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xs text-emerald-400/70"
            >
              {saveStatus}
            </motion.span>
          )}
        </div>
      </FadeIn>

      {/* ─── Bio Section ─────────────────────── */}
      <FadeIn delay={0.05}>
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="font-display font-semibold text-lg text-white mb-6">Bio</h2>
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
                    {bioData.paragraphs.length > 1 && (
                      <button
                        onClick={() => removeParagraph(i)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 font-mono text-[10px] text-red-400/50 hover:text-red-400 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ─── Skills Section ──────────────────── */}
      <FadeIn delay={0.1}>
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-white">Technical Skills</h2>
            <button onClick={addSkillGroup} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
              + Add group
            </button>
          </div>
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
                <button
                  onClick={() => removeSkillGroup(i)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 font-mono text-[10px] text-red-400/50 hover:text-red-400 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ─── Timeline Section ────────────────── */}
      <FadeIn delay={0.15}>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-white">Journey / Timeline</h2>
            <button onClick={addTimelineEntry} className="font-mono text-[10px] text-blue-400/70 hover:text-blue-400 transition-colors">
              + Add entry
            </button>
          </div>
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
                <button
                  onClick={() => removeTimelineEntry(i)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 font-mono text-[10px] text-red-400/50 hover:text-red-400 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

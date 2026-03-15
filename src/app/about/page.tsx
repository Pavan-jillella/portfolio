import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  AboutBioData,
  AboutSkillGroup,
  AboutTimelineEntry,
  AboutExperienceEntry,
  AboutEducationEntry,
  AboutMetaData,
} from "@/types";

// ─── Fallback defaults (used when DB has no data yet) ────

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
];

const DEFAULT_EXPERIENCE: AboutExperienceEntry[] = [];
const DEFAULT_EDUCATION: AboutEducationEntry[] = [];
const DEFAULT_META: AboutMetaData = { photoUrl: "", resumeUrl: "", resumeFileName: "" };

// ─── Fetch from Supabase (server-side, no auth needed) ───

async function getAboutData() {
  try {
    const supabase = createAdminClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("about_content")
      .select("section, data")
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return null;
    return {
      bio: data.find((r: { section: string }) => r.section === "bio")?.data as AboutBioData | undefined,
      skills: data.find((r: { section: string }) => r.section === "skills")?.data as AboutSkillGroup[] | undefined,
      timeline: data.find((r: { section: string }) => r.section === "timeline")?.data as AboutTimelineEntry[] | undefined,
      experience: data.find((r: { section: string }) => r.section === "experience")?.data as AboutExperienceEntry[] | undefined,
      education: data.find((r: { section: string }) => r.section === "education")?.data as AboutEducationEntry[] | undefined,
      meta: data.find((r: { section: string }) => r.section === "meta")?.data as AboutMetaData | undefined,
    };
  } catch {
    return null;
  }
}

// ─── Page ────────────────────────────────────────────────

export const revalidate = 60;

export const metadata = {
  title: "About | Pavan Jillella",
  description:
    "Learn about Pavan Jillella — developer, writer, and builder at the intersection of technology, education, and finance.",
};

export default async function AboutPage() {
  const dbData = await getAboutData();
  const bio = dbData?.bio ?? DEFAULT_BIO;
  const skills = dbData?.skills ?? DEFAULT_SKILLS;
  const timeline = dbData?.timeline ?? DEFAULT_TIMELINE;
  const experience = dbData?.experience ?? DEFAULT_EXPERIENCE;
  const education = dbData?.education ?? DEFAULT_EDUCATION;
  const meta = dbData?.meta ?? DEFAULT_META;

  return (
    <>
      <PageHeader
        label="About"
        title={bio.heading}
        description={bio.description}
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Bio + Photo */}
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <div className={meta.photoUrl ? "flex flex-col md:flex-row gap-8 md:gap-10" : ""}>
                {meta.photoUrl && (
                  <div className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.photoUrl}
                      alt="Pavan Jillella"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border border-white/10"
                    />
                  </div>
                )}
                <div className="flex-1">
                  {bio.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={`font-body text-white/60 leading-relaxed ${i === 0 ? "text-lg mb-6" : ""} ${i > 0 && i < bio.paragraphs.length - 1 ? "mb-4" : ""}`}
                    >
                      {p}
                    </p>
                  ))}
                  {meta.resumeUrl && (
                    <a
                      href={meta.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 font-body text-sm text-blue-400 hover:bg-blue-500/20 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <FadeIn>
                <h2 className="font-display font-bold text-2xl text-white mb-8">Experience</h2>
              </FadeIn>
              <div className="space-y-4">
                {experience.map((entry, i) => (
                  <FadeIn key={`exp-${i}`} delay={i * 0.05}>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                        <div>
                          <h3 className="font-body font-medium text-white">{entry.role}</h3>
                          <p className="font-body text-sm text-blue-400">{entry.company}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs text-white/30">{entry.period}</span>
                          {entry.current && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-[10px] text-emerald-400">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="font-body text-sm text-white/40">{entry.description}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <FadeIn>
                <h2 className="font-display font-bold text-2xl text-white mb-8">Education</h2>
              </FadeIn>
              <div className="space-y-4">
                {education.map((entry, i) => (
                  <FadeIn key={`edu-${i}`} delay={i * 0.05}>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                        <div>
                          <h3 className="font-body font-medium text-white">{entry.degree}</h3>
                          <p className="font-body text-sm text-blue-400">{entry.institution}</p>
                        </div>
                        <span className="font-mono text-xs text-white/30 shrink-0">{entry.period}</span>
                      </div>
                      <p className="font-body text-sm text-white/40">{entry.description}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">Technical Skills</h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {skills.map((group, i) => (
                <FadeIn key={group.category} delay={i * 0.05}>
                  <div className="glass-card rounded-2xl p-6">
                    <p className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-4">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-full border border-white/8 bg-white/4 font-body text-xs text-white/50"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">Journey</h2>
            </FadeIn>
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <FadeIn key={`${item.year}-${i}`} delay={i * 0.05}>
                  <div className="glass-card rounded-2xl p-6 flex gap-6">
                    <span className="font-mono text-sm text-blue-400 shrink-0 pt-0.5">{item.year}</span>
                    <div>
                      <h3 className="font-body font-medium text-white mb-1">{item.title}</h3>
                      <p className="font-body text-sm text-white/40">{item.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

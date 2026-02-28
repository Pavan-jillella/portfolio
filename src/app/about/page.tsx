import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

const skills = [
  { category: "Languages", items: ["TypeScript", "Python", "Go", "JavaScript", "SQL"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"] },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Vercel", "Figma"] },
];

const timeline = [
  { year: "2024", title: "Full-Stack Developer", description: "Building products at the intersection of education, finance, and technology." },
  { year: "2023", title: "Open Source Contributor", description: "Contributed to multiple open-source projects. Started building developer tools." },
  { year: "2022", title: "Started Learning in Public", description: "Launched blog and YouTube channel to document my learning journey." },
  { year: "2021", title: "First Lines of Code", description: "Wrote my first Python script. Everything changed from that point forward." },
];

export const metadata = {
  title: "About | Pavan Jillella",
  description: "Learn about Pavan Jillella — developer, writer, and builder at the intersection of technology, education, and finance.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title="Building at the intersection."
        description="Developer, writer, and lifelong learner focused on technology, education, and financial independence."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Bio */}
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <p className="font-body text-white/60 leading-relaxed text-lg mb-6">
                I&apos;m Pavan — a developer who believes in building things that matter. My work spans across
                technology, education, and personal finance, driven by the conviction that these three domains
                are deeply interconnected.
              </p>
              <p className="font-body text-white/60 leading-relaxed">
                When I&apos;m not writing code, I&apos;m usually reading, documenting what I learn, or optimizing
                some system in my life. I believe in compounding — in knowledge, in skills, and in investments.
                This portfolio is a reflection of that philosophy: everything here is built incrementally, one
                commit at a time.
              </p>
            </div>
          </FadeIn>

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
                <FadeIn key={item.year} delay={i * 0.05}>
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

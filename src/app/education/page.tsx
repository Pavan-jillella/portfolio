import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { CourseTrackerSection } from "@/components/education/CourseTrackerSection";

const principles = [
  {
    title: "Learn in Public",
    description: "Document everything. Share what you learn. Teaching is the best way to solidify understanding.",
  },
  {
    title: "Systems Over Goals",
    description: "Goals are for direction. Systems are for progress. Build habits and processes that compound over time.",
  },
  {
    title: "First Principles Thinking",
    description: "Break problems down to their fundamental truths. Rebuild from there instead of reasoning by analogy.",
  },
  {
    title: "Compounding Knowledge",
    description: "Read broadly, write daily, connect ideas across domains. Knowledge compounds like interest.",
  },
];

const reading = [
  { title: "Atomic Habits", author: "James Clear", category: "Productivity" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", category: "Technology" },
  { title: "Psychology of Money", author: "Morgan Housel", category: "Finance" },
  { title: "Deep Work", author: "Cal Newport", category: "Productivity" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", category: "Technology" },
];

export const metadata = {
  title: "Education | Pavan Jillella",
  description: "Learning philosophy, recommended reading, and knowledge systems.",
};

export default function EducationPage() {
  return (
    <>
      <PageHeader
        label="Education"
        title="Always learning."
        description="My approach to continuous learning, knowledge management, and intellectual growth."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Principles */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">Learning Principles</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {principles.map((p, i) => (
                <FadeIn key={p.title} delay={i * 0.05}>
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <h3 className="font-display font-semibold text-white mb-2">{p.title}</h3>
                    <p className="font-body text-sm text-white/40">{p.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Reading List */}
          <div>
            <FadeIn>
              <h2 className="font-display font-bold text-2xl text-white mb-8">Recommended Reading</h2>
            </FadeIn>
            <div className="space-y-3">
              {reading.map((book, i) => (
                <FadeIn key={book.title} delay={i * 0.03}>
                  <div className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-body font-medium text-sm text-white">{book.title}</h3>
                      <p className="font-body text-xs text-white/30 mt-0.5">{book.author}</p>
                    </div>
                    <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs shrink-0">
                      {book.category}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Knowledge System */}
          <FadeIn>
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <h2 className="font-display font-bold text-2xl text-white mb-6">My Knowledge System</h2>
              <div className="space-y-4 font-body text-white/50 leading-relaxed">
                <p>
                  I maintain a personal knowledge management system built on the PARA method. Every piece of
                  information I encounter is captured, organized, and connected to existing knowledge.
                </p>
                <p>
                  The tools: <span className="text-white/70">Obsidian</span> for permanent notes and knowledge
                  graph, <span className="text-white/70">Notion</span> for project management, and
                  <span className="text-white/70"> this blog</span> for publishing refined ideas.
                </p>
                <p>
                  The goal isn&apos;t to collect information — it&apos;s to build a thinking system that makes me
                  better at solving problems over time.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Course Tracker */}
          <CourseTrackerSection />

          {/* Dashboard CTA */}
          <FadeIn>
            <Link href="/education/dashboard">
              <div className="glass-card rounded-3xl p-8 md:p-10 group cursor-pointer hover:border-blue-500/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-2">Tool</p>
                    <h2 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-blue-300 transition-colors">
                      Education Dashboard
                    </h2>
                    <p className="font-body text-sm text-white/40 max-w-lg">
                      Track study sessions, manage projects, organize notes with a rich text editor, and monitor your GitHub and LeetCode progress.
                    </p>
                  </div>
                  <span className="text-white/20 group-hover:text-blue-400 text-3xl transition-colors shrink-0 ml-6">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

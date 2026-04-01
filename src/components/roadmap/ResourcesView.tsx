"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  PYTHON_RESOURCES,
  DSA_RESOURCES,
  SYSTEM_DESIGN_RESOURCES,
  BEHAVIORAL_RESOURCES,
  CURATED_LISTS,
  LEARNING_PATH,
  YOUTUBE_CHANNELS,
  PRACTICE_PLATFORMS,
} from "@/lib/google-prep-resources";

/* ================================================================
   TYPES & CONSTANTS — Dark theme neon accents
   ================================================================ */

type ResourceCategory = "path" | "python" | "dsa" | "system-design" | "behavioral" | "curated" | "channels";

const CATEGORIES: { id: ResourceCategory; label: string; icon: string; gradient: string; glow: string }[] = [
  { id: "path", label: "Learning Path", icon: "🗺️", gradient: "from-emerald-400 to-teal-500", glow: "shadow-emerald-500/25" },
  { id: "python", label: "Python", icon: "🐍", gradient: "from-blue-400 to-indigo-500", glow: "shadow-blue-500/25" },
  { id: "dsa", label: "DSA Patterns", icon: "🧩", gradient: "from-violet-400 to-purple-500", glow: "shadow-violet-500/25" },
  { id: "system-design", label: "System Design", icon: "🏗️", gradient: "from-orange-400 to-amber-500", glow: "shadow-orange-500/25" },
  { id: "behavioral", label: "Behavioral", icon: "💬", gradient: "from-pink-400 to-rose-500", glow: "shadow-pink-500/25" },
  { id: "curated", label: "Problem Lists", icon: "📋", gradient: "from-amber-400 to-yellow-500", glow: "shadow-amber-500/25" },
  { id: "channels", label: "Channels", icon: "📺", gradient: "from-cyan-400 to-sky-500", glow: "shadow-cyan-500/25" },
];

/* ================================================================
   RESOURCE CARD COMPONENT — Glass morphic style
   ================================================================ */

function ResourceCard({
  name,
  url,
  tags,
  className,
}: {
  name: string;
  url: string;
  tags?: { label: string; color: string }[];
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm",
        "hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300",
        className
      )}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors truncate">
          {name}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {tags.map((tag, i) => (
              <span key={i} className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", tag.color)}>
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors border border-white/10">
        <span className="text-slate-400 group-hover:text-blue-400 text-sm transition-colors">→</span>
      </div>
    </a>
  );
}

/* ================================================================
   SECTION CARD COMPONENT — Collapsible glass card
   ================================================================ */

function SectionCard({
  title,
  badge,
  children,
  gradient,
  defaultOpen = false,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  gradient?: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {gradient && (
            <div className={cn("w-1.5 h-8 rounded-full bg-gradient-to-b", gradient)} />
          )}
          <span className="font-semibold text-white">{title}</span>
          {badge && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium uppercase tracking-wide border border-amber-500/30">
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
        >
          <span className="text-slate-400 text-xs">▼</span>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-white/10">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   LEARNING PATH SECTION
   ================================================================ */

function LearningPathSection() {
  return (
    <div className="space-y-8">
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-400 via-violet-400 to-rose-400 rounded-full opacity-50" />

        <div className="space-y-4">
          {LEARNING_PATH.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div className="absolute left-3 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 border-2 border-[#0a0c12] shadow-lg shadow-blue-500/30" />

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Phase {idx + 1}
                    </span>
                    <h3 className="font-bold text-lg text-white mt-0.5">{phase.phase}</h3>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold whitespace-nowrap border border-blue-500/30">
                    {phase.weeks}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Goals</p>
                    <ul className="space-y-1.5">
                      {phase.goals.map((g, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.resources.map((r, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PYTHON SECTION
   ================================================================ */

function PythonSection() {
  const sections = [
    { key: "basics", data: PYTHON_RESOURCES.basics, gradient: "from-blue-400 to-indigo-500" },
    { key: "dataStructures", data: PYTHON_RESOURCES.dataStructures, gradient: "from-violet-400 to-purple-500" },
    { key: "functionsOOP", data: PYTHON_RESOURCES.functionsOOP, gradient: "from-emerald-400 to-teal-500" },
    { key: "advanced", data: PYTHON_RESOURCES.advanced, gradient: "from-orange-400 to-amber-500" },
  ];

  return (
    <div className="space-y-4">
      {sections.map(({ key, data, gradient }, idx) => {
        const practice = "practice" in data ? (data as { practice: { name: string; url: string; type: string }[] }).practice : null;
        return (
          <SectionCard
            key={key}
            title={`${data.title}`}
            badge={data.duration}
            gradient={gradient}
            defaultOpen={idx === 0}
          >
            <div className="space-y-6">
              {/* Topics */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Topics Covered</p>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((topic, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">📹 Video Tutorials</p>
                <div className="grid gap-2">
                  {data.videos.map((v, i) => (
                    <ResourceCard
                      key={i}
                      name={v.name}
                      url={v.url}
                      tags={[
                        { label: v.duration, color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
                        ...(v.free ? [{ label: "Free", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }] : []),
                      ]}
                    />
                  ))}
                </div>
              </div>

              {/* Docs */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">📚 Documentation</p>
                <div className="grid gap-2">
                  {data.docs.map((d, i) => (
                    <ResourceCard
                      key={i}
                      name={d.name}
                      url={d.url}
                      tags={[{ label: d.type, color: "bg-white/10 text-slate-400 border border-white/10" }]}
                    />
                  ))}
                </div>
              </div>

              {/* Practice */}
              {practice && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">💻 Practice</p>
                  <div className="grid gap-2">
                    {practice.map((p, i) => (
                      <ResourceCard key={i} name={p.name} url={p.url} tags={[{ label: p.type, color: "bg-violet-500/20 text-violet-400 border border-violet-500/30" }]} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}

/* ================================================================
   DSA SECTION
   ================================================================ */

function DSASection() {
  const categories = Object.entries(DSA_RESOURCES);
  const gradients = ["from-blue-400 to-indigo-500", "from-violet-400 to-purple-500", "from-emerald-400 to-teal-500", "from-orange-400 to-amber-500", "from-pink-400 to-rose-500", "from-cyan-400 to-sky-500"];

  return (
    <div className="space-y-4">
      {categories.map(([key, category], idx) => (
        <SectionCard
          key={key}
          title={category.title}
          badge={category.importance.split(" - ")[1] || category.importance}
          gradient={gradients[idx % gradients.length]}
          defaultOpen={idx === 0}
        >
          <div className="space-y-6">
            {/* Patterns */}
            {category.patterns.map((pattern, pIdx) => (
              <div key={pIdx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{pattern.name}</p>
                    {"description" in pattern && pattern.description && (
                      <p className="text-sm text-slate-400 mt-0.5">{pattern.description}</p>
                    )}
                  </div>
                </div>

                {/* Problems Grid */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Problems</p>
                  <div className="grid sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {pattern.problems.map((p, i) => (
                      <a
                        key={i}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all group"
                      >
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0",
                            p.difficulty === "Easy" && "bg-emerald-500/20 text-emerald-400",
                            p.difficulty === "Medium" && "bg-amber-500/20 text-amber-400",
                            p.difficulty === "Hard" && "bg-red-500/20 text-red-400"
                          )}
                        >
                          {p.difficulty[0]}
                        </span>
                        <span className="text-xs text-slate-300 group-hover:text-blue-400 truncate">{p.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Template */}
                {pattern.template && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Template</p>
                    <pre className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-slate-100 text-xs overflow-x-auto font-mono leading-relaxed">
                      <code>{pattern.template}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {/* Videos */}
            {category.videos && category.videos.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">📹 Video Explanations</p>
                <div className="grid gap-2">
                  {category.videos.map((v, i) => (
                    <ResourceCard key={i} name={v.name} url={v.url} tags={[{ label: v.duration, color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" }]} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ================================================================
   SYSTEM DESIGN SECTION
   ================================================================ */

function SystemDesignSection() {
  return (
    <div className="space-y-4">
      {/* Fundamentals */}
      <SectionCard title="Fundamentals" gradient="from-blue-400 to-indigo-500" defaultOpen>
        <div className="space-y-6">
          {/* Core Topics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SYSTEM_DESIGN_RESOURCES.fundamentals.topics.map((topic, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-white mb-2">{topic.name}</p>
                <div className="flex flex-wrap gap-1">
                  {topic.concepts.map((c, j) => (
                    <span key={j} className="text-[10px] px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Videos & Books Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">📹 Video Courses</p>
              <div className="space-y-2">
                {SYSTEM_DESIGN_RESOURCES.fundamentals.videos.map((v, i) => (
                  <ResourceCard
                    key={i}
                    name={v.name}
                    url={v.url}
                    tags={[
                      { label: v.duration, color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
                      ...(v.free ? [{ label: "Free", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" }] : []),
                    ]}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">📖 Books & Resources</p>
              <div className="space-y-2">
                {SYSTEM_DESIGN_RESOURCES.fundamentals.books.map((b, i) => (
                  <ResourceCard key={i} name={b.name} url={b.url} tags={[{ label: b.type, color: "bg-amber-500/20 text-amber-400 border border-amber-500/30" }]} />
                ))}
                {SYSTEM_DESIGN_RESOURCES.fundamentals.websites.map((w, i) => (
                  <ResourceCard key={i} name={w.name} url={w.url} tags={[{ label: w.type, color: "bg-white/10 text-slate-400 border border-white/10" }]} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* System Designs */}
      {"designs" in SYSTEM_DESIGN_RESOURCES && (
        <>
          <div className="pt-4">
            <p className="text-sm font-bold text-slate-300 mb-4">🏗️ Practice Designs</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {(SYSTEM_DESIGN_RESOURCES as { designs: Array<{ name: string; difficulty: string; concepts: string[]; video: string }> }).designs.map((design, idx) => (
              <a
                key={idx}
                href={design.video}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 hover:border-orange-500/40 transition-all backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white group-hover:text-orange-400">{design.name}</h4>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-full font-semibold",
                      design.difficulty === "Easy" && "bg-emerald-500/20 text-emerald-400",
                      design.difficulty === "Medium" && "bg-amber-500/20 text-amber-400",
                      design.difficulty === "Hard" && "bg-red-500/20 text-red-400"
                    )}
                  >
                    {design.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {design.concepts.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10">
                      {c}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================
   BEHAVIORAL SECTION
   ================================================================ */

function BehavioralSection() {
  return (
    <div className="space-y-4">
      {/* STAR Method */}
      <SectionCard title="STAR Method Framework" gradient="from-amber-400 to-yellow-500" defaultOpen>
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
            <p className="font-bold text-lg text-amber-400 mb-2">{BEHAVIORAL_RESOURCES.starMethod.title}</p>
            <p className="text-sm text-amber-300/80 mb-4">{BEHAVIORAL_RESOURCES.starMethod.description}</p>
            <pre className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-200 whitespace-pre-wrap font-mono">
              {BEHAVIORAL_RESOURCES.starMethod.template}
            </pre>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Questions to Prepare</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {BEHAVIORAL_RESOURCES.starMethod.stories.map((story, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:border-amber-500/40 hover:bg-amber-500/10 transition-colors">
                  {story}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Googleyness */}
      <SectionCard title="Googleyness & Leadership" gradient="from-blue-400 to-indigo-500">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {BEHAVIORAL_RESOURCES.googleyness.traits.map((trait, i) => (
              <div key={i} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sm text-slate-300 flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                {trait}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ================================================================
   CURATED LISTS SECTION
   ================================================================ */

function CuratedListsSection() {
  const lists = Object.entries(CURATED_LISTS);
  const gradients = ["from-blue-400 to-indigo-500", "from-violet-400 to-purple-500", "from-emerald-400 to-teal-500", "from-orange-400 to-amber-500", "from-pink-400 to-rose-500"];
  const glows = ["shadow-blue-500/20", "shadow-violet-500/20", "shadow-emerald-500/20", "shadow-orange-500/20", "shadow-pink-500/20"];

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {lists.map(([key, list], idx) => (
        <a
          key={key}
          href={list.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group p-6 rounded-2xl bg-white/5 border border-white/10 hover:shadow-lg transition-all relative overflow-hidden backdrop-blur-sm",
            `hover:${glows[idx % glows.length]}`
          )}
        >
          <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", gradients[idx % gradients.length])} />
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400">{list.name}</h3>
            <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors border border-white/10">
              <span className="text-slate-400 group-hover:text-blue-400 text-sm">→</span>
            </div>
          </div>
          <p className="text-sm text-slate-400">{list.description}</p>
        </a>
      ))}
    </div>
  );
}

/* ================================================================
   CHANNELS SECTION
   ================================================================ */

function ChannelsSection() {
  return (
    <div className="space-y-8">
      {/* YouTube Channels */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📺</span>
          <h3 className="font-bold text-lg text-white">YouTube Channels</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {YOUTUBE_CHANNELS.map((ch, i) => (
            <a
              key={i}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/10 transition-all backdrop-blur-sm"
            >
              <p className="font-semibold text-white group-hover:text-red-400 mb-1">{ch.name}</p>
              <p className="text-sm text-slate-400">{ch.focus}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Practice Platforms */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💻</span>
          <h3 className="font-bold text-lg text-white">Practice Platforms</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRACTICE_PLATFORMS.map((pl, i) => (
            <a
              key={i}
              href={pl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/10 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-white group-hover:text-blue-400">{pl.name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{pl.premium}</span>
              </div>
              <p className="text-sm text-slate-400">{pl.focus}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function ResourcesView() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("path");
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="space-y-8">
      {/* Hero Header — Glass morphic */}
      <section className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-bl from-blue-500/20 via-violet-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30">
              📚
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
                Resource Library
              </h2>
              <p className="text-sm text-slate-400">Complete preparation guide</p>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl mt-4 leading-relaxed">
            Everything you need for Google SDE interviews. From Python basics to system design mastery —
            curated videos, documentation, code templates, and practice problems.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2",
              activeCategory === cat.id
                ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg ${cat.glow}`
                : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10"
            )}
          >
            <span>{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* Active Category Title */}
      <div className="flex items-center gap-3 pt-2">
        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shadow-md", activeCat.gradient, activeCat.glow)}>
          {activeCat.icon}
        </div>
        <h3 className="font-bold text-xl text-white">{activeCat.label}</h3>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {activeCategory === "path" && <LearningPathSection />}
          {activeCategory === "python" && <PythonSection />}
          {activeCategory === "dsa" && <DSASection />}
          {activeCategory === "system-design" && <SystemDesignSection />}
          {activeCategory === "behavioral" && <BehavioralSection />}
          {activeCategory === "curated" && <CuratedListsSection />}
          {activeCategory === "channels" && <ChannelsSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

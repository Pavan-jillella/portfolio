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
   TYPES & CONSTANTS
   ================================================================ */

type ResourceCategory = "path" | "python" | "dsa" | "system-design" | "behavioral" | "curated" | "channels";

const CATEGORIES: { id: ResourceCategory; label: string; icon: string; gradient: string }[] = [
  { id: "path", label: "Learning Path", icon: "🗺️", gradient: "from-emerald-500 to-teal-500" },
  { id: "python", label: "Python", icon: "🐍", gradient: "from-blue-500 to-indigo-500" },
  { id: "dsa", label: "DSA Patterns", icon: "🧩", gradient: "from-violet-500 to-purple-500" },
  { id: "system-design", label: "System Design", icon: "🏗️", gradient: "from-orange-500 to-amber-500" },
  { id: "behavioral", label: "Behavioral", icon: "💬", gradient: "from-pink-500 to-rose-500" },
  { id: "curated", label: "Problem Lists", icon: "📋", gradient: "from-amber-500 to-yellow-500" },
  { id: "channels", label: "Channels", icon: "📺", gradient: "from-cyan-500 to-sky-500" },
];

/* ================================================================
   RESOURCE CARD COMPONENT
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
        "group flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/80",
        "hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300",
        className
      )}
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors truncate">
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
      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        <span className="text-slate-400 group-hover:text-blue-600 text-sm transition-colors">→</span>
      </div>
    </a>
  );
}

/* ================================================================
   SECTION CARD COMPONENT
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
    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {gradient && (
            <div className={cn("w-1.5 h-8 rounded-full bg-gradient-to-b", gradient)} />
          )}
          <span className="font-semibold text-slate-800">{title}</span>
          {badge && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <span className="text-slate-500 text-xs">▼</span>
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
            <div className="px-6 pb-6 pt-2 border-t border-slate-100">{children}</div>
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
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-emerald-400 via-violet-400 to-rose-400 rounded-full" />

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
              <div className="absolute left-3 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 border-4 border-white shadow-md" />

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Phase {idx + 1}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 mt-0.5">{phase.phase}</h3>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold whitespace-nowrap">
                    {phase.weeks}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Goals</p>
                    <ul className="space-y-1.5">
                      {phase.goals.map((g, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.resources.map((r, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
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
    { key: "basics", data: PYTHON_RESOURCES.basics, gradient: "from-blue-500 to-indigo-500" },
    { key: "dataStructures", data: PYTHON_RESOURCES.dataStructures, gradient: "from-violet-500 to-purple-500" },
    { key: "functionsOOP", data: PYTHON_RESOURCES.functionsOOP, gradient: "from-emerald-500 to-teal-500" },
    { key: "advanced", data: PYTHON_RESOURCES.advanced, gradient: "from-orange-500 to-amber-500" },
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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Topics Covered</p>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((topic, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/50">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">📹 Video Tutorials</p>
                <div className="grid gap-2">
                  {data.videos.map((v, i) => (
                    <ResourceCard
                      key={i}
                      name={v.name}
                      url={v.url}
                      tags={[
                        { label: v.duration, color: "bg-blue-100 text-blue-700" },
                        ...(v.free ? [{ label: "Free", color: "bg-emerald-100 text-emerald-700" }] : []),
                      ]}
                    />
                  ))}
                </div>
              </div>

              {/* Docs */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">📚 Documentation</p>
                <div className="grid gap-2">
                  {data.docs.map((d, i) => (
                    <ResourceCard
                      key={i}
                      name={d.name}
                      url={d.url}
                      tags={[{ label: d.type, color: "bg-slate-100 text-slate-600" }]}
                    />
                  ))}
                </div>
              </div>

              {/* Practice */}
              {practice && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">💻 Practice</p>
                  <div className="grid gap-2">
                    {practice.map((p, i) => (
                      <ResourceCard key={i} name={p.name} url={p.url} tags={[{ label: p.type, color: "bg-violet-100 text-violet-700" }]} />
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
  const gradients = ["from-blue-500 to-indigo-500", "from-violet-500 to-purple-500", "from-emerald-500 to-teal-500", "from-orange-500 to-amber-500", "from-pink-500 to-rose-500", "from-cyan-500 to-sky-500"];

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
              <div key={pIdx} className="p-4 rounded-xl bg-slate-50/50 border border-slate-200/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{pattern.name}</p>
                    {"description" in pattern && pattern.description && (
                      <p className="text-sm text-slate-500 mt-0.5">{pattern.description}</p>
                    )}
                  </div>
                </div>

                {/* Problems Grid */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Problems</p>
                  <div className="grid sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {pattern.problems.map((p, i) => (
                      <a
                        key={i}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                      >
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0",
                            p.difficulty === "Easy" && "bg-emerald-100 text-emerald-700",
                            p.difficulty === "Medium" && "bg-amber-100 text-amber-700",
                            p.difficulty === "Hard" && "bg-red-100 text-red-700"
                          )}
                        >
                          {p.difficulty[0]}
                        </span>
                        <span className="text-xs text-slate-700 group-hover:text-blue-600 truncate">{p.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Template */}
                {pattern.template && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Template</p>
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono leading-relaxed">
                      <code>{pattern.template}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {/* Videos */}
            {category.videos && category.videos.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">📹 Video Explanations</p>
                <div className="grid gap-2">
                  {category.videos.map((v, i) => (
                    <ResourceCard key={i} name={v.name} url={v.url} tags={[{ label: v.duration, color: "bg-blue-100 text-blue-700" }]} />
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
      <SectionCard title="Fundamentals" gradient="from-blue-500 to-indigo-500" defaultOpen>
        <div className="space-y-6">
          {/* Core Topics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SYSTEM_DESIGN_RESOURCES.fundamentals.topics.map((topic, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50/50 border border-slate-200/50">
                <p className="font-semibold text-slate-800 mb-2">{topic.name}</p>
                <div className="flex flex-wrap gap-1">
                  {topic.concepts.map((c, j) => (
                    <span key={j} className="text-[10px] px-2 py-1 rounded-md bg-blue-100 text-blue-700">
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">📹 Video Courses</p>
              <div className="space-y-2">
                {SYSTEM_DESIGN_RESOURCES.fundamentals.videos.map((v, i) => (
                  <ResourceCard
                    key={i}
                    name={v.name}
                    url={v.url}
                    tags={[
                      { label: v.duration, color: "bg-blue-100 text-blue-700" },
                      ...(v.free ? [{ label: "Free", color: "bg-emerald-100 text-emerald-700" }] : []),
                    ]}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">📖 Books & Resources</p>
              <div className="space-y-2">
                {SYSTEM_DESIGN_RESOURCES.fundamentals.books.map((b, i) => (
                  <ResourceCard key={i} name={b.name} url={b.url} tags={[{ label: b.type, color: "bg-amber-100 text-amber-700" }]} />
                ))}
                {SYSTEM_DESIGN_RESOURCES.fundamentals.websites.map((w, i) => (
                  <ResourceCard key={i} name={w.name} url={w.url} tags={[{ label: w.type, color: "bg-slate-100 text-slate-600" }]} />
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
            <p className="text-sm font-bold text-slate-700 mb-4">🏗️ Practice Designs</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {(SYSTEM_DESIGN_RESOURCES as { designs: Array<{ name: string; difficulty: string; concepts: string[]; video: string }> }).designs.map((design, idx) => (
              <a
                key={idx}
                href={design.video}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:shadow-lg hover:border-orange-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-slate-800 group-hover:text-orange-600">{design.name}</h4>
                  <span
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-full font-semibold",
                      design.difficulty === "Easy" && "bg-emerald-100 text-emerald-700",
                      design.difficulty === "Medium" && "bg-amber-100 text-amber-700",
                      design.difficulty === "Hard" && "bg-red-100 text-red-700"
                    )}
                  >
                    {design.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {design.concepts.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
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
      <SectionCard title="STAR Method Framework" gradient="from-amber-500 to-yellow-500" defaultOpen>
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50">
            <p className="font-bold text-lg text-amber-700 mb-2">{BEHAVIORAL_RESOURCES.starMethod.title}</p>
            <p className="text-sm text-amber-600/80 mb-4">{BEHAVIORAL_RESOURCES.starMethod.description}</p>
            <pre className="p-4 rounded-xl bg-white border border-amber-200/50 text-sm text-slate-700 whitespace-pre-wrap font-mono">
              {BEHAVIORAL_RESOURCES.starMethod.template}
            </pre>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Questions to Prepare</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {BEHAVIORAL_RESOURCES.starMethod.stories.map((story, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/80 text-sm text-slate-700 hover:border-amber-300 transition-colors">
                  {story}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Googleyness */}
      <SectionCard title="Googleyness & Leadership" gradient="from-blue-500 to-indigo-500">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {BEHAVIORAL_RESOURCES.googleyness.traits.map((trait, i) => (
              <div key={i} className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/50 text-sm text-slate-700 flex items-center gap-2">
                <span className="text-blue-500">✓</span>
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
  const gradients = ["from-blue-500 to-indigo-500", "from-violet-500 to-purple-500", "from-emerald-500 to-teal-500", "from-orange-500 to-amber-500", "from-pink-500 to-rose-500"];

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {lists.map(([key, list], idx) => (
        <a
          key={key}
          href={list.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-lg transition-all relative overflow-hidden"
        >
          <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", gradients[idx % gradients.length])} />
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600">{list.name}</h3>
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <span className="text-slate-400 group-hover:text-blue-600 text-sm">→</span>
            </div>
          </div>
          <p className="text-sm text-slate-600">{list.description}</p>
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
          <h3 className="font-bold text-lg text-slate-800">YouTube Channels</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {YOUTUBE_CHANNELS.map((ch, i) => (
            <a
              key={i}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-red-300 hover:shadow-lg transition-all"
            >
              <p className="font-semibold text-slate-800 group-hover:text-red-600 mb-1">{ch.name}</p>
              <p className="text-sm text-slate-500">{ch.focus}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Practice Platforms */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💻</span>
          <h3 className="font-bold text-lg text-slate-800">Practice Platforms</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRACTICE_PLATFORMS.map((pl, i) => (
            <a
              key={i}
              href={pl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-slate-800 group-hover:text-blue-600">{pl.name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{pl.premium}</span>
              </div>
              <p className="text-sm text-slate-500">{pl.focus}</p>
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
      {/* Hero Header */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-blue-50/30 to-violet-50/30 p-8 md:p-10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 via-violet-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
              📚
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-800">
                Resource Library
              </h2>
              <p className="text-sm text-slate-500">Complete preparation guide</p>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl mt-4 leading-relaxed">
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
                ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm"
            )}
          >
            <span>{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* Active Category Title */}
      <div className="flex items-center gap-3 pt-2">
        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shadow-md", activeCat.gradient)}>
          {activeCat.icon}
        </div>
        <h3 className="font-bold text-xl text-slate-800">{activeCat.label}</h3>
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

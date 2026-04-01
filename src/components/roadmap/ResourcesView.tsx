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
   TYPES
   ================================================================ */

type ResourceCategory = "python" | "dsa" | "system-design" | "behavioral" | "curated" | "path" | "channels";

const CATEGORIES = [
  { id: "path" as ResourceCategory, label: "Learning Path", icon: "🗺️", color: "emerald" },
  { id: "python" as ResourceCategory, label: "Python", icon: "🐍", color: "blue" },
  { id: "dsa" as ResourceCategory, label: "DSA Patterns", icon: "🧩", color: "violet" },
  { id: "system-design" as ResourceCategory, label: "System Design", icon: "🏗️", color: "orange" },
  { id: "behavioral" as ResourceCategory, label: "Behavioral", icon: "💬", color: "pink" },
  { id: "curated" as ResourceCategory, label: "Problem Lists", icon: "📋", color: "amber" },
  { id: "channels" as ResourceCategory, label: "Channels & Tools", icon: "📺", color: "cyan" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", gradient: "from-emerald-400 to-teal-500" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", gradient: "from-blue-400 to-indigo-500" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", gradient: "from-violet-400 to-purple-500" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", gradient: "from-orange-400 to-amber-500" },
  pink: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", gradient: "from-pink-400 to-rose-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", gradient: "from-amber-400 to-yellow-500" },
  cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", gradient: "from-cyan-400 to-sky-500" },
};

/* ================================================================
   EXPANDABLE SECTION
   ================================================================ */

function ExpandableSection({
  title,
  children,
  defaultOpen = false,
  color = "blue",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  color?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div className={cn("rounded-2xl border overflow-hidden", colors.border, colors.bg)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
      >
        <span className={cn("font-semibold", colors.text)}>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400"
        >
          ▼
        </motion.span>
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
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   RESOURCE LINK CARD
   ================================================================ */

function ResourceLink({
  name,
  url,
  type,
  duration,
  free,
}: {
  name: string;
  url: string;
  type?: string;
  duration?: string;
  free?: boolean;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors truncate">
            {name}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {type && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {type}
              </span>
            )}
            {duration && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                {duration}
              </span>
            )}
            {free && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                Free
              </span>
            )}
          </div>
        </div>
        <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
      </div>
    </a>
  );
}

/* ================================================================
   PYTHON SECTION
   ================================================================ */

function PythonSection() {
  const sections = [
    { key: "basics", data: PYTHON_RESOURCES.basics, color: "blue" },
    { key: "dataStructures", data: PYTHON_RESOURCES.dataStructures, color: "violet" },
    { key: "functionsOOP", data: PYTHON_RESOURCES.functionsOOP, color: "emerald" },
    { key: "advanced", data: PYTHON_RESOURCES.advanced, color: "orange" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-slate-600 mb-6">
        Master Python from basics to advanced concepts. Follow these resources in order for a structured learning path.
      </p>
      {sections.map(({ key, data, color }) => {
        const practice = "practice" in data ? (data as { practice: { name: string; url: string; type: string }[] }).practice : null;
        return (
        <ExpandableSection key={key} title={`${data.title} (${data.duration})`} color={color}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Topics Covered:</p>
              <div className="flex flex-wrap gap-2">
                {data.topics.map((topic, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">📹 Video Tutorials:</p>
              <div className="grid gap-2">
                {data.videos.map((v, i) => (
                  <ResourceLink key={i} name={v.name} url={v.url} duration={v.duration} free={v.free} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">📚 Documentation & Tutorials:</p>
              <div className="grid gap-2">
                {data.docs.map((d, i) => (
                  <ResourceLink key={i} name={d.name} url={d.url} type={d.type} />
                ))}
              </div>
            </div>

            {practice && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">💻 Practice:</p>
                <div className="grid gap-2">
                  {practice.map((p, i) => (
                    <ResourceLink key={i} name={p.name} url={p.url} type={p.type} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>
      )})}
    </div>
  );
}

/* ================================================================
   DSA SECTION
   ================================================================ */

function DSASection() {
  const categories = Object.entries(DSA_RESOURCES);

  return (
    <div className="space-y-4">
      <p className="text-slate-600 mb-6">
        Master these core DSA categories to solve any coding problem. Each category includes patterns with problems, code templates, and video explanations.
      </p>
      {categories.map(([key, category], idx) => (
        <ExpandableSection
          key={key}
          title={`${idx + 1}. ${category.title}`}
          color={["blue", "violet", "emerald", "orange", "pink", "amber", "cyan", "blue", "violet", "emerald", "orange", "pink"][idx % 12]}
        >
          <div className="space-y-4">
            <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
              {category.importance}
            </p>

            {/* Patterns */}
            {category.patterns.map((pattern, pIdx) => (
              <div key={pIdx} className="p-4 rounded-xl bg-white border border-slate-200">
                <p className="font-semibold text-slate-800 mb-1">{pattern.name}</p>
                {"description" in pattern && pattern.description && (
                  <p className="text-sm text-slate-500 mb-3">{pattern.description}</p>
                )}

                {/* Problems */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Problems:</p>
                  <div className="grid gap-1.5 max-h-[200px] overflow-y-auto">
                    {pattern.problems.map((p, i) => (
                      <a
                        key={i}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors group"
                      >
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium",
                            p.difficulty === "Easy" && "bg-emerald-100 text-emerald-700",
                            p.difficulty === "Medium" && "bg-amber-100 text-amber-700",
                            p.difficulty === "Hard" && "bg-red-100 text-red-700"
                          )}
                        >
                          {p.difficulty}
                        </span>
                        <span className="flex-1 text-xs text-slate-600 group-hover:text-blue-600 truncate">
                          {p.name}
                        </span>
                        <span className="text-slate-300 text-xs group-hover:text-blue-500">→</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Template */}
                {pattern.template && (
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Code Template:</p>
                    <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-[10px] overflow-x-auto">
                      <code>{pattern.template}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {/* Videos */}
            {category.videos && category.videos.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">📹 Video Explanations:</p>
                <div className="grid gap-2">
                  {category.videos.map((v, i) => (
                    <ResourceLink key={i} name={v.name} url={v.url} duration={v.duration} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>
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
      <p className="text-slate-600 mb-6">
        Learn system design fundamentals and practice with real-world system designs commonly asked in Google interviews.
      </p>

      <ExpandableSection title="📚 Fundamentals" color="blue" defaultOpen>
        <div className="space-y-4">
          {/* Topics with concepts */}
          {SYSTEM_DESIGN_RESOURCES.fundamentals.topics.map((topic, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-slate-200">
              <p className="font-semibold text-slate-800 mb-2">{topic.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {topic.concepts.map((c, j) => (
                  <span key={j} className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-700">
                    {c}
                  </span>
                ))}
              </div>
              {"resources" in topic && topic.resources && (
                <div className="mt-2">
                  {topic.resources.map((r, j) => (
                    <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-blue-600 hover:underline">
                      {r.name} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Videos */}
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">📹 Video Courses:</p>
            <div className="grid gap-2">
              {SYSTEM_DESIGN_RESOURCES.fundamentals.videos.map((v, i) => (
                <ResourceLink key={i} name={v.name} url={v.url} duration={v.duration} free={v.free} />
              ))}
            </div>
          </div>

          {/* Books */}
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">📖 Recommended Books:</p>
            <div className="grid gap-2">
              {SYSTEM_DESIGN_RESOURCES.fundamentals.books.map((b, i) => (
                <ResourceLink key={i} name={b.name} url={b.url} type={b.type} />
              ))}
            </div>
          </div>

          {/* Websites */}
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">🌐 Resources:</p>
            <div className="grid gap-2">
              {SYSTEM_DESIGN_RESOURCES.fundamentals.websites.map((w, i) => (
                <ResourceLink key={i} name={w.name} url={w.url} type={w.type} />
              ))}
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* System Designs to Practice */}
      {"designs" in SYSTEM_DESIGN_RESOURCES && (
        <div className="grid gap-4">
          <p className="text-sm font-medium text-slate-700 mt-4">🏗️ System Designs to Practice:</p>
          {(SYSTEM_DESIGN_RESOURCES as { designs: Array<{ name: string; difficulty: string; concepts: string[]; video: string }> }).designs.map((design, idx) => (
            <ExpandableSection
              key={idx}
              title={design.name}
              color={["orange", "amber", "emerald", "blue", "violet", "pink", "cyan", "orange", "amber", "emerald"][idx % 10]}
            >
              <div className="space-y-4">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium inline-block",
                    design.difficulty === "Easy" && "bg-emerald-100 text-emerald-700",
                    design.difficulty === "Medium" && "bg-amber-100 text-amber-700",
                    design.difficulty === "Hard" && "bg-red-100 text-red-700"
                  )}
                >
                  {design.difficulty}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Key Concepts:</p>
                  <div className="flex flex-wrap gap-2">
                    {design.concepts.map((c, i) => (
                      <span key={i} className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">📹 Video Walkthrough:</p>
                  <a
                    href={design.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              </div>
            </ExpandableSection>
          ))}
        </div>
      )}

      {"interviewTemplate" in SYSTEM_DESIGN_RESOURCES && (
        <ExpandableSection title="📋 Interview Template" color="violet">
          <div className="space-y-3">
            {(SYSTEM_DESIGN_RESOURCES as { interviewTemplate: Array<{ step: string; duration: string; tasks: string[] }> }).interviewTemplate.map((step, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-200">
                <p className="font-medium text-slate-800 mb-1">
                  {i + 1}. {step.step}
                </p>
                <p className="text-sm text-slate-500">{step.duration}</p>
                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                  {step.tasks.map((t, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ExpandableSection>
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
      <p className="text-slate-600 mb-6">
        Prepare compelling stories using the STAR method and demonstrate Googleyness in your interviews.
      </p>

      <ExpandableSection title="⭐ STAR Method Framework" color="amber" defaultOpen>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <p className="font-bold text-lg text-amber-600">{BEHAVIORAL_RESOURCES.starMethod.title}</p>
            <p className="text-sm text-slate-500 mb-3">{BEHAVIORAL_RESOURCES.starMethod.description}</p>
            <pre className="p-3 rounded-lg bg-slate-50 text-sm text-slate-700 whitespace-pre-wrap">
              {BEHAVIORAL_RESOURCES.starMethod.template}
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Common Questions to Prepare:</p>
            <div className="space-y-2">
              {BEHAVIORAL_RESOURCES.starMethod.stories.map((story, i) => (
                <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                  {story}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ExpandableSection>

      <ExpandableSection title="🌟 Googleyness & Leadership" color="blue">
        <div className="space-y-4">
          <p className="font-medium text-slate-800">{BEHAVIORAL_RESOURCES.googleyness.title}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {BEHAVIORAL_RESOURCES.googleyness.traits.map((trait, i) => (
              <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                ✓ {trait}
              </div>
            ))}
          </div>
          {"resources" in BEHAVIORAL_RESOURCES.googleyness && (
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Resources:</p>
              <div className="grid gap-2">
                {(BEHAVIORAL_RESOURCES.googleyness as { resources: Array<{ name: string; url: string; type: string }> }).resources.map((r, i) => (
                  <ResourceLink key={i} name={r.name} url={r.url} type={r.type} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ExpandableSection>
    </div>
  );
}

/* ================================================================
   CURATED LISTS SECTION
   ================================================================ */

function CuratedListsSection() {
  const lists = Object.entries(CURATED_LISTS);

  return (
    <div className="space-y-4">
      <p className="text-slate-600 mb-6">
        Focus on these curated problem lists that are most relevant for Google interviews.
      </p>
      {lists.map(([key, list], idx) => (
        <ExpandableSection
          key={key}
          title={list.name}
          color={["blue", "violet", "emerald", "orange", "pink"][idx % 5]}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{list.description}</p>
            <a
              href={list.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:from-blue-600 hover:to-violet-600 transition-all"
            >
              View Problem List →
            </a>
            {"neetcodeUrl" in list && (
              <a
                href={(list as { neetcodeUrl: string }).neetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all ml-2"
              >
                View on NeetCode →
              </a>
            )}
          </div>
        </ExpandableSection>
      ))}
    </div>
  );
}

/* ================================================================
   LEARNING PATH SECTION
   ================================================================ */

function LearningPathSection() {
  return (
    <div className="space-y-6">
      <p className="text-slate-600 mb-6">
        Your 8-phase roadmap to Google-ready. Follow this structured path from foundation to interview mastery.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-violet-400 to-rose-400" />

        <div className="space-y-6">
          {LEARNING_PATH.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-16"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-4 w-5 h-5 rounded-full border-4 border-white shadow-md",
                  `bg-gradient-to-br ${COLOR_MAP[["emerald", "blue", "violet", "orange", "pink", "amber", "cyan", "emerald"][idx % 8]].gradient}`
                )}
              />

              <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-800">
                    Phase {idx + 1}: {phase.phase}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                    {phase.weeks}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Goals</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {phase.goals.map((g, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.resources.map((r, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
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
   CHANNELS & TOOLS SECTION
   ================================================================ */

function ChannelsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-4">📺 YouTube Channels</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {YOUTUBE_CHANNELS.map((ch, i) => (
            <a
              key={i}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all group"
            >
              <p className="font-medium text-slate-800 group-hover:text-red-600">{ch.name}</p>
              <p className="text-sm text-slate-500 mt-1">{ch.focus}</p>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-4">💻 Practice Platforms</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRACTICE_PLATFORMS.map((pl, i) => (
            <a
              key={i}
              href={pl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-800 group-hover:text-blue-600">{pl.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{pl.premium}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{pl.focus}</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/30 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="font-display font-bold text-3xl text-slate-800 mb-2">
            📚 Complete Resource Library
          </h2>
          <p className="text-slate-600 max-w-2xl">
            Everything you need to prepare for Google SDE interviews. From Python basics to system design mastery -
            curated resources, video tutorials, code templates, and practice problems.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const colors = COLOR_MAP[cat.color];
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2",
                isActive
                  ? `${colors.bg} ${colors.border} ${colors.text} border shadow-sm`
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
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

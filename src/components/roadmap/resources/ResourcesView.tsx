"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  PYTHON_RESOURCES, 
  DSA_RESOURCES, 
  SYSTEM_DESIGN_RESOURCES, 
  BEHAVIORAL_RESOURCES,
  CURATED_LISTS,
  YOUTUBE_CHANNELS,
  PRACTICE_PLATFORMS,
  LEARNING_PATH
} from "@/lib/google-prep-resources";
import { 
  Book, 
  Video, 
  ExternalLink, 
  FileText, 
  Code2, 
  Brain, 
  Users, 
  Trophy,
  Play,
  Star
} from "lucide-react";
import { useState } from "react";

interface ResourcesViewProps {
  className?: string;
}

type ResourceCategory = "learning" | "python" | "dsa" | "system-design" | "behavioral" | "problems" | "youtube";

const CATEGORIES = [
  { id: "learning" as ResourceCategory, label: "Learning Path", icon: Book, emoji: "🗺️" },
  { id: "python" as ResourceCategory, label: "Python", icon: Code2, emoji: "🐍" },
  { id: "dsa" as ResourceCategory, label: "DSA", icon: Brain, emoji: "🧩" },
  { id: "system-design" as ResourceCategory, label: "System Design", icon: FileText, emoji: "🏗️" },
  { id: "behavioral" as ResourceCategory, label: "Behavioral", icon: Users, emoji: "💬" },
  { id: "problems" as ResourceCategory, label: "Problem Lists", icon: Trophy, emoji: "📋" },
  { id: "youtube" as ResourceCategory, label: "YouTube", icon: Play, emoji: "📺" },
];

export function ResourcesView({ className }: ResourcesViewProps) {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("learning");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-6 pb-24 md:pb-8", className)}
    >
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              activeCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeCategory === "learning" && <LearningPathSection />}
        {activeCategory === "python" && <PythonSection />}
        {activeCategory === "dsa" && <DSASection />}
        {activeCategory === "system-design" && <SystemDesignSection />}
        {activeCategory === "behavioral" && <BehavioralSection />}
        {activeCategory === "problems" && <ProblemListsSection />}
        {activeCategory === "youtube" && <YouTubeSection />}
      </div>

      {/* Practice Platforms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-white/5 border border-white/10"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> Practice Platforms
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PRACTICE_PLATFORMS.map(platform => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                  {platform.name}
                </span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </div>
              <p className="text-xs text-white/50">{platform.focus}</p>
              <p className="text-xs text-emerald-400/70 mt-1">{platform.premium}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function LearningPathSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">🗺️ 8-Month Learning Path</h2>
      <div className="grid gap-4">
        {LEARNING_PATH.map(phase => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: phase.phase * 0.05 }}
            className="p-4 rounded-lg border-l-4 border-blue-500 bg-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-white/40 text-sm">Phase {phase.phase}</span>
                <h3 className="text-white font-medium">{phase.title}</h3>
              </div>
              <span className="text-white/40 text-sm">Weeks {phase.weeks}</span>
            </div>
            <p className="text-sm text-white/60 mb-2">Focus: {phase.focus} • {phase.dailyHours}hrs/day</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {phase.goals.slice(0, 3).map((goal, i) => (
                <span key={i} className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded">
                  {goal.length > 40 ? goal.slice(0, 40) + "..." : goal}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PythonSection() {
  const sections = [
    { key: "basics", data: PYTHON_RESOURCES.basics },
    { key: "dataStructures", data: PYTHON_RESOURCES.dataStructures },
    { key: "functionsOOP", data: PYTHON_RESOURCES.functionsOOP },
    { key: "advanced", data: PYTHON_RESOURCES.advanced },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">🐍 Python Resources</h2>
      {sections.map(section => (
        <ResourceSection
          key={section.key}
          title={section.data.title}
          duration={section.data.duration}
          topics={section.data.topics}
          videos={section.data.videos}
          docs={section.data.docs}
          practice={(section.data as typeof PYTHON_RESOURCES.basics).practice}
        />
      ))}
    </div>
  );
}

function DSASection() {
  // Use the actual keys from DSA_RESOURCES
  const sections = [
    { key: "arraysStrings", data: DSA_RESOURCES.arraysStrings },
    { key: "hashMaps", data: DSA_RESOURCES.hashMaps },
    { key: "stacksQueues", data: DSA_RESOURCES.stacksQueues },
    { key: "linkedLists", data: DSA_RESOURCES.linkedLists },
    { key: "trees", data: DSA_RESOURCES.trees },
    { key: "graphs", data: DSA_RESOURCES.graphs },
    { key: "dp", data: DSA_RESOURCES.dp },
    { key: "backtracking", data: DSA_RESOURCES.backtracking },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">🧩 Data Structures & Algorithms</h2>
      {sections.map(section => (
        <DSAResourceSection
          key={section.key}
          title={section.data.title}
          importance={section.data.importance}
          patterns={section.data.patterns}
          videos={section.data.videos}
        />
      ))}
    </div>
  );
}

interface DSAResourceSectionProps {
  title: string;
  importance: string;
  patterns: Array<{
    name: string;
    description?: string;
    problems: Array<{ name: string; url: string; difficulty: string }>;
    template?: string;
  }>;
  videos: Array<{ name: string; url: string; duration: string }>;
}

function DSAResourceSection({ title, importance, patterns, videos }: DSAResourceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/50">{importance}</p>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="text-white/40"
        >
          ▶
        </motion.span>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-4"
        >
          {/* Patterns */}
          <div>
            <h4 className="text-sm font-medium text-white/60 mb-2">Patterns</h4>
            <div className="space-y-3">
              {patterns.map((pattern, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5">
                  <h5 className="text-white font-medium">{pattern.name}</h5>
                  {pattern.description && <p className="text-xs text-white/50 mb-2">{pattern.description}</p>}
                  <div className="flex flex-wrap gap-2">
                    {pattern.problems.slice(0, 4).map((p, j) => (
                      <a
                        key={j}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "text-xs px-2 py-1 rounded",
                          p.difficulty === "Easy" && "bg-emerald-500/20 text-emerald-400",
                          p.difficulty === "Medium" && "bg-amber-500/20 text-amber-400",
                          p.difficulty === "Hard" && "bg-red-500/20 text-red-400"
                        )}
                      >
                        {p.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          {videos && videos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1">
                <Video className="w-4 h-4" /> Videos
              </h4>
              <div className="space-y-2">
                {videos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-sm text-white/70 group-hover:text-white">{video.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">{video.duration}</span>
                      <ExternalLink className="w-3 h-3 text-white/30" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function SystemDesignSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">🏗️ System Design</h2>
      
      {/* Fundamentals */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">{SYSTEM_DESIGN_RESOURCES.fundamentals.title}</h3>
        <div className="space-y-3 mb-4">
          {SYSTEM_DESIGN_RESOURCES.fundamentals.topics.map((topic, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5">
              <h4 className="text-white font-medium">{topic.name}</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {topic.concepts.map((c, j) => (
                  <span key={j} className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/60 flex items-center gap-1">
            <Video className="w-4 h-4" /> Videos
          </h4>
          {SYSTEM_DESIGN_RESOURCES.fundamentals.videos.map((v, i) => (
            <a
              key={i}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <span className="text-sm text-white/70 group-hover:text-white">{v.name}</span>
              <span className="text-xs text-white/40">{v.duration}</span>
            </a>
          ))}
        </div>
      </div>

      {/* System Designs */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">📚 Real-World System Designs</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SYSTEM_DESIGN_RESOURCES.designs.map((design, i) => (
            <a
              key={i}
              href={design.video}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-3 rounded-lg border transition-all hover:border-white/30",
                design.difficulty === "Easy" && "bg-emerald-500/10 border-emerald-500/20",
                design.difficulty === "Medium" && "bg-amber-500/10 border-amber-500/20",
                design.difficulty === "Hard" && "bg-red-500/10 border-red-500/20"
              )}
            >
              <span className="text-white/80 font-medium">{design.name}</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {design.concepts.slice(0, 2).map((c, j) => (
                  <span key={j} className="text-xs text-white/40">{c}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function BehavioralSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">💬 Behavioral Interview</h2>
      
      {/* STAR Method */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">{BEHAVIORAL_RESOURCES.starMethod.title}</h3>
        <p className="text-sm text-white/60 mb-4">{BEHAVIORAL_RESOURCES.starMethod.description}</p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white/60">Common Stories to Prepare</h4>
          {BEHAVIORAL_RESOURCES.starMethod.stories.map((story, i) => (
            <div key={i} className="p-2 rounded bg-white/5 text-sm text-white/70">
              {story}
            </div>
          ))}
        </div>
      </div>

      {/* Googleyness */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">{BEHAVIORAL_RESOURCES.googleyness.title}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {BEHAVIORAL_RESOURCES.googleyness.traits.map((trait, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 text-white/70">
              ✓ {trait}
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">📚 Resources</h3>
        <div className="space-y-2">
          {BEHAVIORAL_RESOURCES.resources.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <span className="text-sm text-white/70 group-hover:text-white">{r.name}</span>
              <span className="text-xs text-white/40 capitalize">{r.type}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemListsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">📋 Curated Problem Lists</h2>
      
      {/* Blind 75 */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              {CURATED_LISTS.blind75.name}
            </h3>
            <p className="text-sm text-white/60">{CURATED_LISTS.blind75.description}</p>
          </div>
          <a
            href={CURATED_LISTS.blind75.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors text-sm font-medium"
          >
            Open List →
          </a>
        </div>
      </div>

      {/* Grind 169 */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-400" />
              {CURATED_LISTS.grind169.name}
            </h3>
            <p className="text-sm text-white/60">{CURATED_LISTS.grind169.description}</p>
          </div>
          <a
            href={CURATED_LISTS.grind169.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
          >
            Open List →
          </a>
        </div>
      </div>

      {/* Google Tagged */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">🔍 {CURATED_LISTS.googleTop.name}</h3>
            <p className="text-sm text-white/60">{CURATED_LISTS.googleTop.description}</p>
          </div>
          <a
            href={CURATED_LISTS.googleTop.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
          >
            Open List →
          </a>
        </div>
        <p className="text-xs text-white/50">Premium required • Focus on last 6 months</p>
      </div>

      {/* NeetCode */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">📚 {CURATED_LISTS.neetcode150.name}</h3>
            <p className="text-sm text-white/60">{CURATED_LISTS.neetcode150.description}</p>
          </div>
          <a
            href={CURATED_LISTS.neetcode150.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors text-sm font-medium"
          >
            Open List →
          </a>
        </div>
      </div>

      {/* Sean Prashad */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">🎯 {CURATED_LISTS.seanPrashad.name}</h3>
            <p className="text-sm text-white/60">{CURATED_LISTS.seanPrashad.description}</p>
          </div>
          <a
            href={CURATED_LISTS.seanPrashad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors text-sm font-medium"
          >
            Open List →
          </a>
        </div>
      </div>
    </div>
  );
}

function YouTubeSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">📺 YouTube Channels</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {YOUTUBE_CHANNELS.map(channel => (
          <a
            key={channel.name}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-4 rounded-xl border transition-all group",
              channel.best
                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500/50"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                {channel.name}
              </span>
              {channel.best && <Star className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-sm text-white/50">{channel.focus}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

interface ResourceSectionProps {
  title: string;
  duration?: string;
  topics?: string[];
  videos?: Array<{ name: string; url: string; duration?: string; free?: boolean }>;
  docs?: Array<{ name: string; url: string; type?: string }>;
  practice?: Array<{ name: string; url: string; problems?: number | string }>;
}

function ResourceSection({ title, duration, topics, videos, docs, practice }: ResourceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {duration && <p className="text-sm text-white/50">{duration}</p>}
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="text-white/40"
        >
          ▶
        </motion.span>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-4"
        >
          {/* Topics */}
          {topics && topics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs text-white/70">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos && videos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1">
                <Video className="w-4 h-4" /> Videos
              </h4>
              <div className="space-y-2">
                {videos.slice(0, 5).map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-sm text-white/70 group-hover:text-white">{video.name}</span>
                    <div className="flex items-center gap-2">
                      {video.duration && <span className="text-xs text-white/40">{video.duration}</span>}
                      <ExternalLink className="w-3 h-3 text-white/30" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Docs */}
          {docs && docs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2 flex items-center gap-1">
                <Book className="w-4 h-4" /> Reading
              </h4>
              <div className="space-y-2">
                {docs.slice(0, 5).map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-sm text-white/70 group-hover:text-white">{doc.name}</span>
                    <ExternalLink className="w-3 h-3 text-white/30" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Practice */}
          {practice && practice.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Practice</h4>
              <div className="space-y-2">
                {practice.map((p, i) => (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors group"
                  >
                    <span className="text-sm text-emerald-400">{p.name}</span>
                    <span className="text-xs text-white/40">{p.problems} problems</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ResourcesView;

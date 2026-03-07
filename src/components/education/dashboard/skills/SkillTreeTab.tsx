"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { StudySession, Course, DashboardProject } from "@/types";
import { SKILL_CATEGORIES, SKILL_CATEGORY_COLORS } from "@/lib/constants";
import { generateSkillsFromData } from "@/lib/education-utils";
import { SkillCard } from "./SkillCard";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";

interface SkillTreeTabProps {
  sessions: StudySession[];
  courses: Course[];
  projects: DashboardProject[];
}

export function SkillTreeTab({ sessions, courses, projects }: SkillTreeTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const skills = useMemo(
    () => generateSkillsFromData(sessions, courses, projects),
    [sessions, courses, projects]
  );

  const totalXP = skills.reduce((s, sk) => s + sk.xp, 0);
  const highestLevel = skills.length > 0 ? Math.max(...skills.map((s) => s.level)) : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof skills>();
    SKILL_CATEGORIES.forEach((cat) => map.set(cat, []));
    skills.forEach((s) => {
      const arr = map.get(s.category) || [];
      arr.push(s);
      map.set(s.category, arr);
    });
    return Array.from(map.entries()).filter(([, arr]) => arr.length > 0);
  }, [skills]);

  return (
    <div className="space-y-8">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-semibold text-xl text-white">Skill Tree</h2>
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Stats header */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total XP", value: totalXP.toLocaleString(), color: "text-blue-400" },
          { label: "Skills", value: skills.length.toString(), color: "text-emerald-400" },
          { label: "Highest Level", value: highestLevel.toString(), color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card rounded-xl p-4 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{stat.label}</p>
            <p className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Grid View (grouped) */}
      {viewMode === "grid" && grouped.map(([category, catSkills]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-4">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: SKILL_CATEGORY_COLORS[category] || "#6b7280" }}
            />
            <h3 className="font-display font-semibold text-white">{category}</h3>
            <span className="font-mono text-xs text-white/30">{catSkills.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catSkills.map((skill, idx) => (
              <SkillCard key={skill.id} skill={skill} index={idx} />
            ))}
          </div>
        </div>
      ))}

      {/* List View (flat, sorted by XP desc) */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {[...skills].sort((a, b) => b.xp - a.xp).map((skill, i) => {
            const catColor = SKILL_CATEGORY_COLORS[skill.category] || "#6b7280";
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="glass-card rounded-xl p-4 flex items-center gap-4"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: catColor }} />
                <span className="font-display font-semibold text-sm text-white w-32 truncate shrink-0">{skill.name}</span>
                <span className="font-mono text-[10px] text-white/30 w-20 shrink-0">{skill.category}</span>
                <span className="font-mono text-[10px] text-white/40 shrink-0">Lv.{skill.level}</span>
                <div className="flex-1 min-w-[100px]">
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ backgroundColor: catColor, width: `${(skill.xp / skill.max_xp) * 100}%` }} />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-white/30 shrink-0">{skill.xp} XP</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Table View (flat, sorted by XP desc) */}
      {viewMode === "table" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Skill</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Level</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">XP</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody>
                {[...skills].sort((a, b) => b.xp - a.xp).map((skill) => {
                  const catColor = SKILL_CATEGORY_COLORS[skill.category] || "#6b7280";
                  return (
                    <tr key={skill.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="font-body text-xs text-white/70">{skill.name}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                          <span className="font-mono text-[10px] text-white/40">{skill.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs text-white/50">{skill.level}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs text-white/50">{skill.xp}</span>
                      </td>
                      <td className="px-4 py-2.5 w-32">
                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <div className="h-full rounded-full" style={{ backgroundColor: catColor, width: `${(skill.xp / skill.max_xp) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {skills.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-sm text-white/20">
            Start studying to build your skill tree
          </p>
        </div>
      )}
    </div>
  );
}

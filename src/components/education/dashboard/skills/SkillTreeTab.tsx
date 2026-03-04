"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { StudySession, Course, DashboardProject } from "@/types";
import { SKILL_CATEGORIES, SKILL_CATEGORY_COLORS } from "@/lib/constants";
import { generateSkillsFromData } from "@/lib/education-utils";
import { SkillCard } from "./SkillCard";

interface SkillTreeTabProps {
  sessions: StudySession[];
  courses: Course[];
  projects: DashboardProject[];
}

export function SkillTreeTab({ sessions, courses, projects }: SkillTreeTabProps) {
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

      {/* Skill groups */}
      {grouped.map(([category, catSkills]) => (
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

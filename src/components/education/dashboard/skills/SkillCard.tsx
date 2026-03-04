"use client";
import { motion } from "framer-motion";
import { Skill } from "@/types";
import { SKILL_LEVELS, SKILL_CATEGORY_COLORS } from "@/lib/constants";
import { SkillProgressBar } from "./SkillProgressBar";

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  const levelLabel = SKILL_LEVELS[skill.level - 1] || "Beginner";
  const catColor = SKILL_CATEGORY_COLORS[skill.category] || "#6b7280";

  return (
    <motion.div
      className="glass-card rounded-xl p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-semibold text-sm text-white truncate">
          {skill.name}
        </h4>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-mono border"
          style={{
            color: catColor,
            borderColor: `${catColor}33`,
            backgroundColor: `${catColor}15`,
          }}
        >
          Lv.{skill.level}
        </span>
      </div>

      <p className="font-body text-[10px] text-white/30 mb-2">
        {levelLabel} &middot; {skill.xp} XP
      </p>

      <SkillProgressBar current={skill.xp} max={skill.max_xp} color={catColor} />
    </motion.div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { StudySession, Course, DashboardProject, Skill } from "@/types";
import {
  getStudyStreak,
  getSubjectBreakdown,
  formatDuration,
} from "@/lib/education-utils";
import { SKILL_LEVELS } from "@/lib/constants";
import { motion } from "framer-motion";

interface LearningResumeTabProps {
  sessions: StudySession[];
  courses: Course[];
  projects: DashboardProject[];
  skills: Skill[];
}

export function LearningResumeTab({
  sessions,
  courses,
  projects,
  skills,
}: LearningResumeTabProps) {
  const [exporting, setExporting] = useState(false);

  // Computed stats
  const streak = useMemo(() => getStudyStreak(sessions), [sessions]);
  const subjectBreakdown = useMemo(() => getSubjectBreakdown(sessions), [sessions]);
  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + s.duration_minutes, 0),
    [sessions]
  );
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedCourses = useMemo(
    () => courses.filter((c) => c.status === "completed"),
    [courses]
  );
  const uniqueSubjects = useMemo(
    () => new Set(sessions.map((s) => s.subject)).size,
    [sessions]
  );

  function getSkillLevelLabel(level: number): string {
    return SKILL_LEVELS[Math.max(0, Math.min(level - 1, SKILL_LEVELS.length - 1))] || "Beginner";
  }

  function getSkillLevelColor(level: number): string {
    const colors = [
      "text-white/40",
      "text-blue-400",
      "text-cyan-400",
      "text-emerald-400",
      "text-amber-400",
    ];
    return colors[Math.max(0, Math.min(level - 1, colors.length - 1))] || "text-white/40";
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "completed":
        return "text-emerald-400";
      case "in-progress":
        return "text-blue-400";
      case "on-hold":
        return "text-amber-400";
      default:
        return "text-white/40";
    }
  }

  async function handleExportPDF() {
    setExporting(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Learning Resume", margin, y);
      y += 10;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
        margin,
        y
      );
      y += 12;

      // Horizontal rule
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Study Statistics
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40);
      doc.text("Study Statistics", margin, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80);

      const stats = [
        `Total Study Time: ${totalHours} hours`,
        `Current Streak: ${streak} days`,
        `Subjects Covered: ${uniqueSubjects}`,
        `Sessions Logged: ${sessions.length}`,
      ];
      stats.forEach((stat) => {
        doc.text(`  ${stat}`, margin, y);
        y += 6;
      });
      y += 6;

      // Skills Summary
      if (skills.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40);
        doc.text("Skills", margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);

        skills.forEach((skill) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          const levelLabel = getSkillLevelLabel(skill.level);
          doc.text(`  ${skill.name}  -  ${levelLabel} (Level ${skill.level})`, margin, y);
          y += 6;
        });
        y += 6;
      }

      // Completed Courses
      if (completedCourses.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40);
        doc.text("Completed Courses", margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);

        completedCourses.forEach((course) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(`  ${course.name}`, margin, y);
          y += 5;
          doc.setTextColor(120);
          doc.text(`    ${course.platform}  |  ${course.category}  |  ${course.total_hours}h`, margin, y);
          doc.setTextColor(80);
          y += 7;
        });
        y += 4;
      }

      // Projects
      if (projects.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40);
        doc.text("Projects", margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);

        projects.forEach((project) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          doc.text(`  ${project.name}  (${project.status})`, margin, y);
          y += 5;
          if (project.description) {
            doc.setTextColor(120);
            const descLines = doc.splitTextToSize(
              `    ${project.description}`,
              contentWidth - 10
            );
            doc.text(descLines, margin, y);
            y += descLines.length * 5;
            doc.setTextColor(80);
          }
          y += 3;
        });
        y += 4;
      }

      // Subject Breakdown
      if (subjectBreakdown.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = margin;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40);
        doc.text("Subject Breakdown", margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);

        subjectBreakdown.forEach((item) => {
          if (y > 270) {
            doc.addPage();
            y = margin;
          }
          const hours = (item.minutes / 60).toFixed(1);
          doc.text(`  ${item.subject}: ${hours} hours`, margin, y);
          y += 6;
        });
      }

      doc.save("learning-resume.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">
          Learning Resume
        </h2>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {exporting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as PDF
            </>
          )}
        </button>
      </div>

      {/* Resume Preview */}
      <div className="glass-card rounded-2xl p-8 space-y-8">
        {/* Study Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <h3 className="font-display font-semibold text-base text-white mb-4 pb-2 border-b border-white/5">
            Study Statistics
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="font-body text-[10px] text-white/40 mb-1">Total Hours</p>
              <p className="font-mono text-xl text-white">{totalHours}</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="font-body text-[10px] text-white/40 mb-1">Current Streak</p>
              <p className="font-mono text-xl text-white">{streak} days</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="font-body text-[10px] text-white/40 mb-1">Subjects</p>
              <p className="font-mono text-xl text-white">{uniqueSubjects}</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="font-body text-[10px] text-white/40 mb-1">Sessions</p>
              <p className="font-mono text-xl text-white">{sessions.length}</p>
            </div>
          </div>
        </motion.section>

        {/* Skills Summary */}
        {skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h3 className="font-display font-semibold text-base text-white mb-4 pb-2 border-b border-white/5">
              Skills Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-xl bg-white/[0.03] p-3 flex flex-col gap-1.5"
                >
                  <p className="font-body text-xs text-white truncate">{skill.name}</p>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] ${getSkillLevelColor(skill.level)}`}>
                      {getSkillLevelLabel(skill.level)}
                    </span>
                    <span className="font-mono text-[10px] text-white/20">
                      Lv.{skill.level}
                    </span>
                  </div>
                  {/* XP bar */}
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500/50"
                      style={{
                        width: `${Math.min((skill.xp / skill.max_xp) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-display font-semibold text-base text-white mb-4 pb-2 border-b border-white/5">
              Completed Courses
              <span className="font-mono text-xs text-white/20 ml-2">
                ({completedCourses.length})
              </span>
            </h3>
            <div className="flex flex-col gap-2">
              {completedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-body text-sm text-white truncate">{course.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-white/30">
                        {course.platform}
                      </span>
                      <span className="font-mono text-[10px] text-white/15">|</span>
                      <span className="font-mono text-[10px] text-white/30">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-emerald-400/60 flex-shrink-0">
                    {course.total_hours}h
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="font-display font-semibold text-base text-white mb-4 pb-2 border-b border-white/5">
              Projects
              <span className="font-mono text-xs text-white/20 ml-2">
                ({projects.length})
              </span>
            </h3>
            <div className="flex flex-col gap-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-white/[0.02] gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-body text-sm text-white truncate">{project.name}</p>
                    {project.description && (
                      <p className="font-body text-[11px] text-white/30 mt-0.5 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-mono text-[10px] flex-shrink-0 capitalize ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Subject Breakdown */}
        {subjectBreakdown.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display font-semibold text-base text-white mb-4 pb-2 border-b border-white/5">
              Subject Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {subjectBreakdown.map((item) => (
                <div
                  key={item.subject}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                >
                  <span className="font-body text-xs text-white/60 truncate">
                    {item.subject}
                  </span>
                  <span className="font-mono text-[10px] text-white/30 ml-2 flex-shrink-0">
                    {formatDuration(item.minutes)}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {sessions.length === 0 && skills.length === 0 && completedCourses.length === 0 && projects.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-body text-sm text-white/30">
              Start logging study sessions, courses, and projects to build your learning resume.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

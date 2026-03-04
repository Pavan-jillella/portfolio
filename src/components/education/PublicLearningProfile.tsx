"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SUBJECT_COLORS, COURSE_STATUS_CONFIG, PROJECT_STATUS_CONFIG } from "@/lib/constants";

interface ProfileData {
  displayName: string;
  avatarUrl: string | null;
  stats: {
    totalStudyHours: number;
    totalSessions: number;
    streak: number;
    coursesTotal: number;
    coursesCompleted: number;
    coursesInProgress: number;
    projectsTotal: number;
    projectsCompleted: number;
    notesCount: number;
  };
  subjects: { name: string; hours: number }[];
  courses: { name: string; category: string; platform: string; status: string; progress: number }[];
  projects: { name: string; status: string; techStack: string[] }[];
}

interface PublicLearningProfileProps {
  userId: string;
}

export function PublicLearningProfile({ userId }: PublicLearningProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/education/profile/${encodeURIComponent(userId)}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Profile not found" : "Failed to load profile");
        return res.json();
      })
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
        <div className="w-48 h-4 rounded bg-white/5 animate-pulse" />
        <div className="w-32 h-3 rounded bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-display text-xl text-white/40">{error || "Profile not found"}</p>
        <a href="/" className="mt-4 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Go home
        </a>
      </div>
    );
  }

  const { stats, subjects, courses, projects } = profile;
  const maxSubjectHours = Math.max(...subjects.map((s) => s.hours), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-20 h-20 rounded-full border-2 border-white/10"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center">
            <span className="font-display text-2xl text-white/60">
              {profile.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h1 className="font-display font-bold text-2xl text-white">{profile.displayName}</h1>
          <p className="font-body text-sm text-white/40 mt-1">Learning Profile</p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Study Hours", value: stats.totalStudyHours, suffix: "h" },
          { label: "Current Streak", value: stats.streak, suffix: " days" },
          { label: "Courses Done", value: stats.coursesCompleted, suffix: "" },
          { label: "Projects", value: stats.projectsTotal, suffix: "" },
          { label: "Sessions", value: stats.totalSessions, suffix: "" },
          { label: "In Progress", value: stats.coursesInProgress, suffix: "" },
          { label: "Notes", value: stats.notesCount, suffix: "" },
          { label: "Total Courses", value: stats.coursesTotal, suffix: "" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{s.label}</p>
            <p className="font-display font-bold text-2xl text-white">
              {s.value}{s.suffix}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Subject breakdown */}
      {subjects.length > 0 && (
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display font-semibold text-sm text-white mb-4">Subjects Studied</h3>
          <div className="space-y-3">
            {subjects.slice(0, 10).map((subject) => {
              const color = SUBJECT_COLORS[subject.name] || "#6b7280";
              const pct = (subject.hours / maxSubjectHours) * 100;
              return (
                <div key={subject.name} className="flex items-center gap-3">
                  <span className="font-body text-xs text-white/60 w-28 truncate">{subject.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-white/30 w-10 text-right">{subject.hours}h</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-display font-semibold text-sm text-white mb-4">
            Courses ({stats.coursesCompleted}/{stats.coursesTotal} completed)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {courses.map((course, i) => {
              const statusCfg = COURSE_STATUS_CONFIG[course.status as keyof typeof COURSE_STATUS_CONFIG] || {
                label: course.status,
                color: "text-white/40",
                bgColor: "bg-white/4",
              };
              return (
                <div key={`${course.name}-${i}`} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                  <h4 className="font-body text-sm text-white/70 mb-2 truncate">{course.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-[10px]">
                      {course.platform}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusCfg.color} ${statusCfg.bgColor}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-display font-semibold text-sm text-white mb-4">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((project, i) => {
              const statusCfg = PROJECT_STATUS_CONFIG[project.status as keyof typeof PROJECT_STATUS_CONFIG] || {
                label: project.status,
                color: "text-white/40",
                bgColor: "bg-white/4",
              };
              return (
                <div key={`${project.name}-${i}`} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                  <h4 className="font-body text-sm text-white/70 mb-2">{project.name}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusCfg.color} ${statusCfg.bgColor}`}>
                      {statusCfg.label}
                    </span>
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/20 text-[10px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center py-6">
        <p className="font-mono text-[10px] text-white/15">
          Powered by the Education Dashboard
        </p>
      </div>
    </div>
  );
}

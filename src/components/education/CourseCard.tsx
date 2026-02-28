"use client";
import { Course } from "@/types";
import { COURSE_STATUS_CONFIG } from "@/lib/constants";
import { ProgressRing } from "./ProgressRing";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const statusCfg = COURSE_STATUS_CONFIG[course.status];

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl p-6 cursor-pointer group hover:border-white/12 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <ProgressRing progress={course.progress} completed={course.status === "completed"} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
              {course.name}
            </h3>
            <span
              className={`tag-badge px-2 py-0.5 rounded-full border border-white/8 text-xs shrink-0 ${statusCfg.color} ${statusCfg.bgColor}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
              {course.platform}
            </span>
            <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
              {course.category}
            </span>
            {course.total_hours > 0 && (
              <span className="font-mono text-xs text-white/20">{course.total_hours}h</span>
            )}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                course.status === "completed" ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

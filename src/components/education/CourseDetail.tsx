"use client";
import { Course, CourseMaterial, CourseUpdate, CourseStatus } from "@/types";
import { COURSE_STATUS_CONFIG } from "@/lib/constants";
import { ProgressRing } from "./ProgressRing";
import { MaterialsList } from "./MaterialsList";
import { UpdatesLog } from "./UpdatesLog";
import { FadeIn } from "@/components/ui/FadeIn";

interface CourseDetailProps {
  course: Course;
  materials: CourseMaterial[];
  updates: CourseUpdate[];
  onBack: () => void;
  onAddMaterial: (material: Omit<CourseMaterial, "id" | "created_at">) => void;
  onDeleteMaterial: (id: string) => void;
  onAddUpdate: (update: Omit<CourseUpdate, "id" | "created_at">) => void;
  onUpdateProgress: (id: string, progress: number, status: CourseStatus) => void;
  onDeleteCourse: (id: string) => void;
}

export function CourseDetail({
  course,
  materials,
  updates,
  onBack,
  onAddMaterial,
  onDeleteMaterial,
  onAddUpdate,
  onUpdateProgress,
  onDeleteCourse,
}: CourseDetailProps) {
  const statusCfg = COURSE_STATUS_CONFIG[course.status];

  function handleProgressChange(newProgress: number) {
    const newStatus: CourseStatus = newProgress >= 100 ? "completed" : newProgress > 0 ? "in-progress" : "planned";
    onUpdateProgress(course.id, newProgress, newStatus);
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <button
          onClick={onBack}
          className="font-body text-sm text-white/30 hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to courses
        </button>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-start gap-6 flex-wrap">
            <ProgressRing progress={course.progress} size={96} strokeWidth={4} completed={course.status === "completed"} />
            <div className="flex-1 min-w-[200px]">
              <h2 className="font-display font-bold text-2xl text-white mb-2">{course.name}</h2>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                  {course.platform}
                </span>
                <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                  {course.category}
                </span>
                <span className={`tag-badge px-2 py-0.5 rounded-full border border-white/8 text-xs ${statusCfg.color} ${statusCfg.bgColor}`}>
                  {statusCfg.label}
                </span>
                {course.total_hours > 0 && (
                  <span className="font-mono text-xs text-white/20">{course.total_hours}h total</span>
                )}
              </div>

              {course.url && (
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors mb-4"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open course
                </a>
              )}

              {/* Progress slider */}
              <div>
                <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
                  Progress — {course.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={course.progress}
                  onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4">
            <button
              onClick={() => onDeleteCourse(course.id)}
              className="text-xs font-body text-white/20 hover:text-red-400 transition-colors"
            >
              Delete course
            </button>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="glass-card rounded-2xl p-6">
            <MaterialsList
              materials={materials}
              onAdd={onAddMaterial}
              onDelete={onDeleteMaterial}
              courseId={course.id}
            />
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="glass-card rounded-2xl p-6">
            <UpdatesLog updates={updates} onAdd={onAddUpdate} courseId={course.id} />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

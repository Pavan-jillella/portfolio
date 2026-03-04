"use client";
import { useState, useMemo } from "react";
import { Course, CourseModule, CourseNote, CourseFile, StudySession } from "@/types";
import { calculateModuleProgress } from "@/lib/education-utils";
import { COURSE_STATUS_CONFIG } from "@/lib/constants";
import { CourseModuleList } from "./CourseModuleList";
import { CourseNotesEditor } from "./CourseNotesEditor";
import { CourseFileUpload } from "./CourseFileUpload";
import { CourseForm } from "@/components/education/CourseForm";
import { CourseRecommendations } from "../ai/CourseRecommendations";
import { motion } from "framer-motion";

interface CourseTrackerTabProps {
  courses: Course[];
  sessions: StudySession[];
  modules: CourseModule[];
  courseNotes: CourseNote[];
  courseFiles: CourseFile[];
  onAddCourse: (course: Omit<Course, "id" | "created_at">) => void;
  onAddModule: (module: Omit<CourseModule, "id" | "created_at">) => void;
  onToggleModule: (id: string) => void;
  onDeleteModule: (id: string) => void;
  onSaveCourseNote: (note: Omit<CourseNote, "id" | "created_at">) => void;
  onAddCourseFile: (file: Omit<CourseFile, "id" | "created_at">) => void;
  onDeleteCourseFile: (id: string) => void;
}

export function CourseTrackerTab({
  courses,
  sessions,
  modules,
  courseNotes,
  courseFiles,
  onAddCourse,
  onAddModule,
  onToggleModule,
  onDeleteModule,
  onSaveCourseNote,
  onAddCourseFile,
  onDeleteCourseFile,
}: CourseTrackerTabProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const completed = courses.filter((c) => c.status === "completed").length;
    const avgProgress =
      courses.length > 0
        ? Math.round(
            courses.reduce((sum, c) => {
              const courseMods = modules.filter((m) => m.course_id === c.id);
              return sum + (courseMods.length > 0 ? calculateModuleProgress(courseMods) : c.progress);
            }, 0) / courses.length
          )
        : 0;
    return { total: courses.length, completed, avgProgress };
  }, [courses, modules]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedModules = useMemo(
    () => modules.filter((m) => m.course_id === selectedCourseId),
    [modules, selectedCourseId]
  );
  const selectedNotes = useMemo(
    () => courseNotes.filter((n) => n.course_id === selectedCourseId),
    [courseNotes, selectedCourseId]
  );
  const selectedFiles = useMemo(
    () => courseFiles.filter((f) => f.course_id === selectedCourseId),
    [courseFiles, selectedCourseId]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">Course Tracker</h2>
        <button
          onClick={() => setShowForm(true)}
          className="glass-card px-5 py-2 rounded-2xl text-sm font-body text-white/60 hover:text-white hover:border-blue-500/30 transition-all duration-300"
        >
          + Add Course
        </button>
      </div>

      <CourseForm open={showForm} onClose={() => setShowForm(false)} onSubmit={onAddCourse} />

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Courses", value: stats.total },
          { label: "Completed", value: stats.completed },
          { label: "Avg Progress", value: `${stats.avgProgress}%` },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{stat.label}</p>
            <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Course grid */}
      {courses.length === 0 ? (
        <p className="font-body text-sm text-white/20 text-center py-8">No courses added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const courseMods = modules.filter((m) => m.course_id === course.id);
            const modProgress = courseMods.length > 0 ? calculateModuleProgress(courseMods) : course.progress;
            const statusCfg = COURSE_STATUS_CONFIG[course.status];
            const isSelected = selectedCourseId === course.id;

            return (
              <motion.div
                key={course.id}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all ${
                  isSelected ? "border-blue-500/30" : "hover:border-white/10"
                }`}
                onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <h4 className="font-display font-semibold text-sm text-white mb-2 truncate">{course.name}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-[10px]">
                    {course.platform}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusCfg.color} ${statusCfg.bgColor}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${modProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/30">{modProgress}%</span>
                  <span className="font-mono text-[10px] text-white/30">{courseMods.length} modules</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Selected course detail */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <CourseModuleList
            modules={selectedModules}
            courseId={selectedCourse.id}
            onAdd={onAddModule}
            onToggle={onToggleModule}
            onDelete={onDeleteModule}
          />
          <CourseNotesEditor
            courseId={selectedCourse.id}
            courseNotes={selectedNotes}
            onSave={onSaveCourseNote}
          />
          <div className="md:col-span-2">
            <CourseFileUpload
              courseId={selectedCourse.id}
              files={selectedFiles}
              onAdd={onAddCourseFile}
              onDelete={onDeleteCourseFile}
            />
          </div>
        </motion.div>
      )}

      {/* AI Course Recommendations */}
      <CourseRecommendations courses={courses} sessions={sessions} onAddCourse={onAddCourse} />
    </div>
  );
}

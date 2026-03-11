"use client";
import { useState, useMemo } from "react";
import { Course, CourseModule, CourseNote, CourseFile, StudySession, UploadedFile } from "@/types";
import { calculateModuleProgress } from "@/lib/education-utils";
import { COURSE_STATUS_CONFIG } from "@/lib/constants";
import { CourseModuleList } from "./CourseModuleList";
import { CourseNotesEditor } from "./CourseNotesEditor";
import { CourseFileUpload } from "./CourseFileUpload";
import { CourseLinkedFiles } from "./CourseLinkedFiles";
import { CourseForm } from "@/components/education/CourseForm";
import { CourseRecommendations } from "../ai/CourseRecommendations";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { motion, AnimatePresence } from "framer-motion";

interface CourseTrackerTabProps {
  courses: Course[];
  sessions: StudySession[];
  modules: CourseModule[];
  courseNotes: CourseNote[];
  courseFiles: CourseFile[];
  generalFiles: UploadedFile[];
  isStorageAvailable: boolean;
  isOwnerUser?: boolean;
  onAddCourse: (course: Omit<Course, "id" | "created_at">) => void;
  onDeleteCourse: (id: string) => void;
  onImportSeedCourse?: () => Promise<string | null>;
  onAddModule: (module: Omit<CourseModule, "id" | "created_at">) => void;
  onToggleModule: (id: string) => void;
  onDeleteModule: (id: string) => void;
  onSaveCourseNote: (note: Omit<CourseNote, "id" | "created_at">) => void;
  onAddCourseFile: (file: Omit<CourseFile, "id" | "created_at">) => void;
  onDeleteCourseFile: (id: string) => void;
  onUploadFile: (file: File) => Promise<{ url: string; path: string } | null>;
  onAddGeneralFile: (file: Omit<UploadedFile, "id" | "created_at">) => void;
  onUpdateGeneralFile: (id: string, updates: Partial<UploadedFile>) => void;
}

export function CourseTrackerTab({
  courses,
  sessions,
  modules,
  courseNotes,
  courseFiles,
  generalFiles,
  isStorageAvailable,
  isOwnerUser,
  onAddCourse,
  onDeleteCourse,
  onImportSeedCourse,
  onAddModule,
  onToggleModule,
  onDeleteModule,
  onSaveCourseNote,
  onAddCourseFile,
  onDeleteCourseFile,
  onUploadFile,
  onAddGeneralFile,
  onUpdateGeneralFile,
}: CourseTrackerTabProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
        <div className="flex items-center gap-3">
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          {isOwnerUser && onImportSeedCourse && (
            <button
              onClick={async () => {
                setImporting(true);
                setImportMsg(null);
                const err = await onImportSeedCourse();
                if (err) {
                  setImportMsg({ type: "error", text: err });
                } else {
                  setImportMsg({ type: "success", text: "Python Roadmap imported!" });
                }
                setImporting(false);
                setTimeout(() => setImportMsg(null), 4000);
              }}
              disabled={importing}
              className="glass-card px-4 py-2 rounded-2xl text-sm font-body text-blue-400/60 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-300 disabled:opacity-40"
            >
              {importing ? "Importing..." : "Import Python Roadmap"}
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="glass-card px-5 py-2 rounded-2xl text-sm font-body text-white/60 hover:text-white hover:border-blue-500/30 transition-all duration-300"
          >
            + Add Course
          </button>
        </div>
      </div>

      <CourseForm open={showForm} onClose={() => setShowForm(false)} onSubmit={onAddCourse} />

      <AnimatePresence>
        {importMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl px-4 py-3 text-sm font-body ${
              importMsg.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {importMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

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
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const courseMods = modules.filter((m) => m.course_id === course.id);
            const modProgress = courseMods.length > 0 ? calculateModuleProgress(courseMods) : course.progress;
            const statusCfg = COURSE_STATUS_CONFIG[course.status];
            const isSelected = selectedCourseId === course.id;

            return (
              <motion.div
                key={course.id}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all group relative ${
                  isSelected ? "border-blue-500/30" : "hover:border-white/10"
                }`}
                onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400"
                >
                  &times;
                </button>
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
      ) : viewMode === "list" ? (
        <div className="space-y-2">
          {courses.map((course) => {
            const courseMods = modules.filter((m) => m.course_id === course.id);
            const modProgress = courseMods.length > 0 ? calculateModuleProgress(courseMods) : course.progress;
            const statusCfg = COURSE_STATUS_CONFIG[course.status];
            const isSelected = selectedCourseId === course.id;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-2xl p-4 cursor-pointer transition-all hover:bg-white/[0.02] group ${isSelected ? "border-blue-500/30" : ""}`}
                onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-semibold text-sm text-white truncate min-w-0 flex-1">{course.name}</span>
                  <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-[10px] shrink-0">{course.platform}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${statusCfg.color} ${statusCfg.bgColor}`}>{statusCfg.label}</span>
                  <div className="flex items-center gap-2 shrink-0 w-36">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${modProgress}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-white/30 w-8 text-right">{modProgress}%</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400 shrink-0"
                  >
                    &times;
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Platform</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Modules</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Progress</th>
                  <th className="px-4 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const courseMods = modules.filter((m) => m.course_id === course.id);
                  const modProgress = courseMods.length > 0 ? calculateModuleProgress(courseMods) : course.progress;
                  const statusCfg = COURSE_STATUS_CONFIG[course.status];
                  const isSelected = selectedCourseId === course.id;
                  return (
                    <tr
                      key={course.id}
                      className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group ${isSelected ? "bg-blue-500/5" : ""}`}
                      onClick={() => setSelectedCourseId(isSelected ? null : course.id)}
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-body text-xs text-white/70">{course.name}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-[10px] text-white/40">{course.platform}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full ${statusCfg.color} ${statusCfg.bgColor}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs text-white/40">{courseMods.length}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs text-white/50">{modProgress}%</span>
                      </td>
                      <td className="px-2 py-2.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteCourse(course.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          <div className="md:col-span-2">
            <CourseLinkedFiles
              courseId={selectedCourse.id}
              courses={courses}
              files={generalFiles}
              isStorageAvailable={isStorageAvailable}
              onUpload={onUploadFile}
              onAddFile={onAddGeneralFile}
              onUpdateFile={onUpdateGeneralFile}
            />
          </div>
        </motion.div>
      )}

      {/* AI Course Recommendations */}
      <CourseRecommendations courses={courses} sessions={sessions} onAddCourse={onAddCourse} />
    </div>
  );
}

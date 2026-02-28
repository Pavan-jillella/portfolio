"use client";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Course, CourseMaterial, CourseUpdate, CourseStatus } from "@/types";
import { generateId } from "@/lib/finance-utils";
import { CourseStats } from "./CourseStats";
import { CourseFilters } from "./CourseFilters";
import { CourseCard } from "./CourseCard";
import { CourseForm } from "./CourseForm";
import { CourseDetail } from "./CourseDetail";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatePresence, motion } from "framer-motion";

export function CourseTrackerSection() {
  const [courses, setCourses] = useLocalStorage<Course[]>("pj-courses", []);
  const [materials, setMaterials] = useLocalStorage<CourseMaterial[]>("pj-course-materials", []);
  const [updates, setUpdates] = useLocalStorage<CourseUpdate[]>("pj-course-updates", []);

  const [filter, setFilter] = useState<CourseStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = filter === "all" ? courses : courses.filter((c) => c.status === filter);
  const selectedCourse = selectedId ? courses.find((c) => c.id === selectedId) : null;

  function handleAddCourse(data: Omit<Course, "id" | "created_at">) {
    const newCourse: Course = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    setCourses((prev) => [...prev, newCourse]);
  }

  function handleDeleteCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setMaterials((prev) => prev.filter((m) => m.course_id !== id));
    setUpdates((prev) => prev.filter((u) => u.course_id !== id));
    setSelectedId(null);
  }

  function handleUpdateProgress(id: string, progress: number, status: CourseStatus) {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, progress, status } : c))
    );
  }

  function handleAddMaterial(data: Omit<CourseMaterial, "id" | "created_at">) {
    const newMaterial: CourseMaterial = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    setMaterials((prev) => [...prev, newMaterial]);
  }

  function handleDeleteMaterial(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  function handleAddUpdate(data: Omit<CourseUpdate, "id" | "created_at">) {
    const newUpdate: CourseUpdate = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    setUpdates((prev) => [...prev, newUpdate]);
  }

  const totalHours = courses.reduce((sum, c) => sum + c.total_hours, 0);

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-2xl text-white">Course Tracker</h2>
          <button
            onClick={() => setShowForm(true)}
            className="glass-card px-5 py-2 rounded-2xl text-sm font-body text-white/60 hover:text-white hover:border-blue-500/30 transition-all duration-300"
          >
            + Add Course
          </button>
        </div>
      </FadeIn>

      <CourseForm open={showForm} onClose={() => setShowForm(false)} onSubmit={handleAddCourse} />

      {selectedCourse ? (
        <CourseDetail
          course={selectedCourse}
          materials={materials.filter((m) => m.course_id === selectedCourse.id)}
          updates={updates.filter((u) => u.course_id === selectedCourse.id)}
          onBack={() => setSelectedId(null)}
          onAddMaterial={handleAddMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onAddUpdate={handleAddUpdate}
          onUpdateProgress={handleUpdateProgress}
          onDeleteCourse={handleDeleteCourse}
        />
      ) : (
        <>
          <FadeIn delay={0.05}>
            <CourseStats
              stats={{
                total: courses.length,
                completed: courses.filter((c) => c.status === "completed").length,
                inProgress: courses.filter((c) => c.status === "in-progress").length,
                totalHours,
              }}
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <CourseFilters current={filter} onChange={setFilter} />
          </FadeIn>

          {filtered.length === 0 ? (
            <FadeIn delay={0.15}>
              <div className="glass-card rounded-3xl p-12 text-center">
                <p className="font-body text-white/30 text-sm">
                  {courses.length === 0
                    ? "No courses yet. Add your first course to start tracking."
                    : "No courses match this filter."}
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filtered.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <CourseCard course={course} onClick={() => setSelectedId(course.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}

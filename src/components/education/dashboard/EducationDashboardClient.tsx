"use client";
import { useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { generateId } from "@/lib/finance-utils";
import {
  StudySession,
  StudyGoal,
  Course,
  CourseModule,
  CourseNote,
  CourseFile,
  Note,
  NoteVersion,
  UploadedFile,
  DashboardProject,
  ProjectMilestone,
  ProjectFile,
  ProjectNote,
} from "@/types";
import { DASHBOARD_TABS, DashboardTabId } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { RealtimeStatus } from "@/components/ui/RealtimeStatus";
import { VisibilityToggle } from "@/components/ui/VisibilityToggle";
import { PrivateSection } from "@/components/ui/PrivateSection";
import { ShareLink } from "@/components/ui/ShareLink";
import { OverviewTab } from "./overview/OverviewTab";
import { StudyPlannerTab } from "./study/StudyPlannerTab";
import { CourseTrackerTab } from "./courses/CourseTrackerTab";
import { NotesTab } from "./notes/NotesTab";
import { ProjectsTab } from "./projects/ProjectsTab";
import { GitHubDashboardTab } from "./github/GitHubDashboardTab";
import { LeetCodeDashboardTab } from "./leetcode/LeetCodeDashboardTab";
import { FilesTab } from "./files/FilesTab";

export function EducationDashboardClient() {
  // ===== State (Realtime-synced) =====
  const [studySessions, setStudySessions, sessionsConnected] = useSupabaseRealtimeSync<StudySession>("pj-study-sessions", "study_sessions", []);
  const [notes, setNotes, notesConnected] = useSupabaseRealtimeSync<Note>("pj-edu-notes", "edu_notes", []);
  const [courses, setCourses, coursesConnected] = useSupabaseRealtimeSync<Course>("pj-courses", "courses", []);
  const [projects, setProjects, projectsConnected] = useSupabaseRealtimeSync<DashboardProject>("pj-edu-projects", "edu_projects", []);

  // ===== State (Local only) =====
  const [studyGoals, setStudyGoals] = useLocalStorage<StudyGoal[]>("pj-study-goals", []);
  const [courseModules, setCourseModules] = useLocalStorage<CourseModule[]>("pj-course-modules", []);
  const [courseNotes, setCourseNotes] = useLocalStorage<CourseNote[]>("pj-course-notes", []);
  const [courseFiles, setCourseFiles] = useLocalStorage<CourseFile[]>("pj-course-files", []);
  const [noteVersions, setNoteVersions] = useLocalStorage<NoteVersion[]>("pj-note-versions", []);
  const [files, setFiles] = useLocalStorage<UploadedFile[]>("pj-edu-files", []);
  const [milestones, setMilestones] = useLocalStorage<ProjectMilestone[]>("pj-project-milestones", []);
  const [projectFiles, setProjectFiles] = useLocalStorage<ProjectFile[]>("pj-project-files", []);
  const [projectNotes, setProjectNotes] = useLocalStorage<ProjectNote[]>("pj-project-notes", []);

  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const { isAvailable: isStorageAvailable, upload: uploadFile } = useSupabaseStorage();
  const isRealtimeConnected = sessionsConnected || notesConnected || coursesConnected || projectsConnected;

  // ===== Study Session Handlers =====
  function addStudySession(session: Omit<StudySession, "id" | "created_at">) {
    setStudySessions((prev) => [{ ...session, id: generateId(), created_at: new Date().toISOString() }, ...prev]);
  }
  function editStudySession(id: string, data: Omit<StudySession, "id" | "created_at">) {
    setStudySessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }
  function deleteStudySession(id: string) {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
  }

  // ===== Study Goal Handlers =====
  function addStudyGoal(goal: Omit<StudyGoal, "id" | "created_at">) {
    setStudyGoals((prev) => [{ ...goal, id: generateId(), created_at: new Date().toISOString() }, ...prev]);
  }
  function deleteStudyGoal(id: string) {
    setStudyGoals((prev) => prev.filter((g) => g.id !== id));
  }

  // ===== Course Module Handlers =====
  function addCourseModule(module: Omit<CourseModule, "id" | "created_at">) {
    setCourseModules((prev) => [...prev, { ...module, id: generateId(), created_at: new Date().toISOString() }]);
  }
  function toggleCourseModule(id: string) {
    setCourseModules((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));
  }
  function deleteCourseModule(id: string) {
    setCourseModules((prev) => prev.filter((m) => m.id !== id));
  }

  // ===== Course Note Handlers =====
  function saveCourseNote(note: Omit<CourseNote, "id" | "created_at">) {
    setCourseNotes((prev) => {
      const existing = prev.find((n) => n.course_id === note.course_id);
      if (existing) {
        return prev.map((n) => (n.id === existing.id ? { ...n, ...note } : n));
      }
      return [...prev, { ...note, id: generateId(), created_at: new Date().toISOString() }];
    });
  }

  // ===== Course File Handlers =====
  function addCourseFile(file: Omit<CourseFile, "id" | "created_at">) {
    setCourseFiles((prev) => [...prev, { ...file, id: generateId(), created_at: new Date().toISOString() }]);
  }
  function deleteCourseFile(id: string) {
    setCourseFiles((prev) => prev.filter((f) => f.id !== id));
  }

  // ===== Note Handlers =====
  function addNote(note: Omit<Note, "id" | "created_at" | "updated_at">) {
    const now = new Date().toISOString();
    setNotes((prev) => [{ ...note, id: generateId(), created_at: now, updated_at: now }, ...prev]);
  }
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  }, [setNotes]);
  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  // ===== Note Version Handlers =====
  function saveNoteVersion(version: Omit<NoteVersion, "id">) {
    setNoteVersions((prev) => [...prev, { ...version, id: generateId() }]);
  }
  function restoreNoteVersion(noteId: string, contentHtml: string) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, content_html: contentHtml, updated_at: new Date().toISOString() } : n
      )
    );
  }

  // ===== File Handlers =====
  async function handleFileUpload(file: File): Promise<{ url: string; path: string } | null> {
    const path = `uploads/${Date.now()}-${file.name}`;
    return await uploadFile(file, path);
  }
  function addFile(file: Omit<UploadedFile, "id" | "created_at">) {
    setFiles((prev) => [...prev, { ...file, id: generateId(), created_at: new Date().toISOString() }]);
  }
  function deleteFile(id: string, storagePath: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (storagePath) {
      fetch(`/api/education/upload/${encodeURIComponent(storagePath)}`, { method: "DELETE" }).catch(() => {});
    }
  }

  // ===== Project Handlers =====
  function addProject(project: Omit<DashboardProject, "id" | "created_at" | "updated_at">) {
    const now = new Date().toISOString();
    setProjects((prev) => [{ ...project, id: generateId(), created_at: now, updated_at: now }, ...prev]);
  }
  const editProject = useCallback((id: string, updates: Partial<DashboardProject>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, [setProjects]);
  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setMilestones((prev) => prev.filter((m) => m.project_id !== id));
    setProjectFiles((prev) => prev.filter((f) => f.project_id !== id));
    setProjectNotes((prev) => prev.filter((n) => n.project_id !== id));
  }

  // ===== Milestone Handlers =====
  function addMilestone(milestone: Omit<ProjectMilestone, "id" | "created_at">) {
    setMilestones((prev) => [...prev, { ...milestone, id: generateId(), created_at: new Date().toISOString() }]);
  }
  function toggleMilestone(id: string) {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));
  }
  function deleteMilestone(id: string) {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }

  // ===== Project Note Handlers =====
  function saveProjectNote(note: Omit<ProjectNote, "id" | "created_at">) {
    setProjectNotes((prev) => {
      const existing = prev.find((n) => n.project_id === note.project_id);
      if (existing) {
        return prev.map((n) => (n.id === existing.id ? { ...n, ...note } : n));
      }
      return [...prev, { ...note, id: generateId(), created_at: new Date().toISOString() }];
    });
  }

  // ===== Project File Handlers =====
  function addProjectFile(file: Omit<ProjectFile, "id" | "created_at">) {
    setProjectFiles((prev) => [...prev, { ...file, id: generateId(), created_at: new Date().toISOString() }]);
  }
  function deleteProjectFile(id: string) {
    setProjectFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2 flex-1">
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
                  activeTab === tab.id
                    ? "glass-card text-blue-400"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <RealtimeStatus isConnected={isRealtimeConnected} />
          <ShareLink />
          <VisibilityToggle />
        </div>
      </FadeIn>

      {/* Tab content */}
      {activeTab === "overview" && (
        <FadeIn>
          <ErrorBoundary module="Overview">
            <OverviewTab
              sessions={studySessions}
              courses={courses}
              notes={notes}
              projects={projects}
            />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "study" && (
        <FadeIn>
          <ErrorBoundary module="Study Planner">
            <StudyPlannerTab
              sessions={studySessions}
              goals={studyGoals}
              onAddSession={addStudySession}
              onEditSession={editStudySession}
              onDeleteSession={deleteStudySession}
              onAddGoal={addStudyGoal}
              onDeleteGoal={deleteStudyGoal}
            />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "courses" && (
        <FadeIn>
          <ErrorBoundary module="Course Tracker">
            <CourseTrackerTab
              courses={courses}
              modules={courseModules}
              courseNotes={courseNotes}
              courseFiles={courseFiles}
              onAddModule={addCourseModule}
              onToggleModule={toggleCourseModule}
              onDeleteModule={deleteCourseModule}
              onSaveCourseNote={saveCourseNote}
              onAddCourseFile={addCourseFile}
              onDeleteCourseFile={deleteCourseFile}
            />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "notes" && (
        <FadeIn>
          <ErrorBoundary module="Notes">
            <PrivateSection sectionKey="notes" label="Notes">
              <NotesTab
                notes={notes}
                versions={noteVersions}
                courses={courses}
                projects={projects}
                onAddNote={addNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
                onSaveVersion={saveNoteVersion}
                onRestoreVersion={restoreNoteVersion}
              />
            </PrivateSection>
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "projects" && (
        <FadeIn>
          <ErrorBoundary module="Projects">
            <ProjectsTab
              projects={projects}
              milestones={milestones}
              projectNotes={projectNotes}
              projectFiles={projectFiles}
              onAddProject={addProject}
              onEditProject={editProject}
              onDeleteProject={deleteProject}
              onAddMilestone={addMilestone}
              onToggleMilestone={toggleMilestone}
              onDeleteMilestone={deleteMilestone}
              onSaveProjectNote={saveProjectNote}
              onAddProjectFile={addProjectFile}
              onDeleteProjectFile={deleteProjectFile}
            />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "github" && (
        <FadeIn>
          <ErrorBoundary module="GitHub">
            <GitHubDashboardTab />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "leetcode" && (
        <FadeIn>
          <ErrorBoundary module="LeetCode">
            <LeetCodeDashboardTab />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "files" && (
        <FadeIn>
          <ErrorBoundary module="Files">
            <PrivateSection sectionKey="files" label="Files">
              <FilesTab
                files={files}
                isStorageAvailable={isStorageAvailable}
                onUpload={handleFileUpload}
                onDelete={deleteFile}
                onAddFile={addFile}
              />
            </PrivateSection>
          </ErrorBoundary>
        </FadeIn>
      )}
    </div>
  );
}

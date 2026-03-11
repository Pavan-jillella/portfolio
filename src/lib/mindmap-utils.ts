import { Course, Note, UploadedFile } from "@/types";

export interface MindMapNode {
  id: string;
  type: "course" | "note" | "tag" | "file";
  label: string;
  x: number;
  y: number;
  color: string;
  bgFill: string;
  strokeColor: string;
  radius: number;
  metadata?: {
    courseId?: string;
    noteId?: string;
    status?: string;
    progress?: number;
    platform?: string;
    category?: string;
  };
}

export interface MindMapEdge {
  source: string;
  target: string;
  type: "course-note" | "course-file" | "shared-note" | "course-tag";
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  width: number;
  height: number;
}

const COURSE_STATUS_COLORS: Record<string, { color: string; bgFill: string; strokeColor: string }> = {
  completed: { color: "#10b981", bgFill: "rgba(16,185,129,0.1)", strokeColor: "rgba(16,185,129,0.3)" },
  "in-progress": { color: "#3b82f6", bgFill: "rgba(59,130,246,0.1)", strokeColor: "rgba(59,130,246,0.3)" },
  planned: { color: "#6b7280", bgFill: "rgba(107,114,128,0.08)", strokeColor: "rgba(107,114,128,0.2)" },
};

const NOTE_STYLE = { color: "#8b5cf6", bgFill: "rgba(139,92,246,0.08)", strokeColor: "rgba(139,92,246,0.25)" };
const TAG_STYLE = { color: "#f59e0b", bgFill: "rgba(245,158,11,0.08)", strokeColor: "rgba(245,158,11,0.2)" };
const FILE_STYLE = { color: "#06b6d4", bgFill: "rgba(6,182,212,0.08)", strokeColor: "rgba(6,182,212,0.2)" };

export function buildMindMapData(
  courses: Course[],
  notes: Note[],
  files: UploadedFile[]
): MindMapData {
  const nodes: MindMapNode[] = [];
  const edges: MindMapEdge[] = [];
  const edgeSet = new Set<string>();

  function addEdge(source: string, target: string, type: MindMapEdge["type"]) {
    const key = `${source}-${target}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ source, target, type });
    }
  }

  // Filter relevant data
  const linkedNotes = notes.filter((n) => n.linked_course_ids?.length > 0);
  const courseFiles = files.filter(
    (f) => f.linked_entity_type === "course" && f.linked_entity_ids?.length > 0
  );

  // Collect all unique tags from linked notes
  const tagSet = new Set<string>();
  linkedNotes.forEach((n) => n.tags?.forEach((t) => tagSet.add(t)));
  const uniqueTags = Array.from(tagSet).slice(0, 15); // Limit tags to keep it readable

  // Layout: courses in a circle, notes/files/tags radiate outward
  const courseCount = courses.length;
  const centerX = 500;
  const centerY = 400;
  const courseRadius = Math.max(180, courseCount * 35);

  // Place course nodes in a circle
  courses.forEach((course, i) => {
    const angle = (2 * Math.PI * i) / Math.max(courseCount, 1) - Math.PI / 2;
    const x = centerX + courseRadius * Math.cos(angle);
    const y = centerY + courseRadius * Math.sin(angle);
    const colors = COURSE_STATUS_COLORS[course.status] || COURSE_STATUS_COLORS.planned;

    nodes.push({
      id: `course-${course.id}`,
      type: "course",
      label: course.name.length > 20 ? course.name.slice(0, 20) + "..." : course.name,
      x,
      y,
      radius: 38,
      ...colors,
      metadata: {
        courseId: course.id,
        status: course.status,
        progress: course.progress,
        platform: course.platform,
        category: course.category,
      },
    });
  });

  // Place note nodes branching from their linked courses
  linkedNotes.forEach((note, i) => {
    const primaryCourseId = note.linked_course_ids[0];
    const courseNode = nodes.find((n) => n.id === `course-${primaryCourseId}`);
    if (!courseNode) return;

    // Offset from the primary course
    const courseIdx = courses.findIndex((c) => c.id === primaryCourseId);
    const baseAngle = (2 * Math.PI * courseIdx) / Math.max(courseCount, 1) - Math.PI / 2;
    const noteAngle = baseAngle + ((i % 5) - 2) * 0.3;
    const noteRadius = courseRadius + 100 + (i % 3) * 40;
    const x = centerX + noteRadius * Math.cos(noteAngle);
    const y = centerY + noteRadius * Math.sin(noteAngle);

    nodes.push({
      id: `note-${note.id}`,
      type: "note",
      label: note.title.length > 18 ? note.title.slice(0, 18) + "..." : note.title,
      x,
      y,
      radius: 28,
      ...NOTE_STYLE,
      metadata: { noteId: note.id },
    });

    // Connect note to all linked courses
    note.linked_course_ids.forEach((cid) => {
      if (courses.some((c) => c.id === cid)) {
        addEdge(`course-${cid}`, `note-${note.id}`, "course-note");
      }
    });
  });

  // Place file nodes
  courseFiles.forEach((file, i) => {
    const primaryCourseId = file.linked_entity_ids[0];
    const courseNode = nodes.find((n) => n.id === `course-${primaryCourseId}`);
    if (!courseNode) return;

    const courseIdx = courses.findIndex((c) => c.id === primaryCourseId);
    const baseAngle = (2 * Math.PI * courseIdx) / Math.max(courseCount, 1) - Math.PI / 2;
    const fileAngle = baseAngle + Math.PI + ((i % 4) - 1.5) * 0.35;
    const fileRadius = courseRadius + 80 + (i % 3) * 30;
    const x = centerX + fileRadius * Math.cos(fileAngle);
    const y = centerY + fileRadius * Math.sin(fileAngle);

    nodes.push({
      id: `file-${file.id}`,
      type: "file",
      label: file.file_name.length > 15 ? file.file_name.slice(0, 15) + "..." : file.file_name,
      x,
      y,
      radius: 20,
      ...FILE_STYLE,
      metadata: {},
    });

    file.linked_entity_ids.forEach((cid) => {
      if (courses.some((c) => c.id === cid)) {
        addEdge(`course-${cid}`, `file-${file.id}`, "course-file");
      }
    });
  });

  // Place tag nodes in an outer ring
  uniqueTags.forEach((tag, i) => {
    const angle = (2 * Math.PI * i) / Math.max(uniqueTags.length, 1);
    const tagRadius = courseRadius + 200;
    const x = centerX + tagRadius * Math.cos(angle);
    const y = centerY + tagRadius * Math.sin(angle);

    nodes.push({
      id: `tag-${tag}`,
      type: "tag",
      label: tag,
      x,
      y,
      radius: 16,
      ...TAG_STYLE,
    });

    // Connect tag to courses whose linked notes contain this tag
    courses.forEach((course) => {
      const hasTag = linkedNotes.some(
        (n) => n.linked_course_ids.includes(course.id) && n.tags?.includes(tag)
      );
      if (hasTag) {
        addEdge(`course-${course.id}`, `tag-${tag}`, "course-tag");
      }
    });
  });

  // Compute bounding box
  const allX = nodes.map((n) => n.x);
  const allY = nodes.map((n) => n.y);
  const padding = 80;
  const width = Math.max(800, (Math.max(...allX) - Math.min(...allX)) + padding * 2);
  const height = Math.max(600, (Math.max(...allY) - Math.min(...allY)) + padding * 2);

  // Offset all nodes so the bounding box starts near 0,0
  const minX = Math.min(...allX) - padding;
  const minY = Math.min(...allY) - padding;
  nodes.forEach((n) => {
    n.x -= minX;
    n.y -= minY;
  });

  return { nodes, edges, width, height };
}

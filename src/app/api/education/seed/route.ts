import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isOwner } from "@/lib/roles";

/** Python Roadmap by Data With Baraa — course + modules seed data */

const COURSE = {
  name: "Python Bootcamp 2025 — Zero to Hero (Data With Baraa)",
  platform: "YouTube" as const,
  url: "https://www.youtube.com/playlist?list=PLNcg_FV9n7qZGfFl2ANI_zISzNp257Lwn",
  progress: 0,
  status: "planned" as const,
  category: "Python" as const,
  total_hours: 13,
};

const CHAPTERS: { title: string; lessons: string[] }[] = [
  {
    title: "Chapter 1 — Introduction & Setup",
    lessons: [
      "What is Python (Visually Explained) | How It Works",
      "How to Install Python and VS Code + Roadmap",
      "Python Comments: Visually Explained",
      "Python Print Function: Visually Explained",
      "Python Variables: Visually Explained",
      "Python Input Function: Visually Explained",
    ],
  },
  {
    title: "Chapter 2 — Data Types & Basics",
    lessons: [
      "Python Data Types: Visually Explained",
      "Python String Functions | Text Manipulation & Cleaning",
      "Python Numbers Mastery | Math Functions, Round & Random",
    ],
  },
  {
    title: "Chapter 3 — Control Flow",
    lessons: [
      "Python Control Flow: Visually Explained",
      "Python Boolean Functions | bool, all, any, isinstance",
      "Python Comparison Operators (Visually Explained)",
      "Python Logical Operators | and, or, not, Execution Order",
      "Python Membership & Identity Operators | IN & IS",
      "Python If Elif Else Statements (Visually Explained)",
      "Python If-Else One Line and Match-Case",
    ],
  },
  {
    title: "Chapter 4 — Loops",
    lessons: [
      "Python For Loops (Visually Explained)",
      "Python Break vs Continue vs Pass | Control Statements",
      "Python For-Else Loop | Hidden Control Flow Trick",
      "Python Nested Loops | A Must-Have Skill for Data Engineers",
      "Python While Loops | For vs While Loops",
    ],
  },
  {
    title: "Chapter 5 — Data Structures: Lists",
    lessons: [
      "Introduction to Data Structures in Python",
      "How to Create a List in Python",
      "How to Access Lists in Python (Indexing & Slicing)",
      "Python Unpacking | Asterisk * and Underscore _",
      "How to Explore & Analyze Lists in Python",
      "How to Add, Remove, and Update Lists in Python",
      "How to Order Lists in Python | sort(), sorted(), reverse()",
      "How to Copy Python Lists Safely | Shallow Copy vs Deepcopy",
      "How to Combine Lists in Python | 4 Ways and ZIP",
      "Python Iterator vs Iterable | enumerate, map, filter",
      "Python Lambda Functions (Visually Explained)",
      "Python List Comprehension | The Cleanest Way to Code",
      "30 Python List Operations in 5 Minutes",
    ],
  },
  {
    title: "Chapter 6 — Data Structures: Tuples, Sets, Dicts",
    lessons: [
      "Python Tuples (Visually Explained)",
      "Python Sets (Visually Explained)",
      "Python Dictionaries (Visually Explained)",
      "When to Use List, Tuple, Set, Dict",
    ],
  },
  {
    title: "Chapter 7 — Functions",
    lessons: [
      "Python Functions Made Simple (Visual Explanation)",
      "Python Parameters vs Arguments (Explained Visually)",
      "Parameters vs Global vs Local Variables",
      "Positional vs Keyword Arguments | Default Parameters",
      "Python *Args and **Kwargs Finally Make Sense",
      "Python Return Vs Print()",
      "Python Functions Types | Action, Transform, Validate, Orchestrate",
      "8 Python Function Habits That Make Your Code Clean",
    ],
  },
  {
    title: "Chapter 8 — Full Course Recap",
    lessons: [
      "Python Full Course for Beginners (13 Hours) — From Zero to Hero",
    ],
  },
];

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isOwner(user.email)) {
    return NextResponse.json({ error: "Only the owner can seed courses" }, { status: 403 });
  }

  const courseId = crypto.randomUUID();
  const now = new Date().toISOString();

  const course = {
    id: courseId,
    ...COURSE,
    created_at: now,
  };

  // Build modules (chapters as section headers + individual lessons)
  const modules: { id: string; course_id: string; title: string; order: number; completed: boolean; created_at: string }[] = [];
  let order = 0;
  for (const chapter of CHAPTERS) {
    // Chapter header
    modules.push({
      id: crypto.randomUUID(),
      course_id: courseId,
      title: `📘 ${chapter.title}`,
      order: order++,
      completed: false,
      created_at: now,
    });
    // Lessons
    for (const lesson of chapter.lessons) {
      modules.push({
        id: crypto.randomUUID(),
        course_id: courseId,
        title: lesson,
        order: order++,
        completed: false,
        created_at: now,
      });
    }
  }

  // Sync course to Supabase via service role
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(url, serviceKey);
    await admin.from("courses").upsert({ ...course, user_id: user.id });
  }

  return NextResponse.json({
    success: true,
    course,
    modules,
    message: `Created course "${course.name}" with ${modules.length} modules (${CHAPTERS.length} chapters).`,
  });
}

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  // Only allow in development (Vercel has read-only filesystem)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Blog creation is only available in development mode." },
      { status: 403 }
    );
  }

  try {
    const { title, slug, description, category, content } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const date = new Date().toISOString().split("T")[0];
    const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`;

    const frontmatter = `---
title: "${title}"
date: "${date}"
description: "${description || ""}"
category: "${category || "Technology"}"
readTime: "${readTime}"
published: true
tags: []
---`;

    const fullContent = `${frontmatter}\n\n${content}`;

    const contentDir = path.join(process.cwd(), "content", "blog");
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    const filePath = path.join(contentDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, fullContent, "utf-8");

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

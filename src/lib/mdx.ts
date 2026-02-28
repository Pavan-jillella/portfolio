import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPostMeta, BlogPostFull } from "@/types";

const contentDir = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(contentDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContents);

      return {
        title: data.title || "",
        date: data.date || "",
        description: data.description || "",
        category: data.category || "",
        readTime: data.readTime || "",
        slug: filename.replace(/\.mdx$/, ""),
        published: data.published !== false,
        tags: data.tags || [],
      } as BlogPostMeta;
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPostFull | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title || "",
    date: data.date || "",
    description: data.description || "",
    category: data.category || "",
    readTime: data.readTime || "",
    slug,
    published: data.published !== false,
    tags: data.tags || [],
    content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

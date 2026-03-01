import { getAllPosts } from "@/lib/mdx";
import { BLOG_POSTS } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogFilters } from "@/components/blog/BlogFilters";

export const metadata = {
  title: "Blog | Pavan Jillella",
  description: "Thoughts on technology, education, and finance — written by Pavan Jillella.",
};

export default function BlogPage() {
  const mdxPosts = getAllPosts();
  const posts = mdxPosts.length > 0
    ? mdxPosts.map((p, i) => ({
        id: String(i + 1),
        title: p.title,
        date: p.date,
        description: p.description,
        category: p.category,
        readTime: p.readTime,
        slug: p.slug,
      }))
    : BLOG_POSTS;

  return (
    <>
      <PageHeader
        label="Blog"
        title="Writing & thinking."
        description="Thoughts on technology, education, and finance. Written to clarify my own thinking."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <BlogFilters posts={posts} />
        </div>
      </section>
    </>
  );
}

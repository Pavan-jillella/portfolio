import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx/MDXContent";
import { CommentSection } from "@/components/blog/CommentSection";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Pavan Jillella`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <FadeIn>
          <Link
            href="/blog"
            className="inline-block font-body text-sm text-white/30 hover:text-white transition-colors mb-8"
          >
            ← Back to blog
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="tag-badge px-3 py-1 rounded-full border border-white/8 bg-white/4 text-white/40 text-xs">
                {post.category}
              </span>
              <span className="font-mono text-xs text-white/25">{post.readTime}</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              {post.title}
            </h1>
            <p className="font-body text-white/40">{post.description}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="font-mono text-xs text-white/20">{post.date}</span>
              {post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-xs text-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Content */}
        <FadeIn delay={0.1}>
          <MDXContent source={post.content} />
        </FadeIn>

        {/* Comments */}
        <FadeIn delay={0.15}>
          <CommentSection slug={params.slug} />
        </FadeIn>
      </div>
    </article>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost, Vlog } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { VlogManager } from "@/components/vlogs/VlogManager";
import { useAuth } from "@/components/providers/AuthProvider";
import { isOwner } from "@/lib/roles";

type ContentTab = "articles" | "videos";

const vlogCategories = ["All", "Technology", "Education", "Finance", "Lifestyle", "Other"];

export default function BlogPage() {
  // For logged-in users, use realtime sync (can see their drafts)
  const [userPosts, setUserPosts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  // For public viewing, fetch from public API
  const [publicPosts, setPublicPosts] = useState<BlogPost[]>([]);
  const [vlogs, setVlogs] = useSupabaseRealtimeSync<Vlog>("pj-vlogs", "vlogs", []);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "videos" ? "videos" : "articles";
  const [tab, setTab] = useState<ContentTab>(initialTab);
  const [vlogCategory, setVlogCategory] = useState("All");
  const [manageMode, setManageMode] = useState(false);
  const { user } = useAuth();

  // Fetch public posts on mount (for non-logged-in users or public view)
  useEffect(() => {
    async function fetchPublicPosts() {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPublicPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch public posts:", error);
      }
    }
    fetchPublicPosts();
  }, []);

  // Use user posts if logged in and owner, otherwise use public posts
  // Merge to show all published posts
  const posts = user && isOwner(user.email)
    ? userPosts
    : publicPosts.length > 0 
      ? publicPosts 
      : userPosts.filter(p => p.published);

  const published = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredVlogs = vlogCategory === "All"
    ? vlogs
    : vlogs.filter((v) => v.category === vlogCategory);

  function addVlog(vlog: Vlog) {
    setVlogs((prev) => [vlog, ...prev]);
  }
  function editVlog(id: string, updates: Partial<Vlog>) {
    setVlogs((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  }
  function deleteVlog(id: string) {
    setVlogs((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <>
      <PageHeader
        label="Content"
        title="Writing & watching."
        description="Articles, tutorials, and video content on technology, education, and finance."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Tab switcher */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center rounded-xl border border-white/[0.06] overflow-hidden">
              {(["articles", "videos"] as ContentTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 font-body text-sm capitalize transition-all ${
                    tab === t
                      ? "bg-white/[0.08] text-white"
                      : "text-white/35 hover:text-white/50"
                  }`}
                >
                  {t}
                  <span className="ml-2 font-mono text-[10px] opacity-50">
                    {t === "articles" ? published.length : vlogs.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Articles tab */}
          <AnimatePresence mode="wait">
            {tab === "articles" && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <BlogFilters posts={published} />
              </motion.div>
            )}

            {/* Videos tab */}
            {tab === "videos" && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Video controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-wrap gap-2">
                    {vlogCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setVlogCategory(cat)}
                        className={`px-4 py-2 rounded-full border font-body text-xs transition-all duration-200 ${
                          vlogCategory === cat
                            ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                            : "border-white/8 bg-white/4 text-white/50 hover:text-white hover:border-white/15"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {user && isOwner(user.email) && (
                    <button
                      onClick={() => setManageMode(!manageMode)}
                      className={`px-4 py-2 rounded-full border font-body text-xs transition-all duration-200 ${
                        manageMode
                          ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                          : "border-white/8 bg-white/4 text-white/50 hover:text-white hover:border-white/15"
                      }`}
                    >
                      {manageMode ? "Done" : "Manage"}
                    </button>
                  )}
                </div>

                {/* Vlog Manager */}
                {manageMode && (
                  <VlogManager
                    vlogs={vlogs}
                    onAdd={addVlog}
                    onEdit={editVlog}
                    onDelete={deleteVlog}
                  />
                )}

                {/* Video grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVlogs.map((vlog) => (
                    <motion.div
                      key={vlog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-2xl overflow-hidden"
                    >
                      <YouTubeEmbed videoId={vlog.youtube_id} title={vlog.title} />
                      <div className="p-5">
                        <h3 className="font-display font-semibold text-white mb-2">{vlog.title}</h3>
                        <p className="font-body text-sm text-white/40 mb-3 line-clamp-2">{vlog.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                            {vlog.category}
                          </span>
                          <span className="font-mono text-xs text-white/20">{vlog.duration}</span>
                          <span className="font-mono text-xs text-white/20">{vlog.published_at}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredVlogs.length === 0 && (
                    <div className="col-span-2 text-center py-16">
                      <p className="font-body text-sm text-white/30">No videos in this category yet.</p>
                      {user && isOwner(user.email) && (
                        <button
                          onClick={() => setManageMode(true)}
                          className="mt-3 font-body text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Add your first video
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

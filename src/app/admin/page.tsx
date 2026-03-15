"use client";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost, Vlog } from "@/types";

export default function AdminDashboard() {
  const [posts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  const [vlogs] = useSupabaseRealtimeSync<Vlog>("pj-vlogs", "vlogs", []);
  const [habits] = useSupabaseRealtimeSync("pj-habits", "habits", []);
  const [habitLogs] = useSupabaseRealtimeSync("pj-habit-logs", "habit_logs", []);

  const publishedPosts = posts.filter((p) => p.published).length;
  const draftPosts = posts.filter((p) => !p.published).length;
  const totalVlogs = vlogs.length;
  const totalHabits = (habits as unknown[]).length;
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = (habitLogs as { date?: string }[]).filter((l) => l.date === today).length;

  const stats = [
    { label: "Published Posts", value: publishedPosts, sub: `${draftPosts} drafts` },
    { label: "Videos", value: totalVlogs, sub: "uploaded" },
    { label: "Habits", value: `${todayLogs}/${totalHabits}`, sub: "completed today" },
  ];

  const actions = [
    { title: "Write new post", description: "Create and publish blog content", href: "/blog/write" },
    { title: "Manage content", description: "Edit published posts and videos", href: "/blog" },
    { title: "View analytics", description: "Study patterns and growth metrics", href: "/dashboard/analytics" },
    { title: "Habit tracker", description: "Review streaks and daily habits", href: "/dashboard/habits" },
    { title: "Settings", description: "Account, profile, and preferences", href: "/settings" },
  ];

  return (
    <div className="max-w-4xl">
      <FadeIn>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Dashboard</h1>
        <p className="font-body text-white/40 mb-10">Overview of your website activity.</p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={0.05 * (i + 1)}>
            <div className="glass-card rounded-2xl p-6">
              <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="font-display font-bold text-3xl text-white">{stat.value}</p>
              <p className="font-body text-xs text-white/20 mt-1">{stat.sub}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block glass-card rounded-xl p-4 hover:bg-white/[0.04] transition-all"
              >
                <p className="font-body text-sm text-white">{action.title}</p>
                <p className="font-body text-xs text-white/30 mt-1">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

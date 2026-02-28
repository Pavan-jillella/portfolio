import { FadeIn } from "@/components/ui/FadeIn";

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl">
      <FadeIn>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Dashboard</h1>
        <p className="font-body text-white/40 mb-10">Overview of your website activity.</p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <FadeIn delay={0.05}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Page Views</p>
            <p className="font-display font-bold text-3xl text-white">—</p>
            <p className="font-body text-xs text-white/20 mt-1">Connect Supabase to track</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Comments</p>
            <p className="font-display font-bold text-3xl text-white">—</p>
            <p className="font-body text-xs text-white/20 mt-1">Connect Supabase to track</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Subscribers</p>
            <p className="font-display font-bold text-3xl text-white">—</p>
            <p className="font-body text-xs text-white/20 mt-1">Connect Supabase to track</p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-lg text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/blog/new" className="block glass-card rounded-xl p-4 hover:bg-glass-hover transition-all">
              <p className="font-body text-sm text-white">Create new blog post</p>
              <p className="font-body text-xs text-white/30 mt-1">Write and publish MDX content</p>
            </a>
            <a href="/admin/analytics" className="block glass-card rounded-xl p-4 hover:bg-glass-hover transition-all">
              <p className="font-body text-sm text-white">View analytics</p>
              <p className="font-body text-xs text-white/30 mt-1">See page views and visitor data</p>
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

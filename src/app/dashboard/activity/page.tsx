import { ActivityTimeline } from "@/components/activity/ActivityTimeline";

export const metadata = {
  title: "Activity — Pavan Jillella",
};

export default function ActivityPage() {
  return (
    <section className="min-h-screen py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2">Timeline</p>
          <h1 className="font-display text-3xl font-bold text-white">Activity Feed</h1>
          <p className="font-body text-sm text-white/40 mt-2">
            A unified view of study sessions, blog posts, code commits, and more.
          </p>
        </div>
        <ActivityTimeline />
      </div>
    </section>
  );
}

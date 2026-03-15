"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ActivityTimeline } from "@/components/activity/ActivityTimeline";

export default function ActivityPage() {
  return (
    <>
      <PageHeader
        compact
        label="Activity"
        title="Activity Feed"
        description="A unified view of study sessions, blog posts, code commits, and more."
      />
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <ActivityTimeline />
          </FadeIn>
        </div>
      </section>
    </>
  );
}

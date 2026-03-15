"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { PersonalAnalyticsClient } from "@/components/analytics/PersonalAnalyticsClient";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        compact
        label="Analytics"
        title="Personal Analytics"
        description="Study patterns, coding activity, and growth metrics."
      />
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <PersonalAnalyticsClient />
          </FadeIn>
        </div>
      </section>
    </>
  );
}

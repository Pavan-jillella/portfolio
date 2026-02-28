import { PersonalAnalyticsClient } from "@/components/analytics/PersonalAnalyticsClient";

export const metadata = {
  title: "Analytics — Pavan Jillella",
};

export default function AnalyticsPage() {
  return (
    <section className="min-h-screen py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2">Insights</p>
          <h1 className="font-display text-3xl font-bold text-white">Personal Analytics</h1>
          <p className="font-body text-sm text-white/40 mt-2">
            Study patterns, coding activity, and growth metrics.
          </p>
        </div>
        <PersonalAnalyticsClient />
      </div>
    </section>
  );
}

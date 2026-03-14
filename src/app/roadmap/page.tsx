import { PageHeader } from "@/components/ui/PageHeader";
import { FAANGRoadmapClient } from "@/components/roadmap/FAANGRoadmapClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Google SDE Roadmap - Focus | Pavan Jillella",
  description:
    "A structured 8-month roadmap to master Programming, Data Structures, Algorithms, System Design, and Interview Preparation.",
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        label="Preparation"
        title="Google SDE Roadmap - Focus"
        description="From Beginner to Google SDE — a structured 8-month plan to master DSA, System Design, and Interviews."
      />
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <FAANGRoadmapClient />
        </div>
      </section>
    </>
  );
}

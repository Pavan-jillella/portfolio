import { PageHeader } from "@/components/ui/PageHeader";
import { FAANGRoadmapClient } from "@/components/roadmap/FAANGRoadmapClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAANG Roadmap | Pavan Jillella",
  description:
    "A structured 8-month roadmap to master Programming, Data Structures, Algorithms, System Design, and Interview Preparation.",
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        label="Preparation"
        title="FAANG Roadmap"
        description="From Beginner to FAANG Engineer — a structured 8-month plan to master DSA, System Design, and Interviews."
      />
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <FAANGRoadmapClient />
        </div>
      </section>
    </>
  );
}

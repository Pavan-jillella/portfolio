import { RoadmapClientV2 } from "@/components/roadmap/RoadmapClientV2";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Google SDE Roadmap | Pavan Jillella",
  description:
    "A structured 8-month roadmap to master Programming, Data Structures, Algorithms, System Design, and Interview Preparation.",
};

export default function RoadmapPage() {
  return (
    <section className="px-4 md:px-6 pt-20 md:pt-24 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto">
        <RoadmapClientV2 />
      </div>
    </section>
  );
}

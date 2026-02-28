import { PageHeader } from "@/components/ui/PageHeader";
import { EducationDashboardClient } from "@/components/education/dashboard/EducationDashboardClient";

export const metadata = {
  title: "Education Dashboard | Pavan Jillella",
  description: "Track study sessions, courses, projects, notes, and more.",
};

export default function EducationDashboardPage() {
  return (
    <>
      <PageHeader
        label="Dashboard"
        title="Education Dashboard"
        description="Track your learning progress, manage projects, and organize notes."
      />
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <EducationDashboardClient />
        </div>
      </section>
    </>
  );
}

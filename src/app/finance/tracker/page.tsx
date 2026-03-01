import { PageHeader } from "@/components/ui/PageHeader";
import { FinanceTrackerClient } from "@/components/finance/FinanceTrackerClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Budget Tracker | Pavan Jillella",
  description: "Personal budgeting tool with expense tracking, savings goals, and smart recommendations.",
};

export default function FinanceTrackerPage() {
  return (
    <>
      <PageHeader
        label="Finance / Tracker"
        title="Budget tracker."
        description="Track spending, set category budgets, and monitor savings goals. Data is stored locally in your browser."
      />
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <FinanceTrackerClient />
        </div>
      </section>
    </>
  );
}

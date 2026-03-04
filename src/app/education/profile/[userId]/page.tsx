import { PublicLearningProfile } from "@/components/education/PublicLearningProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return {
    title: "Learning Profile | Pavan Jillella",
    description: `Public learning profile for user ${userId.slice(0, 8)}`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <PublicLearningProfile userId={userId} />
      </div>
    </div>
  );
}

import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoHeroCell } from "@/components/bento/BentoHeroCell";
import { BentoGitHubCell } from "@/components/bento/BentoGitHubCell";
import { BentoLeetCodeCell } from "@/components/bento/BentoLeetCodeCell";
import { BentoLatestBlogCell } from "@/components/bento/BentoLatestBlogCell";
import { BentoTechStackCell } from "@/components/bento/BentoTechStackCell";
import { BentoFeaturedProjectsCell } from "@/components/bento/BentoFeaturedProjectsCell";
import { BentoAboutCell } from "@/components/bento/BentoAboutCell";
import { BentoContactCell } from "@/components/bento/BentoContactCell";
import { BentoStatusCell } from "@/components/bento/BentoStatusCell";
import { BentoClockCell } from "@/components/bento/BentoClockCell";
import { BentoHighlightsCell } from "@/components/bento/BentoHighlightsCell";

export default function Home() {
  return (
    <section className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <BentoGrid>
          {/* Row 1-2: Hero (2x2) + GitHub + LeetCode */}
          <BentoHeroCell />
          <BentoGitHubCell />
          <BentoLeetCodeCell />

          {/* Row 2 right: Blog + Tech Stack */}
          <BentoLatestBlogCell />
          <BentoTechStackCell />

          {/* Row 3: Projects (2 wide) + Status + Clock */}
          <BentoFeaturedProjectsCell />
          <BentoStatusCell />
          <BentoClockCell />

          {/* Row 4: Highlights (2 wide) + About (2 wide) */}
          <BentoHighlightsCell />
          <BentoAboutCell />

          {/* Row 5: Contact (full width) */}
          <BentoContactCell />
        </BentoGrid>
      </div>
    </section>
  );
}

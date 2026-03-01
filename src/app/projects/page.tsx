import { PROJECTS } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectFilters } from "@/components/projects/ProjectFilters";

export const metadata = {
  title: "Projects | Pavan Jillella",
  description: "Open source projects and tools built by Pavan Jillella.",
};

async function getGitHubRepos() {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      "https://api.github.com/users/Pavan-jillella/repos?per_page=100&type=owner&sort=stars&direction=desc",
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const repos = await res.json();
    return Array.isArray(repos) ? repos.slice(0, 6) : null;
  } catch {
    return null;
  }
}

export default async function ProjectsPage() {
  const repos = await getGitHubRepos();
  const useGitHub = repos && repos.length > 0;

  const projects = useGitHub
    ? repos.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description || "No description",
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || "Unknown",
        url: r.html_url,
        topics: r.topics || [],
      }))
    : PROJECTS;

  return (
    <>
      <PageHeader
        label="Projects"
        title="Things I've built."
        description="Open source tools, libraries, and applications. Most are built to scratch my own itch."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {useGitHub && (
            <FadeIn>
              <p className="font-mono text-xs text-white/20 mb-8">Live from GitHub</p>
            </FadeIn>
          )}

          <ProjectFilters projects={projects} />
        </div>
      </section>
    </>
  );
}

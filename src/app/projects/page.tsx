import { PROJECTS } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project: any, i: number) => (
              <FadeIn key={project.id} delay={i * 0.05}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-card rounded-2xl p-6 hover:bg-white/[0.02] hover:border-white/15 transition-all duration-300 group h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {project.name}
                    </h3>
                    <span className="font-mono text-xs text-white/20 shrink-0 ml-3">{project.language}</span>
                  </div>
                  <p className="font-body text-sm text-white/40 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/30">
                      ★ {project.stars}
                    </span>
                    <span className="font-mono text-xs text-white/30">
                      ⑂ {project.forks}
                    </span>
                  </div>
                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.topics.slice(0, 4).map((topic: string) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-xs text-white/20"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

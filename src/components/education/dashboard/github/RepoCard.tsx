"use client";
import { GitHubRepo } from "@/types";
import { GITHUB_LANGUAGE_COLORS } from "@/lib/constants";

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  const langColor = repo.language ? GITHUB_LANGUAGE_COLORS[repo.language] || GITHUB_LANGUAGE_COLORS.Other : "#6b7280";

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card rounded-2xl p-5 block hover:border-white/10 transition-all group"
    >
      <h4 className="font-display font-semibold text-sm text-white group-hover:text-blue-300 transition-colors truncate mb-1">
        {repo.name}
      </h4>
      {repo.description && (
        <p className="font-body text-xs text-white/40 line-clamp-2 mb-3">{repo.description}</p>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            <span className="font-mono text-[10px] text-white/40">{repo.language}</span>
          </div>
        )}
        {repo.stargazers_count > 0 && (
          <span className="font-mono text-[10px] text-white/30">
            <svg className="w-3 h-3 inline-block mr-0.5 -mt-0.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="font-mono text-[10px] text-white/30">
            <svg className="w-3 h-3 inline-block mr-0.5 -mt-0.5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
            {repo.forks_count}
          </span>
        )}
      </div>
    </a>
  );
}

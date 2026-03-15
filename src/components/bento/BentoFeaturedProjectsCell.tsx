"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { bentoItem } from "./BentoGrid";

interface PublicProject {
  id: string;
  name: string;
  description: string;
  language: string;
  url: string;
  stars: number;
  forks: number;
  topics: string[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-400",
  Go: "bg-cyan-400",
  Rust: "bg-orange-400",
  Java: "bg-red-400",
};

export function BentoFeaturedProjectsCell() {
  const { data } = useQuery({
    queryKey: ["public-homepage"],
    queryFn: async () => {
      const res = await fetch("/api/public");
      if (!res.ok) return { posts: [], projects: [] };
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const featured: PublicProject[] = (data?.projects ?? []).slice(0, 3);

  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-violet bento-card-shine col-span-1 md:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-section-projects" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Featured Projects</span>
        </div>
        <Link
          href="/projects"
          className="font-body text-xs text-white/30 hover:text-white/60 transition-colors group"
        >
          View all <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      {featured.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {featured.map((project) => (
            <motion.a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-section-projects/20 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${LANG_COLORS[project.language] || "bg-white/30"}`} />
                <span className="font-mono text-[10px] text-white/30">{project.language}</span>
              </div>
              <h4 className="font-display font-semibold text-sm text-white mb-1 group-hover:text-section-projects transition-colors">
                {project.name}
              </h4>
              <p className="font-body text-xs text-white/30 line-clamp-2">
                {project.description}
              </p>
              {(project.stars > 0 || project.forks > 0) && (
                <div className="flex items-center gap-3 mt-3 font-mono text-[10px] text-white/20">
                  {project.stars > 0 && <span>★ {project.stars}</span>}
                  {project.forks > 0 && <span>⑂ {project.forks}</span>}
                </div>
              )}
            </motion.a>
          ))}
        </motion.div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="font-body text-sm text-white/30">No projects yet</p>
        </div>
      )}
    </motion.div>
  );
}

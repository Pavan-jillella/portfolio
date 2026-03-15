"use client";
import { motion } from "framer-motion";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { AnimatedCounter } from "./AnimatedCounter";
import { bentoItem } from "./BentoGrid";

export function BentoGitHubCell() {
  const { data, isLoading, isError } = useGitHubData("Pavan-jillella");

  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-violet bento-card-shine flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-section-projects" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">GitHub</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
          <div className="flex gap-6 mt-2">
            <div className="h-6 w-12 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-12 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center">
          <p className="font-body text-sm text-white/30">Unable to load stats</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <AnimatedCounter
              target={data?.stats?.totalRepos ?? 0}
              className="font-display font-bold text-3xl text-white"
            />
            <p className="font-body text-sm text-white/40">Public repos</p>
          </div>
          <div className="flex gap-6">
            <div>
              <AnimatedCounter
                target={data?.stats?.totalStars ?? 0}
                className="font-display font-semibold text-lg text-white"
              />
              <p className="font-mono text-[10px] text-white/30 uppercase">Stars</p>
            </div>
            <div>
              <AnimatedCounter
                target={data?.stats?.totalForks ?? 0}
                className="font-display font-semibold text-lg text-white"
              />
              <p className="font-mono text-[10px] text-white/30 uppercase">Forks</p>
            </div>
          </div>
          {/* Top languages mini bar */}
          {data?.languages && data.languages.length > 0 && (() => {
            const total = data.languages.reduce((s, l) => s + l.count, 0);
            return (
              <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                {data.languages.slice(0, 4).map((lang) => (
                  <motion.div
                    key={lang.language}
                    initial={{ width: 0 }}
                    animate={{ width: `${(lang.count / total) * 100}%` }}
                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: lang.color || "#8b5cf6" }}
                    title={`${lang.language}: ${((lang.count / total) * 100).toFixed(1)}%`}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </motion.div>
  );
}

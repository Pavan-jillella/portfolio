"use client";
import { motion } from "framer-motion";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { AnimatedCounter } from "./AnimatedCounter";
import { bentoItem } from "./BentoGrid";

export function BentoLeetCodeCell() {
  const { data, isLoading, isError } = useLeetCodeData("pavanjillella");

  const difficulties = data
    ? [
        { label: "Easy", count: data.easy, total: data.totalEasy, color: "bg-emerald-400", barColor: "#34d399" },
        { label: "Med", count: data.medium, total: data.totalMedium, color: "bg-amber-400", barColor: "#fbbf24" },
        { label: "Hard", count: data.hard, total: data.totalHard, color: "bg-red-400", barColor: "#f87171" },
      ]
    : [];

  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-orange bento-card-shine flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-section-blog" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.842.69c.656.537 1.594.43 2.126-.217a1.476 1.476 0 0 0-.22-2.12l-.841-.69c-2.105-1.72-5.23-1.614-7.198.269l-1.121 1.2-.257-.274 5.267-5.643A1.386 1.386 0 0 0 13.483 0z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">LeetCode</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-8 w-16 bg-white/5 rounded-lg animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 w-full bg-white/5 rounded animate-pulse" />
            ))}
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
              target={data?.solved ?? 0}
              className="font-display font-bold text-3xl text-white"
            />
            <p className="font-body text-sm text-white/40">Problems solved</p>
          </div>
          <div className="space-y-2.5">
            {difficulties.map((d, i) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white/30 w-7">{d.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: d.total ? `${(d.count / d.total) * 100}%` : "0%" }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.barColor }}
                  />
                </div>
                <span className="font-mono text-[10px] text-white/40 w-14 text-right">
                  {d.count}/{d.total}
                </span>
              </div>
            ))}
          </div>
          {data?.ranking && (
            <p className="font-mono text-[10px] text-white/20">
              Rank #{data.ranking.toLocaleString()}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

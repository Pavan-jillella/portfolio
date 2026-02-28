"use client";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Vlog } from "@/types";
import { VLOGS as DEFAULT_VLOGS } from "@/lib/vlogs";
import Image from "next/image";

export function VlogSection() {
  const [vlogs] = useLocalStorage<Vlog[]>("pj-vlogs", DEFAULT_VLOGS);
  const latestVlog = vlogs[0];

  if (!latestVlog) return null;

  return (
    <section id="vlogs" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <FadeIn className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="section-label block mb-4">Latest vlog</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">
              On camera, on purpose.
            </h2>
          </div>
          <Link
            href="/vlogs"
            className="font-body text-sm text-white/30 hover:text-blue-400 transition-colors shrink-0"
          >
            All vlogs →
          </Link>
        </FadeIn>

        {/* Cinematic video card */}
        <FadeIn delay={0.15}>
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            className="glass-card rounded-4xl overflow-hidden group cursor-pointer"
          >
            {/* Thumbnail with play */}
            <div className="relative aspect-video bg-charcoal-800">
              <Image
                src={`https://img.youtube.com/vi/${latestVlog.youtubeId}/maxresdefault.jpg`}
                alt={latestVlog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div className="p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="tag-badge px-3 py-1 rounded-full border text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                    {latestVlog.category}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-white mb-2 leading-snug">
                  {latestVlog.title}
                </h3>
                <p className="font-body text-sm text-white/40">
                  {latestVlog.publishedAt} · {latestVlog.duration}
                </p>
              </div>

              <Link href="/vlogs" className="shrink-0">
                <span className="font-body text-sm text-white/30 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  View all vlogs
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

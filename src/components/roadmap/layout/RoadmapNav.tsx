"use client";

import { cn } from "@/lib/utils";
import { RoadmapView } from "@/types";
import { motion } from "framer-motion";
import { Target, Map, Swords, BookOpen } from "lucide-react";

interface RoadmapNavProps {
  currentView: RoadmapView;
  onViewChange: (view: RoadmapView) => void;
  className?: string;
}

const navItems: { id: RoadmapView; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: "today", label: "Today", shortLabel: "Today", icon: <Target className="w-5 h-5" /> },
  { id: "journey", label: "Journey", shortLabel: "Journey", icon: <Map className="w-5 h-5" /> },
  { id: "practice", label: "Practice", shortLabel: "Practice", icon: <Swords className="w-5 h-5" /> },
  { id: "resources", label: "Resources", shortLabel: "Learn", icon: <BookOpen className="w-5 h-5" /> },
];

export function RoadmapNav({ currentView, onViewChange, className }: RoadmapNavProps) {
  return (
    <>
      {/* Desktop Navigation - Top tabs */}
      <nav className={cn("hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10", className)}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
              currentView === item.id
                ? "text-white"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            )}
          >
            {currentView === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg border border-emerald-500/30 pointer-events-none"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.icon}</span>
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile Navigation - Bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal-900/95 backdrop-blur-xl border-t border-white/10 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[72px]",
                currentView === item.id
                  ? "text-emerald-400"
                  : "text-white/60"
              )}
            >
              {currentView === item.id && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-emerald-500/10 rounded-xl pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 text-xs font-medium">{item.shortLabel}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default RoadmapNav;

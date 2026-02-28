"use client";
import { SpendingRecommendation } from "@/types";

interface RecommendationsProps {
  recommendations: SpendingRecommendation[];
}

const severityConfig = {
  info: { border: "border-blue-500/20", bg: "bg-blue-500/5", text: "text-blue-400", icon: "i" },
  warning: { border: "border-yellow-500/20", bg: "bg-yellow-500/5", text: "text-yellow-400", icon: "!" },
  danger: { border: "border-red-500/20", bg: "bg-red-500/5", text: "text-red-400", icon: "!!" },
};

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-body text-sm text-white/50">Your spending looks healthy this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recommendations.map((rec, i) => {
        const config = severityConfig[rec.severity];
        return (
          <div key={i} className={`glass-card rounded-2xl p-4 border-l-2 ${config.border} ${config.bg}`}>
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                <span className={`font-mono text-xs font-bold ${config.text}`}>{config.icon}</span>
              </div>
              <p className="font-body text-sm text-white/60">{rec.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

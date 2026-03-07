"use client";
import { motion, useReducedMotion } from "framer-motion";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  completed?: boolean;
}

export function ProgressRing({ progress, size = 48, strokeWidth = 3, completed = false }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        perspective: prefersReduced ? undefined : "600px",
      }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={prefersReduced ? undefined : { transform: "rotateX(12deg) rotate(-90deg)" }}
      >
        <defs>
          <filter id={`ringGlow-${size}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>
        {/* Shadow ring behind */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={strokeWidth + 1}
          transform="translate(0, 2)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={completed ? "#10b981" : "#3b82f6"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          filter={`url(#ringGlow-${size})`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/60">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

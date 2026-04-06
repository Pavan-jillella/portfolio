"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreakFlameProps {
  streak: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function StreakFlame({ streak, className, size = "md", showLabel = true }: StreakFlameProps) {
  const isActive = streak > 0;
  
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };
  
  const containerSizes = {
    sm: "px-2 py-1",
    md: "px-3 py-1.5",
    lg: "px-4 py-2",
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        isActive 
          ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30" 
          : "bg-white/5 border border-white/10",
        containerSizes[size],
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.span
        className={cn(sizeClasses[size], isActive ? "animate-flame" : "grayscale opacity-50")}
        animate={isActive ? {
          scale: [1, 1.1, 1],
          rotate: [-2, 2, -2],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        🔥
      </motion.span>
      
      {showLabel && (
        <span className={cn(
          "font-bold",
          isActive ? "text-orange-400" : "text-white/40",
          size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
        )}>
          {streak}
        </span>
      )}
    </motion.div>
  );
}

export default StreakFlame;

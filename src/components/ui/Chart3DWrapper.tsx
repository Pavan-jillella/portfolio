"use client";
import { ReactNode, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CHART_3D } from "@/lib/chart-3d-utils";

interface Chart3DWrapperProps {
  children: ReactNode;
  tiltX?: number;
  tiltY?: number;
  perspective?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Wraps a chart with CSS 3D perspective + framer-motion animated tilt.
 * - Animates from flat → tilted on mount
 * - Flattens on hover for readability
 * - Respects `prefers-reduced-motion`
 */
export function Chart3DWrapper({
  children,
  tiltX = CHART_3D.tiltX,
  tiltY = CHART_3D.tiltY,
  perspective = CHART_3D.perspective,
  className = "",
  disabled = false,
}: Chart3DWrapperProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // No 3D if reduced motion or explicitly disabled
  if (prefersReduced || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateX: 0, rotateY: 0 }}
        animate={{ rotateX: tiltX, rotateY: tiltY }}
        whileHover={{ rotateX: 0, rotateY: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

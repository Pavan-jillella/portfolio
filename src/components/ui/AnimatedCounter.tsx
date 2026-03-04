"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  decimals,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const started = useRef(false);

  const dp = decimals ?? (Number.isInteger(target) ? 0 : 1);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    let rafId: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      const value = eased * target;
      setCount(dp === 0 ? Math.round(value) : parseFloat(value.toFixed(dp)));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration, dp]);

  const display = dp === 0 ? count.toLocaleString() : count.toFixed(dp);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

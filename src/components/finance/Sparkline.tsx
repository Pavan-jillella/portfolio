"use client";
import { useState, useId } from "react";
import { usePriceHistory } from "@/hooks/queries/usePriceHistory";
import { PriceHistoryRange } from "@/types";

// ===== Pure SVG Sparkline =====

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color,
  fillOpacity = 0.1,
}: SparklineProps) {
  const gradId = useId();

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = color || (isPositive ? "#34d399" : "#f87171");

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return [x, y] as const;
  });

  const linePath = "M" + points.map(([x, y]) => `${x},${y}`).join(" L");
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
        <filter id={`${gradId}-glow`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" filter={`url(#${gradId}-glow)`} />
    </svg>
  );
}

// ===== PriceSparkline (data-fetching wrapper) =====

const RANGES: PriceHistoryRange[] = ["1D", "1W", "1M", "1Y"];

interface PriceSparklineProps {
  symbol: string;
  defaultRange?: PriceHistoryRange;
}

export function PriceSparkline({ symbol, defaultRange = "1M" }: PriceSparklineProps) {
  const [range, setRange] = useState<PriceHistoryRange>(defaultRange);
  const { data, isLoading } = usePriceHistory(symbol, range);

  const prices = data?.points.map((p) => p.price) || [];

  return (
    <div className="flex flex-col items-end gap-1">
      {isLoading ? (
        <div className="w-[120px] h-[32px] bg-white/4 rounded animate-pulse" />
      ) : (
        <Sparkline data={prices} />
      )}
      <div className="flex gap-0.5">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={(e) => {
              e.stopPropagation();
              setRange(r);
            }}
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
              range === r ? "bg-white/10 text-white/70" : "text-white/20 hover:text-white/40"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

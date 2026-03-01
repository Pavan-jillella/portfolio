"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface StudyBarChartProps {
  data: { date: string; minutes: number }[];
}

export function StudyBarChart({ data }: StudyBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);
  const chartWidth = 600;
  const chartHeight = 250;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 30;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const barWidth = Math.min(plotWidth / data.length - 8, 40);
  const barGap = (plotWidth - barWidth * data.length) / (data.length + 1);

  const dayLabels = data.map((d) => {
    const date = new Date(d.date + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  // Y-axis: compute nice tick values in hours
  const maxHours = Math.ceil(maxMinutes / 60);
  const yTicks: number[] = [];
  const tickStep = maxHours <= 2 ? 0.5 : maxHours <= 5 ? 1 : maxHours <= 10 ? 2 : Math.ceil(maxHours / 5);
  for (let v = 0; v <= maxHours; v += tickStep) {
    yTicks.push(v);
  }

  function yPos(minutes: number): number {
    return paddingTop + plotHeight - (minutes / maxMinutes) * plotHeight;
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Daily Study Time</h3>
      <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines and labels */}
        {yTicks.map((tick) => {
          const y = yPos(tick * 60);
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.05"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="font-mono"
                fill="currentColor"
                fillOpacity="0.25"
                fontSize="10"
              >
                {tick % 1 === 0 ? `${tick}h` : `${tick}h`}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = paddingLeft + barGap + i * (barWidth + barGap);
          const barHeight = (d.minutes / maxMinutes) * plotHeight;
          const y = paddingTop + plotHeight - barHeight;
          const hours = Math.floor(d.minutes / 60);
          const mins = d.minutes % 60;
          const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

          return (
            <g
              key={d.date}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              {/* Bar */}
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 0)}
                rx={4}
                ry={4}
                fill="url(#barGradient)"
                initial={{ height: 0, y: paddingTop + plotHeight }}
                animate={{ height: Math.max(barHeight, 0), y }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />

              {/* Hover tooltip */}
              {hoveredIndex === i && d.minutes > 0 && (
                <g>
                  <rect
                    x={x + barWidth / 2 - 28}
                    y={y - 22}
                    width={56}
                    height={18}
                    rx={4}
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    className="font-mono"
                    fill="currentColor"
                    fillOpacity="0.8"
                    fontSize="10"
                  >
                    {label}
                  </text>
                </g>
              )}

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                className="font-mono"
                fill="currentColor"
                fillOpacity="0.25"
                fontSize="10"
              >
                {dayLabels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

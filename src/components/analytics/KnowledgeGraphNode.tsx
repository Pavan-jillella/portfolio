"use client";

interface KnowledgeGraphNodeProps {
  x: number;
  y: number;
  label: string;
  entityType: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  course: "#06b6d4",   // cyan
  note: "#a855f7",     // purple
  project: "#10b981",  // emerald
  blog: "#3b82f6",     // blue
};

export function KnowledgeGraphNode({
  x,
  y,
  label,
  entityType,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: KnowledgeGraphNodeProps) {
  const color = TYPE_COLORS[entityType] || "#6b7280";
  const radius = isHovered ? 8 : 5;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="cursor-pointer"
    >
      <circle
        r={radius}
        fill={color}
        opacity={isHovered ? 1 : 0.7}
        className="transition-all duration-200"
      />
      {isHovered && (
        <>
          <circle r={radius + 3} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
          <text
            y={-12}
            textAnchor="middle"
            fill="white"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            opacity={0.8}
          >
            {label.length > 30 ? label.slice(0, 30) + "..." : label}
          </text>
          <text
            y={16}
            textAnchor="middle"
            fill={color}
            fontSize={8}
            fontFamily="JetBrains Mono, monospace"
            opacity={0.6}
          >
            {entityType}
          </text>
        </>
      )}
    </g>
  );
}

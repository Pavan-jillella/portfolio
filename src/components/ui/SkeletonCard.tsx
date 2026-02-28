interface SkeletonCardProps {
  rows?: number;
  height?: string;
}

export function SkeletonCard({ rows = 2, height = "h-20" }: SkeletonCardProps) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${height} animate-pulse`}>
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`rounded bg-white/[0.06] ${i === 0 ? "h-3 w-1/2" : "h-5 w-3/4"}`}
          />
        ))}
      </div>
    </div>
  );
}

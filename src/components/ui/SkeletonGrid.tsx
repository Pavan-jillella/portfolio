import { SkeletonCard } from "./SkeletonCard";

interface SkeletonGridProps {
  count?: number;
  columns?: string;
  rows?: number;
  height?: string;
}

export function SkeletonGrid({ count = 4, columns = "grid-cols-2 lg:grid-cols-4", rows = 2, height = "h-20" }: SkeletonGridProps) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} rows={rows} height={height} />
      ))}
    </div>
  );
}

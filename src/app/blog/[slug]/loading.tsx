export default function BlogPostLoading() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-4 w-24 bg-white/5 rounded mb-8" />
        <div className="flex gap-3 mb-4">
          <div className="h-6 w-20 bg-white/5 rounded-full" />
          <div className="h-6 w-16 bg-white/5 rounded" />
        </div>
        <div className="h-10 w-full bg-white/5 rounded mb-4" />
        <div className="h-5 w-3/4 bg-white/5 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 w-full bg-white/5 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

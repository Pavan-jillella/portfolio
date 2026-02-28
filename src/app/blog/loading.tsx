export default function BlogLoading() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4 mb-16">
          <div className="h-4 w-16 bg-white/5 rounded" />
          <div className="h-10 w-64 bg-white/5 rounded" />
          <div className="h-5 w-96 bg-white/5 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-5 w-3/4 bg-white/5 rounded mb-3" />
              <div className="h-4 w-full bg-white/5 rounded mb-3" />
              <div className="flex gap-3">
                <div className="h-3 w-20 bg-white/5 rounded" />
                <div className="h-3 w-16 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

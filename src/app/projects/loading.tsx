export default function ProjectsLoading() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4 mb-16">
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-10 w-56 bg-white/5 rounded" />
          <div className="h-5 w-96 bg-white/5 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-5 w-32 bg-white/5 rounded mb-3" />
              <div className="h-4 w-full bg-white/5 rounded mb-4" />
              <div className="flex gap-4">
                <div className="h-3 w-12 bg-white/5 rounded" />
                <div className="h-3 w-12 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

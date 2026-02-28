export default function VlogsLoading() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4 mb-16">
          <div className="h-4 w-16 bg-white/5 rounded" />
          <div className="h-10 w-48 bg-white/5 rounded" />
          <div className="h-5 w-80 bg-white/5 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="flex gap-3">
                  <div className="h-3 w-16 bg-white/5 rounded" />
                  <div className="h-3 w-12 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Deep ambient glow — subtler */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-blue-600/[0.03] blur-[140px]" />

      {/* Blue/cyan blob — top left */}
      <div className="blob-1 absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-600/[0.06] to-cyan-500/[0.03] blur-[100px]" />

      {/* Warm amber blob — bottom right */}
      <div className="blob-2 absolute bottom-[15%] right-[10%] w-[450px] h-[350px] rounded-full bg-gradient-to-br from-amber-500/[0.04] to-orange-400/[0.02] blur-[100px]" />
    </div>
  );
}

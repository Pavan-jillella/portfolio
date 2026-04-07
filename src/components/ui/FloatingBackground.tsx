export function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Subtle warm ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gold/[0.04] blur-[180px]" />

      {/* Gold/cream blob — top left */}
      <div className="blob-1 absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gold/[0.06] to-cream-warm/[0.04] blur-[120px]" />

      {/* Sage green blob — bottom right */}
      <div className="blob-2 absolute bottom-[15%] right-[10%] w-[450px] h-[350px] rounded-full bg-gradient-to-br from-sage/[0.05] to-taupe/[0.03] blur-[120px]" />
    </div>
  );
}

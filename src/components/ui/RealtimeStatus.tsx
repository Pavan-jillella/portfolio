interface RealtimeStatusProps {
  isConnected: boolean;
}

export function RealtimeStatus({ isConnected }: RealtimeStatusProps) {
  return (
    <div className="flex items-center gap-1.5" title={isConnected ? "Real-time sync active" : "Local only"}>
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
        }`}
      />
      <span className="font-mono text-[10px] text-white/20">
        {isConnected ? "Live" : "Local"}
      </span>
    </div>
  );
}

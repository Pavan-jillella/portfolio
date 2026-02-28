export function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Deep ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-blue-600/5 blur-[120px]" />
      
      {/* Floating blobs */}
      <div className="blob-1 absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-600/8 to-cyan-500/4 blur-[80px]" />
      <div className="blob-2 absolute top-[40%] right-[8%] w-[500px] h-[350px] rounded-full bg-gradient-to-br from-indigo-600/6 to-blue-400/4 blur-[100px]" />
      <div className="blob-3 absolute bottom-[20%] left-[20%] w-[350px] h-[450px] rounded-full bg-gradient-to-br from-cyan-600/5 to-blue-500/3 blur-[90px]" />
      <div className="blob-4 absolute top-[70%] right-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/6 to-indigo-400/3 blur-[70px]" />
    </div>
  );
}

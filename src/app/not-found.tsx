import Link from "next/link";

export const metadata = {
  title: "404 | Pavan Jillella",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-sm text-blue-400 uppercase tracking-widest mb-4">404</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
          Page not found
        </h1>
        <p className="font-body text-white/40 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="glass-card px-6 py-3 rounded-full font-body text-sm text-white/80 hover:text-white transition-all duration-200 hover:border-blue-500/30"
        >
          Back to home →
        </Link>
      </div>
    </section>
  );
}

"use client";
import { useVisibility } from "@/hooks/useVisibility";
import { SectionKey } from "@/lib/visibility";

interface PrivateSectionProps {
  sectionKey: SectionKey;
  children: React.ReactNode;
  label?: string;
}

export function PrivateSection({ sectionKey, children, label }: PrivateSectionProps) {
  const { isVisible } = useVisibility();

  if (!isVisible(sectionKey)) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <svg className="w-8 h-8 text-white/10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="font-body text-sm text-white/20">
          {label || "This section"} is set to private
        </p>
        <p className="font-mono text-[10px] text-white/10 mt-1">
          Toggle visibility in settings
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

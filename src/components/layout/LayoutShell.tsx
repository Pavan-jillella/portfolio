"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CommandPalette } from "@/components/search/CommandPalette";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/sections/Footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalPage = pathname === "/login" || pathname === "/blog/write" || pathname === "/terms" || pathname === "/privacy";

  return (
    <>
      {!isMinimalPage && <Navbar />}
      <main className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>
      {!isMinimalPage && <Footer />}
      {!isMinimalPage && (
        <>
          <ChatWidget />
          <CommandPalette />
        </>
      )}
    </>
  );
}

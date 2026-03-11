"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CommandPalette } from "@/components/search/CommandPalette";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalPage = pathname === "/login" || pathname === "/blog/write" || pathname === "/terms" || pathname === "/privacy";

  return (
    <>
      {!isMinimalPage && <Navbar />}
      <main className="relative z-10 page-transition">{children}</main>
      {!isMinimalPage && (
        <>
          <ChatWidget />
          <CommandPalette />
        </>
      )}
    </>
  );
}

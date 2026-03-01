"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CommandPalette } from "@/components/search/CommandPalette";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <main className="relative z-10 page-transition">{children}</main>
      {!isLoginPage && (
        <>
          <ChatWidget />
          <CommandPalette />
        </>
      )}
    </>
  );
}

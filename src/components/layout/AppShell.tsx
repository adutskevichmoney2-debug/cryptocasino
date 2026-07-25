"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/modals/AuthModal";
import { WalletModal } from "@/components/modals/WalletModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { Toaster } from "@/components/ui/Toaster";
import { CookieBanner } from "@/components/misc/CookieBanner";
import { AgeGate } from "@/components/misc/AgeGate";
import { SplashScreen } from "@/components/misc/SplashScreen";
import { ChatWidget } from "@/components/support/ChatWidget";
import { useUi } from "@/lib/stores/ui";
import { useHasMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUi((s) => s.sidebarCollapsed);
  const mounted = useHasMounted();

  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-dvh flex-col transition-[padding] duration-300",
          mounted && sidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-[240px]",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      >
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <Footer />
      </div>

      <MobileNav />
      <AuthModal />
      <WalletModal />
      <SearchModal />
      <ChatWidget />
      <Toaster />
      <CookieBanner />
      <AgeGate />
      <SplashScreen />
    </div>
  );
}

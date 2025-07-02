'use client'

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarConsole } from "@/components/app-sidebar-console"

export default function ConsolePage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <AppSidebarConsole />
        <div className="relative min-h-screen w-full">
          <SidebarTrigger className="absolute left-1 top-1 z-50" />
          <main className="h-full">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

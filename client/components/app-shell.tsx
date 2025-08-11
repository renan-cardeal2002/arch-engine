"use client"

import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {isLogin ? (
        <main className="min-h-screen w-full flex items-center justify-center">{children}</main>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <div className="relative min-h-screen w-full">
            <SidebarTrigger className="absolute left-1 top-1 z-50" />
            <main className="h-full">{children}</main>
          </div>
        </SidebarProvider>
      )}
    </ThemeProvider>
  )
}

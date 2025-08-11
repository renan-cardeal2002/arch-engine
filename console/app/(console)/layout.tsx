import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative min-h-screen w-full">
        <SidebarTrigger className="absolute left-1 top-1 z-50" />
        <main className="h-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}

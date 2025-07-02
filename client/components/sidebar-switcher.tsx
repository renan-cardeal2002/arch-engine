"use client";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

export function SidebarSwitcher() {
  const pathname = usePathname();
  if (pathname.startsWith("/console")) {
    return null;
  }
  return <AppSidebar />;
}

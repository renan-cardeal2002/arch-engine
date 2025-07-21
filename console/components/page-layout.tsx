"use client";

import AppBreadcrumb from "@/components/app-breadcrumb";
import { ReactNode } from "react";

export default function PageLayout({
  children,
  actions,
}: {
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto border-b border-t mt-10">
      <div className="p-8">
        <AppBreadcrumb />
      </div>
      {actions && <div className="flex justify-end pe-8">{actions}</div>}
      {children}
    </div>
  );
}

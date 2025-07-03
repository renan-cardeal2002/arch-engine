'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useBreadcrumb } from "./breadcrumb-provider";

export default function AppBreadcrumb() {
  const { items } = useBreadcrumb();
  
  if (!items.length) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
      {items.map((item: any, idx: number) => (
        <span key={item.href || item.label} className="flex items-center">
          {idx > 0 && (
            <ChevronRight className="mx-2" size={16} />
          )}
          {item.href ? (
            <Link href={item.href} className="hover:border-b transition">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

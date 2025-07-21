'use client'

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { useEffect } from "react";

export default function WorkloadsPage() {
   const { setItems } = useBreadcrumb();
   
   useEffect(() => {
      setItems([
      { label: "Home", href: "/" },
      { label: "Cargas de trabalho" },
      ]);
   }, [setItems]);
   
   return <PageLayout />
}
'use client'

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { useEffect } from "react";

export default function SchedulesPage() {
   const { setItems } = useBreadcrumb();
   
   useEffect(() => {
      setItems([
      { label: "Home", href: "/" },
      { label: "Agendamentos" },
      ]);
   }, [setItems]);
   
   return <PageLayout />
}
'use client'

import AppBreadcrumb from "@/components/app-breadcrumb";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import { useEffect } from "react";

export default function WorkloadsPage() {
   const { setItems } = useBreadcrumb();
   
   useEffect(() => {
      setItems([
      { label: "Home", href: "/" },
      { label: "Cargas de trabalho" },
      ]);
   }, [setItems]);
   
   return (
      <div className="overflow-x-auto border-b border-t mt-10">
         <div className="p-8">
            <AppBreadcrumb />
         </div>
      </div>
   )
}
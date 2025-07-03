'use client';

import AppBreadcrumb from "@/components/app-breadcrumb";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function AgentsPage() {
  const { setItems } = useBreadcrumb();

   useEffect(() => {
    setItems([
      { label: "Home", href: "/" },
      { label: "Agentes" },
    ]);
  }, [setItems]);

  const dados = [
    { id: 1, name: "Analista de Orçamentos", description: "Especialista em gerar orçamentos personalizados." },
    { id: 2, name: "Vendedor Online", description: "Especialista em realizar atendimentos de leads." },
  ];

  return (
    <div className="overflow-x-auto border-b border-t mt-10">
      <div className="p-8">
        <AppBreadcrumb />
      </div>
      
      <div className="flex justify-end pe-8">
        <button className="
          px-4 py-2 rounded-lg shadow
          bg-neutral-800 text-white
          hover:bg-neutral-700
          transition
          dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300
        ">
          + Incluir
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-2">
        {dados.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition"
          >
            <div className="font-bold text-lg">{item.name}</div>
            <div className="text-gray-600">{item.description}</div>
            <div className="flex gap-2 mt-2 justify-center">
              <button className="hover:text-blue-600" title="Visualizar">
                <Eye size={21} />
              </button>
              <button className="hover:text-green-600" title="Editar">
                <Edit size={21} />
              </button>
              <button className="hover:text-red-600" title="Deletar">
                <Trash2 size={21} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

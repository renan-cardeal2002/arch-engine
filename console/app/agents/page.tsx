"use client";

import AppBreadcrumb from "@/components/app-breadcrumb";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function AgentsPage() {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Agentes" }]);
  }, [setItems]);

  const dados = [
    {
      id: 1,
      name: "Analista de Orçamentos",
      description: "Especialista em gerar orçamentos personalizados.",
    },
    {
      id: 2,
      name: "Vendedor Online",
      description: "Especialista em realizar atendimentos de leads.",
    },
  ];

  return (
    <div className="overflow-x-auto border-b border-t mt-10">
      <div className="p-8">
        <AppBreadcrumb />
      </div>

      <div className="flex justify-end pe-8">
        <Button
          className="
          bg-green-100 text-green-700 hover:bg-green-200
          dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800
        "
        >
          + Novo agente
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m-8">
        {dados.map((item) => (
          <div
            key={item.id}
            className="
            bg-white dark:bg-neutral-900 
            border border-neutral-200 dark:border-neutral-800 
            shadow rounded-lg flex-1 flex flex-col md:flex-row p-4 items-start md:items-center gap-6"
          >
            <div className="flex-1">
              <div className="flex gap-6 flex-wrap justify-center">
                <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.name}
                </div>
                <div className="text-lg opacity-80 text-neutral-800 dark:text-neutral-300">
                  {item.description}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button className="hover:bg-blue-600" title="Visualizar">
                    <Eye size={21} />
                  </Button>
                  <Button className="hover:bg-green-600" title="Editar">
                    <Edit size={21} />
                  </Button>
                  <Button className="hover:bg-red-600" title="Deletar">
                    <Trash2 size={21} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

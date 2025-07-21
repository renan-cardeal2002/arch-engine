"use client";

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function KnowledgesPage() {
  const { setItems } = useBreadcrumb();

  const [dados, setDados] = useState([
    {
      id: 1,
      name: "Regras de geração de Orçamento",
      description: "Para gerar o orçamento, siga as regras abaixo a seguir...",
      endpoint_id: 1,
    },
  ]);

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Conhecimentos" }]);
  }, [setItems]);

  return (
    <PageLayout
      actions={
        <Button
          className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
        >
          <Plus />
          Novo conhecimento
        </Button>
      }
    >
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button className="hover:bg-blue-600" title="Visualizar">
                  <Eye size={21} />
                </Button>
                <Button className="hover:bg-green-600" title="Editar">
                  <Edit size={21} />
                </Button>
                <Button className="hover:bg-red-600" title="Deletar">
                  <Trash2 size={21} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}

"use client";

import AppBreadcrumb from "@/components/app-breadcrumb";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToolsPage() {
  const { setItems } = useBreadcrumb();

  const [dados, setDados] = useState([
    {
      id: 1,
      name: "read_pdf",
      description:
        "Le dados a partir de arquivos PDF, extraindo texto e metadados.",
      endpoint_id: 1,
    },
  ]);

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Ferramentas" }]);
  }, [setItems]);

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
          + Nova ferramenta
        </Button>
      </div>

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
    </div>
  );
}

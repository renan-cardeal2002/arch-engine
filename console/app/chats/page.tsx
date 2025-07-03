'use client';

import AppBreadcrumb from "@/components/app-breadcrumb";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import { Edit, Trash2, Eye, Cog } from "lucide-react";
import { useEffect } from "react";

export default function ChatsPage() {
  const { setItems } = useBreadcrumb();

   useEffect(() => {
    setItems([
      { label: "Home", href: "/" },
      { label: "Chats" },
    ]);
  }, [setItems]);
  
  const dados = [
    { id: 1, name: "Chat PlayEscolar - Vendedor Online", description: "Realiza atendimentos de clientes com finalidade de vender cursos de inglês e programação" },
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
          + Novo Chat
        </button>
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
                <button className="hover:text-blue-600" title="Visualizar">
                  <Eye size={21} />
                </button>
                <button className="hover:text-green-600" title="Editar">
                  <Edit size={21} />
                </button>
                <button className="hover:text-grey-600" title="Configurações">
                  <Cog size={21} />
                </button>
                <button className="hover:text-red-600" title="Deletar">
                  <Trash2 size={21} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

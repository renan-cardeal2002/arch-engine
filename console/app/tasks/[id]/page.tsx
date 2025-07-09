"use client";

import AppBreadcrumb from "@/components/app-breadcrumb";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, Barcode, Box } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tasksMock = [
  {
    id: 1,
    name: "Gerador de orçamentos",
    code: "66f10b24-b59b-4dff-8336-b3f16200698d6",
    description:
      "Automação que executa a manipulação de orçamentos e cria orçamentos personalizados.",
  },
];

export default function TaskPage() {
  const { setItems } = useBreadcrumb();

  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [instructions, setInstructions] = useState("");

  const task = tasksMock.find((t) => t.id === Number(id));

  if (!task) {
    return <div className="p-8 text-red-600">Task não encontrada</div>;
  }

  useEffect(() => {
    setItems([
      { label: "Home", href: "/" },
      { label: "Tarefas", href: "/tasks" },
      { label: `${task.name}` },
    ]);
  }, [setItems, task]);

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
          + Nova carga de trabalho
        </Button>
      </div>

      <div className="flex flex-wrap gap-8 m-8">
        <div
          className="
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            shadow rounded-lg flex-1 flex flex-col md:flex-row p-6 items-start md:items-center gap-6
            "
        >
          <div className="flex-1">
            <div className="flex gap-6 flex-wrap">
              <div>
                <div className="text-xs font-bold flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                  <span className="inline-block">
                    <Box />
                  </span>
                  Nome
                </div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {task.name}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                  <span className="inline-block">
                    <Barcode />
                  </span>
                  Código de identificação
                </div>
                <div className="text-lg font-mono opacity-80 text-neutral-800 dark:text-neutral-300">
                  {task.code}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                <span className="inline-block">
                  <AlignLeft />
                </span>
                Descrição
              </div>
              <div className="text-base text-neutral-900 dark:text-neutral-100">
                {task.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            shadow rounded-lg p-6 mb-6 m-8
        "
      >
        <div className="font-semibold text-lg mb-2 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <span>▾</span> Instruções
        </div>
        <Textarea
          rows={5}
          className="
                mb-4
                bg-white dark:bg-neutral-900
                border border-neutral-200 dark:border-neutral-700
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            "
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Adicione instruções para este serviço..."
        />
        <div className="flex justify-end">
          <Button
            className="
                bg-green-600 text-white hover:bg-green-700
                dark:bg-green-500 dark:text-neutral-900 dark:hover:bg-green-400
            "
          >
            Salvar instruções
          </Button>
        </div>
      </div>

      <div
        className="
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            shadow rounded-lg p-6 m-8
        "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <span>▾</span> Agentes
          </div>
          <Button
            className="
                    bg-green-100 text-green-700 hover:bg-green-200
                    dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800
                "
          >
            + Novo agente
          </Button>
        </div>
        <Input
          placeholder="Buscar um agente..."
          className="
                mb-4
                bg-white dark:bg-neutral-900
                border border-neutral-200 dark:border-neutral-700
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            "
        />
        <table className="min-w-full">
          <thead>
            <tr className="text-neutral-600 dark:text-neutral-300">
              <th className="py-2 px-4 text-left">Nome</th>
              <th className="py-2 px-4 text-left">Descrição</th>
              <th className="py-2 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="text-center opacity-80">
                Nenhum agente vinculado a essa tarefa
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

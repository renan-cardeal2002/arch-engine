"use client";

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, Barcode, Box, Plus, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskPage() {
  const { setItems } = useBreadcrumb();

  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [instructions, setInstructions] = useState("");
  const [agent, setAgent] = useState<any>({});

  const fetchAgent = async (id: string) => {
    try {
      const res = await fetch(`/api/agent/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar agente");

      const data = await res.json();
      setAgent(data);
    } catch (error) {
      console.error("Erro ao buscar agente:", error);
      setAgent({});
    }
  };

  if (!agent) {
    return <div className="p-8 text-red-600">Agente não encontrada</div>;
  }

  useEffect(() => {
    setItems([
      { label: "Home", href: "/" },
      { label: "Agentes", href: "/agents" },
      { label: `${agent.name}` },
    ]);
  }, [setItems]);

  useEffect(() => {
    if (id) {
      fetchAgent(id);
    }
  }, [id]);

  useEffect(() => {
    if (agent?.name) {
      setItems([
        { label: "Home", href: "/" },
        { label: "Agentes", href: "/agents" },
        { label: `${agent.name}` },
      ]);
    }
  }, [agent?.name]);

  return (
    <PageLayout>
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
                <div className="text-base text-neutral-900 dark:text-neutral-100">
                  {agent.name}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                  <span className="inline-block">
                    <AlignLeft />
                  </span>
                  Descrição
                </div>
                <div className="text-base text-neutral-900 dark:text-neutral-100">
                  {agent.description}
                </div>
              </div>
            </div>
          </div>
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
            <span>▾</span> Habilidades
          </div>
          <Button
            className="
                    bg-green-100 text-green-700 hover:bg-green-200
                    dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800
                "
          >
            <Plus /> Nova habilidade
          </Button>
        </div>
        <Input
          placeholder="Buscar uma habilidade..."
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
                Nenhuma habilidade vinculada a essa tarefa
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}

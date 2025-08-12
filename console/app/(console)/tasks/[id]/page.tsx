"use client";

import SkillSelector from "@/components/app-skill-selector";
import SkillTable from "@/components/app-skill-table";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getService } from "@/services/services-service";
import { AlignLeft, Barcode, Box, Plus, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskPage() {
  const { setItems } = useBreadcrumb();
  const { id } = useParams<{ id: string }>();

  const [instructions, setInstructions] = useState("");
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [serviceAgents, setServiceAgents] = useState<any>([]);
  const [serviceSteps, setServiceSteps] = useState<any>([]);
  const [availableAgents, setAgents] = useState<any[]>([]);
  const [agentSelected, setAgentSelected] = useState<any>({});

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agent");
      const data = await res.json();

      if (Array.isArray(data)) {
        setAgents(data);
      } else {
        console.warn("Resposta inesperada da API /api/agent:", data);
        setAgents([]);
      }
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
      setAgents([]);
    }
  };

  const handleSubmitAgent = async () => {
    try {
      // await addServiceAgent(id, agentSelected.id);
      setAgentSelected({});
      await getService(id);
    } catch (error) {
      console.error("Erro ao vincular habilidade ao agente:", error);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getService(id);
        await fetchAgents();
        if (active) setTask(data);
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        if (active) setTask(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!task?.name) return;
    setItems([
      { label: "Home", href: "/" },
      { label: "Serviços", href: "/tasks" },
      { label: task.name },
    ]);
  }, [task?.name, setItems]);

  if (loading) {
    return <div className="p-8 text-center">Carregando…</div>;
  }

  if (!task) {
    return (
      <div className="p-8 text-center text-red-600">Task não encontrada</div>
    );
  }

  return (
    <PageLayout
      actions={
        <Button className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800">
          <Plus />
          Nova carga de trabalho
        </Button>
      }
    >
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
                  {task.id}
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
            <Save />
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
            <Plus /> Novo agente
          </Button>
        </div>
        <SkillSelector
          skills={availableAgents}
          selected={agentSelected}
          setSelected={setAgentSelected}
          onSubmit={handleSubmitAgent}
          label="Selecione um agente"
        />

        <SkillTable skills={serviceAgents} />
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
            <span>▾</span> Etapas
          </div>
          <Button
            className="
                    bg-green-100 text-green-700 hover:bg-green-200
                    dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800
                "
          >
            <Plus /> Nova estapa
          </Button>
        </div>
        <SkillTable skills={serviceSteps} />
      </div>
    </PageLayout>
  );
}

"use client";

import DetailsHeader from "@/components/app-details-header";
import SkillSelector from "@/components/app-skill-selector";
import SkillTable from "@/components/app-skill-table";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  addAgentSkill,
  getAgent,
  getAgentSkills,
} from "@/services/agent-service";
import { getAllSkills } from "@/services/skill-service";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskPage() {
  const { setItems } = useBreadcrumb();

  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<any>({});
  const [agentSkills, setAgentSkills] = useState<any>([]);
  const [availableSkills, setAvailableSkills] = useState<any>([]);
  const [skillSelected, setSkillSelected] = useState<any>({});

  const fetchAgent = async (id: string) => {
    try {
      const data = await getAgent(id);
      setAgent(data);
    } catch (error) {
      console.error("Erro ao buscar agente:", error);
      setAgent({});
    }
  };

  const fetchAgentSkills = async (id: string) => {
    try {
      const data = await getAgentSkills(id);
      setAgentSkills(data);
    } catch (error) {
      console.error("Erro ao buscar agente:", error);
      setAgentSkills([]);
    }
  };

  const fetchSkills = async () => {
    try {
      const data = await getAllSkills();
      if (Array.isArray(data)) {
        setAvailableSkills(data);
      } else {
        console.warn("Resposta inesperada da API /api/skill:", data);
        setAvailableSkills([]);
      }
    } catch (error) {
      console.error("Erro ao buscar habilidades:", error);
      setAvailableSkills([]);
    }
  };

  const handleSubmitSkill = async () => {
    try {
      await addAgentSkill(id, skillSelected.id);
      setSkillSelected({});
      fetchAgentSkills(id);
    } catch (error) {
      console.error("Erro ao vincular habilidade ao agente:", error);
    }
  };

  if (!agent) {
    return <div className="p-8 text-red-600">Agente não encontrada</div>;
  }

  useEffect(() => {
    if (agent?.name) {
      setItems([
        { label: "Home", href: "/" },
        { label: "Agentes", href: "/agents" },
        { label: `${agent.name}` },
      ]);
    }
  }, [agent?.name]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      await Promise.all([fetchAgent(id), fetchAgentSkills(id), fetchSkills()]);
    };

    load();
  }, [id]);

  return (
    <PageLayout>
      <DetailsHeader details={agent} />

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

        <SkillSelector
          skills={availableSkills}
          selected={skillSelected}
          setSelected={setSkillSelected}
          onSubmit={handleSubmitSkill}
        />

        <SkillTable skills={agentSkills} />
      </div>
    </PageLayout>
  );
}

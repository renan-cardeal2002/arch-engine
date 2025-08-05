"use client";

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AgentsPage() {
  const { setItems } = useBreadcrumb();
  const [dados, setDados] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agent");
      const data = await res.json();

      if (Array.isArray(data)) {
        setDados(data);
      } else {
        console.warn("Resposta inesperada da API /api/agent:", data);
        setDados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
      setDados([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar agente");

      setName("");
      setDescription("");
      setShowModal(false);
      fetchAgents();
    } catch (error) {
      console.error("Erro ao cadastrar agente:", error);
    }
  };

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Ferramentas" }]);
    fetchAgents();
  }, [setItems]);

  return (
    <PageLayout
      actions={
        <Button
          className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          onClick={() => setShowModal(true)}
        >
          <Plus />
          Novo agente
        </Button>
      }
    >
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
                  <Link href={`/agents/${item.id}`}>
                    <Button className="hover:bg-blue-600" title="Visualizar">
                      <Eye size={21} />
                    </Button>
                  </Link>
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

        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-neutral-800 text-white mr-2"
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-600 text-white"
                onClick={handleSubmit}
                disabled={!name.trim() || !description.trim()}
              >
                <Save />
                Salvar
              </Button>
            </>
          }
        >
          <h2 className="text-xl font-bold mb-4">Novo Agente</h2>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Nome do agente"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}

"use client";

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Eye, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SkillsPage() {
  const { setItems } = useBreadcrumb();
  const [dados, setDados] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skill");
      const data = await res.json();

      if (Array.isArray(data)) {
        setDados(data);
      } else {
        console.warn("Resposta inesperada da API /api/skill:", data);
        setDados([]);
      }
    } catch (error) {
      console.error("Erro ao buscar habilidades:", error);
      setDados([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar agente");

      setName("");
      setDescription("");
      setShowModal(false);
      fetchSkills();
    } catch (error) {
      console.error("Erro ao cadastrar agente:", error);
    }
  };

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Habilidades" }]);
    fetchSkills();
  }, [setItems]);

  return (
    <PageLayout
      actions={
        <Button
          className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          onClick={() => setShowModal(true)}
        >
          <Plus />
          Nova habilidade
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
        <h2 className="text-xl font-bold mb-4">Novo Habilidade</h2>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Nome da habilidade"
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
    </PageLayout>
  );
}

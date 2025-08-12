"use client";

import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Cog, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ConfigModal from "./components/config-modal";
import { TaskConfig, TaskItem } from "./components/types";
import { addService, getServices } from "@/services/services-service";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TasksPage() {
  const { setItems } = useBreadcrumb();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configModalItem, setConfigModalItem] = useState<TaskItem | null>(null);
  const [dados, setDados] = useState<TaskItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setDados(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      setDados([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await addService(name, description, "TASK");

      if (!data.ok) throw new Error("Erro ao cadastrar agente");

      setName("");
      setDescription("");
      setShowModal(false);
      fetchServices();
    } catch (error) {
      console.error("Erro ao cadastrar agente:", error);
    }
  };

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Serviços" }]);
    fetchServices();
  }, [setItems]);

  function handleConfig(item: TaskItem) {
    setConfigModalItem(item);
    setConfigModalOpen(true);
  }

  function handleConfigSave(config: TaskConfig) {
    if (configModalItem) {
      setDados((dados) =>
        dados.map((item) =>
          item.id === configModalItem.id ? { ...item, config } : item
        )
      );
      setConfigModalOpen(false);
      setConfigModalItem(null);
    }
  }

  return (
    <PageLayout
      actions={
        <Button
          className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          onClick={() => setShowModal(true)}
        >
          <Plus />
          Nova tarefa
        </Button>
      }
    >
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
        <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
        <Input
          type="text"
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
        />
      </Modal>

      <ConfigModal
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        config={configModalItem?.config}
        onSave={handleConfigSave}
      />

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
                <Link href={`/tasks/${item.id}`}>
                  <Button className="hover:bg-blue-600" title="Visualizar">
                    <Eye size={21} />
                  </Button>
                </Link>
                <Button className="hover:bg-green-600" title="Editar">
                  <Edit size={21} />
                </Button>
                <Button
                  className="hover:bg-sky-600"
                  title="Configurações"
                  onClick={() => handleConfig(item)}
                >
                  <Cog size={21} />
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

"use client";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import PageLayout from "@/components/page-layout";
import Modal from "@/components/ui/modal";
import { Edit, Trash2, Eye, Cog, Plus, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatItem, ChatConfig } from "./components/types";
import ConfigModal from "./components/config-modal";

export default function ChatsPage() {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Chats" }]);
  }, [setItems]);

  const [dados, setDados] = useState<ChatItem[]>([
    {
      id: 1,
      name: "Chat PlayEscolar - Vendedor Online",
      description:
        "Realiza atendimentos de clientes com finalidade de vender cursos de inglês e programação",
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configModalItem, setConfigModalItem] = useState<ChatItem | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    setModalMode("create");
    setSelectedId(null);
    setName("");
    setDescription("");
    setModalOpen(true);
  }

  function handleEdit(item: any) {
    setModalMode("edit");
    setSelectedId(item.id);
    setName(item.name);
    setDescription(item.description);
    setModalOpen(true);
  }

  function handleView(item: any) {
    setModalMode("view");
    setSelectedId(item.id);
    setName(item.name);
    setDescription(item.description);
    setModalOpen(true);
  }

  function handleSave() {
    if (modalMode === "create") {
      const novoItem = {
        id: Date.now(),
        name: name,
        description: description,
      };
      setDados([...dados, novoItem]);
    } else if (modalMode === "edit" && selectedId != null) {
      setDados(
        dados.map((item) =>
          item.id === selectedId ? { ...item, name, description } : item
        )
      );
    }
    setModalOpen(false);
    setName("");
    setDescription("");
    setSelectedId(null);
  }

  function handleDelete(id: number) {
    setDados(dados.filter((item) => item.id !== id));
  }

  function handleConfig(item: ChatItem) {
    setConfigModalItem(item);
    setConfigModalOpen(true);
  }

  function handleConfigSave(config: ChatConfig) {
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
          onClick={handleCreate}
          className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
        >
          <Plus />
          Novo Chat
        </Button>
      }
    >
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          modalMode === "view" ? (
            <Button onClick={() => setModalOpen(false)}>Fechar</Button>
          ) : (
            <>
              <Button
                onClick={() => setModalOpen(false)}
                className="bg-neutral-800 text-white mr-2"
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-600 text-white"
                onClick={handleSave}
                disabled={!name.trim() || !description.trim()}
              >
                <Save />
                Salvar
              </Button>
            </>
          )
        }
      >
        <h2 className="text-xl font-bold mb-4">
          {modalMode === "create" && "Novo Chat"}
          {modalMode === "edit" && "Editar Chat"}
          {modalMode === "view" && "Visualizar Chat"}
        </h2>
        <Input
          type="text"
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={modalMode === "view"}
        />
        <Textarea
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={modalMode === "view"}
          rows={10}
        />
      </Modal>

      <ConfigModal
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        config={configModalItem?.config}
        onSave={handleConfigSave}
      />

      {/* TABELA */}
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
                <Button
                  className="hover:bg-blue-600"
                  title="Visualizar"
                  onClick={() => handleView(item)}
                >
                  <Eye size={21} />
                </Button>
                <Button
                  className="hover:bg-green-600"
                  title="Editar"
                  onClick={() => handleEdit(item)}
                >
                  <Edit size={21} />
                </Button>
                <Button
                  className="hover:bg-sky-600"
                  title="Configurações"
                  onClick={() => handleConfig(item)}
                >
                  <Cog size={21} />
                </Button>
                <Button
                  className="hover:bg-red-600"
                  title="Deletar"
                  onClick={() => handleDelete(item.id)}
                >
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

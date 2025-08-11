"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useChatStore } from "@/stores/chat-store";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Cog, Save } from "lucide-react";

const modelosMock = [ // # mock
  { value: "gpt-4o", label: "GPT-4o (2024)" },
  { value: "gpt-4-0125-preview", label: "GPT-4 Turbo (0125)" },
  { value: "gpt-4-1106-preview", label: "GPT-4 Turbo (1106)" },
  { value: "gpt-4-vision-preview", label: "GPT-4 Vision" },
  { value: "gpt-4-0613", label: "GPT-4 (0613)" },
  { value: "gpt-4-32k", label: "GPT-4 32K" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo-0125", label: "GPT-3.5 Turbo (0125)" },
  { value: "gpt-3.5-turbo-1106", label: "GPT-3.5 Turbo (1106)" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16K" },
  { value: "gpt-3.5-turbo-instruct", label: "GPT-3.5 Turbo Instruct" },
  { value: "gpt-4-1", label: "gpt-4.1 (Legacy)" },
  { value: "gpt-3.5", label: "gpt-3.5 (Legacy)" },
  { value: "gpt-3", label: "gpt-3" },
];

export default function AgentPlaygroundPage() {
  const params = useParams<{ id: string }>();
  const { chats, updateSystemPrompt } = useChatStore();
  const chatItem = chats.find((c) => c.id === params.id);
  const [systemPrompt, setSystemPrompt] = useState(
    chatItem?.systemPrompt || ""
  );

  const threadId = "987e7fd5-cd27-4493-8f0c-6cfb47326808";
  const [flowData, setFlowData] = useState("");
  const [toolName, setToolName] = useState("");
  const [settingsJson, setSettingsJson] = useState("");
  const [showNodesinfo, setShowNodesinfo] = useState(false);
  const [showModalConfig, setShowModalConfig] = useState(false);
  const [model, setModel] = useState(modelosMock[0].value); // # mock

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Modal open={showModalConfig} onClose={() => setShowModalConfig(false)}>
        <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
          <h2 className="text-xl font-bold">Configurações</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modelo */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Modelo
              </label>
              <select
                className="w-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 ring-green-500"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {modelosMock.map((m) => ( // # mock
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox */}
            <div className="flex items-end gap-2">
              <Checkbox
                id="show-nodesinfo"
                checked={showNodesinfo}
                onCheckedChange={(checked) =>
                  setShowNodesinfo(checked === true)
                }
              />
              <label
                htmlFor="show-nodesinfo"
                className="text-xs font-medium text-neutral-600 dark:text-neutral-400"
              >
                Mostrar info gráficos
              </label>
            </div>

            {/* Flow Data */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Flow Data
              </label>
              <Textarea
                className="font-mono w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={3}
                placeholder='{"key": "value"}'
                value={flowData}
                onChange={(e) => setFlowData(e.target.value)}
              />
            </div>

            {/* Ferramentas */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Ferramentas
              </label>
              <Input
                className="w-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-500 rounded px-3 py-2"
                placeholder="Nome da ferramenta"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
              />
            </div>

            {/* Configurações */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Configurações
              </label>
              <Textarea
                className="font-mono w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={3}
                placeholder='{"key": "value"}'
                value={settingsJson}
                onChange={(e) => setSettingsJson(e.target.value)}
              />
            </div>

            {/* System Prompt */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                System message
              </label>
              <Textarea
                className="font-mono w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={6}
                placeholder="Describe desired model behavior (tone, tool usage, response style)"
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  updateSystemPrompt(threadId, systemPrompt);
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Topbar */}
      <div className="flex items-center flex-shrink justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
        <div>
          <span className="text-lg font-semibold mr-4 text-neutral-900 dark:text-neutral-100">
            Agente
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200
                       dark:bg-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
            onClick={() => setShowModalConfig(true)}
          >
            <Cog />
            Configurações
          </Button>
          <Button
            className="bg-green-100 text-green-700 hover:bg-green-200
                       dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          >
            <Save />
            Salvar Agente
          </Button>
        </div>
      </div>

      {/* Body */}
      <div
        className="
              mx-auto w-full 
              rounded-xl shadow p-4 
              overflow-y-auto mt-2
            "
      >
        <div className="space-y-2 max-w-2xl mx-auto w-full"></div>
      </div>
    </div>
  );
}

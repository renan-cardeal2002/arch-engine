"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { Cog, Save } from "lucide-react";
import { useState } from "react";

const endpointsMock = [
  { value: "1", label: "Local" },
  { value: "2", label: "Produção" },
  { value: "3", label: "Homologação" },
];

const typesMock = [
  { value: "1", label: "String" },
  { value: "2", label: "Boolean" },
  { value: "3", label: "Integer" },
  { value: "4", label: "List" },
  { value: "5", label: "Dict" },
];

export default function ToolPlaygroundPage() {
  const [tool, setTool] = useState("");
  const [params, setParams] = useState("");
  const [type, setType] = useState("");
  const [endpoint, setEndpoint] = useState(endpointsMock[0].value);
  const [result, setResult] = useState<string | null>(null);
  const [showModalConfig, setShowModalConfig] = useState(false);

  function handleTest() {
    setResult(`(Mock) Executou tool "${tool}" com params: ${params}`);
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Modal open={showModalConfig} onClose={() => setShowModalConfig(false)}>
        <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
          <h2 className="text-xl font-bold">Configurações</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modelo */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Endpoint
              </label>
              <select
                className="w-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 ring-green-500"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              >
                {endpointsMock.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ferramentas */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Parâmetros
              </label>
              <Input
                className="mb-2 p-2 me-2 rounded border dark:bg-neutral-900 dark:text-white"
                placeholder="Nome"
                value={params}
                onChange={(e) => setParams(e.target.value)}
              />
              <select
                className="bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 ring-green-500"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {typesMock.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex items-center flex-shrink justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
        <div>
          <span className="text-lg font-semibold mr-4 text-neutral-900 dark:text-neutral-100">
            Ferramenta
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
        <div className="space-y-2 max-w-2xl mx-auto w-full">
          <input
            className="w-full mb-2 p-2 rounded border dark:bg-neutral-900 dark:text-white"
            placeholder="Procure uma ferramenta"
            value={tool}
            onChange={(e) => setTool(e.target.value)}
          />
          <button
            className="bg-violet-600 text-white px-4 py-2 rounded"
            onClick={handleTest}
          >
            Executar
          </button>
          {result && (
            <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded">
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

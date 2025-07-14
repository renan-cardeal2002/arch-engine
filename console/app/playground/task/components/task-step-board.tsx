import { useState } from "react";
import { Step, StepCard, StepStatus } from "./task-step"; // Ajusta o path se precisar
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const statusList: StepStatus[] = ["done", "in_progress", "pending"];

export default function StepsBoard() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [name, setName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [status, setStatus] = useState<StepStatus>("pending");

  // Adiciona nova etapa
  const addStep = () => {
    if (!name.trim()) return; // Só adiciona se tiver nome
    setSteps((prev) => [
      ...prev,
      {
        id: Date.now(), // ID único simples, só pra exemplo
        name,
        instruction,
        status,
      },
    ]);
    setName("");
    setInstruction("");
    setStatus("pending");
  };

  // (opcional) Remover etapa
  const removeStep = (id: number) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  // (opcional) Limpar tudo
  const clearSteps = () => setSteps([]);

  // Quando clicar em "Executar"
  const executeSteps = () => {
    // Aqui faz a chamada/execução real (API, etc)
    alert("Executando etapas: " + JSON.stringify(steps, null, 2));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Formulário para adicionar etapa */}
      <div className="flex gap-2 mb-6">
        <input
          className="px-2 py-1 rounded border border-neutral-300 flex-1"
          placeholder="Nome da etapa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="px-2 py-1 rounded border border-neutral-300 flex-1"
          placeholder="Instrução"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
        {/* <select
          className="px-2 py-1 rounded border border-neutral-300"
          value={status}
          onChange={(e) => setStatus(e.target.value as StepStatus)}
        >
          {statusList.map((s) => (
            <option key={s} value={s}>
              {s === "done"
                ? "Concluída"
                : s === "in_progress"
                ? "Em andamento"
                : "Pendente"}
            </option>
          ))}
        </select> */}
        <button
          className="px-3 py-1 bg-green-600 text-white rounded"
          onClick={addStep}
        >
          Adicionar
        </button>
      </div>

      {/* Lista de etapas */}
      <div className="mb-4">
        {steps.map((etapa) => (
          <div key={etapa.id} className="relative">
            <Button
              className="text-xs text-red-400 hover:text-red-600"
              onClick={() => removeStep(etapa.id)}
              title="Remover etapa"
            >
              <Trash2></Trash2>
            </Button>
            <StepCard etapa={etapa} />
          </div>
        ))}
      </div>

      {/* Botões finais */}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={executeSteps}
          disabled={steps.length === 0}
        >
          Executar etapas
        </button>
        <button
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
          onClick={clearSteps}
        >
          Limpar tudo
        </button>
      </div>
    </div>
  );
}

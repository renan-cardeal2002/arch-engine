import { useState, useEffect } from "react";
import { Step, StepCard, StepStatus } from "./task-step";
import { Button } from "@/components/ui/button";
import { Hammer, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StepsBoard({ steps: stepsParam }: { steps: Step[] }) {
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    setSteps(stepsParam);
  }, [stepsParam]);

  const [name, setName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [status, setStatus] = useState<StepStatus>("pending");

  const addStep = () => {
    if (!name.trim()) return;
    setSteps((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        instruction,
        status,
      },
    ]);
    setName("");
    setInstruction("");
    setStatus("pending");
  };

  const removeStep = (id: number) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  const executeSteps = () => {
    alert("Executando etapas: " + JSON.stringify(steps, null, 2));
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex gap-6">
        <div className="w-1/3 bg-background rounded-xl p-4 shadow space-y-4 border border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-2">
            <Input placeholder="Ordem" className="w-28" />
            <Input
              placeholder="Nome da etapa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
          </div>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
            <option value="">Selecione um agente</option>
            {/* ... */}
          </select>
          <Textarea
            placeholder="Instrução"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="min-h-[60px]"
          />
          <div className="flex gap-2">
            <Button
              className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              onClick={addStep}
            >
              <Plus />
              Adicionar
            </Button>
            <Button
              className="bg-blue-200 text-blue-700 dark:bg-blue-600 dark:text-white hover:bg-blue-300"
              onClick={executeSteps}
              disabled={steps.length === 0}
            >
              <Hammer />
              Executar etapas
            </Button>
          </div>
        </div>

        {/* Coluna direita: Lista de etapas */}
        <div className="w-2/3 space-y-4">
          {steps.length === 0 ? (
            <div className="text-muted-foreground text-center mt-8">
              Nenhuma etapa cadastrada ainda.
            </div>
          ) : (
            steps.map((etapa) => (
              <div key={etapa.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <StepCard etapa={etapa} />
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    className="text-red-400 bg-white hover:text-red-600 hover:bg-white dark:bg-red-400 dark:text-white rounded"
                    onClick={() => removeStep(etapa.id)}
                    title="Remover etapa"
                    size="icon"
                  >
                    <Trash2 />
                  </Button>
                  <Button
                    className="text-blue-400 bg-white hover:text-blue-600 hover:bg-white dark:bg-blue-400 dark:text-white rounded"
                    title="Refazer etapa"
                    size="icon"
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

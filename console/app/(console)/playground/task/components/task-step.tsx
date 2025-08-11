import { Button } from "@/components/ui/button";
import { useState } from "react";

export type StepStatus = "done" | "in_progress" | "pending";

export type Step = {
  id: number;
  name: string;
  instruction: string;
  details?: string;
  status: StepStatus;
};

export function StepCard({ etapa }: { etapa: Step }) {
  const [showDetails, setShowDetails] = useState(false);

  const statusColor: Record<StepStatus, string> = {
    done: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
    in_progress:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500 dark:text-yellow-100",
    pending:
      "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
  };

  const statusLabel: Record<StepStatus, string> = {
    done: "Concluída",
    in_progress: "Em andamento",
    pending: "Pendente",
  };

  const showButton = etapa.status == "done";

  return (
    <div className="mb-4 shadow">
      <div
        className={`p-4 ${
          statusColor[etapa.status]
        } flex items-center gap-4 rounded-sm`}
      >
        <div className="flex-1">
          <div className="font-semibold text-base">{etapa.name}</div>
          <div className="text-xs text-neutral-600 dark:text-neutral-200 mt-1">
            {etapa.instruction}
          </div>
        </div>
        <span className="px-2 py-1 text-sm font-medium">
          {statusLabel[etapa.status]}
        </span>
        {showButton && (
          <Button onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? "Ocultar detalhes" : "Exibir detalhes"}
          </Button>
        )}
      </div>
      {showButton && showDetails && (
        <div className="p-4 bg-white dark:bg-neutral-900 border-t text-sm rounded-sm">
          <div>
            <strong>Detalhes da execução:</strong>
            <div className="mt-1">{etapa.details}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export type StepStatus = "done" | "in_progress" | "pending";

export type Step = {
  id: number;
  name: string;
  instruction: string;
  status: StepStatus;
};

export function StepCard({ etapa }: { etapa: Step }) {
  const statusColor: Record<StepStatus, string> = {
    done: "bg-green-100 text-green-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    pending: "bg-neutral-200 text-neutral-700",
  };

  const statusLabel: Record<StepStatus, string> = {
    done: "Concluída",
    in_progress: "Em andamento",
    pending: "Pendente",
  };

  return (
    <div
      className={`mb-4 rounded-sm shadow p-4 ${
        statusColor[etapa.status]
      } flex items-center gap-4`}
    >
      <div className="flex-1">
        <div className="font-semibold text-base">{etapa.name}</div>
        <div className="text-xs text-neutral-600 mt-1">{etapa.instruction}</div>
      </div>
      <span className="px-2 py-1 rounded text-xs font-medium">
        {statusLabel[etapa.status]}
      </span>
    </div>
  );
}

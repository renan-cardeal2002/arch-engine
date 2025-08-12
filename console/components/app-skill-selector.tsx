import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SkillSelector({
  skills,
  selected,
  setSelected,
  onSubmit,
  label = "Selecione uma habilidade",
}: {
  skills: any[];
  selected: any;
  setSelected: (s: any) => void;
  onSubmit: () => void;
  label?: string;
}) {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <select
        value={selected.id || ""}
        onChange={(e) => {
          const skill = skills.find((s: any) => s.id === e.target.value);
          setSelected(skill || {});
        }}
        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 rounded"
      >
        <option value="">{label}</option>
        {skills.map((skill: any) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
      <Button
        onClick={onSubmit}
        disabled={!selected?.id}
        className="bg-green-100 text-green-700 hover:bg-green-200
                    dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
      >
        <Plus />
      </Button>
    </div>
  );
}

import { AlignLeft, Box } from "lucide-react";

export default function DetailsHeader({ details }: { details: any }) {
  return (
    <div className="flex flex-wrap gap-8 m-8">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow rounded-lg flex-1 flex flex-col md:flex-row p-6 items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex gap-6 flex-wrap">
            <div>
              <div className="text-xs font-bold flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                <Box /> Nome
              </div>
              <div className="text-base text-neutral-900 dark:text-neutral-100">
                {details.name}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
                <AlignLeft /> Descrição
              </div>
              <div className="text-base text-neutral-900 dark:text-neutral-100">
                {details.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

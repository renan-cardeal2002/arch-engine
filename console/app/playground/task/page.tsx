"use client";
import { useState } from "react";
export default function TaskPlayground() {
  const [script, setScript] = useState("");
  const [log, setLog] = useState<string | null>(null);

  function handleRun() {
    setLog(`(Mock) Rodando tarefa com script: ${script}`);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <div className="font-semibold mb-2">Testar Tarefa Autônoma</div>
      <textarea
        className="w-full mb-2 p-2 rounded border dark:bg-neutral-900 dark:text-white"
        placeholder="Defina os passos da tarefa"
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
      <button
        className="bg-violet-600 text-white px-4 py-2 rounded"
        onClick={handleRun}
      >
        Executar tarefa
      </button>
      {log && (
        <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded">
          {log}
        </div>
      )}
    </div>
  );
}

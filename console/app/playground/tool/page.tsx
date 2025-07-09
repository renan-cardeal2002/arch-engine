"use client";
import { useState } from "react";
export default function ToolPlaygroundPage() {
  const [tool, setTool] = useState("");
  const [params, setParams] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function handleTest() {
    setResult(`(Mock) Executou tool "${tool}" com params: ${params}`);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <div className="font-semibold mb-2">Testar Tool</div>
      <input
        className="w-full mb-2 p-2 rounded border dark:bg-neutral-900 dark:text-white"
        placeholder="Nome da tool"
        value={tool}
        onChange={(e) => setTool(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 rounded border dark:bg-neutral-900 dark:text-white"
        placeholder="Parâmetros (ex: JSON)"
        value={params}
        onChange={(e) => setParams(e.target.value)}
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
  );
}

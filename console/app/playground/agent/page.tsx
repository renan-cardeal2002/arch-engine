"use client";
import { useState } from "react";
export default function AgentPlaygroundPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function handleTest() {
    // Simule o retorno de um agente
    setResult(`(Mock) Resposta do agente para: "${input}"`);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <div className="font-semibold mb-2">Testar Agente</div>
      <input
        className="w-full p-2 rounded border dark:bg-neutral-900 dark:text-white"
        placeholder="Digite um prompt/comando"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="mt-2 bg-violet-600 text-white px-4 py-2 rounded"
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

"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBreadcrumb } from "@/components/breadcrumb-provider";
import AppBreadcrumb from "@/components/app-breadcrumb";
import { useLangGraphAgent } from "@/hooks/useLangGraphAgent/useLangGraphAgent";
import { AgentState, InterruptValue, ResumeValue } from "./agent-types";
import { useParams } from "next/navigation";
import { useChatStore } from "@/stores/chat-store";
import { AppCheckpoint, GraphNode } from "@/hooks/useLangGraphAgent/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Step, StepCard } from "./components/task-step";
import StepsBoard from "./components/task-step-board";

const modelosMock = [
  { value: "gpt-4o", label: "GPT-4o (2024)" },
  { value: "gpt-4-0125-preview", label: "GPT-4 Turbo (0125)" },
  { value: "gpt-4-1106-preview", label: "GPT-4 Turbo (1106)" },
  { value: "gpt-4-vision-preview", label: "GPT-4 Vision" },
  { value: "gpt-4-0613", label: "GPT-4 (0613)" },
  { value: "gpt-4-32k", label: "GPT-4 32K" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo-0125", label: "GPT-3.5 Turbo (0125)" },
  { value: "gpt-3.5-turbo-1106", label: "GPT-3.5 Turbo (1106)" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16K" },
  { value: "gpt-3.5-turbo-instruct", label: "GPT-3.5 Turbo Instruct" },
  // Extras populares de labs/alternativas
  { value: "gpt-4-1", label: "gpt-4.1 (Legacy)" },
  { value: "gpt-3.5", label: "gpt-3.5 (Legacy)" },
  { value: "gpt-3", label: "gpt-3" },
];

const etapasMock: Step[] = [
  {
    id: 1,
    name: "Iniciar tarefa",
    instruction: "Tarefa criada e inicializada.",
    status: "done",
  },
  {
    id: 2,
    name: "Processando dados",
    instruction: "O agente está processando os dados.",
    status: "in_progress",
  },
  {
    id: 3,
    name: "Executar ferramenta X",
    instruction: "Execução da ferramenta X aguardando.",
    status: "pending",
  },
];

export default function TaskPlaygroundPage() {
  // new
  const params = useParams<{ id: string }>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { chats, updateSystemPrompt } = useChatStore();

  const chatItem = chats.find((c) => c.id === params.id);
  const [systemPrompt, setSystemPrompt] = useState(
    chatItem?.systemPrompt || ""
  );

  const threadId = "987e7fd5-cd27-4493-8f0c-6cfb47326808";
  const [flowData, setFlowData] = useState("");
  const [toolName, setToolName] = useState("");
  const [settingsJson, setSettingsJson] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showNodesinfo, setShowNodesinfo] = useState(false);
  const [restoreError, setRestoreError] = useState(false);

  useEffect(() => {
    setSystemPrompt(chatItem?.systemPrompt || "");
  }, [chatItem?.systemPrompt]);

  const onCheckpointStart = (
    checkpoint: AppCheckpoint<AgentState, InterruptValue>
  ) => {
    console.log("Checkpoint started:", checkpoint.nodes);
  };

  const onCheckpointEnd = (
    checkpoint: AppCheckpoint<AgentState, InterruptValue>
  ) => {
    console.log("Checkpoint ended:", checkpoint.nodes);

    // Example how to do some application logic based on the agent flow. E.g. reminders list.
    if (checkpoint.nodes.some((n) => n.name === "reminder")) {
      console.log("Reminder created");
    }
  };

  const onCheckpointStateUpdate = (
    checkpoint: AppCheckpoint<AgentState, InterruptValue>
  ) => {
    console.log(
      "Checkpoint intermediate state updated:",
      checkpoint.nodes,
      checkpoint.state
    );
  };

  const {
    status,
    appCheckpoints,
    run,
    resume,
    replay,
    restore,
    stop,
    restoring,
  } = useLangGraphAgent<AgentState, InterruptValue, ResumeValue>({
    onCheckpointStart,
    onCheckpointEnd,
    onCheckpointStateUpdate,
  });

  // Restore chat on page open
  useEffect(() => {
    if (threadId) {
      restore(threadId).catch(() => {
        setRestoreError(true);
      });
    }
  }, [threadId]);

  // Focus input on page load and after message is sent
  useEffect(() => {
    const isInputEnabled = status !== "running" && !restoring;
    if (inputRef.current && isInputEnabled) {
      inputRef.current.focus();
    }
  }, [status, restoring]);

  // Add scroll event listener
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScrollUpdate);
      return () =>
        messagesContainer.removeEventListener("scroll", handleScrollUpdate);
    }
  }, []);

  // Auto-scroll when new nodes appear
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [appCheckpoints, shouldAutoScroll]);

  const handleScrollUpdate = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      setShowScrollButton(!isAtBottom);

      if (isAtBottom) {
        setShouldAutoScroll(true);
      } else {
        setShouldAutoScroll(false);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const [model, setModel] = useState(modelosMock[0].value);
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([{ label: "Home", href: "/" }, { label: "Playground - Chat" }]);
  }, [setItems]);

  return (
    <div className="bg-white dark:bg-neutral-950 max-h-screen border-b border-t mt-10">
      <div className="p-4 md:p-8 pb-0">
        <AppBreadcrumb />
      </div>
      <div className="flex flex-col md:flex-row max-h-[100vh]">
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 min-w-0 md:min-w-[250px] md:max-w-[320px] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 flex flex-col pt-4 z-10">
          <div className="px-4 md:px-8 pb-4 mt-2 md:mt-10">
            {/* Model */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Modelo
              </label>
              <select
                className="w-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 ring-green-500"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                {modelosMock.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <Checkbox
                id="show-nodesinfo"
                checked={showNodesinfo}
                onCheckedChange={(checked) =>
                  setShowNodesinfo(checked === true)
                }
              />
              <label
                htmlFor="show-nodesinfo"
                className="text-xs font-medium leading-none text-neutral-600 dark:text-neutral-400"
              >
                Mostrar info gráficos
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Flow Data
              </label>
              <Textarea
                className="font-mono bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={3}
                placeholder='{"key": "value"}'
                value={flowData}
                onChange={(e) => setFlowData(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Ferramentas
              </label>
              <Input
                className="w-full bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-500 rounded px-3 py-2"
                placeholder="Nome da ferramenta"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Configurações
              </label>
              <Textarea
                className="font-mono bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={3}
                placeholder='{"key": "value"}'
                value={settingsJson}
                onChange={(e) => setSettingsJson(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                System message
              </label>
              <Textarea
                className="font-mono bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={8}
                placeholder="Describe desired model behavior (tone, tool usage, response style)"
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  updateSystemPrompt(threadId, systemPrompt);
                }}
              />
            </div>
          </div>
        </aside>

        {/* MAIN CHAT */}
        <main className="flex-1 flex flex-col bg-neutral-50 dark:bg-neutral-950">
          {/* Topbar */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
            <div>
              <span className="text-lg font-semibold mr-4 text-neutral-900 dark:text-neutral-100">
                Nova Tarefa
              </span>
              <span className="bg-neutral-200 dark:bg-neutral-900 px-2 py-1 rounded text-xs text-neutral-600 dark:text-neutral-400">
                Rascunho <span className="text-neutral-400">- {threadId}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-green-100 text-green-700 hover:bg-green-200
                       dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                Salvar Tarefa
              </Button>
            </div>
          </div>

          {/* Etapas da Tarefa */}
          <div className="space-y-2 max-w-2xl mx-auto w-full">
            <StepsBoard></StepsBoard>
          </div>

          <div className="space-y-2 max-w-2xl mx-auto w-full">
            {etapasMock.map((etapa) => (
              <StepCard key={etapa.id} etapa={etapa} />
            ))}
          </div>
          {showScrollButton && (
            <Button
              className="fixed bottom-28 right-8 rounded-full shadow-md"
              size="icon"
              variant="outline"
              onClick={scrollToBottom}
            >
              <ArrowDown />
            </Button>
          )}
        </main>
      </div>
    </div>
  );
}

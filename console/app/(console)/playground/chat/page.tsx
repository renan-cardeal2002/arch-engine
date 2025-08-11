"use client";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  Square,
  AlertTriangle,
  ArrowDown,
  Ellipsis,
  Save,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLangGraphAgent } from "@/hooks/useLangGraphAgent/useLangGraphAgent";
import { AgentState, InterruptValue, ResumeValue } from "./agent-types";
import { useParams } from "next/navigation";
import { useChatStore } from "@/stores/chat-store";
import { AppCheckpoint, GraphNode } from "@/hooks/useLangGraphAgent/types";
import { ChatbotNode } from "./components/chatbot-node";
import WeatherNode from "./components/weather/weather-node";
import Reminder from "./components/reminder";
import { Checkbox } from "@/components/ui/checkbox";
import { NodeCard } from "./components/node-card";
import { CheckpointCard } from "./components/checkpoint-card";
import Modal from "@/components/ui/modal";
import { ChatConfig, ChatItem } from "@/app/(console)/chats/components/types";

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

export default function ChatPlaygroundPage() {
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
  const [inputValue, setInputValue] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [flowData, setFlowData] = useState("");
  const [toolName, setToolName] = useState("");
  const [settingsJson, setSettingsJson] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showNodesinfo, setShowNodesinfo] = useState(false);
  const [restoreError, setRestoreError] = useState(false);
  const [showModalConfig, setShowModalConfig] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(true);
  const [configModalItem, setConfigModalItem] = useState<ChatItem | null>(null);

  function handleConfigSave(config: ChatConfig) {
    if (configModalItem) {
      setConfigModalOpen(false);
      setConfigModalItem(null);
    }
  }

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

  const handleResume = (resumeValue: ResumeValue) => {
    resume({ thread_id: threadId, resume: resumeValue });
  };

  const renderCheckpointError = (
    checkpoint: AppCheckpoint<AgentState, InterruptValue>
  ): React.ReactNode => {
    return (
      <div className="text-sm text-red-500 font-medium p-2 bg-red-50 rounded-md flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Error in {checkpoint.checkpointConfig.configurable.checkpoint_id}
      </div>
    );
  };

  const renderNode = (
    checkpoint: AppCheckpoint<AgentState, InterruptValue>,
    node: GraphNode<AgentState>
  ): React.ReactNode => {
    switch (node.name) {
      case "__start__":
      case "chatbot":
        return <ChatbotNode nodeState={node.state} />;
      case "weather":
        return <WeatherNode nodeState={node.state} />;
      case "reminder":
        return (
          <Reminder
            interruptValue={checkpoint.interruptValue as string}
            onResume={handleResume}
          />
        );
      default:
        return null;
    }
  };

  const [model, setModel] = useState(modelosMock[0].value);

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Modal open={showModalConfig} onClose={() => setShowModalConfig(false)}>
        <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
          <h2 className="text-xl font-bold">Configurações</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modelo */}
            <div>
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

            {/* Checkbox */}
            <div className="flex items-end gap-2">
              <Checkbox
                id="show-nodesinfo"
                checked={showNodesinfo}
                onCheckedChange={(checked) =>
                  setShowNodesinfo(checked === true)
                }
              />
              <label
                htmlFor="show-nodesinfo"
                className="text-xs font-medium text-neutral-600 dark:text-neutral-400"
              >
                Mostrar info gráficos
              </label>
            </div>

            {/* Flow Data */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Flow Data
              </label>
              <Textarea
                className="font-mono w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={3}
                placeholder='{"key": "value"}'
                value={flowData}
                onChange={(e) => setFlowData(e.target.value)}
              />
            </div>

            {/* Ferramentas */}
            <div className="col-span-2">
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

            {/* Configurações */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Configurações
              </label>
              <Textarea
                className="font-mono w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={3}
                placeholder='{"key": "value"}'
                value={settingsJson}
                onChange={(e) => setSettingsJson(e.target.value)}
              />
            </div>

            {/* System Prompt */}
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                System message
              </label>
              <Textarea
                className="font-mono w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 rounded"
                rows={6}
                placeholder="Describe desired model behavior (tone, tool usage, response style)"
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  updateSystemPrompt(threadId, systemPrompt);
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Topbar */}
      <div className="flex items-center flex-shrink justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
        <div>
          <span className="text-lg font-semibold mr-4 text-neutral-900 dark:text-neutral-100">
            Novo Chat
          </span>
          <span className="bg-neutral-200 dark:bg-neutral-900 px-2 py-1 rounded text-xs text-neutral-600 dark:text-neutral-400">
            Rascunho <span className="text-neutral-400">- {threadId}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200
                       dark:bg-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
            onClick={() => setShowModalConfig(true)}
          >
            <Cog />
            Configurações
          </Button>
          <Button
            className="bg-green-100 text-green-700 hover:bg-green-200
                       dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          >
            <Save />
            Salvar Chat
          </Button>
        </div>
      </div>

      {/* Body */}
      <div
        ref={messagesContainerRef}
        className="
              mx-auto w-full 
              rounded-xl shadow p-4 
              overflow-y-auto mt-2
            "
      >
        <div className="space-y-2 max-w-2xl mx-auto w-full">
          {appCheckpoints.map((checkpoint) => (
            <div
              key={checkpoint.checkpointConfig.configurable.checkpoint_id}
              className="space-y-2"
            >
              {showNodesinfo && (
                <CheckpointCard
                  thread_id={threadId}
                  appCheckpoint={checkpoint}
                  replayHandler={replay}
                />
              )}
              {checkpoint.error
                ? renderCheckpointError(checkpoint)
                : checkpoint.nodes.map((node, nodeIndex) => (
                    <div key={nodeIndex} className="space-y-2">
                      {showNodesinfo && <NodeCard node={node} />}
                      {renderNode(checkpoint, node)}
                    </div>
                  ))}
            </div>
          ))}
          {(status === "running" || restoring) && (
            <div className="flex items-center justify-center p-4">
              <Ellipsis className="w-6 h-6 text-muted-foreground animate-pulse" />
            </div>
          )}
          {status === "error" && (
            <div className="text-sm text-red-500 font-medium font-mono p-2 bg-red-50 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error running agent.
            </div>
          )}
          {restoreError && (
            <div className="text-sm text-red-500 font-medium font-mono p-2 bg-red-50 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error restoring agent. Check if agent server is running.
            </div>
          )}
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
      </div>

      <div className="flex-shrink-0 p-2 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Textarea
              ref={inputRef}
              className="pr-24 resize-none font-mono"
              placeholder="Enter your message..."
              value={inputValue}
              disabled={status === "running" || restoring}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() && status !== "running" && !restoring) {
                    setRestoreError(false);
                    run({
                      thread_id: threadId,
                      service_id: serviceId || undefined,
                      flow_data: flowData || undefined,
                      tool_name: toolName || undefined,
                      settings: (() => {
                        try {
                          return settingsJson.trim() !== ""
                            ? JSON.parse(settingsJson)
                            : undefined;
                        } catch {
                          return undefined;
                        }
                      })(),
                      state: {
                        system_prompt: systemPrompt,
                        llm_core_model: model || undefined,
                        messages: [{ type: "user", content: inputValue }],
                      },
                    });
                    setInputValue("");
                  }
                }
              }}
            />
            {status === "running" ? (
              <Button
                className="absolute right-3 top-[50%] translate-y-[-50%]"
                size="icon"
                variant="destructive"
                onClick={() => stop(threadId)}
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="absolute right-3 top-[50%] translate-y-[-50%]"
                size="icon"
                variant="outline"
                disabled={!inputValue.trim() || restoring}
                onClick={() => {
                  if (inputValue.trim() && !restoring) {
                    run({
                      thread_id: threadId,
                      service_id: serviceId || undefined,
                      flow_data: flowData || undefined,
                      tool_name: toolName || undefined,
                      settings: (() => {
                        try {
                          return settingsJson.trim() !== ""
                            ? JSON.parse(settingsJson)
                            : undefined;
                        } catch {
                          return undefined;
                        }
                      })(),
                      state: {
                        system_prompt: systemPrompt,
                        messages: [{ type: "user", content: inputValue }],
                      },
                    });
                    setInputValue("");
                  }
                }}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

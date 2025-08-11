import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { AgentState } from "../agent-types";

interface ChatbotNodeProps {
  nodeState: Partial<AgentState>;
}

export function ChatbotNode({ nodeState }: ChatbotNodeProps) {
  const getMessageIcon = (type: string) => {
    const baseClasses =
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700";

    switch (type) {
      case "ai":
        return {
          icon: <Bot className="h-5 w-5" />,
          className: baseClasses,
        };
      case "user":
      case "human":
        return {
          icon: <User className="h-5 w-5" />,
          className: baseClasses,
        };
      default:
        return {
          icon: <Bot className="h-5 w-5" />,
          className: baseClasses,
        };
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {nodeState?.messages?.map((msg, index) => {
        const isAi = msg.type === "ai";

        return (
          <div
            key={msg.id ?? index}
            className={cn(
              "flex items-start gap-3 border-b rounded",
              isAi ? "flex-row" : "flex-row-reverse"
            )}
          >
            {/* Ícone */}
            <div
              className={cn(
                "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border",
                getMessageIcon(msg.type).className
              )}
            >
              {getMessageIcon(msg.type).icon}
            </div>

            {/* Mensagem */}
            <div
              className={cn(
                "flex-1 p-2 min-w-0 text-sm break-words text-foreground",
                isAi ? "text-left" : "text-right"
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 break-words">{children}</p>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className?.includes("language-");
                    return (
                      <code
                        className={cn(
                          "bg-gray-100 px-1 py-0.5 rounded break-all",
                          !isInline && "block p-2 my-2 overflow-x-auto"
                        )}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto max-w-full">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-2">{children}</ol>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>

              {msg.tool_calls && msg.tool_calls.length > 0 && (
                <div
                  className={cn(
                    "flex gap-2 mt-1",
                    isAi ? "justify-start" : "justify-end"
                  )}
                >
                  <span className="text-sm font-mono">Tool calls:</span>
                  {msg.tool_calls.map((toolCall) => (
                    <Badge key={toolCall.id} variant="outline">
                      {toolCall.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

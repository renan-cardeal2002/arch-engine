import { WithMessages } from "@/hooks/useLangGraphAgent/types";

// The agent state which mirrors the LangGraph state. If your sate have messages, extend WithMessages interface.
export interface AgentState extends WithMessages {
  system_prompt?: string;
  weather_forecast: WeatherForecast[];
  context?: {
    agent_state: { flow_data?: string | null; service_id?: number | string | null };
    settings: Record<string, unknown>;
  };
}

export interface WeatherForecast {
  location: string;
  search_status: string;
  result: "Sunny" | "Cloudy" | "Rainy" | "Snowy";
}

// All possible interrupt types from the graph. We are using string for Reminder node
export type InterruptValue = string | number | { "question": string };

// All possible resume types to send to the graph. We are using string for Reminder node
export type ResumeValue = string | number;

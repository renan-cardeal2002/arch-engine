from typing import TypedDict, Any, Annotated
import operator
from langgraph.graph import MessagesState

class AgentStateCtx(TypedDict):
    flow_data: str | None
    service_id: int | str | None

class Context(TypedDict):
    agent_state: AgentStateCtx
    settings: dict[str, Any]

class Weather(TypedDict):
    location: str
    search_status: str
    result: str

class State(MessagesState):
    system_prompt: str | None
    llm_core_model: str | None
    weather_forecast: Annotated[list[Weather], operator.add]
    context: Context

class WeatherInput(TypedDict):
    location: str
    tool_call_id: str

class ToolNodeArgs(TypedDict):
    name: str
    args: dict[str, Any]
    id: str

class McpToolNodeArgs(TypedDict):
    server_name: str
    name: str
    args: dict[str, Any]
    id: str